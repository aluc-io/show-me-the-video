import * as React from 'react'
import { useContext } from 'react';

import { CardBox } from '../component/CardBox'
import { Footer } from '../component/Footer'
import Header from '../component/Header'
import Page from '../component/Page'
import { AppContext } from '../context';

const Index = () => {
  const { repoInfoArr } = useContext(AppContext)
  return (
    <Page>
      <Header />
      {repoInfoArr.map( (repoInfo,i) => <CardBox key={i} repoInfo={repoInfo}/>)}
      <Footer />
    </Page>
  )
}

export default Index
