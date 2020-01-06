import { withRouter, SingletonRouter } from 'next/router'
import Link from 'next/link'
import * as React from 'react'
import { useContext } from 'react'
import AppBar from '@material-ui/core/AppBar'
import Toolbar, { ToolbarProps } from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import Switch from '@material-ui/core/Switch'
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

const StyledToolbar: React.ComponentType<ToolbarProps> = styled(Toolbar)`
  min-height: ${p => p.theme.headerHeight}px !important;
`

const Header: React.FunctionComponent<IHeaderProps> = (props) => {
  const { showLayout, toggleShowLayout, siteInfo } = useContext(AppContext)
  const title = props.title || siteInfo.title
  return (
    <Box>
      <AppBar position='static'>
        <StyledToolbar>
          <Link prefetch href="/">
            <IconButton color="inherit">
              <HomeIcon />
            </IconButton>
          </Link>
          <Typography variant="subtitle1" color="inherit" style={{flexGrow: 1}} noWrap>{title}</Typography>
          <Switch checked={showLayout} onChange={toggleShowLayout} aria-label="layout"/>
        </StyledToolbar>
      </AppBar>
    </Box>
  )
}

export default withRouter(Header)
