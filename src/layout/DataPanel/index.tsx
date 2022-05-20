import { useState, Fragment } from 'react';
import { useTranslation } from "react-i18next";
import { List, ListSubheader, Collapse, } from '@mui/material';
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
interface ItemList {
  [key: string]: JSX.Element
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
  const itemList: ItemList = {
    APIlayers: <APILayers cache={cache} />,
    CWBsites: <ToggleCWB />,
    Animated: <AnimatedCurrents />,
    SatData: <SatelliteData />
  }
  const onOff: OnOff = Object.keys(itemList).reduce((acc, key) => Object.assign(acc, { [key]: false }), {})
  const [openSwitch, setOpenSwitch] = useState(onOff)
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
        Object.keys(itemList).map((item) => {
          return (
            <Fragment key={`item-${item}`}>
              < DataPanelItem
                // icon={item}
                handleClick={handleClick(item)}
                open={openSwitch[item]}
                text={t(`${item}.title`)} />
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
  )
}

export default DataPanel