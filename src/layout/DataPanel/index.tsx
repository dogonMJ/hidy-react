import { useState, Fragment } from 'react';
import { useTranslation } from "react-i18next";
import { List, Collapse, Drawer, Button, Divider, IconButton, styled, } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material'
import { useMap } from 'react-leaflet';
import ToggleCWB from 'layout/DataPanel/NearTW';
import APILayers from 'layout/DataPanel/APIlayers'
import AnimatedCurrents from 'layout/DataPanel/AnimatedCurrents';
import SatelliteData from 'layout/DataPanel/SatelliteData';
import { ODB } from 'layout/DataPanel/ODB';
import { DataPanelItem } from 'components/DataPanelItem';
import { SeafloorElevation } from 'layout/DataPanel/SeafloorElevation';
// @ts-ignore
import Cache from 'cachai';
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
  const { t } = useTranslation()
  const itemList: ItemList = {
    APIlayers: <APILayers cache={cache} />,
    CWBsites: <ToggleCWB />,
    Animated: <AnimatedCurrents />,
    SatData: <SatelliteData />,
    OdbData: <ODB />,
    // Seafloor: <SeafloorElevation />,
  }
  const onOff: OnOff = Object.keys(itemList).reduce((acc, key) => Object.assign(acc, { [key]: false }), {})
  const [openSwitch, setOpenSwitch] = useState(onOff)
  const [open, setOpen] = useState(false);

  const mouseEnter = () => map.scrollWheelZoom.disable()
  const mouseLeave = () => map.scrollWheelZoom.enable()
  const handleDrawerOpen = () => setOpen(true)
  const handleDrawerClose = () => setOpen(false)
  const handleClick = (item: string) => () => {
    openSwitch[item] = !openSwitch[item]
    setOpenSwitch({ ...openSwitch })
  }

  return (
    <>
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
            maxHeight: 'calc(100% - 113px)',
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
          onMouseEnter={mouseEnter}
          onMouseLeave={mouseLeave}
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
        </List>
      </Drawer>
    </>
  )
}

export default DataPanel