import * as React from 'react'

import styled from '../style/styled-component'
import media from '../style/media'
import { layout as lo } from '../style/polished'
import Card from './Card'
import { IRepoInfo } from 'src/@types/global';

const CardBoxRoot = styled.div`
  margin: .8em .8em 1.4em .8em;
`

const GridWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

`
const Grid = styled.div`
  display: flex;
  flex-wrap: wrap;

  @media ${media.xs} { width: 100%; }
  @media ${media.s}  { width: ${p => p.theme.cardWidth*2 + p.theme.cardMargin*4}px; }
  @media ${media.m}  { width: ${p => p.theme.cardWidth*3 + p.theme.cardMargin*6}px; }
  @media ${media.l}  { width: ${p => p.theme.cardWidth*4 + p.theme.cardMargin*8}px; }
  @media ${media.xl} { width: ${p => p.theme.cardWidth*6 + p.theme.cardMargin*12}px; }
  max-width: 1780px;
  ${p => p.theme.showLayout ? 'box-shadow: 0 0 10px 2px green;' : ''}
  ${p => lo(p.theme.showLayout, "Grid", "rgba(33, 83, 133, 0.45)")}
`

const Title = styled.div`
  /* Card 의 width 와 sync 되어야 왼쪽 줄이 맞음 */

  margin-left: ${p => p.theme.cardMargin}px;
  @media ${media.xs} { margin-left: 0px; }
  @media ${media.xs} { width: 100%; }
  font-weight: 700;
  white-space: pre;
  font-size: 1.1em;

  ${p => lo(p.theme.showLayout, "", "rgba(193, 83, 133, 0.45)")}
`

interface IProps {
  repoInfo: IRepoInfo
}

export const CardBox: React.FunctionComponent<IProps> = (props)=> {
  const { title, docInfoArr, idx } = props.repoInfo
  return (
    <CardBoxRoot>
      <GridWrapper>
        <Grid>
          <Title>{title}</Title>
        </Grid>
      </GridWrapper>
      <GridWrapper>
        <Grid>
          {docInfoArr.map( (info,i) => <Card key={i} repoIdx={idx} {...info} />)}
        </Grid>
      </GridWrapper>
    </CardBoxRoot>
  )
}
