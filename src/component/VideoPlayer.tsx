import ReactPlayer from 'react-player';

interface IProps {
  videoUrl: string
}
export const VideoPlayer = ({ videoUrl }: IProps) => (
  <ReactPlayer url={videoUrl} width='100%' height='100%' controls/>
)
