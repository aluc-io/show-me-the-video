import Document, { Head, Main, NextScript, NextDocumentContext } from 'next/document'
import { ServerStyleSheet } from 'styled-components'
import { ReactElement } from 'react';

interface IDocumentProps {
  styleTags: ReactElement<{}>
}

export default class MyDocument extends Document<IDocumentProps> {
  static async getInitialProps({ renderPage }: NextDocumentContext) {
    const sheet = new ServerStyleSheet()
    const page = renderPage( App => props => {
      return sheet.collectStyles(<App {...props} />)
    })
    const styleTags = sheet.getStyleElement()
    return { ...page, styleTags }
  }

  render() {
    return (
      <html className="bp3-focus-disabled">
        <Head>
          {this.props.styleTags}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    )
  }
}
