import * as React from 'react'
import { withRouter, SingletonRouter } from 'next/router'
import getConfig from 'next/config'
import { Card as BPCard } from '@blueprintjs/core'
import styled from 'styled-components'
import * as ReactMarkdown from 'react-markdown'
import { Player, BigPlayButton, ControlBar, PlaybackRateMenuButton } from 'video-react'
import { space, width, fontSize, color } from 'styled-system'
import "video-react/dist/video-react.css"
import { Button as BPButton, Intent, Slider, KeyCombo } from "@blueprintjs/core";
import * as mime from 'mime-types'
import Ripples from 'react-ripples'


// import { Classes } from "@blueprintjs/core"
import "@blueprintjs/core/lib/css/blueprint.css";
// import "@blueprintjs/icons/lib/css/blueprint-icons.css";

import { CONST_DIR_NAME } from '../core/constant'
import markdownCss from '../markdownCss'
import { getGuideInfo } from '../core'
import Header from '../component/Header'
import { IGuideInfo, IStatelessPage, ICommonStyledProps } from 'global';
const { publicRuntimeConfig } = getConfig()

const { SMTV_URL, SMTV_PUBLIC_REPO_URL, SMTV_MANAGER_ID } = publicRuntimeConfig

interface GuideProps {
  guideInfo: IGuideInfo
  router: SingletonRouter
}

const Page = styled.div`
  ${space}
  ${width}
  ${fontSize}
  ${color}
  display: flex;
  min-height: 100vh;
  flex-direction: column;
`

const Card = styled(BPCard)<ICommonStyledProps>`
  background-color: blue;
  color: white;
  d: ${p => p.showLayout ? 'd' : 'f'};
`

const Content = styled(BPCard)<ICommonStyledProps>`
  margin-bottom: 60px;
  flex: 1 1 0%;
  box-sizing: border-box;
`
const Container = styled(BPCard)<ICommonStyledProps>`
  margin-left: auto;
  margin-right: auto;
  max-width: 960px;
  padding: 0px 20px;
`

const VideoContainer = styled(BPCard)<ICommonStyledProps>`
  position: relative;
  padding-bottom: 56.25%;
  height: 0px;
`

const VideoFrame = styled(BPCard)<ICommonStyledProps>`
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;

  & div:focus {
    outline: none;
  }
`

const Button = styled(BPButton)<ICommonStyledProps>`
  width: 100%;
`

const MarkdownStyle = styled(BPCard)`
  ${markdownCss}
`

const lookupMime = (src: string) => mime.lookup(src) ? mime.lookup(src) : void 0

const customRenderers: ReactMarkdown.Renderers = {
  linkReference: (props) => {
    const videoUrl = props!.href
    const thumbnailUrl = props.children[0]!.props!.src
    // videoUrl, thumbnailUrl 이 아래의 패턴의 경우
    // 비디오 플레이어 자리. 플레이어는 따로 띄우고 있으므로 제거해줌
    if (
      (lookupMime(videoUrl) || '').split('/')[0] === 'video'
      && (lookupMime(thumbnailUrl) || '').split('/')[0] === 'image'
    ) {
      return <div/>
    }
    return <a {...props}/>
  },
}

const Guide: IStatelessPage<GuideProps> = (props) => {
  const { router } = props
  if (!props.guideInfo) {
    return <pre>{JSON.stringify(props,null,2)}</pre>
  }
  const { id, videoUrl, text, thumbnailUrl, filename } = props.guideInfo

  const issueTitle = encodeURIComponent(`
  영상 가이드(${id}) 관련 문의/제안 드립니다
  `.trim())
    const issueDescription = encodeURIComponent(`
  # 질문 있어요 / 제안 합니다
  
  - 보고 있던 동영상 주소: ${SMTV_URL}/${router.asPath}
  - 급함 정도: 매우 급함 / 급함 / 보통 / 안급함 / 매우 안급함
  - 내용:
  
  \`\`\`
  <여기에 작성해주세요>
  \`\`\`
  
  /assign @${SMTV_MANAGER_ID}
  `.trim())
  return (
    <Page>
      <Header />
      <Content>
        <Container>
          <VideoContainer>
            <VideoFrame>
              <Player
                src={videoUrl}
                poster={thumbnailUrl}
                playsInline
              >
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
          <BPCard>
            <Ripples>
              <Button intent={Intent.WARNING} large={true} text={'ddd'}>
              </Button>
            </Ripples>
            <Button large={true}>
              <a target='_blank' href={`${SMTV_PUBLIC_REPO_URL}/edit/master/${CONST_DIR_NAME}/${filename}`}>
                편집
              </a>
            </Button>
            </BPCard>
        </Container>
      </Content>
    </Page>
  )
}

Guide.getInitialProps = async ({ req }) => {
  const guideId = req.params.guideId
  const guideInfo = await getGuideInfo(guideId)
  console.log('guideInfo: ' + guideInfo)
  return { guideInfo }
}
export default withRouter(Guide)
