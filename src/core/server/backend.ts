import * as path from "path"
import * as git from 'simple-git/promise'

import to from 'await-to-js'
import { promises } from 'fs'

import { compact, filter, reject as lodashReject, find, findIndex, last, get } from 'lodash'

import * as marked from 'marked'
import { Token, Tokens } from 'marked'
import * as md5 from 'md5'
import * as readdirEnhanced from 'readdir-enhanced'
import * as tracer from 'tracer'
import { CONST_GITREPO_PATH } from '../constant'
import { oc } from 'ts-optchain'

import config from './config'
import { IDocInfo } from "global";
import { TGetDocInfoArr } from "../interface";

const fs = promises
const logger = tracer.console()
const { } = config

const getPathFromGitRepoUrl = (url: string) => {
  if (!url) {
    throw new Error('SMTV_ERROR_2004 no url')
  }
  const projectName = last(url.split('/'))!.replace(/\.git$/,'')
  return `${CONST_GITREPO_PATH}/${projectName}.${md5(url)}`
}

const getRepoPath = async (repoUrl: string) => {
  const dirPath = getPathFromGitRepoUrl(repoUrl)
  const dotGitPath = path.resolve(dirPath, '.git')

  const [err, stat] = await to(fs.stat(dirPath))
  if (err && err.code !== 'ENOENT') throw err

  // let err2: Error | null
  // let dotGitStat: _fs.Stats | undefined
  const [err2, dotGitStat] = await to(fs.stat(dotGitPath))
  if (err2 && err2.code !== 'ENOENT') throw err

  if (oc(stat).isDirectory() && oc(dotGitStat).isDirectory()) {
    // true, true
    const [err3] = await to(git(dirPath).pull())
    if (err3) throw err3
    logger.debug(`success. git pull ${dirPath}`)

  } else if (oc(stat).isDirectory() && !oc(dotGitStat).isDirectory()) {
    // true, false
    const pathArr = readdirEnhanced.sync(dirPath)
    if (pathArr.length > 0 ) throw new Error('NOT_EMPTY_DIRECTORY')

    const [err4] = await to(git().clone(repoUrl, dirPath, ["--depth","1"]))
    if (err4) throw err4
    logger.debug(`success. git clone ${repoUrl} ${dirPath}`)

  } else {
    // false, false
    // false, true (이 경우는 불가능)
    const [err4] = await to(git().clone(repoUrl, dirPath, ["--depth","1"]))
    if (err4) throw err4

    logger.debug(`success. git clone ${repoUrl} ${dirPath}`)
  }

  return dirPath
}

const getVideoGuideHereFileArr = (repoPath: string, docDirectory: string) => {
  const dirPath = path.resolve(repoPath, docDirectory)
  let fileArr = readdirEnhanced.sync(dirPath)
  fileArr = lodashReject(fileArr, name => name === 'README.md')
  fileArr = filter(fileArr, name => /\.md$/.test(name))
  fileArr = fileArr.map( name => path.resolve( dirPath, name))
  return fileArr
}

const readFile = async (absolutePath: string) => {
  const text = await fs.readFile( absolutePath, 'utf8')
  return { filename: path.basename(absolutePath), text }
}

interface IFilenameText {
  filename: string
  text: string
}

const emptyLink = { href: "", title: "" }
// const emptyHeading: Tokens.Heading = { type: 'heading', depth: -1, text: "" }

const parseVideoInfo: (info: IFilenameText) => IDocInfo | null = ({ filename, text }) => {
  const tokenArr = marked.lexer(text)
  const firstHeading = find(tokenArr, (t: Token): t is Tokens.Heading => t.type === 'heading' && t.depth === 1)
  // const title = firstHeading ? firstHeading.text : "[Untitle]"
  const title = firstHeading ? firstHeading.text : "[Untitle]"

  const titleIndex = findIndex( tokenArr, firstHeading )

  const subTitleToken = get<Token | void>(tokenArr, titleIndex+1)
  const subTitle = subTitleToken && subTitleToken.type == 'heading' && subTitleToken.depth == 2
      ? subTitleToken.text : '';

  const isDraft = (tokenArr.links.draft || { href: "false" }).href === 'true'
  if (isDraft) return null

  let createTime = (tokenArr.links.createtime || emptyLink).href
  createTime = createTime ? createTime.replace(/-/g,' ') : createTime

  let updateTime = (tokenArr.links.updatetime || emptyLink).href
  updateTime = updateTime ? updateTime.replace(/-/g,' ') : updateTime

  return {
    // links 에 걸린 키는 다 소문자로 변환됨
    title,
    subTitle,
    videoUrl: (tokenArr.links.videourl || emptyLink).href,
    thumbnailUrl: (tokenArr.links.thumbnailurl || emptyLink).href,
    tagArr: (tokenArr.links.tags || emptyLink).href.split(','),
    prev: (tokenArr.links.prev || emptyLink).href,
    next: (tokenArr.links.next || emptyLink).href,
    author: (tokenArr.links.author || emptyLink).href,
    createTime,
    updateTime,
    duration: (tokenArr.links.duration || emptyLink).href,
    id: md5(filename).substr(0,8),
    filename: filename,
    text: text,
  }
}

export const getDocInfoArr: TGetDocInfoArr = async (repoIdx) => {
  repoIdx = Number(repoIdx)
  const backendRepo = config.backendRepos[repoIdx]
  const { cloneUrl, docDirectory } = backendRepo

  const repoPath = getPathFromGitRepoUrl(backendRepo.cloneUrl)
  const [err] = await to( getRepoPath(cloneUrl))
  if (err) throw err

  const fileArr = getVideoGuideHereFileArr(repoPath, docDirectory)
  const promiseArr = fileArr.map(readFile)
  const filenameTextArr = await Promise.all(promiseArr)
  const docInfoArr = compact(filenameTextArr.map(parseVideoInfo))
  return docInfoArr
}

export default {
  getDocInfoArr,
}
