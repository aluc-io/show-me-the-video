import { IRepoInfo, IDocInfo, ISiteInfo } from '../@types/global';

type repoIdx = string | number

export type TGetDocInfo = (repoIdx: repoIdx, docId: string) => Promise<IDocInfo>

export type TGetDocInfoFromMarkdown = (repoIdx: repoIdx, docId: string) => Promise<IDocInfo>
export type TGetDocInfoFromYoutube = (id: string) => Promise<IDocInfo>

export type TGetDocInfoArr = (cloneUrl: string, docDirectory: string) => Promise<Array<IDocInfo>>

export type TGetRepoInfo = (repoIdx: repoIdx) => Promise<IRepoInfo>
export type TGetSiteInfo = () => Promise<ISiteInfo> | ISiteInfo
export type TGetRepoInfoArr = () => Promise<Array<IRepoInfo>>
