
import Ripples from 'react-ripples'
import styled from '../style/styled-component'

const StyledRipples = styled(Ripples)<IProps>`
  background-color: blue;
  flex-direction: column;
  display: flex;
  width: 100%;
  height: 100%;
  cursor: pointer;
  padding: .2em;
`

const FlexA = styled.a<IProps>`
  background-color: green;
  flex-direction: column;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  cursor: pointer;
  :hover {
    opacity: 0.8;
    text-decoration: none;
    color: white;
  }
  :active {
    opacity: 0.7;
  }
`

interface IProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  bg?: string
  text?: string
}
export const ButtonComponent = (props: IProps) => {
  const { href, target, text, bg } = props
  return (
    <StyledRipples>
      <FlexA bg={bg} href={href} target={target}>
        {text}
      </FlexA>
    </StyledRipples>
  )
}
