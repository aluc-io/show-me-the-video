import * as React from 'react'
import App, { Container, NextAppContext, DefaultAppIProps, AppProps } from 'next/app'

import { useShowLayout, useRepoInfoArr, useSiteInfo } from '../state'
import { AppContext } from '../context'
import { getRepoInfoArr, getSiteInfo } from '../core'
import { GlobalStyle } from '../style/GlobalStyle'
import theme from '../style/theme-light'
import { ThemeProvider } from '../style/styled-component'
import { ISiteInfo, IRepoInfo } from 'global';

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

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }

    const repoInfoArr = await getRepoInfoArr()
    const siteInfo = await getSiteInfo()
    const showLayout = true
    return { repoInfoArr, siteInfo, pageProps, router, showLayout }
  }

  render() {
    // Splited function Component is needed,
    // because hooks can only be called inside the body of a function component.
    return <CustomApp {...this.props}/>
  }
}

export default CustomAppWrapper
