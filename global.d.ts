import { string } from 'prop-types';
import { NextFunctionComponent } from 'next';

declare module "mktemp"

declare module "video-react"

interface IStatelessPage<P = {}> extends NextFunctionComponent<P> {
  getInitialProps?: (ctx: any) => any
}

interface IStatefulPage<P = {}> extends React.Component<P> {
  getInitialProps?: (ctx: any) => any
}

interface ICommonStyledProps {
  showLayout?: boolean
}

interface IYoutubeDocInfo {
  title: string
  thumbnailUrl: string
  tagArr: Array<string>
  author: string
  createTime: string
  duration: string
}

interface IMarkdownDocInfo extends IYoutubeDocInfo {
  updateTime?: string
  isDraft?: boolean
  prev?: string
  next?: string
}

interface IDocInfo extends IMarkdownDocInfo {
  id: string
  filename: string
  text: string
  videoUrl: string
  type: 'MEDIA_URL' | 'YOUTUBE'
  isDeleted: boolean
}

interface IRepoInfo {
  idx: number
  type: string
  publicUrl: string
  title: string
  managerId: string
  docDirectory: string
  docInfoArr: Array<IDocInfo>
}

interface ISiteInfo {
  title: string
  host: string
}

interface IApplicationConfig extends ISiteInfo {
  youtubeAPIKey: string
  backendRepos: Array<{
    type: string
    cloneUrl: string
    publicUrl: string
    docDirectory: string
    title: string
    managerId: string
  }>
}
