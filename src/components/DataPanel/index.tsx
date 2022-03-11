import { useState } from 'react';
import { useTranslation } from "react-i18next";
import { List, ListSubheader, ListItemButton, ListItemIcon, ListItemText, Collapse, } from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import ToggleCWB from 'components/CWB';
import APILayers from 'components/APIlayers'
// @ts-ignore
import Cache from 'cachai';
const cache = new Cache(400)

const DataPanel = () => {
  const { t } = useTranslation()
  const [openApi, setOpenApi] = useState(false);
  const [openCwb, setOpenCwb] = useState(false);

  const handleClick = (value: string) => () => {
    switch ('open' + value) {
      case 'openApi':
        setOpenApi(!openApi);
        break
      case 'openCwb':
        setOpenCwb(!openCwb);
        break
    }
  };
  return (
    <List
      sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper', zIndex: 1000 }}
      component="nav"
      aria-labelledby="nested-list-subheader"
      subheader={
        <ListSubheader component="div" id="nested-list-subheader">
          Nested List Items
        </ListSubheader>
      }
    >
      <ListItemButton>
        <ListItemIcon>
          A
        </ListItemIcon>
        <ListItemText primary="Sent mail" />
      </ListItemButton>

      <ListItemButton onClick={handleClick('Api')}>
        <ListItemIcon>
          B
        </ListItemIcon>
        <ListItemText primary={t('APIlayers.api')} />
        {openApi ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={openApi} timeout="auto" unmountOnExit>
        <APILayers cache={cache} />
      </Collapse>
      <ListItemButton onClick={handleClick('Cwb')}>
        <ListItemIcon>
          C
        </ListItemIcon>
        <ListItemText primary={t('CWBsites.cwb')} />
        {openCwb ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={openCwb} timeout="auto" unmountOnExit>
        <ToggleCWB />
      </Collapse>
    </List>
  )
}

export default DataPanel