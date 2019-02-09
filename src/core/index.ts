import { TGetDocInfo, TGetSiteInfo, TGetRepoInfoArr, TGetRepoInfo } from './interface';

const isServer = !! process.env.APPLICATION_CONFIG

console.log(`isServer: ${isServer}`)
interface ICoreCommon {
  getDocInfo: TGetDocInfo
  getSiteInfo: TGetSiteInfo
  getRepoInfoArr: TGetRepoInfoArr
  getRepoInfo: TGetRepoInfo
}

let common: ICoreCommon
if (isServer) {
  common = require('./server')
} else {
  common = require('./client')
}

const { getDocInfo, getRepoInfo, getRepoInfoArr, getSiteInfo } = common
export { getDocInfo, getRepoInfo, getRepoInfoArr, getSiteInfo }
