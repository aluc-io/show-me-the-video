import IThemeInterface from './theme'

const theme: IThemeInterface = {
  primaryColor: 'red',
  primaryColorInverted: 'orange',
  showLayout: process.env.NODE_ENV !== 'production',
  cardWidth: 240,
  cardMargin: 8,
  headerHeight: 48,
  cardColumns: { xs: 1, s: 2, m: 3, l: 4, xl: 6 }
}

export default theme
