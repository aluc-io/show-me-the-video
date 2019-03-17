import { createContext } from 'react'
import IThemeInterface from '../style/theme'
import theme from '../style/theme-light'
import { ISiteInfo, IRepoInfo } from 'src/@types/global';

interface IAppContext {
  showLayout: boolean
  toggleShowLayout: () => void
  siteInfo: ISiteInfo
  setSiteInfo: (siteInfo: ISiteInfo) => void
  repoInfoArr: Array<IRepoInfo>
  setRepoInfoArr: (repoArr: Array<IRepoInfo>) => void
  theme: IThemeInterface
}

export const AppContext = createContext<IAppContext>({
  showLayout: true,
  toggleShowLayout: () => {},
  siteInfo: { title: '', host: '' },
  setSiteInfo: () => {},
  repoInfoArr: [],
  setRepoInfoArr: () => {},
  theme: theme,
})
