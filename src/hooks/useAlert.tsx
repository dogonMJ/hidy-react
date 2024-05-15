import { ReactNode, useState, useCallback } from "react";
import { AlertSlideType } from "types";

export const useAlert = () => {
  const [openAlert, setOpenAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState<ReactNode>('');
  const [severity, setSeverity] = useState<AlertSlideType["severity"]>(undefined)

  const setMessage = useCallback((message: ReactNode) => {
    setAlertMessage(message);
    setOpenAlert(true);
  }, [])

  const hideAlert = () => {
    setOpenAlert(false);
    setAlertMessage('');
  };

  return {
    openAlert,
    setOpenAlert,
    alertMessage,
    setMessage,
    severity,
    setSeverity,
    hideAlert,
  };
}
