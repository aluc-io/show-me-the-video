import * as React from 'react'
import { useContext } from 'react';

import CardBox from '../component/CardBox'
import Footer from '../component/Footer'
import Header from '../component/Header'
import Page from '../component/Page'
import { ThemeProvider } from '../style/styled-component'
import theme from '../style/theme-light'
import { AppContext } from '../context';


const Index = () => {
  const { showLayout } = useContext(AppContext)
  const dynamicTheme = { ...theme, showLayout }
  return (
    <ThemeProvider theme={dynamicTheme}>
      <Page>
        <Header />
        <CardBox />
        <Footer />
      </Page>
    </ThemeProvider>
  )
}

export default Index
