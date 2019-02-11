import ReactPlayer from 'react-player';
import { Player, BigPlayButton, ControlBar, PlaybackRateMenuButton } from 'video-react'
import styled from '../style/styled-component'
import { useState, useContext, useEffect } from 'react';
import { AppContext } from '../context';

const isServer = !! process.env.APPLICATION_CONFIG

const VideoContainer = styled.div`
  position: relative;
  padding-bottom: 56.25%;
  height: 0px;
`

const VideoFrame = styled.div<{ position: string }>`
  position: ${p => p.position};
  z-index: 1;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;

  & div:focus {
    outline: none;
  }
`

interface IProps {
  videoUrl: string
  thumbnailUrl: string
  type: string
}
export const VideoPlayer = ({ videoUrl, type,thumbnailUrl }: IProps) => {
  const position = usePosition()
  return (
    <VideoContainer>
      <VideoFrame position={position}>
        {type === 'MEDIA_URL' && (
          <Player src={videoUrl} poster={thumbnailUrl} playsInline >
            <BigPlayButton position="center" />
            <ControlBar>
              <PlaybackRateMenuButton rates={[0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2]} />
            </ControlBar>
          </Player>
        )}
        {type === 'YOUTUBE' && <ReactPlayer url={videoUrl} width='100%' height='100%' controls/>}
      </VideoFrame>
    </VideoContainer>
  )
}

const usePosition = () => {
  const [position,setPosition] = useState<string>('absolute')
  const { theme } = useContext(AppContext)

  const handleEvent = () => {
    const newPosition = document.documentElement.scrollTop >= theme.headerHeight
      ? 'fixed' : 'absolute'
    if (position !== newPosition) setPosition(newPosition)
  }

  useEffect(() => {
    if (isServer) return 
    window.addEventListener('scroll', handleEvent)
    return () => window.removeEventListener('scroll', handleEvent)
  })

  console.log(position)
  return position
}
