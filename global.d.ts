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

interface IDocInfo {
  title: string
  subTitle: string
  videoUrl: string
  thumbnailUrl: string
  tagArr: Array<string>
  prev: string
  next: string
  author: string
  createTime: string
  updateTime: string
  duration: string
  id: string
  filename: string
  text: string
}

interface IRepoInfo {
  idx: number
  type: string
  publicUrl: string
  title: string
  managerId: string
  docInfoArr: Array<IDocInfo>
}

interface ISiteInfo {
  title: string
  host: string
}

interface IApplicationConfig extends ISiteInfo {
  backendRepos: Array<{
    type: string
    cloneUrl: string
    publicUrl: string
    docDirectory: string
    title: string
    managerId: string
  }>
}
