import styled from 'styled-components'
import NextLink from 'next/link'

const StyledLink = styled.div`
  cursor: pointer;
  :hover {
    color: #976565;
  }
`

export const Link = (props) => {
  return (
    <StyledLink>
      <NextLink {...props}/>
    </StyledLink>
  )
}

export default {
  Link,
}
