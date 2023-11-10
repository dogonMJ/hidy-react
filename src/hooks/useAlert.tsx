import { ReactNode, useState, useCallback } from "react";

export const useAlert = () => {
  const [openAlert, setOpenAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState<ReactNode>('');

  const showAlert = useCallback((message: ReactNode) => {
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
    showAlert,
    hideAlert,
  };
}
