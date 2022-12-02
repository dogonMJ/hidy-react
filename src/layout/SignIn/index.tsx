import * as React from 'react';
import { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import ODBIcon from 'assets/images/ODB.png';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store/store"
import { coordInputSlice } from "store/slice/mapSlice";
import { sign } from './utils'
import { RenderIf } from 'components/RenderIf/RenderIf';

export const SignIn = (props: { setOpen: any }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [authFail, setAuthFail] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget)
    console.log(data.get('remember'))
    const loginFetch = await sign.login({
      'username': data.get('username'),
      'password': data.get('password'),
      'remember': data.get('remember'),
    })

    if (loginFetch.logged) {
      const userInfo = await sign.getUserInfo()
      dispatch(coordInputSlice.actions.userInfo(userInfo))
      setAuthFail(false)
      props.setOpen(false)
    } else {
      setAuthFail(true)
    }
  };

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
            autoFocus
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
                {'Unauthorized'}
              </Typography>
            </Box>
          </RenderIf>
          <Typography variant="caption">
            <Checkbox value="remember" color="primary" name='remember' />
            {t('account.remember')}
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