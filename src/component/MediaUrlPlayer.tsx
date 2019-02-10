import { Player, BigPlayButton, ControlBar, PlaybackRateMenuButton } from 'video-react'

interface IProps {
  videoUrl: string
  thumbnailUrl: string
}
export const MediaUrlPlayer = ({ videoUrl, thumbnailUrl }: IProps) =>
  <Player src={videoUrl} poster={thumbnailUrl} playsInline >
    <BigPlayButton position="center" />
    <ControlBar>
      <PlaybackRateMenuButton rates={[5, 2, 1, 0.5, 0.1]} />
    </ControlBar>
  </Player>
