import { useState } from 'react';
import { useTranslation } from "react-i18next";
import { List, ListSubheader, ListItemButton, ListItemIcon, ListItemText, Collapse, } from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import ToggleCWB from 'components/DataPanel/CWB';
import APILayers from 'components/DataPanel/APIlayers'
import AnimatedCurrents from 'components/DataPanel/AnimatedCurrents';
// @ts-ignore
import Cache from 'cachai';
const cache = new Cache(400)

const DataPanel = () => {
  const { t } = useTranslation()
  const [openApi, setOpenApi] = useState(false);
  const [openCwb, setOpenCwb] = useState(false);
  const [openCur, setOpenCur] = useState(false);

  const handleClick = (value: string) => () => {
    switch (value) {
      case 'Api':
        setOpenApi(!openApi);
        break
      case 'Cwb':
        setOpenCwb(!openCwb);
        break
      case 'Cur':
        setOpenCur(!openCur);
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
          {t('dataPanel')}
        </ListSubheader>
      }
    >
      <ListItemButton onClick={handleClick('Api')}>
        <ListItemIcon>
          A
        </ListItemIcon>
        <ListItemText primary={t('APIlayers.api')} />
        {openApi ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={openApi} timeout="auto" >
        <APILayers cache={cache} />
      </Collapse>

      <ListItemButton onClick={handleClick('Cwb')}>
        <ListItemIcon>
          B
        </ListItemIcon>
        <ListItemText primary={t('CWBsites.cwb')} />
        {openCwb ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={openCwb} timeout="auto">
        <ToggleCWB />
      </Collapse>

      <ListItemButton onClick={handleClick('Cur')}>
        <ListItemIcon>
          C
        </ListItemIcon>
        <ListItemText primary={t('Animated.animated')} />
        {openCur ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={openCur} timeout="auto">
        <AnimatedCurrents />
      </Collapse>
    </List>
  )
}

export default DataPanel