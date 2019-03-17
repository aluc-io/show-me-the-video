/* globals __rewire_reset_all__ */
import fs from "fs"
import path from 'path'

import to from 'await-to-js'

import tmp from 'tmp'
import rimraf from 'rimraf'
import sinon from 'sinon'

import { CONST_DOC_DIRECTORY } from '../src/core/constant'

const fsPromise = fs.promises

const backend = require('../src/core/server/backend')

describe("check getPathFromGitRepoUrl", () => {
  const validUrl = 'https://github.com/b6pzeusbc54tvhw5jgpyw8pwz2x6gs/video-here-tc-data.git'

  it('should works: getPathFromGitRepoUrl(url)', () => {
    const dirName = backend.__get__("getPathFromGitRepoUrl")(validUrl)
    expect(dirName.length).toBeGreaterThan(0)
  })
})

describe("check getRepo", () => {
  let dirName = 'tmp-git-repo-for-test-case'
  const validUrl = 'https://github.com/b6pzeusbc54tvhw5jgpyw8pwz2x6gs/video-here-tc-data.git'
  const invalidUrl = 'https://wronggithub.com/b/video-here-tc-data.git'

  beforeAll( () => rimraf.sync(dirName))

  it('should works: getRepo(validUrl) x 2', async () => {
    // const fakeClone = sinon.fake( server.__get__('Clone'))
    // const fakeOpen = sinon.fake( server.__get__('Repository').open)

    const fakeGetPathFromGitRepoUrl = sinon.fake.returns(dirName)

    // server.__set__('Clone', fakeClone)
    // server.__set__('Repository', { open: fakeOpen })
    backend.__set__('getPathFromGitRepoUrl', fakeGetPathFromGitRepoUrl )

    const [err,repoPath] = await to(backend.__get__('_getRepoPath')(validUrl))
    expect(fakeGetPathFromGitRepoUrl.callCount).toBe(1)
    expect(fakeGetPathFromGitRepoUrl.getCall(0).args[0]).toBe(validUrl)
    // expect(fakeOpen.callCount).toBe(1)
    // expect(fakeOpen.getCall(0).args[0]).toBe(dirName)
    // expect(fakeClone.callCount).toBe(1)
    // expect(fakeClone.getCall(0).args[0]).toBe(validUrl)
    expect(err ).toBeNull()
    expect(repoPath).toBe(dirName)

    const [err2,repoPath2] = await to(backend.__get__('_getRepoPath')(validUrl))
    expect(fakeGetPathFromGitRepoUrl.callCount).toBe(2)
    expect(fakeGetPathFromGitRepoUrl.lastCall.args[0]).toBe(validUrl)
    // expect(fakeOpen.callCount).toBe(2)
    // expect(fakeOpen.lastCall.args[0]).toBe(dirName)
    // expect(fakeClone.callCount).toBe(1)
    expect(err2 ).toBeNull()
    expect(repoPath2).toBe(dirName)
  }, 15000)

  it('should works: getRepo(validUrl) second', async () => {
    const fakeGetPathFromGitRepoUrl = sinon.fake.returns(dirName)

    backend.__set__('getPathFromGitRepoUrl', fakeGetPathFromGitRepoUrl )
    const [err,repoPath] = await to(backend.__get__('_getRepoPath')(validUrl))
    expect(fakeGetPathFromGitRepoUrl.callCount).toBe(1)
    expect(fakeGetPathFromGitRepoUrl.lastCall.args[0]).toBe(validUrl)
    expect(err ).toBeNull()
    expect(repoPath).toBe(dirName)
  }, 12000)

  it('should works: getRepo(validUrl, emptyDirPath)', async () => {
    await to(fsPromise.mkdir(dirName))
    const [err,repo] = await to(backend.__get__('_getRepoPath')(validUrl, dirName))
    expect(err).toBeNull()
    expect(repo).not.toBeUndefined()
  }, 10000)

  it('should works: getRepo(validUrl, notExistDirPath)', async () => {
    const [err,repo] = await to(backend.__get__('_getRepoPath')(validUrl, dirName))
    expect(err).toBeNull()
    expect(repo).not.toBeUndefined()

  }, 10000)


  it('should error: getRepo(validUrl, existDirPath)', async () => {
    const dirName = backend.__get__("getPathFromGitRepoUrl")(validUrl)
    await fsPromise.mkdir(dirName)
    tmp.fileSync({ dir: dirName })

    const [err,repoPath] = await to(backend.__get__('_getRepoPath')(validUrl))
    expect(err).not.toBe(null)
    expect(err.message).toBe('NOT_EMPTY_DIRECTORY')
    expect(err.name).toBe('Error')
    expect(repoPath).toBeUndefined()
  }, 9000)

  it('should error: getRepo(invalidUrl)', async () => {
    const [err,repoPath] = await to(backend.__get__('_getRepoPath')(invalidUrl))
    expect(err.name).toBe('Error')
    expect(err.message).toMatch(/^Cloning into '.*'\.\.\.\nfatal: unable to access/)
    expect(repoPath).toBeUndefined()
  }, 10000)

  it('should work: readFile(absolutePath)', async () => {
    const filePath = path.resolve( __dirname, 'asset', CONST_DOC_DIRECTORY, 'validVideoGuideHereMarkdown.md')
    const [err,text] = await to( backend.__get__('readFile')(filePath))
    expect(err ).toBeNull()
    expect(text).toEqual( fs.readFileSync(filePath,'utf8'))
  })

  it('should error: getVideoInfoArr(invalidUrl)', async () => {
    const [err,arr] = await to(backend.getDocInfoArr(invalidUrl))
    expect(err.message).toMatch(/^Cloning into '.*'\.\.\.\nfatal: unable to access/)
    expect(arr).toBeUndefined()
  })

  /*
  it('should work: getVideoGuideHereFileArr(validPath)', async () => {
    const repoPath = path.resolve(__dirname, 'asset')
    const fileArr = server.__get__('getVideoGuideHereFileArr')(repoPath)
    expect(fileArr).toEqual([
      path.resolve( repoPath,CONST_DIR_NAME,'validVideoGuideHereMarkdown.md'),
      path.resolve( repoPath,CONST_DIR_NAME,'validVideoGuideHereMarkdown2.md'),
    ])
  })

  it('should work: parseVideoInfo()', async () => {
    const filePath = path.resolve( __dirname, 'asset', CONST_DIR_NAME, 'validVideoGuideHereMarkdown.md' )
    const filename = path.basename( filePath )
    const text = fs.readFileSync( filePath, 'utf8')
    const info = server.__get__('parseVideoInfo')({ filename, text})
    expect(info.title).toBe('Title')
    expect(info.subTitle).toBe('Sub title')
    expect(info.videoUrl).toBe('http://local-static.aluc.io:8998/video1.mkv')
    expect(info.thumbnailUrl).toBe('http://local-static.aluc.io:8998/resized.256/video1.jpg')
    expect(info.tagArr).toEqual(['windows','linux'])
    expect(info.prevGuideId).toBe('wio1io2ffh')
    expect(info.nextGuideId).toBe('ysT9Nii5An')
    expect(info.duration).toBe('2:30')
    expect(info.author).toBe('alfreduc')
    expect(info.date).toBe('20181127')
  })
  */

  afterEach(() => {
    __rewire_reset_all__()
    const validPath = backend.__get__('getPathFromGitRepoUrl')(validUrl)
    rimraf.sync(validPath)
    rimraf.sync(dirName)
  })
})

