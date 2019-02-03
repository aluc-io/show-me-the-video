import { withRouter, SingletonRouter } from 'next/router'
import * as React from 'react'
import styled from 'styled-components'

import { ICommonStyledProps } from 'global'
import { AppContext } from '../context'
import { useContext } from 'react';

const Box = styled.div<ICommonStyledProps>`
  -webkit-box-align: center;
  align-items: center;
  height: 80px;
  -webkit-box-pack: justify;
  justify-content: space-between;
  margin-bottom: 20px;
  border-bottom: 2px solid rgb(237, 237, 237);
  padding: 0px 20px;
  font-family: Roboto;
  background-color: ${p => p.showLayout ? 'rgba(133, 233, 133, 0.65)' : '#f2aaaa'};
`

const H1 = styled.h1<ICommonStyledProps>`
  font-size: 1.3em;
  color: black;
  background-color: ${p => p.showLayout ? 'rgba(83, 23, 233, 0.65)' : '#f2aaaa'};
  & a {
    text-decoration: none;
    color: black;
  }
`

const TextButton = styled.li<ICommonStyledProps>`
  background-color: ${p => p.showLayout ? 'rgba(83, 23, 233, 0.65)' : '#f2aaaa'};
  display: inline-block;
  cursor: pointer;
  color: white;
  margin-left: 1em;
  font-size: 2em;
  &:first-child {
    margin-left: 0;
  }
  & a {
    text-decoration: none;
    color: white;
  }
  & a:hover {
    color: #700f0f;
  }
  &:hover {
    color: #700f0f;
  }
`

const TextButtonBox = styled.ul`
  list-style: none;
`
interface IHeaderProps {
  router: SingletonRouter
}

const Header: React.FunctionComponent<IHeaderProps> = props => {
  const { showLayout, toggleShowLayout, siteInfo } = useContext(AppContext)
  const { pathname } = props.router
  const { title } = siteInfo

  return (
    <Box showLayout={showLayout}>
      <H1 showLayout={showLayout}>
        {pathname !== '/' && <a href={`/`}>{title}</a>}
        {pathname === '/' && title}
      </H1>
      <TextButtonBox>
        <TextButton onClick={toggleShowLayout}>layout</TextButton>
        <TextButton>
          {pathname !== '/' && <a href={`/`}>list</a>}
        </TextButton>
      </TextButtonBox>
    </Box>
  )
}

export default withRouter(Header)
