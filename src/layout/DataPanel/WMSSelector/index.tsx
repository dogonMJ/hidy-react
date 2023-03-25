import { Divider, Stack, Switch, List, ListItem, ListItemButton, ListItemText, ListItemIcon, Typography } from "@mui/material"
import { DirectAddLayers } from "./DirectAddLayer"
import { LayerSelector } from "./LayerSelector"
import InfoButton from "components/InfoButton"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { RenderIf } from "components/RenderIf/RenderIf"
import { CRS } from 'leaflet'

interface ItemList {
  [key: string]: JSX.Element
}
const optionList = ['directAddLayers', 'layerSelector']

export const WMSSelector = () => {
  const { t } = useTranslation()
  const [checked, setChecked] = useState<string[]>([])

  const itemList: ItemList = {
    directAddLayers: <DirectAddLayers />,
    layerSelector: <LayerSelector />
  }

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
      <Typography variant="caption" sx={{ fontStyle: 'italic', ml: 2 }}>{t('WMSSelector.disclaimer')}</Typography>
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
                      edge="start"
                      checked={checked.indexOf(value) !== -1}
                      tabIndex={-1}
                      disableRipple
                      inputProps={{ 'aria-labelledby': labelId }}
                    />
                  </ListItemIcon>
                  <ListItemText id={labelId} primary={t(`WMSSelector.${value}`)} />
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