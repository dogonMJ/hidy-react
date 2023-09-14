import { useState } from 'react';
import { useTranslation } from "react-i18next";
import { List, ListItemButton, ListItemIcon, ListItemText, ListItem } from '@mui/material';
import { Divider, ListSubheader, Switch } from "@mui/material";
import CwbSeaSites from 'layout/DataPanel/NearTW/CwbSeaSites';
import CwbWeatherSites from 'layout/DataPanel/NearTW/CwbWeatherSites';
import CwbRadar from 'layout/DataPanel/NearTW/CwbRadar';
import CwbSeaForecast from 'layout/DataPanel/NearTW/CwbSeaForecast';
import InfoButton from "components/InfoButton";
// import { MoiSubstrate } from "./MoiSubstrate";

const optionList = ['sea', 'weather', 'radar']
const ToggleCWB = () => {
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
    <>
      <Divider variant="middle" />
      <ListSubheader component="div" id="nested-list-subheader" sx={{ lineHeight: '25px', marginTop: '10px' }}>
        {t('CWBsites.subheader')}
      </ListSubheader>
      <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
        {optionList.map((value) => {
          const labelId = `checkbox-list-label-${value}`;
          return (
            <ListItem
              key={value}

              disablePadding
            >
              <ListItemButton role={undefined} onClick={handleToggle(value)} dense>
                <ListItemIcon>
                  <Switch
                    id={`switch-${value}`}
                    edge="start"
                    checked={checked.indexOf(value) !== -1}
                    tabIndex={-1}
                    disableRipple
                    inputProps={{ 'aria-labelledby': labelId }}
                  />
                </ListItemIcon>
                <ListItemText id={labelId} primary={t(`CWBsites.${value}`)} />
              </ListItemButton>
              <InfoButton dataId={value} />
            </ListItem>
          );
        })}
      </List>
      <Divider variant="middle" />
      <ListSubheader component="div" id="nested-list-subheader" sx={{ lineHeight: '25px', marginTop: '10px' }}>
        {t('CwbSeaForecast.subheader')}
      </ListSubheader>
      <CwbSeaForecast />
      <Divider variant="middle" />
      {/* {checked.includes('substrate') && <MoiSubstrate />} */}
      {checked.includes('sea') && <CwbSeaSites />}
      {checked.includes('weather') && <CwbWeatherSites />}
      {checked.includes('radar') && <CwbRadar />}
    </>
  );
}

export default ToggleCWB