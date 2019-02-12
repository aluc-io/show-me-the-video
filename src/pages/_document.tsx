import Document, { Head, Main, NextScript, NextDocumentContext } from 'next/document'
import { ServerStyleSheet } from 'styled-components'
import { ReactElement } from 'react';

import JssProvider from 'react-jss/lib/JssProvider';
import { MuiThemeProvider } from '@material-ui/core/styles';

import { sheetsRegistry, theme, generateClassName, sheetsManager } from '../style/getContext'

interface IDocumentProps {
  styleTags: ReactElement<{}>
  materialUICss: string
}

export default class MyDocument extends Document<IDocumentProps> {
  static async getInitialProps({ renderPage }: NextDocumentContext) {
    console.log('document getInitialProps')
    const sheet = new ServerStyleSheet()

    const page = renderPage( App => props => {
      return sheet.collectStyles(
        <JssProvider registry={sheetsRegistry} generateClassName={generateClassName}>
          <MuiThemeProvider theme={theme} sheetsManager={sheetsManager}>
          <App {...props} />
          </MuiThemeProvider>
        </JssProvider>
      )
    })

    const materialUICss = sheetsRegistry.toString()
    const styleTags = sheet.getStyleElement()
    return { ...page, styleTags, materialUICss }
  }

  render() {
    console.log('document render. this.props.materialUICss.length(): ' + this.props.materialUICss.length)
    return (
      <html>
        <Head>
          {this.props.styleTags}
          <meta name="viewport" content="width=device-width, initial-scale=1"/>
          <meta content="IE=edge,chrome=1" http-equiv="X-UA-Compatible"/>
          <style
            id="jss-server-side"
            dangerouslySetInnerHTML={{
              __html: this.props.materialUICss,
            }}
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    )
  }
}
