import "normalize.css";
// import '../font.css'
import { createGlobalStyle } from 'styled-components'

export const GlobalStyle = createGlobalStyle`
* {
  box-sizing: border-box;
}
a {
  text-decoration: none;
}
a:visited {
  text-decoration: none;
}
html, body, div, span, applet, object, iframe, h1, h2, h3, h4, h5, h6, p, blockquote, pre, a, abbr, acronym, address, big, cite, code, del, dfn, em, img, ins, kbd, q, s, samp, small, strike, strong, sub, sup, tt, var, b, u, i, center, dl, dt, dd, ol, ul, li, fieldset, form, label, legend, table, caption, tbody, tfoot, thead, tr, th, td, article, aside, canvas, details, embed, figure, figcaption, footer, header, hgroup, menu, nav, output, ruby, section, summary, time, mark, audio, video {
  vertical-align: baseline;
  margin: 0px;
  padding: 0px;
  border-width: 0px;
  border-style: initial;
  border-color: initial;
  border-image: initial;
  font: inherit;
}

body {
  background-color: rgb(249, 249, 249);
}
`
