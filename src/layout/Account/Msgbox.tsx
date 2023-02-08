import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useTranslation } from 'react-i18next';

interface Content {
  title?: string
  text: string
}

export const Msgbox = (props: { open: boolean, setOpen: any, content: Content }) => {
  const { open, setOpen, content } = props
  const { t } = useTranslation()

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="message-dialog-title"
      aria-describedby="message-dialog-description"
    >
      <DialogTitle id="message-dialog-title">
        {content.title}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="message-dialog-description">
          {content.text}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>{t('account.close')}</Button>
      </DialogActions>
    </Dialog>
  );
}