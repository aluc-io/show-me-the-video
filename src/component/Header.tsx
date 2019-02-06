import { withRouter, SingletonRouter } from 'next/router'
import * as React from 'react'
import { useContext } from 'react'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import Switch from '@material-ui/core/Switch'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import HomeIcon from '@material-ui/icons/Home'

import styled from '../style/styled-component'
import { layout as lo } from '../style/polished'
import { AppContext } from '../context'

const Box = styled.div`
  flexGrow: 1
  ${p => lo(p.theme.showLayout, "FooterBox", "rgba(200, 200, 200, 0.75)" )}
`
interface IHeaderProps {
  router: SingletonRouter
  title?: string
}

const Header: React.FunctionComponent<IHeaderProps> = (props) => {
  const { showLayout, toggleShowLayout, siteInfo } = useContext(AppContext)
  const title = props.title || siteInfo.title

  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <IconButton color="inherit" aria-label="Menu" href="/">
            <HomeIcon />
          </IconButton>
          <Typography variant="h6" color="inherit" style={{flexGrow: 1}}>{title}</Typography>
          <FormControlLabel
            control={<Switch checked={showLayout} onChange={toggleShowLayout} aria-label="layout"/>}
            label={'layout'}
          />
        </Toolbar>
      </AppBar>
    </Box>
  )
}

export default withRouter(Header)
