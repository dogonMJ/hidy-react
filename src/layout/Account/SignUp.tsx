import * as React from 'react';
import { useState } from 'react';
import { Avatar, Button, CssBaseline, TextField, OutlinedInput, Box, Typography, Container, InputAdornment, IconButton, FormControl, InputLabel, FormHelperText, Dialog } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ODBIcon from 'assets/images/ODB.png';
import { useTranslation } from 'react-i18next';
import { account } from './utils'
import { Msgbox } from './Msgbox';

export const SignUp = () => {
  const { t } = useTranslation()
  const [confirmError, setConfirmError] = useState(false)
  const [showPassword, setShowPassword] = useState(false);
  const [usernameValid, setUsernameValid] = useState<boolean | null>(null)
  const [openMsg, setOpenMsg] = useState(false)
  const [message, setMessage] = useState({ text: '', title: '' })

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const currentTarget = event.currentTarget
    const data = new FormData(currentTarget)
    const pwd = data.get('password1')
    const confirm = data.get('password2')

    if (usernameValid) {
      if (pwd === confirm) {
        setConfirmError(false)
        const signupFetch = await account.signup(data)
        if (signupFetch['check_email']) {
          setMessage({
            title: 'Succesfully Registered!',
            text: 'Please check email to activate account'
          })
          currentTarget.reset()
          setOpenMsg(true)
        } else {
          setMessage({
            title: 'Something went wrong...',
            text: 'Please check if the password is too common or similar to any above information.\nIf you encounter any other problems, please contact us.'
          })
          setOpenMsg(true)
        }
      } else {
        return setConfirmError(true)
      }
    } else {
      return setUsernameValid(false)
    }
  };
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const checkUsername = async (event: any) => {
    const userStatus = await fetch(`${process.env.REACT_APP_PROXY_BASE}/account/signup/chkuser?username=${event.target.value}`)
      .then(response => response.json())
    setUsernameValid(userStatus.username_valid)
  }

  return (
    <>
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
            {t('signup.title')}
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <Typography sx={{ whiteSpace: 'pre-wrap' }}>
              <FormHelperText>{t('account.validChar')}</FormHelperText>
            </Typography >
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label={t('account.username')}
              name="username"
              size='small'
              onBlur={checkUsername}
              error={usernameValid === false}
              helperText={usernameValid ?
                <Typography variant='caption' color="#2e7d32">
                  {t('account.userValid')}
                </Typography> :
                usernameValid === false ? t('account.userNotValid') : t('account.usernameRule')}
              inputProps={{
                pattern: "[\\p{L}\\w@.+-]{2,}" //unicode字元(各語言字母)、數字、@/./+/-/_
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="lastname"
              label={t('account.lastname')}
              name="last_name"
              autoComplete="lastname"
              size='small'
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="firstname"
              label={t('account.firstname')}
              name="first_name"
              autoComplete="firstname"
              size='small'
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              type="email"
              label={t('account.email')}
              name="email"
              autoComplete="email"
              size='small'
            />
            <FormControl fullWidth size='small'>
              <InputLabel>{t('account.password1')}</InputLabel>
              <OutlinedInput
                type={showPassword ? 'text' : 'password'}
                id="password1"
                name="password1"
                size='small'
                required
                fullWidth
                autoComplete="off"
                label={t('account.password1')}
                inputProps={{
                  minLength: 6,
                  pattern: '(?=.*[0-9])(?=.*[\\p{L}])([\\w\\p{L}@.+-]+)'
                }}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
              />

              <TextField
                type="password"
                id="password2"
                name="password2"
                size='small'
                required
                fullWidth
                autoComplete="off"
                margin="normal"
                label={t('account.password2')}
                error={confirmError}
                helperText={confirmError ? t('account.incorrect') : ''}
                variant={confirmError ? 'filled' : 'outlined'}
              />
              <Typography sx={{ whiteSpace: 'pre-wrap' }}>
                <FormHelperText>{t('account.pwdRule')}</FormHelperText>
              </Typography >
            </FormControl>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              {t('account.signup')}
            </Button>
          </Box>
        </Box>
      </Container>
      <Msgbox open={openMsg} setOpen={setOpenMsg} content={message} />
    </>
  );
}