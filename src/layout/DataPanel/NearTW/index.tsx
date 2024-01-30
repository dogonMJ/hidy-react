import { useTranslation } from "react-i18next";
import { List, ListItemButton, ListItemIcon, ListItemText, ListItem } from '@mui/material';
import { Divider, ListSubheader, Switch } from "@mui/material";
import { CwaSeaSites } from "./CwaSeaSites";
import { CwaSeaForecast } from "./CwaSeaForecast";
import { CwaWeatherSites } from "./CwaWeatherSites";
import { CwaRadar } from "./CwaRadar";
import InfoButton from "components/InfoButton";
import { RenderIf } from "components/RenderIf/RenderIf";
import { ComponentList, optionListCWA } from "types";
import { useToggleListChecks } from "hooks/useToggleListChecks";
// import { MoiSubstrate } from "./MoiSubstrate";

const optionList = optionListCWA

export const ToggleCWA = () => {
  const { t } = useTranslation()
  const { checked, handleToggleChecks } = useToggleListChecks()

  const componentList: ComponentList = {
    cwaSea: <CwaSeaSites />,
    cwaWeather: <CwaWeatherSites />,
    cwaRadar: <CwaRadar />,
    // substrate:<MoiSubstrate />
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
      <ListSubheader component="div" id="nested-list-subheader" sx={{ lineHeight: '25px', marginTop: '10px' }}>
        {t('CwaSeaForecast.subheader')}
      </ListSubheader>
      <CwaSeaForecast />
      <Divider variant="middle" />
    </>
  );
}