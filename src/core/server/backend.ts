import * as path from "path"
import * as git from "simple-git/promise"

import to from 'await-to-js'
import { promises } from 'fs'

import { filter, reject as lodashReject, last, omitBy } from 'lodash'

import * as marked from 'marked'
import * as md5 from 'md5'
import * as readdirEnhanced from 'readdir-enhanced'
import * as tracer from 'tracer'
import { CONST_GITREPO_PATH } from '../constant'
import { oc } from 'ts-optchain'
import * as memoizee from 'memoizee'

import config from './config'
import { IDocInfo, IYoutubeDocInfo } from "global";
import { TGetDocInfoArr } from "../interface";

import { getDocInfo as getDocInfoFromYoutube, getEmptyDocInfo as getEmptyDocInfoFromYoutube } from './backendYoutube'
import { getDocInfo as getDocInfoFromMarkdown } from './backendMarkdown'

const fs = promises
const logger = tracer.console()

const getPathFromGitRepoUrl = (url: string) => {
  if (!url) {
    throw new Error('SMTV_ERROR_2004 no url')
  }
  const projectName = last(url.split('/'))!.replace(/\.git$/,'')
  return `${CONST_GITREPO_PATH}/${projectName}.${md5(url)}`
}

const _getRepoPath = async (repoUrl: string) => {
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
    const [err3] = await to(git(dirPath).fetch())
    if (err3) throw err3

    const [err4] = await to(git(dirPath).reset(["origin/master","--hard"]))
    if (err4) throw err4
    logger.debug(`success. ${dirPath} git fetch, reset origin/master`)

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

const getRepoPath = memoizee(_getRepoPath, { maxAge: 5 * 60 * 1000 })

const getMarkdownFilenameArr = (repoPath: string, docDirectory: string) => {
  const dirPath = path.resolve(repoPath, docDirectory)
  let fileArr = readdirEnhanced.sync(dirPath)
  fileArr = lodashReject(fileArr, name => name === 'README.md')
  fileArr = filter(fileArr, name => /\.md$/.test(name))
  fileArr = fileArr.map( name => path.resolve( dirPath, name))
  return fileArr
}

const readFile = async (absolutePath: string) => {
  const text = await fs.readFile( absolutePath, 'utf8')
  return text
}

const emptyLink = { href: "", title: "" }
// const emptyHeading: Tokens.Heading = { type: 'heading', depth: -1, text: "" }

type TParseDocInfo = (filename: string, text: string) => Promise<IDocInfo>
const parseVideoInfo: TParseDocInfo  = async (filename, text) => {
  const tokenArr = marked.lexer(text)

  // https://stackoverflow.com/questions/19377262/regex-for-youtube-url
  const ytMatcher = /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/
  const videoUrl = (tokenArr.links.videourl || emptyLink).href
  const matched = videoUrl.match(ytMatcher)
  const emptyYoutubeInfo = getEmptyDocInfoFromYoutube()

  let infoFromYoutube: IYoutubeDocInfo | undefined
  let err: any
  if (matched) [err, infoFromYoutube] = await to(getDocInfoFromYoutube(matched[5]))
  if (err) logger.error(err)
  infoFromYoutube = infoFromYoutube || emptyYoutubeInfo

  const infoFromMarkdown = getDocInfoFromMarkdown(tokenArr)
  const ommitedMarkdownInfo = omitBy(infoFromMarkdown, item => ! item)
  const ommitedYoutubeInfo = omitBy(infoFromYoutube, item => ! item)

  if(!ommitedMarkdownInfo.title && ommitedYoutubeInfo.title) {
    text = `# ${ommitedYoutubeInfo.title}\n\n${text}`
  }

  return {
    ...emptyYoutubeInfo,
    ...ommitedYoutubeInfo,
    ...ommitedMarkdownInfo,
    videoUrl,
    id: md5(filename).substr(0,8),
    filename: filename,
    text,
    type: matched ? 'YOUTUBE' : 'MEDIA_URL',
    isDeleted: !! err
  }
}

export const getDocInfoArr: TGetDocInfoArr = async (repoIdx) => {
  repoIdx = Number(repoIdx)
  const backendRepo = config.backendRepos[repoIdx]
  const { cloneUrl, docDirectory } = backendRepo

  const repoPath = getPathFromGitRepoUrl(backendRepo.cloneUrl)
  const [err] = await to( getRepoPath(cloneUrl))
  if (err) throw err

  const filenameArr = getMarkdownFilenameArr(repoPath, docDirectory)
  const promiseArr = filenameArr.map( async f => {
    const text = await readFile(f)
    const baseFilename = path.basename(f)
    const docInfo = await parseVideoInfo(baseFilename,text)
    return docInfo
  })
  const docInfoArr = await Promise.all(promiseArr)
  return docInfoArr
}
