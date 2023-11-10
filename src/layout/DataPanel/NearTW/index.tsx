import { useTranslation } from "react-i18next";
import { List, ListItemButton, ListItemIcon, ListItemText, ListItem } from '@mui/material';
import { Divider, ListSubheader, Switch } from "@mui/material";
import { CwaSeaSites } from "./CwaSeaSites";
import { CwaSeaForecast } from "./CwaSeaForecast";
import { CwaWeatherSites } from "./CwaWeatherSites";
import { CwaRadar } from "./CwaRadar";
import InfoButton from "components/InfoButton";
import { RootState } from 'store/store';
import { useDispatch, useSelector } from 'react-redux';
import { onoffsSlice } from 'store/slice/onoffsSlice';
// import { MoiSubstrate } from "./MoiSubstrate";

const optionList = ['cwaSea', 'cwaWeather', 'cwaRadar']
export const ToggleCWA = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const checked = useSelector((state: RootState) => state.switches.checked)
  const handleToggle = (value: string) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];
    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    dispatch(onoffsSlice.actions.setChecked(newChecked))
  };
  return (
    <>
      <Divider variant="middle" />
      <ListSubheader component="div" id="nested-list-subheader" sx={{ lineHeight: '25px', marginTop: '10px' }}>
        {t('CWAsites.subheader')}
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
                <ListItemText id={labelId} primary={t(`CWAsites.${value}`)} />
              </ListItemButton>
              <InfoButton dataId={value} />
            </ListItem>
          );
        })}
      </List>
      <Divider variant="middle" />
      <ListSubheader component="div" id="nested-list-subheader" sx={{ lineHeight: '25px', marginTop: '10px' }}>
        {t('CwaSeaForecast.subheader')}
      </ListSubheader>
      <CwaSeaForecast />
      <Divider variant="middle" />
      {/* {checked.includes('substrate') && <MoiSubstrate />} */}
      {checked.includes('cwaSea') && <CwaSeaSites />}
      {checked.includes('cwaWeather') && <CwaWeatherSites />}
      {checked.includes('cwaRadar') && <CwaRadar />}
    </>
  );
}