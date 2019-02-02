import { string } from 'prop-types';

declare module "mktemp"

declare module "video-react"

interface IStatelessPage<P = {}> extends React.FunctionComponent<P> {
  getInitialProps?: (ctx: any) => any
}

interface IStatefulPage<P = {}> extends React.Component<P> {
  getInitialProps?: (ctx: any) => any
}

interface ICommonStyledProps {
  showLayout?: boolean
}

interface IGuideInfo {
  id: string
  videoUrl: string
  thumbnailUrl: string
  filename: string
  author: string
  title: string
  duration: string
  createTime: string
  updateTime: string
  text: string
}
