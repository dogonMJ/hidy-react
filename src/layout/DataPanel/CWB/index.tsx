import { useState } from 'react';
import { useTranslation } from "react-i18next";
import { List, ListItemButton, ListItemIcon, ListItemText, Checkbox, ListItem } from '@mui/material';
import CwbSeaSites from 'layout/DataPanel/CWB/CwbSeaSites';
import CwbWeatherSites from 'layout/DataPanel/CWB/CwbWeatherSites';
import CwbRadar from 'layout/DataPanel/CWB/CwbRadar';
import InfoButton from "components/InfoButton";

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
                  <Checkbox
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
      {checked.includes('sea') && <CwbSeaSites />}
      {checked.includes('weather') && <CwbWeatherSites />}
      {checked.includes('radar') && <CwbRadar />}
      {/* <WaveForecast /> */}
    </>
  );
}

export default ToggleCWB