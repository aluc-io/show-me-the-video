import to from 'await-to-js'
import axios from 'axios'
import { TGetDocInfo, TGetSiteInfo, TGetRepoInfo, TGetRepoInfoArr } from '../interface';
import * as memoizee from 'memoizee'

const _getDocInfo: TGetDocInfo = async (repoIdx, docId) => {
  const [err,res] = await to( axios.get(`/api/v1/${repoIdx}/${docId}`))
  if (err || !res) throw err

  return res.data
}

const _getSiteInfo: TGetSiteInfo = async () => {
  const [err,res] = await to( axios.get('/api/v1/siteInfo'))
  if (err || !res) throw err

  return res.data
}

const _getRepoInfoArr: TGetRepoInfoArr = async () => {
  const [err,res] = await to( axios.get('/api/v1/repoInfoArr'))
  if (err || !res) throw err

  return res.data
}

const _getRepoInfo: TGetRepoInfo = async (repoIdx) => {
  const [err,res] = await to( axios.get(`/api/v1/${repoIdx}`))
  if (err || !res) throw err

  return res.data
}

export const getDocInfo = memoizee(_getDocInfo, { maxAge: 5 * 60 * 1000 })
export const getSiteInfo = memoizee(_getSiteInfo, { maxAge: 5 * 60 * 1000 })
export const getRepoInfoArr = memoizee(_getRepoInfoArr, { maxAge: 5 * 60 * 1000 })
export const getRepoInfo = memoizee(_getRepoInfo, { maxAge: 5 * 60 * 1000 })
