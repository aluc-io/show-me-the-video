import { getDocInfoArr } from './backend'
import config from './config'
import { find, reject } from 'lodash'
import { IRepoInfo } from 'global';
import { TGetRepoInfo, TGetRepoInfoArr, TGetSiteInfo, TGetDocInfo } from '../interface';

const getRepoInfoArr: TGetRepoInfoArr = async () => {
  const { backendRepos } = config
  const promiseArr = backendRepos.map((_,i) => getDocInfoArr(i))
  const docInfoArrArr = await Promise.all(promiseArr)

  return backendRepos.map( (repo,i) => {
    const docInfoArr = docInfoArrArr[i]
    const repoInfo: IRepoInfo = {
      idx: i,
      type: repo.type,
      title: repo.title,
      publicUrl: repo.publicUrl,
      managerId: repo.managerId,
      docDirectory: repo.docDirectory,
      docInfoArr: reject(docInfoArr, item => item.isDeleted),
    }
    return repoInfo
  })
}

const getRepoInfo: TGetRepoInfo = async (repoIdx) => {
  const repoInfoArr = await getRepoInfoArr()
  return repoInfoArr[repoIdx]
}

const getSiteInfo: TGetSiteInfo = () => {
  return { host: config.host, title: config.title }
}

export const getDocInfo: TGetDocInfo = async (repoIdx, id) => {
  console.log('getDocInfo()', repoIdx, id)
  const repoInfo = await getRepoInfo(repoIdx)
  const docInfo = find(repoInfo.docInfoArr, { id })
  if (!docInfo) throw new Error('SMTV_ERROR_58211_NO_DOC_INFO')

  return docInfo
}

export {
  getRepoInfoArr,
  getSiteInfo,
  getRepoInfo,
  config,
}
