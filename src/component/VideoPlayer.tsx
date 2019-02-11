import ReactPlayer from 'react-player';
import { Player, BigPlayButton, ControlBar, PlaybackRateMenuButton } from 'video-react'
import styled from '../style/styled-component'

const VideoContainer = styled.div`
  position: relative;
  padding-bottom: 56.25%;
  height: 0px;
`

const VideoFrame = styled.div`
  position: absolute;
  top: 0px;
  width: 100%;
  height: 100%;
  max-width: 960px;

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
  return (
    <VideoContainer>
      <VideoFrame>
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
