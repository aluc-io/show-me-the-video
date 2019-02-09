import * as React from 'react'
import { useContext, useState } from 'react';
import { withRouter, SingletonRouter, DefaultQuery } from 'next/router'

import styled from '../style/styled-component'
import * as ReactMarkdown from 'react-markdown'
import { Player, BigPlayButton, ControlBar, PlaybackRateMenuButton } from 'video-react'
import { AppContext } from '../context';
import * as mime from 'mime-types'
import Button from '@material-ui/core/Button'
import CloudUploadIcon from '@material-ui/icons/CloudUpload';

import { CONST_DOC_DIRECTORY } from '../core/constant'
import markdownCss from '../markdownCss'
import { getDocInfo, getRepoInfo } from '../core'
import Header from '../component/Header'
import { Footer } from '../component/Footer'
import Page from '../component/Page'
import { IStatelessPage, IDocInfo, IRepoInfo } from 'global';
import { NextContext } from 'next';
import { getFromQuery } from '../core/util';

const Content = styled.div`
  margin-top: 20px;
  margin-bottom: 60px;
  flex: 1 1 0%;
  box-sizing: border-box;
`
const Container = styled.div`
  margin-left: auto;
  margin-right: auto;
  max-width: 960px;
  padding: 0px 20px;
`

const VideoContainer = styled.div`
  position: relative;
  padding-bottom: 56.25%;
  height: 0px;
`

const VideoFrame = styled.div`
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;

  & div:focus {
    outline: none;
  }
`

const MarkdownStyle = styled.div`
  ${markdownCss}
`

const ButtonGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  justify-items: center;
  align-items: center;
  height: 4em;
  grid-column-gap: .4em;
`
const leftIcon = {
  marginRight: '.2em'
}

const lookupMime = (src: string) => mime.lookup(src) ? mime.lookup(src) : void 0

const customRenderers: ReactMarkdown.Renderers = {
  linkReference: (props) => {
    const videoUrl = props.href
    const thumbnailUrl = props.children[0].props.src
    if (
      (lookupMime(videoUrl) || '').split('/')[0] === 'video'
      && (lookupMime(thumbnailUrl) || '').split('/')[0] === 'image'
    ) {
      // we use custom video player on this case
      return <span style={{ display: 'none' }}/>
    }
    return <a {...props}/>
  },
}



interface IGuideProps {
  repoIdx: number
  docInfo: IDocInfo
  repoInfo: IRepoInfo
  router: SingletonRouter
}

const Guide: IStatelessPage<IGuideProps> = (props) => {
  console.log('doc.tsx render()')
  const { siteInfo } = useContext(AppContext)
  const { host } = siteInfo
  const { router } = props
  const initialInfo = { repoInfo: props.repoInfo, docInfo: props.docInfo }
  const { repoInfo, docInfo } = useInfo(router.query, initialInfo)
  if (!docInfo || !repoInfo) {
    return <pre>...loading</pre>
  }

  const { publicUrl, managerId } = repoInfo
  const { id, videoUrl, text, thumbnailUrl, filename, title } = docInfo

  const issueTitle = encodeURIComponent(`
  영상 가이드(${id}) 관련 문의/제안 드립니다
  `.trim())
    const issueDescription = encodeURIComponent(`
  # 질문 있어요 / 제안 합니다
  
  - 보고 있던 동영상 주소: https://${host}/${router.asPath}
  - 급함 정도: 매우 급함 / 급함 / 보통 / 안급함 / 매우 안급함
  - 내용:
  
  \`\`\`
  <여기에 작성해주세요>
  \`\`\`
  
  /assign @${managerId}
  `.trim())

  return (
    <Page>
      <Header title={title}/>
      <Content>
        <Container>
          <VideoContainer>
            <VideoFrame>
              <Player src={videoUrl} poster={thumbnailUrl} playsInline >
                <BigPlayButton position="center" />
                <ControlBar>
                  <PlaybackRateMenuButton rates={[5, 2, 1, 0.5, 0.1]} />
                </ControlBar>
              </Player>
            </VideoFrame>
          </VideoContainer>
          <MarkdownStyle>
            <ReactMarkdown source={text} renderers={customRenderers}/>
          </MarkdownStyle>
          <ButtonGrid>
            <Button
              color="primary"
              size='large'
              fullWidth={true}
              variant="outlined"
              href={`${publicUrl}/issues/new?issue[title]=${issueTitle}&issue[description]=${issueDescription}`}
              target="_blank"
            >
              <CloudUploadIcon style={leftIcon}/>
              질문/제안
            </Button>
            <Button
              color="primary"
              size='large'
              fullWidth={true}
              variant="outlined"
              href={`${publicUrl}/edit/master/${CONST_DOC_DIRECTORY}/${filename}`}
              target="_blank"
            >
              <CloudUploadIcon style={leftIcon}/>
              편집
            </Button>
          </ButtonGrid>
        </Container>
      </Content>
      <Footer />
    </Page>
  )
}

Guide.getInitialProps = async (ctx: NextContext) => {
  const repoIdx = getFromQuery(ctx.query, 'repoIdx')
  const docId = getFromQuery(ctx.query, 'docId')
  const docInfo = await getDocInfo(repoIdx, docId)
  const repoInfo = await getRepoInfo(repoIdx)
  return { repoInfo, docInfo }
}

interface IPageLazyData {
  // 클라이언트에서는 먼저 페이지를 보여주고 데이터를 나중에 로딩하기 위해
  repoInfo: IRepoInfo
  docInfo: IDocInfo
}
const useInfo = (query: DefaultQuery | undefined, info: IPageLazyData) => {
  // componentDidMount 하기 싫어서
  const [repoInfo, setRepoInfo] = useState<IRepoInfo>(info.repoInfo)
  const [docInfo, setDocInfo] = useState<IDocInfo>(info.docInfo)
  if (!repoInfo || !docInfo) {
    const repoIdx = getFromQuery(query, 'repoIdx')
    const docId = getFromQuery(query, 'docId')
    getDocInfo(repoIdx, docId).then( setDocInfo )
    getRepoInfo(repoIdx).then( setRepoInfo )
  }
  return { repoInfo, docInfo }
}

export default withRouter(Guide)

