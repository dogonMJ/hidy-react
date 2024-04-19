import { useState, Fragment, useEffect, useRef, memo } from 'react';
import 'leaflet'
import { useAppSelector } from 'hooks/reduxHooks';
import { useTranslation } from "react-i18next";
import { List, Collapse, Drawer, Button, Divider, IconButton, styled, Stack, Typography } from '@mui/material';
import { ChevronLeft, ChevronRight, MenuRounded } from '@mui/icons-material'
import { DataPanelItem } from 'components/DataPanelItem';
import { About } from 'layout/DataPanel/About';
import { ToggleCWA } from 'layout/DataPanel/NearTW';
import APILayers from 'layout/DataPanel/APIlayers'
import AnimatedCurrents from 'layout/DataPanel/AnimatedCurrents';
import SatelliteData from 'layout/DataPanel/SatelliteData';
import { ODB } from 'layout/DataPanel/ODB';
import { CPlanLayers } from 'layout/DataPanel/CPlanLayers';
import { StatisticMean } from 'layout/DataPanel/StatisticMean';
import { ShipTrack } from './ShipTrack';
import { CustomLayer } from './CustomLayer';
import { ComponentList } from 'types';
import { useMapDragScroll } from 'hooks/useMapDragScroll';
import ODBlogo from 'assets/images/logo192.png'
import { Box } from '@mui/system';
import { WebMapLayers } from './WebMapLayers';


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
  // APIlayers: <APILayers />,
  WebMapLayers: <WebMapLayers />,
  CWAsites: <ToggleCWA />,
  Animated: <AnimatedCurrents />,
  // SatData: <SatelliteData />,
  OdbData: <ODB />,
  CPlanLayers: <CPlanLayers />,
  StatMean: <StatisticMean />,
  CustomLayer: <CustomLayer />,
}
const secLevelAll: ComponentList = {
  ShipTrack: <ShipTrack />
}
const onOff: OnOff = Object.keys(itemList).reduce((acc, key) => Object.assign(acc, { [key]: false }), {})

const DataPanel = memo(() => {
  const { setDrag } = useMapDragScroll()
  const ref = useRef<any>()
  const { t } = useTranslation()
  const userInfo = useAppSelector(state => state.map.userInfo);
  const [openSwitch, setOpenSwitch] = useState(onOff)
  const [open, setOpen] = useState(true);
  const [openAbout, setOpenAbout] = useState({ about: false, contact: false, news: false })

  const enterPanel = () => setDrag(false)
  const leavePanel = () => setDrag(true)

  const handleDrawerOpen = () => setOpen(true)
  const handleDrawerClose = () => setOpen(false)
  const handleClick = (item: string) => () => {
    openSwitch[item] = !openSwitch[item]
    setOpenSwitch({ ...openSwitch })
  }

  const handleAbout = () => setOpenAbout({ about: !openAbout.about, contact: false, news: false })
  const handleContact = () => setOpenAbout({ about: false, contact: !openAbout.contact, news: false })
  const handleNews = () => setOpenAbout({ about: false, contact: false, news: !openAbout.news })

  useEffect(() => {
    L.DomEvent.disableScrollPropagation(ref.current);
  }, [])
  useEffect(() => {
    /// 展開列表 ///
    const queryString = window.location.search
    const urlParams = new URLSearchParams(queryString);
    for (const [key] of urlParams.entries()) {
      switch (key.slice(0, 3)) {
        case 'odb':
          onOff.OdbData = true
          break
        case 'cwa':
          onOff.CWAsites = true
          break
        case 'lon':
          onOff.StatMean = true
          break
        case 'wms':
          onOff.WebMapLayers = true
          break
        case 'ani':
          onOff.Animated = true
          break
        case 'add':
          onOff.CustomLayer = true
          break
        case 'cpl':
          onOff.CPlanLayers = true
          break
      }
    }
  }, [])
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
            padding: 0,
            width: 377
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
          <Button variant='text' size='small' href="https://odbgo.oc.ntu.edu.tw/odbargo/" target='_blank' rel="noreferrer noopenner" style={{ color: '#1976D2' }} >{t('hidyOld')}</Button>
          <Button variant='text' size='small' onClick={handleNews} sx={{ ':hover': { backgroundColor: 'transparent', textDecoration: 'underline' } }}>{t('news.title')}</Button>
          <Button variant='text' size='small' onClick={handleAbout} sx={{ ':hover': { backgroundColor: 'transparent', textDecoration: 'underline' } }}>{t('about.title')}</Button>
          <Button variant='text' size='small' onClick={handleContact} sx={{ ':hover': { backgroundColor: 'transparent', textDecoration: 'underline' } }}>{t('contact.title')}</Button>
        </Box>
      </Drawer>
      <About open={openAbout} setOpen={setOpenAbout} />
    </div >
  )
})

export default DataPanel