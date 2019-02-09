import { IRepoInfo, IDocInfo, ISiteInfo } from 'global';

type repoIdx = string | number

export type TGetDocInfo = (repoIdx: repoIdx, docId: string) => Promise<IDocInfo>
export type TGetDocInfoArr = (repoIdx: repoIdx) => Promise<Array<IDocInfo>>
export type TGetRepoInfo = (repoIdx: repoIdx) => Promise<IRepoInfo>
export type TGetSiteInfo = () => Promise<ISiteInfo> | ISiteInfo
export type TGetRepoInfoArr = () => Promise<Array<IRepoInfo>>
