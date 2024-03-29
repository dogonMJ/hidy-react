import { useState, useRef } from "react";
import 'leaflet'
import 'leaflet-draw/dist/leaflet.draw.css'
import { Dialog, DialogContent, IconButton, Slide, Paper, Stack, Avatar } from "@mui/material";
import { SignIn } from "layout/UpRightControls/SignInControl/Account/SignIn"
import { useSelector } from "react-redux";
import { RootState } from "store/store"
import { UserBanner } from "layout/UpRightControls/SignInControl/Account/UserBanner";
import { SignUp } from "layout/UpRightControls/SignInControl/Account/SignUp"
import { ResetPassword } from "layout/UpRightControls/SignInControl/Account/ResetPassword"
import { PortalControlButton } from "components/PortalControlButton";

export const SignInControl = () => {
  const userInfo = useSelector((state: RootState) => state.map.userInfo);
  const [showSignInPanel, setShowSignInPanel] = useState(false)
  const [showSignUpPanel, setShowSignUpPanel] = useState(false)
  const [showResetPwdPanel, setShowResetPwdPanel] = useState(false)
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
  const handleClose = () => {
    setShowSignInPanel(false);
    setShowSignUpPanel(false)
  }
  const handleClick = () => userInfo.username ? setShowBanner(true) : setShowSignInPanel(true)
  const handleMouseOver = () => {
    if (userInfo.username) {
      setShowBanner(true)
    }
  }
  return (
    <>
      <PortalControlButton position="topright" className='leaflet-control' order="unshift">
        <Stack
          onMouseOver={handleMouseOver}
          onMouseLeave={() => setShowBanner(false)}
          direction="row"
          sx={{
            overflow: 'hidden',
            borderRadius: 18,
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
      </PortalControlButton>
      <Dialog
        open={showSignInPanel}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth='xs'
      >
        <DialogContent >
          <SignIn setOpen={setShowSignInPanel} setSignUpOpen={setShowSignUpPanel} setResetPwdOpen={setShowResetPwdPanel} />
        </DialogContent>
      </Dialog>

      <Dialog
        open={showSignUpPanel}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth='xs'
      >
        <DialogContent >
          <SignUp setOpen={setShowSignUpPanel} />
        </DialogContent>
      </Dialog>
      {/* <Dialog
        open={showResetPwdPanel}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth='xs'
      >
        <DialogContent >
          <ResetPassword />
        </DialogContent>
      </Dialog> */}
    </>
  )
}