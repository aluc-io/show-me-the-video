import { createContext } from 'react'
import { IRepoInfo, ISiteInfo } from 'global';

interface IAppContext {
  showLayout: boolean
  toggleShowLayout: () => void
  siteInfo: ISiteInfo
  setSiteInfo: (siteInfo: ISiteInfo) => void
  repoInfoArr: Array<IRepoInfo>
  setRepoInfoArr: (repoArr: Array<IRepoInfo>) => void
}

export const AppContext = createContext<IAppContext>({
  showLayout: true,
  toggleShowLayout: () => {},
  siteInfo: { title: '', host: '' },
  setSiteInfo: () => {},
  repoInfoArr: [],
  setRepoInfoArr: () => {},
})
