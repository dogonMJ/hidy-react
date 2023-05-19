import { useState, Fragment, useEffect, useRef } from 'react';
import 'leaflet'
import { useSelector } from 'react-redux';
import { RootState } from "store/store"
import { useTranslation } from "react-i18next";
import { List, Collapse, Drawer, Button, Divider, IconButton, styled, } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material'
import { useMap, } from 'react-leaflet';
import { DataPanelItem } from 'components/DataPanelItem';
import ToggleCWB from 'layout/DataPanel/NearTW';
import APILayers from 'layout/DataPanel/APIlayers'
import AnimatedCurrents from 'layout/DataPanel/AnimatedCurrents';
import SatelliteData from 'layout/DataPanel/SatelliteData';
import { ODB } from 'layout/DataPanel/ODB';
import { CPlanLayers } from 'layout/DataPanel/CPlanLayers';
import { StatisticMean } from 'layout/DataPanel/StatisticMean';
import { ShipTrack } from './ShipTrack';
import { WMSSelector } from './WMSSelector';
import { SatelliteWebMaps } from './SatelliteWebMaps';
// @ts-ignore
import Cache from 'cachai';
declare const L: any

const cache = new Cache(400)
interface OnOff {
  [key: string]: boolean
}
interface ItemList {
  [key: string]: JSX.Element
}

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'space-between',
}));

const DataPanel = () => {
  const map = useMap()
  const ref = useRef<any>()
  const { t } = useTranslation()
  const userInfo = useSelector((state: RootState) => state.coordInput.userInfo);
  const itemList: ItemList = {
    APIlayers: <APILayers cache={cache} />,
    CWBsites: <ToggleCWB />,
    Animated: <AnimatedCurrents />,
    SatData: <SatelliteData />,
    OdbData: <ODB />,
    CPlanLayers: <CPlanLayers />,
    StatMean: <StatisticMean />,
    WMSSelector: < WMSSelector />,
    // WebMaps: <SatelliteWebMaps cache={cache} />
  }
  const secLevelAll: ItemList = {
    ShipTrack: <ShipTrack />
  }
  const onOff: OnOff = Object.keys(itemList).reduce((acc, key) => Object.assign(acc, { [key]: false }), {})
  const [openSwitch, setOpenSwitch] = useState(onOff)
  const [open, setOpen] = useState(false);

  const enableMouse = () => {
    // map.scrollWheelZoom.enable()
    // map.dragging.enable()
  }
  const disableMouse = () => {
    // map.scrollWheelZoom.disable()
    // map.dragging.disable()
  }

  const handleDrawerOpen = () => setOpen(true)
  const handleDrawerClose = () => setOpen(false)
  const handleClick = (item: string) => () => {
    openSwitch[item] = !openSwitch[item]
    setOpenSwitch({ ...openSwitch })
  }
  useEffect(() => {
    L.DomEvent.disableClickPropagation(ref.current);
    L.DomEvent.disableScrollPropagation(ref.current);
  })
  return (
    <div ref={ref} id='dataPanel'>
      <Button
        onClick={handleDrawerOpen}
        endIcon={<ChevronRight />}
        variant="contained"
        sx={{
          zIndex: 1000,
          margin: '5px',
          background: 'white',
          color: 'black',
          ":hover": {
            background: '#e0e0e0',
          },
        }}
      >
        {t('dataPanel')}
      </Button>
      <Drawer
        anchor='left'
        open={open}
        variant="persistent"
        ModalProps={{ keepMounted: true, }}
        PaperProps={{
          sx: {
            maxHeight: 'calc(100% - 140px)',
            height: 'auto',
            marginLeft: '0px'
          }
        }}
      >
        <DrawerHeader>
          {t('dataPanel')}
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeft />
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List
          sx={{
            bgcolor: 'background.paper',
            overflow: 'auto',
            padding: 0
          }}
          component="nav"
          aria-labelledby="nested-list-subheader"
          onMouseEnter={disableMouse}
          onMouseLeave={enableMouse}
        >
          {
            Object.keys(itemList).map((item) => {
              return (
                <Fragment key={`item-${item}`}>
                  <DataPanelItem
                    // icon={item}
                    handleClick={handleClick(item)}
                    open={openSwitch[item]}
                    text={t(`${item}.title`)}
                  />
                  <Collapse
                    in={openSwitch[item]}
                    timeout="auto" >
                    {itemList[item]}
                  </Collapse>
                </Fragment>
              )
            })
          }
          {userInfo.groupL && userInfo.groupL.length > 0 &&
            Object.keys(secLevelAll).map((item) => {
              return (
                <Fragment key={`item-${item}`}>
                  <DataPanelItem
                    handleClick={handleClick(item)}
                    open={openSwitch[item]}
                    text={t(`${item}.title`)}
                  />
                  <Collapse
                    in={openSwitch[item]}
                    timeout="auto" >
                    {secLevelAll[item]}
                  </Collapse>
                </Fragment>
              )
            })
          }
        </List>
      </Drawer>
    </div>
  )
}

export default DataPanel