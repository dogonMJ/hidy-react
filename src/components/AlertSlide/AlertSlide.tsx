import { Alert, AlertColor, IconButton, Slide } from "@mui/material";
import { createPortal } from "react-dom";
import { ReactNode, useEffect } from "react";

export const AlertSlide = (props: { open: boolean, setOpen: any, severity?: AlertColor, timeout?: number, children?: ReactNode, icon?: ReactNode }) => {
  const { open, setOpen, severity, timeout, children, icon } = { ...props }
  useEffect(() => {
    if (timeout) {
      const timer = setTimeout(() => setOpen(false), timeout)
      return () => clearTimeout(timer)
    }
  }, [open, timeout])
  return (
    <>
      {
        createPortal(
          <Slide direction="up" in={open} mountOnEnter unmountOnExit>
            <Alert
              severity={severity}
              sx={{
                zIndex: 'modal',
                position: 'absolute',
                maxWidth: 340,
                bottom: 40,
                left: 5,
              }}
              onClose={() => setOpen(false)}
              icon={icon}
            >
              {children}
            </Alert>
          </Slide>
          ,
          document.getElementById('mapContainer')!
        )
      }

    </>
  )
}