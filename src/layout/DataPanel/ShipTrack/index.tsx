import { Link, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Switch } from '@mui/material'
import { ShipLocation } from 'layout/DataPanel/ShipTrack/ShipLocation'
import { useTranslation } from 'react-i18next'
import { HistTrack } from './HistTrack'
import InfoButton from 'components/InfoButton'
import { useState } from 'react'

export const ShipTrack = () => {
  const { t } = useTranslation()
  const [checked, setChecked] = useState<string[]>([]);

  const handleToggle = (value: string) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];
    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    setChecked(newChecked);
  };
  return (
    <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
      <ListItem>
        <Link
          href="http://odbwms.oc.ntu.edu.tw/odbintl/midas/maps/"
          underline="hover"
          target="_blank"
          rel="noopener noreferrer"
          sx={{ fontSize: 15 }}
        >
          {t('ShipTrack.nor1Info')}
        </Link>
      </ListItem>
      <ListItem disablePadding>
        <ListItemButton role={undefined} onClick={handleToggle('ShipLocation')} dense>
          <ListItemIcon>
            <Switch
              edge="start"
              checked={checked.indexOf('ShipLocation') !== -1}
              tabIndex={-1}
              disableRipple
            />
          </ListItemIcon>
          <ListItemText primary={t(`ShipTrack.ShipLocation`)} />
        </ListItemButton>
        <InfoButton dataId={'ShipLocation'} />
      </ListItem>
      {checked.includes('ShipLocation') && <ShipLocation />}
      <ListItem disablePadding >
        <ListItemButton role={undefined} onClick={handleToggle('HistTrack')} dense>
          <ListItemIcon>
            <Switch
              edge="start"
              checked={checked.indexOf('HistTrack') !== -1}
              tabIndex={-1}
              disableRipple
            />
          </ListItemIcon>
          <ListItemText primary={t(`ShipTrack.HistTrack`)} />
        </ListItemButton>
        <InfoButton dataId={'HistTrack'} />
      </ListItem>
      {/* <HistTrack open={checked.includes('HistTrack')} /> */}
      {checked.includes('HistTrack') && <HistTrack />}
    </List>
  )
}