import { useState, Fragment, useEffect, useRef } from 'react';
import 'leaflet'
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from "store/store"
import { coordInputSlice } from 'store/slice/mapSlice';
import { useTranslation } from "react-i18next";
import { List, Collapse, Drawer, Button, Divider, IconButton, styled, Stack, Typography, Modal, Card, CardHeader, CardContent, Link } from '@mui/material';
import { ChevronLeft, ChevronRight, MenuRounded } from '@mui/icons-material'
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
import { ComponentList } from 'types';
import ODBlogo from 'assets/images/logo192.png'
import { Box } from '@mui/system';
import { About } from 'components/About';

declare const L: any

interface OnOff {
  [key: string]: boolean
}

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'space-between',
}));

const itemList: ComponentList = {
  APIlayers: <APILayers />,
  CWBsites: <ToggleCWB />,
  Animated: <AnimatedCurrents />,
  // SatData: <SatelliteData />,
  OdbData: <ODB />,
  CPlanLayers: <CPlanLayers />,
  StatMean: <StatisticMean />,
  WMSSelector: < WMSSelector />,
  // WebMaps: <SatelliteWebMaps cache={cache} />
}
const secLevelAll: ComponentList = {
  ShipTrack: <ShipTrack />
}
const onOff: OnOff = Object.keys(itemList).reduce((acc, key) => Object.assign(acc, { [key]: false }), {})

const DataPanel = () => {
  const map = useMap()
  const ref = useRef<any>()
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const userInfo = useSelector((state: RootState) => state.coordInput.userInfo);
  const [openSwitch, setOpenSwitch] = useState(onOff)
  const [open, setOpen] = useState(true);
  const [openAbout, setOpenAbout] = useState({ about: false, contact: false })

  const enterPanel = () => {
    dispatch(coordInputSlice.actions.enterPanel(true))
    // map.scrollWheelZoom.enable()
    map.dragging.disable()

  }
  const leavePanel = () => {
    dispatch(coordInputSlice.actions.enterPanel(false))
    // map.scrollWheelZoom.disable()
    map.dragging.enable()
  }

  const handleDrawerOpen = () => setOpen(true)
  const handleDrawerClose = () => setOpen(false)
  const handleClick = (item: string) => () => {
    openSwitch[item] = !openSwitch[item]
    setOpenSwitch({ ...openSwitch })
  }

  const handleAbout = () => setOpenAbout({ about: !openAbout.about, contact: false })
  const handleContact = () => setOpenAbout({ about: false, contact: !openAbout.contact })


  useEffect(() => {
    // L.DomEvent.disableClickPropagation(ref.current);
    L.DomEvent.disableScrollPropagation(ref.current);
  })
  // useEffect(() => {
  //   const queryString = window.location.search
  //   const urlParams = new URLSearchParams(queryString);
  //   const ons = urlParams.get('data')?.split(',')
  //   ons?.forEach((on) => {
  //     onOff[on] = true
  //   })
  //   ons && setOpen(true)
  //   console.log(urlParams.get('data'), onOff)
  // }, [])
  return (
    <div
      ref={ref}
      id='dataPanel'
      onMouseEnter={enterPanel}
      onMouseLeave={leavePanel}
    >
      <Stack sx={{ width: 190 }}>
        <Button
          onClick={handleDrawerOpen}
          endIcon={<ChevronRight />}
          variant="contained"
          sx={{
            width: 50,
            zIndex: 1000,
            margin: '5px',
            background: 'white',
            color: '#282828dd',
            ":hover": {
              background: '#e0e0e0',
            },
          }}
        >
          <MenuRounded />
        </Button>
      </Stack>
      <Drawer
        anchor='left'
        open={open}
        variant="persistent"
        ModalProps={{ keepMounted: true, }}
        PaperProps={{
          sx: {
            maxHeight: 'calc(100% - 140px)',
            height: 'auto',
            marginLeft: '0px',
            borderEndEndRadius: 5
          }
        }}
      >
        <DrawerHeader>
          <img src={ODBlogo} alt={'ODB'} style={{ width: 35, marginLeft: 10 }} />
          <Stack alignItems={'center'}>
            <Typography
              component={'div'}
              sx={{ fontFamily: 'Fugaz One', fontSize: 20 }}>
              Hidy Viewer 2
            </Typography>
            <Typography
              variant={'caption'}
              sx={{ fontFamily: 'Kosugi Maru', fontSize: 12 }}>
              {t('siteSubtitle')}
            </Typography>
          </Stack>
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
          id='navBar'
          aria-labelledby="nested-list-subheader"
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
        <Divider />
        <Box sx={{ paddingInlineEnd: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant='text' size='small' onClick={handleAbout} sx={{ ':hover': { backgroundColor: 'transparent', textDecoration: 'underline' } }}>{t('about.title')}</Button>
          <Button variant='text' size='small' onClick={handleContact} sx={{ ':hover': { backgroundColor: 'transparent', textDecoration: 'underline' } }}>{t('contact.title')}</Button>
        </Box>
      </Drawer>
      <About open={openAbout} setOpen={setOpenAbout} />
    </div >
  )
}

export default DataPanel