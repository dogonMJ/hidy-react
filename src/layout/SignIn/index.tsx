import * as React from 'react';
import { useState } from 'react';
import { Avatar, Button, CssBaseline, TextField, Checkbox, Link, Grid, Box, Typography, Container } from '@mui/material';
import ODBIcon from 'assets/images/ODB.png';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store/store"
import { coordInputSlice } from "store/slice/mapSlice";
import { account } from './utils'
import { RenderIf } from 'components/RenderIf/RenderIf';

export const SignIn = (props: { setOpen: any }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [authFail, setAuthFail] = useState(false)
  const [check, setCheck] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget)
    const loginFetch = await account.login({
      'username': data.get('username'),
      'password': data.get('password'),
      'remember': data.get('remember'),
    })

    if (loginFetch.logged) {
      const userInfo = await account.getUserInfo()
      dispatch(coordInputSlice.actions.userInfo(userInfo))
      setAuthFail(false)
      props.setOpen(false)
    } else {
      setAuthFail(true)
    }
  };

  const handleRemeber = (event: any) => setCheck(event.target.checked)

  return (
    <Container component="main" maxWidth="xs" sx={{ width: '80%', }}>
      <CssBaseline />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
        <Avatar sx={{ m: 1 }} src={ODBIcon} />
        <Typography component="h1" variant="h6" sx={{ fontWeight: 600 }}>
          {t('account.title')}
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label={t('account.username')}
            name="username"
            autoComplete="username"
            size='small'
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label={t('account.password')}
            type="password"
            id="password"
            autoComplete="current-password"
            size='small'
          />
          <RenderIf isTrue={authFail}>
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <Typography variant="caption" sx={{ color: 'red' }} align='center'>
                {t('account.unauthorized')}
              </Typography>
            </Box>
          </RenderIf>
          <Typography variant="subtitle2">
            <Checkbox value="remember" color="primary" name='remember' onChange={handleRemeber} />
            {t('account.remember')}
          </Typography>
          <Typography variant="caption" sx={{ paddingLeft: 1.5 }}>
            {check ? t('account.chkRemember') : t('account.notChkRemember')}
          </Typography>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            {t('account.signin')}
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                {t('account.forgot')}
              </Link>
            </Grid>
            <Grid item>
              <Link href="#" variant="body2">
                {t('account.signup')}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}