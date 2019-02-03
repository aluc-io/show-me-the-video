import * as React from 'react'
import App, { Container, NextAppContext } from 'next/app'
import { createGlobalStyle } from 'styled-components'

import { useShowLayout, useVideoInfoArr } from '../state'
import { AppContext } from '../context'
import { getVideoInfoArr } from '../core'

import "normalize.css";

// import '../font.css'

const GlobalStyle = createGlobalStyle`
* {
  box-sizing: border-box;
}
a {
  text-decoration: none;
}
a:visited {
  text-decoration: none;
}
html, body, div, span, applet, object, iframe, h1, h2, h3, h4, h5, h6, p, blockquote, pre, a, abbr, acronym, address, big, cite, code, del, dfn, em, img, ins, kbd, q, s, samp, small, strike, strong, sub, sup, tt, var, b, u, i, center, dl, dt, dd, ol, ul, li, fieldset, form, label, legend, table, caption, tbody, tfoot, thead, tr, th, td, article, aside, canvas, details, embed, figure, figcaption, footer, header, hgroup, menu, nav, output, ruby, section, summary, time, mark, audio, video {
  vertical-align: baseline;
  margin: 0px;
  padding: 0px;
  border-width: 0px;
  border-style: initial;
  border-color: initial;
  border-image: initial;
  font: inherit;
}
`

const CustomApp = (props) => {
  const { Component, pageProps } = props
  const { showLayout, toggleShowLayout } = useShowLayout(true)
  const videoInfoArr = useVideoInfoArr(props.videoInfoArr)

  const value = {
    showLayout,
    toggleShowLayout,
    videoInfoArr,
  }

  return (
    <AppContext.Provider value={value}>
      <GlobalStyle />
      <Container>
        <Component {...pageProps}/>
      </Container>
    </AppContext.Provider>
  )
}

class CustomAppWrapper extends App {
  static async getInitialProps({ Component, router, ctx }: NextAppContext) {
    let pageProps = {}

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }

    const videoInfoArr = await getVideoInfoArr()
    return { videoInfoArr, pageProps, router }
  }

  render() {
    return <CustomApp {...this.props}/>
  }
}

export default CustomAppWrapper
