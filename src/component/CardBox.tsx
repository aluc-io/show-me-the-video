import { useContext } from 'react'
import * as React from 'react'

import { AppContext } from '../context'
import styled from '../style/styled-component'
import media from '../style/media'
import { layout as lo } from '../style/polished'
import Card from './Card'

const CardBox = styled.div`
  margin: .8em;
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
  align-self: center;
  font-weight: 700;
  white-space: pre;
  font-size: 1.1em;
  ${p => lo(p.theme.showLayout, "", "rgba(193, 83, 133, 0.45)")}
`

export default () => {
  const { videoInfoArr } = useContext(AppContext)
  return (
    <CardBox>
      <GridTitle>
        <Title>My video clip</Title>
      </GridTitle>
      <Grid>
        {videoInfoArr.map( (info,i) => <Card key={i} {...info} />)}
      </Grid>
    </CardBox>
  )
}