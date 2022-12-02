import { useState, useRef } from "react";
import 'leaflet'
import 'leaflet-draw/dist/leaflet.draw.css'
import { Box, DialogContent, IconButton, Slide, Paper, Stack } from "@mui/material";
import { Dialog } from '@mui/material';
import { SignIn } from "layout/SignIn"
import LoginIcon from '@mui/icons-material/Login';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import Avatar from '@mui/material/Avatar';
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store/store"
import { UserBanner } from "layout/SignIn/UserBanner";


export const SignInControl = () => {
  const userInfo = useSelector((state: RootState) => state.coordInput.userInfo);
  const [showSignInPanel, setSignInPanel] = useState(false)
  const [showBanner, setShowBanner] = useState(false)
  const bannerRef = useRef<any>()

  const avatarStyle = (username: string) => {
    const generalStyle = {
      width: 30,
      height: 30,
      backgroundClip: 'padding-box',
      border: '2px solid rgba(0,0,0,0.2)',
    }
    if (username) {
      return generalStyle
    } else {
      return { ...generalStyle, bgcolor: 'white', color: '#28282873' }
    }
  }

  const userAbbr = (username: string) => username ? username.charAt(0).toUpperCase() : null
  const handleClose = () => setSignInPanel(false);
  const handleClick = () => userInfo.username ? setShowBanner(!showBanner) : setSignInPanel(!showSignInPanel)
  const handleMouseOver = () => {
    if (userInfo.username) {
      setShowBanner(true)
    }
  }

  return (
    <>
      <Stack
        onMouseOver={handleMouseOver}
        onMouseLeave={() => setShowBanner(false)}
        direction="row"
        sx={{
          overflow: 'hidden',
          borderRadius: 18
        }}
      >
        <Slide in={showBanner} direction='left' mountOnEnter unmountOnExit >
          <Paper sx={{ marginRight: -3.8, borderRadius: 15 }} elevation={2}>
            <UserBanner ref={bannerRef} userInfo={userInfo} setOpen={setShowBanner} />
          </Paper>
        </Slide>
        <IconButton
          onClick={handleClick}
          sx={{
            width: 30,
            height: 30,
            marginRight: '1px',
          }}
          tabIndex={-1}
        >
          <Avatar sx={avatarStyle(userInfo.username)} >
            {userAbbr(userInfo.username)}
          </Avatar>
        </IconButton>
      </Stack>
      <Dialog
        open={showSignInPanel}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth='xs'
      >
        <DialogContent >
          <SignIn setOpen={setSignInPanel} />
        </DialogContent>
      </Dialog>
    </>
  )
}
