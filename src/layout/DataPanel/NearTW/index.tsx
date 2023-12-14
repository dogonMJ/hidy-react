import { useTranslation } from "react-i18next";
import { List, ListItemButton, ListItemIcon, ListItemText, ListItem } from '@mui/material';
import { Divider, ListSubheader, Switch } from "@mui/material";
import { CwaSeaSites } from "./CwaSeaSites";
import { CwaSeaForecast } from "./CwaSeaForecast";
import { CwaWeatherSites } from "./CwaWeatherSites";
import { CwaRadar } from "./CwaRadar";
import InfoButton from "components/InfoButton";
import { onoffsSlice } from 'store/slice/onoffsSlice';
import { RenderIf } from "components/RenderIf/RenderIf";
import { ComponentList, optionListCWA } from "types";
import { useAppDispatch, useAppSelector } from "hooks/reduxHooks";
// import { MoiSubstrate } from "./MoiSubstrate";

const optionList = optionListCWA

export const ToggleCWA = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const checked = useAppSelector(state => state.switches.checked)

  const componentList: ComponentList = {
    cwaSea: <CwaSeaSites />,
    cwaWeather: <CwaWeatherSites />,
    cwaRadar: <CwaRadar />,
    // substrate:<MoiSubstrate />
  }

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
            <div key={value}>
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
              <RenderIf isTrue={checked.includes(value)}>
                {componentList[value]}
              </RenderIf>
            </div>
          );
        })}
      </List>
      <Divider variant="middle" />
      <ListSubheader component="div" id="nested-list-subheader" sx={{ lineHeight: '25px', marginTop: '10px' }}>
        {t('CwaSeaForecast.subheader')}
      </ListSubheader>
      <CwaSeaForecast />
      <Divider variant="middle" />
    </>
  );
}