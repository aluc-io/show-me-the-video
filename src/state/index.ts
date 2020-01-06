import { useState } from 'react'
import { IRepoInfo } from 'src/@types/global';

export const useShowLayout = (initialValue: boolean) => {
  initialValue = !! initialValue
  const [ showLayout, setShowLayout ] = useState(initialValue)
  const toggleShowLayout = () => setShowLayout(! showLayout )
  return { showLayout, toggleShowLayout }
}

export const useRepoInfoArr = (initialValue: Array<IRepoInfo>) => {
  const [repoInfoArr, setRepoInfoArr] = useState(initialValue)
  return { repoInfoArr, setRepoInfoArr }
}

export const useSiteInfo = (initialValue: any) => {
  const [siteInfo, setSiteInfo] = useState(initialValue)
  return { siteInfo, setSiteInfo }
}

export default {
  useShowLayout,
  useRepoInfoArr,
}
