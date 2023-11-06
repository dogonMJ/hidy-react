import { useCallback, useEffect, useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "store/store"
import { useTranslation } from "react-i18next";
import { List, ListItemButton, ListItemIcon, ListItemText, ListItem, } from '@mui/material';
import { Divider, Switch } from "@mui/material";
import { RenderIf } from 'components/RenderIf/RenderIf';
import InfoButton from "components/InfoButton";
import { OdbTopo } from "./OdbTopo"
import { OdbCTD } from './OdbCTD';
import { OdbGravity } from './OdbGravity';
import { OdbCurrent } from './OdbCurrent';
import { OdbSedCore } from './OdbSedCore';
import { OdbChemistry } from './OdbChemistry';
import { OdbBio } from './OdbBio';
import { OdbMicroplastics } from './OdbMicroPlastics';
import { OdbMarineHeatwave } from './OdbMarineHeatwave';
import { ComponentList } from 'types';
import { onoffsSlice } from 'store/slice/onoffsSlice';


export const ODB = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const checked = useSelector((state: RootState) => state.switches.checkedOdb)

  const handleToggle = (value: string) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];
    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    dispatch(onoffsSlice.actions.setOdbChecked(newChecked))
  };

  const componentList: ComponentList = {
    odbTopo: <OdbTopo opacity={1} />,
    odbCtd: <OdbCTD />,
    odbGravity: <OdbGravity opacity={1} />,
    odbCurrent: <OdbCurrent />,
    odbSedCore: <OdbSedCore />,
    odbMHW: <OdbMarineHeatwave />,
    odbChem: <OdbChemistry />,
    odbBio: <OdbBio />,
    odbMP: < OdbMicroplastics />,
    // WebMaps: <SatelliteWebMaps cache={cache} />
  }

  return (
    <>
      <Divider variant="middle" />
      <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
        {Object.keys(componentList).map((value) => {
          const labelId = `checkbox-list-label-${value}`;
          return (
            <div key={value}>
              <ListItem
                id={`listOption_${value}`}
                key={value}
                disablePadding
              >
                <ListItemButton role={undefined} onClick={handleToggle(value)} dense>
                  <ListItemIcon>
                    <Switch
                      id={`switch-ODB-${value}`}
                      edge="start"
                      checked={checked.indexOf(value) !== -1}
                      tabIndex={-1}
                      disableRipple
                      inputProps={{ 'aria-labelledby': labelId }}
                    />
                  </ListItemIcon>
                  <ListItemText id={labelId} primary={t(`OdbData.${value}`)} />
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
    </>
  )
}