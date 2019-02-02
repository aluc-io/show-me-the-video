import { createContext } from 'react'
import { IGuideInfo } from 'global';

interface IAppContext {
  showLayout: boolean
  toggleShowLayout: () => void
  videoInfoArr: Array<IGuideInfo>
}

export const AppContext = createContext<IAppContext>({
  showLayout: true,
  toggleShowLayout: () => {},
  videoInfoArr: [],
})
