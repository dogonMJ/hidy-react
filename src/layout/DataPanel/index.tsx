import { useEffect, useState } from 'react';
import { useTranslation } from "react-i18next";
import { List, ListSubheader, ListItemButton, ListItemIcon, ListItemText, Collapse, } from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { useMap } from 'react-leaflet';
import ToggleCWB from 'layout/DataPanel/CWB';
import APILayers from 'layout/DataPanel/APIlayers'
import AnimatedCurrents from 'layout/DataPanel/AnimatedCurrents';
import SatelliteData from 'layout/DataPanel/SatelliteData';
import { DataPanelItem } from 'components/DataPanelItem';
// @ts-ignore
import Cache from 'cachai';
const cache = new Cache(400)
interface OnOff {
  [key: string]: boolean
}
const DataPanel = () => {
  const map = useMap()
  const { t } = useTranslation()
  const mouseEnter = () => {
    map.scrollWheelZoom.disable()
  };
  const mouseLeave = () => {
    map.scrollWheelZoom.enable()
  };
  const [openApi, setOpenApi] = useState(false);
  const [openCwb, setOpenCwb] = useState(false);
  const [openCur, setOpenCur] = useState(false);
  const [openSat, setOpenSat] = useState(false);
  const itemList = ['Api', 'Cwb', 'Cur', 'Sat']
  const onOff: OnOff = {
    Api: false,
    Cwb: false,
    Cur: false,
    Sat: false,
  }
  const [openSwitch, setOpenSwitch] = useState(onOff)
  // const handleClick = (value: string) => () => {
  //   switch (value) {
  //     case 'Api':
  //       setOpenApi(!openApi);
  //       break
  //     case 'Cwb':
  //       setOpenCwb(!openCwb);
  //       break
  //     case 'Cur':
  //       setOpenCur(!openCur);
  //       break
  //     case 'Sat':
  //       setOpenSat(!openSat);
  //       break
  //   }
  // };
  const handleClick = (item: string) => () => {
    openSwitch[item] = !openSwitch[item]
    setOpenSwitch({ ...openSwitch })
  }

  return (
    <List
      sx={{
        width: '100%', maxWidth: 360, maxHeight: '85%', bgcolor: 'background.paper', zIndex: 1000, overflow: 'auto',
      }}
      component="nav"
      aria-labelledby="nested-list-subheader"
      subheader={
        <ListSubheader component="div" id="nested-list-subheader">
          {t('dataPanel')}
        </ListSubheader>
      }
      onMouseEnter={mouseEnter}
      onMouseLeave={mouseLeave}
    >
      {
        itemList.map((item) => {
          return (
            < DataPanelItem
              key={`item-${item}`}
              icon={item}
              handleClick={handleClick}
              open={openSwitch[item]}
              item={item} />
          )
        })
      }
      {/*
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
        <ListItemText primary={t('CWBsites.cwbdata')} />
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

      <ListItemButton onClick={handleClick('Sat')}>
        <ListItemIcon>
          D
        </ListItemIcon>
        <ListItemText primary={t('CWBsites.cwbdata')} />
        {openSat ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={openSat} timeout="auto">
        <SatelliteData />
      </Collapse> */}
    </List>
  )
}

export default DataPanel