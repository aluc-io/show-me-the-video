import { useState } from 'react'
import { getVideoInfoArr } from '../core'
import { IGuideInfo } from 'global';

export const useShowLayout = (initialValue: boolean) => {
  initialValue = !! initialValue
  const [ showLayout, setShowLayout ] = useState(initialValue)
  const toggleShowLayout = () => setShowLayout(! showLayout )
  return { showLayout, toggleShowLayout }
}

export const useVideoInfoArr = (initialValue: Array<IGuideInfo>) => {
  const [videoInfoArr, setVideoInfoArr] = useState(initialValue)

  if (videoInfoArr.length < 1 ) {
    console.log('videoInfoArr.length < 1 ')
    getVideoInfoArr().then( setVideoInfoArr )
  }

  return videoInfoArr
}

export default {
  useShowLayout,
  useVideoInfoArr,
}
