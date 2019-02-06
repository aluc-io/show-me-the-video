import * as React from 'react'
import Link from 'next/link'
import { withRouter } from 'next/router'

import styled from '../style/styled-component'
import { IDocInfo } from 'global'
import { layout as lo } from '../style/polished'
import TimeAgo from 'react-timeago'

const Card = styled.div`
  cursor: pointer;
  margin: .6em 0px;
  width: ${p => p.theme.cardWidth}px;
  ${p => lo(p.theme.showLayout, "Card", "rgba(133, 233, 133, 0.65)" )}
  &:hover .info {
    text-decoration: underline;
  }
  &:hover .image {
    transform: translateY(-3px);
    box-shadow: rgba(140, 101, 179, 0.5) 0px 8px 20px;
  }
`

const ImageWrapper = styled.div`
  height: 152px;
  position: relative;
  overflow: hidden;
  box-shadow: rgba(102, 51, 153, 0.1) 0px 4px 10px;
  margin-bottom: 0.525rem;
  border-radius: 4px;
  transition: all 250ms cubic-bezier(0.4, 0, 0.2, 1) 0s;
  ${p => lo(p.theme.showLayout, "ImageWrapper", "rgba(205, 40, 0, 0.65)" )}
`

const LinkInner = styled.div`
  box-shadow: none;
  border-bottom: none;
  transition: all 250ms cubic-bezier(0.4, 0, 0.2, 1) 0s;
  text-decoration: none;
  ${p => lo(p.theme.showLayout, "LinkInner", "rgba(255, 200, 180, 0.51)" )}
`

const Image = styled.img`
  border-radius: 4px;
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center center;
  opacity: 1;
  transition: opacity 0.5s ease 0s;

  max-width: 100%;
  margin-left: 0;
  margin-right: 0;
  margin-top: 0;
  padding-bottom: 0;
  padding-left: 0;
  padding-right: 0;
  padding-top: 0;
  margin-bottom: 1.05rem;

  border-style: none;
}
`

const AbsoluteBox = styled.div`
  position: absolute;
  text-align: right;
  bottom: 5px;
  right: 8px;
  background-color: #0000009e;
  padding: 6px;
  color: white;
  font-family: Roboto;
`

const InfoBox = styled.div`
  color: rgba(0, 0, 0, 0.36);
  line-height: 18px;
  font-size: .9em;
  align-items: baseline;
  ${p => lo(p.theme.showLayout, "", "rgba(33, 13, 133, 0.45)" )}
`

const Title = styled.div`
  color: rgba(0, 0, 0, 0.36);
  ${p => lo(p.theme.showLayout, "Title", "rgba(233, 83, 133, 0.45)" )}

  & h5 {
    box-shadow: rgb(251, 250, 252) 0px 0px 0px 0px inset;
    transition: box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1) 0s, transform 0.3s cubic-bezier(0.4, 0, 0.2, 1) 0s;
    padding-bottom: 0;
    padding-left: 0;
    padding-right: 0;
    padding-top: 0;
    margin: 0;
    color: hsla(270,17.119554496%,0%,0.92);
    font-size: 1rem;
    font-height: 1.4rem;
    font-weight: bold;
    font-rendering: optimizeLegibility;
    font-family: Roboto, 'Nanum Gothic Coding';
    white-space: pre-line;
  }
`

const SubInfo = styled.div`
  text-align: left;
`

const CardComponent: React.FunctionComponent<IDocInfo & {repoIdx: number}> = props => {
  const { repoIdx, title, thumbnailUrl, id, createTime, author, duration } = props
  const ct = new Date(createTime)
  return (
    <Card>
      <Link href={`/${repoIdx}/${id}`}>
        <LinkInner>
          <ImageWrapper className='image'>
            <Image src={thumbnailUrl}/>
            <AbsoluteBox>
              <span>{duration}</span>
            </AbsoluteBox>
          </ImageWrapper>
          <InfoBox className='info'>
            <Title>
              <h5>{title}</h5>
              <SubInfo>
                <span><TimeAgo date={ct}/></span>
                <span>{" / " + author}</span>
              </SubInfo>
            </Title>
          </InfoBox>
        </LinkInner>
      </Link>
    </Card>
  )
}

export default withRouter(CardComponent)
