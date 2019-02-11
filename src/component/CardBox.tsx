import * as React from 'react'

import { IRepoInfo } from 'global';
import styled from '../style/styled-component'
import media from '../style/media'
import { layout as lo } from '../style/polished'
import Card from './Card'

const CardBoxRoot = styled.div`
  margin: .8em .8em 1.4em .8em;
`

const Grid = styled.div`
  display: grid;
  @media ${media.xs} { grid-template-columns: repeat(1,1fr); }
  @media ${media.s}  { grid-template-columns: repeat(2,1fr); }
  @media ${media.m}  { grid-template-columns: repeat(3,1fr); }
  @media ${media.l}  { grid-template-columns: repeat(4,1fr); }
  @media ${media.xl} { grid-template-columns: repeat(6,1fr); }
  justify-items: center;
  grid-column-gap: 10px;
  ${p => lo(p.theme.showLayout, "Grid", "rgba(33, 83, 133, 0.45)")}
`

const GridTitle = styled(Grid)`
  grid-template-rows: 40px;
  ${p => lo(p.theme.showLayout, "GridTitle", "rgba(93, 83, 133, 0.45)")}
`

const Title = styled.div`
  /* Card 의 width 와 sync 되어야 왼쪽 줄이 맞음 */
  width: ${p => p.theme.cardWidth}px;
  @media ${media.xs} { width: 100%; }
  align-self: center;
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
      <GridTitle>
        <Title>{title}</Title>
      </GridTitle>
      <Grid>
        {docInfoArr.map( (info,i) => <Card key={i} repoIdx={idx} {...info} />)}
      </Grid>
    </CardBoxRoot>
  )
}
