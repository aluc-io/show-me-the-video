import * as React from 'react'
import { useContext, useState } from 'react';
import { DefaultQuery, withRouter, WithRouterProps } from 'next/router'
import * as ReactMarkdown from 'react-markdown'
import * as mime from 'mime-types'
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import { NextContext } from 'next';
import Button from '@material-ui/core/Button'

import { IStatelessPage, IDocInfo, IRepoInfo } from 'global';
import styled from '../style/styled-component'
import { AppContext } from '../context';
import markdownCss from '../markdownCss'
import { getDocInfo, getRepoInfo } from '../core'
import Header from '../component/Header'
import { Footer } from '../component/Footer'
import Page from '../component/Page'
import media from '../style/media'
import { getFromQuery } from '../core/util';
import { VideoPlayer } from '../component/VideoPlayer';

const Content = styled.div`
  margin-top: 20px;
  @media ${media.xs} { margin-top: 0px; }
  margin-bottom: 60px;
  flex: 1 1 0%;
  box-sizing: border-box;
`
const Container1 = styled.div`
  margin-left: auto;
  margin-right: auto;
  max-width: 960px;
  padding: 0px 20px;
  @media ${media.xs} { padding: 0px 0px; }
`

const Container2 = styled.div`
  margin-left: auto;
  margin-right: auto;
  max-width: 960px;
  padding: 0px 20px;
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

interface IGuideProps extends WithRouterProps {
  repoIdx: number
  docInfo: IDocInfo
  repoInfo: IRepoInfo
}

const Guide: IStatelessPage<IGuideProps> = (props) => {
  console.log('doc.tsx render()')
  const { siteInfo } = useContext(AppContext)
  const { host } = siteInfo
  const { router } = props
  if (!router) throw new Error('SMTV_ERROR_98531')

  const initialInfo = { repoInfo: props.repoInfo, docInfo: props.docInfo }
  const { repoInfo, docInfo } = useInfo(router.query, initialInfo)
  if (!docInfo || !repoInfo) {
    return <pre>...loading</pre>
  }

  const { publicUrl, managerId, docDirectory } = repoInfo
  const { id, videoUrl, text, thumbnailUrl, filename, title, type } = docInfo

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
        <Container1>
          <VideoPlayer videoUrl={videoUrl} thumbnailUrl={thumbnailUrl} type={type}/>
        </Container1>
        <Container2>
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
            >
              <CloudUploadIcon style={leftIcon}/>
              질문/제안
            </Button>
            <Button
              color="primary"
              size='large'
              fullWidth={true}
              variant="outlined"
              href={`${publicUrl}/edit/master/${docDirectory}/${filename}`}
            >
              <CloudUploadIcon style={leftIcon}/>
              편집
            </Button>
          </ButtonGrid>
        </Container2>
      </Content>
      <Footer />
    </Page>
  )
}

Guide.getInitialProps = async (ctx: NextContext) => {
  console.log('Guide.getInitialProps')
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
  const [lazyInfo, setLazyInfo] = useState<IPageLazyData>(info)
  if (!lazyInfo.repoInfo || !lazyInfo.docInfo) {
    const repoIdx = getFromQuery(query, 'repoIdx')
    const docId = getFromQuery(query, 'docId')
    console.log('fetch repoInfo, docInfo with', repoIdx, docId)
    Promise.all([ getDocInfo(repoIdx, docId), getRepoInfo(repoIdx) ])
      .then(([docInfo, repoInfo]) => {
        // 정보가 없는데 setLazyInfo 를 부르면 무한 루프에 빠질 수 있음
        if (!docInfo || !repoInfo) throw new Error('SMTV_ERROR_12513')
        setLazyInfo({ repoInfo, docInfo })
      })
  }
  return lazyInfo
}

export default withRouter(Guide)

