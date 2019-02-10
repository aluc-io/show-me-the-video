import { Player, BigPlayButton, ControlBar, PlaybackRateMenuButton } from 'video-react'

interface IProps {
  videoUrl: string
  thumbnailUrl: string
}
export const MediaUrlPlayer = ({ videoUrl, thumbnailUrl }: IProps) =>
  <Player src={videoUrl} poster={thumbnailUrl} playsInline >
    <BigPlayButton position="center" />
    <ControlBar>
      <PlaybackRateMenuButton rates={[0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2]} />
    </ControlBar>
  </Player>
