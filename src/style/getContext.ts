import { SheetsRegistry } from 'jss'
import { createMuiTheme, createGenerateClassName } from '@material-ui/core/styles'

export const theme = createMuiTheme();
export const sheetsRegistry = new SheetsRegistry();
export const sheetsManager = new Map();
export const generateClassName = createGenerateClassName();
