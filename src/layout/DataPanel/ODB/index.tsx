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
import { SubSelection } from 'components/SubSelection';

const optionList = ['odbTopo', 'odbCtd', 'odbGravity', 'odbCurrent', 'odbSedCore']
export const ODB = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [checked, setChecked] = useState<string[]>([]);
  const type = useSelector((state: RootState) => state.coordInput.OdbCtdSelection)
  const handleCtdChange = (event: React.MouseEvent<HTMLElement>, newSelect: string,) => {
    if (newSelect) {
      dispatch(coordInputSlice.actions.OdbCtdSelection(newSelect))
    }
  };
  const period = useSelector((state: RootState) => state.coordInput.OdbCurSelection)
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

  const creatSelection = (value: string[], transParentNode?: string) => {
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
  return (
    <>
      <Divider variant="middle" />
      <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
        {optionList.map((value) => {
          const labelId = `checkbox-list-label-${value}`;
          return (
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
          );
        })}
      </List>
      <Divider variant="middle" />
      <RenderIf isTrue={checked.includes('odbTopo')}>
        <OdbTopo opacity={1} />
      </RenderIf>
      <RenderIf isTrue={checked.includes('odbCtd')}>
        <SubSelection select={type} handleChange={handleCtdChange}>
          {creatSelection(['t', 'sal', 'density'], 'OdbData')}
        </SubSelection>
        <RenderIf isTrue={!checked.includes('odbCurrent')}>
          <SubSelection select={period} handleChange={handleCurChange}>
            {creatSelection(['avg', 'NE', 'SW', 'spring', 'summer', 'fall', 'winter'], 'OdbData')}
          </SubSelection>
        </RenderIf>
        <OdbCTD />
      </RenderIf>
      <RenderIf isTrue={checked.includes('odbGravity')}>
        <OdbGravity opacity={1} />
      </RenderIf>
      <RenderIf isTrue={checked.includes('odbCurrent')}>
        <SubSelection select={period} handleChange={handleCurChange}>
          {creatSelection(['avg', 'NE', 'SW', 'spring', 'summer', 'fall', 'winter'], 'OdbData')}
        </SubSelection>
        <OdbCurrent />
      </RenderIf>
      <RenderIf isTrue={checked.includes('odbSedCore')}>
        <OdbSedCore />
      </RenderIf>
    </>
  )
}