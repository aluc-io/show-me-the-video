import styled from '../style/styled-component'
import { layout as lo } from '../style/polished'

export default styled.div`
  font-family: Roboto, Arial, sans-serif;
  overflow-x: hidden;
  overflow-y: hidden;
  background-color: rgb(249, 249, 249);
  min-width: 375px;
  ${p => lo(p.theme.showLayout, "Page", "rgba(200, 200, 200, 0.75)" )}
`
