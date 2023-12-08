import { Alert, Slide } from "@mui/material";
import { createPortal } from "react-dom";
import { memo, useEffect } from "react";
import { AlertSlideType } from "types";

export const AlertSlide = memo((props: AlertSlideType) => {
  const { open, setOpen, severity, timeout = 3000, children, icon } = { ...props }
  useEffect(() => {
    if (open && timeout) {
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
})