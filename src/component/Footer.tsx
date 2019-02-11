import * as React from 'react'
import { useEffect, useState } from 'react'
import styled from '../style/styled-component'
import { layout as lo } from '../style/polished'
import { CONST_SMTV_GITHUB_URL } from '../core/constant';

const isServer = !! process.env.APPLICATION_CONFIG

const Box = styled.div`
  position: fixed;
  padding: 1em 10px;
  bottom: 0px;
  width: 100%;
  text-align: right;
  ${p => lo(p.theme.showLayout, "FooterBox", "rgba(200, 200, 200, 0.75)" )}

  & h1 {
    font-family: Roboto;
    font-size: 1.1em;
    font-weight: 300;
    padding: 0;
    margin: 0;
    color: rgba(128, 128, 128, 0.88);
  }
`

const Version = styled.div`
  left: 4px;
  bottom: 4px;
  position: absolute;
  color: darkgray;
`

export const Footer = () => {
  const restHeight = useRestHeight()
  const opacity = (100 - restHeight) * 0.01
  const display = opacity > 0 ? 'block' : 'none'

  return (
    <Box style={{ opacity, display }}>
      <h1>
        <span>© 2019 <a href="https://aluc.io/pages/1--about">aluc.io</a>. powered by </span>
        <a href={CONST_SMTV_GITHUB_URL}>show-me-the-video</a>
      </h1>
      <Version>{process.env.SMTV_VERSION}</Version>
    </Box>
  )
}

const useRestHeight = () => {
  const [ restHeight, setRestHeight ] = useState(101)
  if (isServer) return restHeight

  const handleEvent = () => {
    const maxScrollY = document.documentElement.scrollHeight - window.innerHeight
    let newRestHeight = maxScrollY - document.documentElement.scrollTop
    newRestHeight = newRestHeight > 100 ? 100 : newRestHeight
    if (restHeight === newRestHeight) return

    setRestHeight(newRestHeight)
  }

  useEffect( () => {
    window.addEventListener('scroll', handleEvent)
    window.addEventListener('resize', handleEvent)
    return () => {
      window.removeEventListener('scroll', handleEvent)
      window.removeEventListener('resize', handleEvent)
    }
  })

  if (restHeight === 101) {
    // restHeight: 101 은 오직 컴포넌트 mount 후 최초 1회만 들어갈 수 있다!?
    // 스크롤이 생기지 않는 페이지에서 restHeight 를 구하기 위해 호출
    // useState 에서 호출 하면 ssr 렌더링 결과와 client 에서의 렌더링 결과가 달라지는 문제
    // componentDidMount 에 들어갈 부분
    window.requestAnimationFrame(handleEvent)
  }

  return restHeight
}

