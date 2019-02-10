import * as React from 'react'
import App, { Container, NextAppContext, DefaultAppIProps, AppProps } from 'next/app'

// 모든 page 에 css 가 추가되어 좋지 않지만 현재 아래 이슈로 이곳에 css 추가
// https://github.com/zeit/next-plugins/issues/282
import "video-react/dist/video-react.css"
import { useShowLayout, useRepoInfoArr, useSiteInfo } from '../state'
import { AppContext } from '../context'
import { getRepoInfoArr, getSiteInfo } from '../core'
import { GlobalStyle } from '../style/GlobalStyle'
import theme from '../style/theme-light'
import { ThemeProvider } from '../style/styled-component'
import { ISiteInfo, IRepoInfo } from 'global';

const isServer = !! process.env.APPLICATION_CONFIG

interface IAppProps extends DefaultAppIProps, AppProps {
  repoInfoArr: Array<IRepoInfo>
  siteInfo: ISiteInfo
  showLayout: boolean
}

const CustomApp = (props: IAppProps) => {
  const { Component, pageProps, repoInfoArr, siteInfo, showLayout } = props
  const value = { 
    ...useShowLayout(showLayout),
    ...useRepoInfoArr(repoInfoArr),
    ...useSiteInfo(siteInfo),
  }
  const dynamicTheme = { ...theme, showLayout: value.showLayout }
  return (
    <AppContext.Provider value={value}>
      <GlobalStyle />
      <Container>
        <ThemeProvider theme={dynamicTheme}>
          <Component {...pageProps}/>
        </ThemeProvider>
      </Container>
    </AppContext.Provider>
  )
}

class CustomAppWrapper extends App<IAppProps> {
  static async getInitialProps({ Component, router, ctx }: NextAppContext) {
    let pageProps = {}

    if (Component.getInitialProps && isServer) {
      pageProps = await Component.getInitialProps(ctx)
    }

    const repoInfoArr = await getRepoInfoArr()
    const siteInfo = await getSiteInfo()
    const showLayout = theme.showLayout
    return { repoInfoArr, siteInfo, pageProps, router, showLayout }
  }

  componentDidMount() {
    console.log('componentDidMount')
    const jssStyles = document.getElementById('jss-server-side');
    if (jssStyles && jssStyles.parentNode) {
      console.log('remove jss-server-side')
      jssStyles.parentNode.removeChild(jssStyles);
    }
  }

  render() {
    // Splited function Component is needed,
    // because hooks can only be called inside the body of a function component.
    return <CustomApp {...this.props}/>
  }
}

export default CustomAppWrapper
