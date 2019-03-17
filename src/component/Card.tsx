import * as React from 'react'
import TimeAgo from 'react-timeago'
import styled from '../style/styled-component'
import media from '../style/media'
// import { IDocInfo } from '../@types/global'
import { layout as lo } from '../style/polished'
import { Link } from '../routes'
import { IDocInfo } from 'src/@types/global';

const Card = styled.div`
  cursor: pointer;
  width: ${p => p.theme.cardWidth}px;
  margin: 0 ${p => p.theme.cardMargin}px;
  @media ${media.xs} {
    width: 100%;
    margin: 0px;
  }

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
  padding-bottom: 56.25%;
  position: relative;
  overflow: hidden;
  box-shadow: rgba(102, 51, 153, 0.1) 0px 4px 10px;
  border-radius: 4px;
  transition: all 250ms cubic-bezier(0.4, 0, 0.2, 1) 0s;
  flex-shrink: 0;
  -webkit-box-pack: center;
  justify-content: center;
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  ${p => lo(p.theme.showLayout, "ImageWrapper", "rgba(205, 40, 0, 0.65)" )}
`

const LinkInner = styled.a`
  box-shadow: none;
  border-bottom: none;
  transition: all 250ms cubic-bezier(0.4, 0, 0.2, 1) 0s;
  text-decoration: none;
  ${p => lo(p.theme.showLayout, "LinkInner", "rgba(255, 200, 180, 0.51)" )}
`

const Image = styled.img`
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
  height: 54px;
  ${p => lo(p.theme.showLayout, "", "rgba(33, 13, 133, 0.45)" )}
`

const Title = styled.div`
  color: rgba(0, 0, 0, 0.36);
  ${p => lo(p.theme.showLayout, "Title", "rgba(233, 83, 133, 0.45)" )}

  & h5 {
    display: block;
    display: -webkit-box;

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

    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;

    -ms-line-clamp: 2;
    -ms-box-orient: vertical;

    text-overflow: ellipsis;
    overflow: hidden;

    max-height: calc(2em * 1.1);
  }
`

const SubInfo = styled.div`
  text-align: left;
`

interface ICardComponentProps extends IDocInfo {
  repoIdx: number
}

const CardComponent: React.FunctionComponent<ICardComponentProps> = props => {
  const { repoIdx, title, thumbnailUrl, id: docId , createTime, author, duration } = props
  const ct = new Date(createTime)
  return (
    <Card>
      <Link prefetch route='doc' params={{ repoIdx, docId }}>
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

export default CardComponent
