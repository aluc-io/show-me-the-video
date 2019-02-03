import to from 'await-to-js'
import axios from 'axios'
import { find } from 'lodash'
import { TGetDocInfo, TGetSiteInfo, TGetRepoInfo, TGetRepoInfoArr } from '../interface';

export const getDocInfo: TGetDocInfo = async (repoIdx, id) => {
  const repoInfo = await getRepoInfo(repoIdx)
  const docInfo = find(repoInfo.docInfoArr, { id })
  if (docInfo) return docInfo

  const [err,res] = await to( axios.get('/api/v1/guide/' + id))
  if (err || !res) throw err

  return res.data
}

export const getSiteInfo: TGetSiteInfo = async () => {
  const [err,res] = await to( axios.get('/api/v1/siteInfo'))
  if (err || !res) throw err

  return res.data
}

export const getRepoInfoArr: TGetRepoInfoArr = async () => {
  const [err,res] = await to( axios.get('/api/v1/repoInfoArr'))
  if (err || !res) throw err

  return res.data
}

export const getRepoInfo: TGetRepoInfo = async (repoIdx) => {
  const [err,res] = await to( axios.get('/api/v1/repoInfo/' + repoIdx))
  if (err || !res) throw err

  return res.data
}

export default {
  getDocInfo,
  getSiteInfo,
  getRepoInfoArr,
  getRepoInfo,
}
