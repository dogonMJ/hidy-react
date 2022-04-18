
import { useState } from "react";
import { ListItemIcon, IconButton, Popover } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import InfoList from 'components/DataPanel/InfoButton/InfoList'
const InfoButton = (props: { dataId: string }) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;
  return (
    <>
      <ListItemIcon>
        <IconButton onClick={handleClick}>
          <ErrorOutlineIcon className="infoMark" fontSize="small" />
        </IconButton>
      </ListItemIcon>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
      >
        <InfoList dataId={props.dataId} />
      </Popover>
    </>
  )
}

export default InfoButton