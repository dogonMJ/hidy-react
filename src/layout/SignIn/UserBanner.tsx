
import React from 'react'
import { useDispatch } from "react-redux";
import { useTranslation } from 'react-i18next';
import { coordInputSlice } from "store/slice/mapSlice";
import { Stack, Typography, IconButton } from "@mui/material"
import LogoutIcon from '@mui/icons-material/Logout';
import { account } from './utils'

export const UserBanner = React.forwardRef((props: { userInfo: any, setOpen: any }, ref) => {
  const { userInfo, setOpen } = props
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const logout = () => {
    account.logout()
    dispatch(coordInputSlice.actions.userInfo({ 'username': null }))
    setOpen(false)
  }

  return (
    <Stack
      direction="row"
      alignItems='center'
      spacing={0.5}
      sx={{ height: 30, paddingRight: 4, paddingLeft: 2 }}
    >
      <Typography variant="subtitle2">
        {userInfo.username}
      </Typography>
      <Typography variant="subtitle2">
        <IconButton onClick={logout} >
          <LogoutIcon fontSize='small' />
          <Typography variant="caption">
            {t('account.signout')}
          </Typography>
        </IconButton>
      </Typography>
    </Stack>
  )
})