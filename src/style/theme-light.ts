import IThemeInterface from './theme'

const theme: IThemeInterface = {
  primaryColor: 'red',
  primaryColorInverted: 'orange',
  showLayout: process.env.NODE_ENV !== 'production',
  cardWidth: 256,
  headerHeight: 48,
}

export default theme
