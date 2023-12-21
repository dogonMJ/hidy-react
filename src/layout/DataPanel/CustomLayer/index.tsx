import { Divider, Stack, Switch, List, ListItem, ListItemButton, ListItemText, ListItemIcon, Typography } from "@mui/material"
import { DirectAddLayers } from "./DirectAddLayer"
import { LayerSelector } from "./LayerSelector"
import InfoButton from "components/InfoButton"
import { useTranslation } from "react-i18next"
import { RenderIf } from "components/RenderIf/RenderIf"
import { AddImage } from "./AddImage"
import { useAppDispatch, useAppSelector } from "hooks/reduxHooks"
import { onoffsSlice } from "store/slice/onoffsSlice"

interface ItemList {
  [key: string]: JSX.Element
}
const optionList = ['addWmsLayer', 'layerSelector', 'addImage']

export const CustomLayer = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const checked = useAppSelector(state => state.switches.checked)

  const itemList: ItemList = {
    addWmsLayer: <DirectAddLayers />,
    layerSelector: <LayerSelector />,
    addImage: <AddImage />
  }

  const handleToggle = (value: string) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];
    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    // setChecked(newChecked);
    dispatch(onoffsSlice.actions.setChecked(newChecked))
  };
  return (
    <>
      <Typography variant="caption" sx={{ fontStyle: 'italic', ml: 2 }}>{t('CustomLayer.disclaimer')}</Typography>
      <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
        {optionList.map((value) => {
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
                      id={`switch-customLayer-${value}`}
                      edge="start"
                      checked={checked.indexOf(value) !== -1}
                      tabIndex={-1}
                      disableRipple
                      inputProps={{ 'aria-labelledby': labelId }}
                    />
                  </ListItemIcon>
                  <ListItemText id={labelId} primary={t(`CustomLayer.${value}`)} />
                </ListItemButton>
                <InfoButton dataId={value} />
              </ListItem>
              <RenderIf isTrue={checked.includes(value)}>
                <Divider variant="middle" />
                <Stack sx={{ margin: 2 }}>
                  {itemList[value]}
                </Stack>
                <Divider variant="middle" />
              </RenderIf>
            </div>
          );
        })}
      </List>
    </>
  )
}