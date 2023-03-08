import * as React from 'react';
import { useState } from 'react';
import { Avatar, Button, CssBaseline, TextField, Box, Typography, Container, } from '@mui/material';
import ODBIcon from 'assets/images/ODB.png';
import { useTranslation } from 'react-i18next';
import { account } from './utils'
import { Msgbox } from './Msgbox';

export const ResetPassword = () => {
  const { t } = useTranslation()
  const [openMsg, setOpenMsg] = useState(false)
  const [message, setMessage] = useState({ success: false, text: '', title: '' })

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const emailForm = new FormData(event.currentTarget)
    const resetFetch = await account.resetPassword(emailForm)
    if (resetFetch.mail_sent) {
      setMessage({ success: true, title: '重設密碼', text: '重設密碼信件已寄出' })
    } else {
      setMessage({ success: false, title: '重設密碼', text: '無法寄出重設密碼信件，請洽ODB管理員' })
    }
    setOpenMsg(true)
  };

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
            {t('resetPwd.title')}
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
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
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              {t('account.reset')}
            </Button>
          </Box>
        </Box>
      </Container>
      <Msgbox open={openMsg} setOpen={setOpenMsg} content={message} />
    </>
  );
}