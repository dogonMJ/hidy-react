
import { useState } from "react";
import { ListItemIcon, IconButton, Popover } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import InfoList from 'layout/DataPanel/InfoButton/InfoList'
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
/*
useEffect(() => {
  const csw = 'https://cmems-catalog-ro.cls.fr/geonetwork/srv/eng/csw-MYOCEAN-CORE-PRODUCTS?service=CSW&request=GetRecordById&version=2.0.2&outputSchema=http://www.isotc211.org/2005/gmd&ElementSetName=full&id=42182941-ac81-4090-9761-f650f5583884'
  const fetchData = async () => {
    const result = await fetch(csw)
      .then((response) => response.text())
      .then((textResponse) => {
        const DOMParse = new DOMParser();
        const xmlDoc = DOMParse.parseFromString(textResponse, 'text/xml');
        return xmlDoc
      })
    const zzz = result.getElementsByTagName("gco:DateTime")[0].innerHTML
    console.log()
    setData(zzz);
  };
  fetchData();
}, [])
*/