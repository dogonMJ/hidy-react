import { useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "store/store"
import { coordInputSlice } from "store/slice/mapSlice";
import { useTranslation } from "react-i18next";
import { List, ListItemButton, ListItemIcon, ListItemText, ListItem, ToggleButton } from '@mui/material';
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
import { SubSelection } from 'components/SubSelection';
import { ComponentList } from 'types';

export const ODB = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [checked, setChecked] = useState<string[]>([]);
  const type = useSelector((state: RootState) => state.coordInput.OdbCtdSelection)
  const period = useSelector((state: RootState) => state.coordInput.OdbCurSelection)

  const handleCtdChange = (event: React.MouseEvent<HTMLElement>, newSelect: string,) => {
    if (newSelect) {
      dispatch(coordInputSlice.actions.OdbCtdSelection(newSelect))
    }
  };

  const handleCurChange = (event: React.MouseEvent<HTMLElement>, newSelect: string,) => {
    if (newSelect) {
      dispatch(coordInputSlice.actions.OdbCurSelection(newSelect))
    }
  };
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

  const creatSelection = (value: string[] | number[], transParentNode?: string) => {
    const res = value.map((value) => {
      const translation = `${transParentNode}.${value}`
      return (
        <ToggleButton value={value} key={value}>
          {t(translation)}
        </ToggleButton>
      )
    })
    return res
  }
  const componentList: ComponentList = {
    odbTopo: <OdbTopo opacity={1} />,
    odbCtd: <>
      <SubSelection select={type} handleChange={handleCtdChange}>
        {creatSelection(['temperature', 'salinity', 'density', 'transmission', 'fluorescence', 'oxygen'], 'OdbData')}
      </SubSelection>
      <RenderIf isTrue={!checked.includes('odbCurrent')}>
        <SubSelection select={period} handleChange={handleCurChange}>
          {creatSelection(['avg', 'NE', 'SW', 'spring', 'summer', 'fall', 'winter'], 'OdbData')}
        </SubSelection>
      </RenderIf>
      <OdbCTD />
    </>,
    odbGravity: <OdbGravity opacity={1} />,
    odbCurrent: <>
      <SubSelection select={period} handleChange={handleCurChange}>
        {creatSelection(['avg', 'NE', 'SW', 'spring', 'summer', 'fall', 'winter'], 'OdbData')}
      </SubSelection>
      <OdbCurrent />
    </>,
    odbSedCore: <OdbSedCore />,
    odbMarineHeatwave: <OdbMarineHeatwave />,
    odbChemistry: <OdbChemistry />,
    odbBio: <OdbBio />,
    odbMicroPlastic: < OdbMicroplastics />,
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