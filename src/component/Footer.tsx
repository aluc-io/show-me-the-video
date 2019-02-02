import { useContext } from 'react'
import * as React from 'react'
import styled from 'styled-components'
import { AppContext } from '../context'
import { ICommonStyledProps } from 'global'
import { NextStatelessComponent } from 'next';
import { WithRouterProps } from 'next/router';

const Box = styled.div<ICommonStyledProps>`
  background-color: ${p => p.showLayout ? 'rgba(133, 233, 133, 0.65)' : 'init'};
  padding: 1em 10px;
  bottom: 0px;
  width: 100%;
  text-align: right;

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
  const { showLayout } = useContext(AppContext)

  return (
    <Box showLayout={showLayout}>
      <h1>Build with Show me the video</h1>
    </Box>
  )
}

export default Footer
