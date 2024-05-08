import { useTranslation } from "react-i18next";
import { List, ListItemButton, ListItemIcon, ListItemText, ListItem } from '@mui/material';
import { Divider, ListSubheader, Switch } from "@mui/material";
import { CwaSeaSites } from "./CwaSeaSites";
import { CwaSeaForecast } from "./CwaSeaForecast/index";
import { CwaWeatherSites } from "./CwaWeatherSites";
import { CwaRadar } from "./CwaRadar";
import InfoButton from "components/InfoButton";
import { RenderIf } from "components/RenderIf/RenderIf";
import { ComponentList, optionListCWA } from "types";
import { useToggleListChecks } from "hooks/useToggleListChecks";
import { DataPanelRadioList } from "components/DataPanelRadioList";
import { CWAForecastCustomPanel } from "./CwaSeaForecast/CWAForecastCustomPanel";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "hooks/reduxHooks";
import { onoffsSlice } from "store/slice/onoffsSlice";
import { BrushOutlined, BrushRounded } from "@mui/icons-material";
import { CWAForecastDirPanel } from "./CwaSeaForecast/CWAForecastDirPanel";
// import { MoiSubstrate } from "./MoiSubstrate";

const optionList = optionListCWA

export const ToggleCWA = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { checked, handleToggleChecks } = useToggleListChecks()
  const [openCustomPanel, setOpenCustomPanel] = useState(false)
  const dir = checked.includes('cwaForecastDir')
  const identifier = useAppSelector(state => state.switches.cwaSeaForecast)

  const componentList: ComponentList = {
    cwaSea: <CwaSeaSites />,
    cwaWeather: <CwaWeatherSites />,
    cwaRadar: <CwaRadar />,
    // substrate:<MoiSubstrate />
  }

  const hadleBrushClick = async (ev: any) => {
    const id = ev.currentTarget.id
    if (id === identifier) { setOpenCustomPanel(prev => !prev) }
  }
  const handleToggleForecast = (value: any) => {
    dispatch(onoffsSlice.actions.setCwaSeaForecast(value))
    const currentIndex = checked.indexOf('cwaForecast');
    const newChecked = [...checked];
    if (value === 'close') {
      newChecked.splice(currentIndex, 1);
    } else if (currentIndex === -1) {
      newChecked.push('cwaForecast');
    }
    dispatch(onoffsSlice.actions.setChecked(newChecked))
  }
  const handleDirSwitch = () => {
    const currentIndex = checked.indexOf('cwaForecastDir');
    const newChecked = [...checked];
    if (dir) {
      newChecked.splice(currentIndex, 1);
    } else if (currentIndex === -1) {
      newChecked.push('cwaForecastDir');
    }
    dispatch(onoffsSlice.actions.setChecked(newChecked))
  }
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
                <ListItemButton role={undefined} onClick={handleToggleChecks(value)} dense>
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
      {/* CWA forecast radio and control panel */}
      <ListSubheader component="div" id="nested-list-subheader" sx={{ lineHeight: '25px', marginTop: '10px' }}>
        {t('CwaSeaForecast.subheader')}
      </ListSubheader>
      <DataPanelRadioList
        group="CwaSeaForecast"
        identifier={identifier}
        optionList={['close']}
        handleClick={handleToggleForecast}
      />
      <DataPanelRadioList
        group='CwaSeaForecast'
        identifier={identifier}
        optionList={['SST', 'SAL', 'SSH', 'SPD']}
        handleClick={handleToggleForecast}
        customButtonProps={{
          handleClick: hadleBrushClick,
          Icon: <BrushOutlined />,
          closeIcon: <BrushRounded />,
          open: openCustomPanel
        }}
        customPanel={
          <RenderIf isTrue={openCustomPanel}>
            <CWAForecastCustomPanel identifier={identifier} />
          </RenderIf>
        }
      />
      {/* dir switch and control panel */}
      <ListItem disablePadding>
        <ListItemButton role={undefined} onClick={handleDirSwitch} dense>
          <ListItemIcon>
            <Switch
              edge="start"
              checked={dir}
              tabIndex={-1}
              disableRipple
            />
          </ListItemIcon>
          <ListItemText primary={`${t(`CwaSeaForecast.DIR`)} (${t(`CwaSeaForecast.longLoad`)})`} />
        </ListItemButton>
        <InfoButton dataId={'DIR'} />
      </ListItem>
      <RenderIf isTrue={dir}>
        <CWAForecastDirPanel />
      </RenderIf>
      <RenderIf isTrue={identifier !== 'close' || dir}>
        <CwaSeaForecast />
      </RenderIf>
      <Divider variant="middle" />
    </>
  );
}