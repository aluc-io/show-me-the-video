import { useEffect, useState } from 'react'
import * as React from 'react'
import styled from 'styled-components'
import { layout as lo } from '../style/polished'
import { NextStatelessComponent } from 'next';
import { WithRouterProps } from 'next/router';
import { throttle } from 'lodash'

const Box = styled.div`
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

const Footer:NextStatelessComponent<WithRouterProps> = () => {
  const lackHeight = useLackHeight()

  return (
    <>
      <div style={{ height: lackHeight }}>{lackHeight}</div>
      <Box>
        <h1>© 2019 alfreduc23. powered by show-me-the-video</h1>
      </Box>
    </>
  )
}

const useLackHeight = () => {
  const isServer: boolean = process.env.IS_SERVER === "true"
  if (isServer) {
    return 0
  }

  const [lackHeight, setLackHeight] = useState(window.innerHeight - document.body.scrollHeight)
  useEffect(() => {
    const handleResize = throttle(() => {
      console.log(window.innerHeight - document.body.scrollHeight + lackHeight)
      const previousCorrection = lackHeight > 0 ? lackHeight : 0
      setLackHeight(window.innerHeight - document.body.scrollHeight - previousCorrection)
    }, 3000 )
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  })
  return lackHeight
}


export default Footer
