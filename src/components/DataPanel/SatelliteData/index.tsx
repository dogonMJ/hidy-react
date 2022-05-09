import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { RootState } from "store/store"
import { List, ListItemButton, ListItemText, RadioGroup, ListItem, FormControlLabel, Radio } from '@mui/material';
import InfoButton from "components/DataPanel/InfoButton";
import { ImageOverlay } from "react-leaflet";

const optionList = ['close', 'madt', 'msla', 'chla']
const SatelliteData = () => {
  const { t } = useTranslation()
  const ref = useRef<any>(null)
  const [identifier, setIdentifier] = useState('close')
  const datetime = useSelector((state: RootState) => state.coordInput.datetime);
  const date = datetime.replace(/T.*|-/g, '')

  const handleToggle = (value: string) => () => {
    setIdentifier(value)
  };;

  useEffect(() => {
    if (ref.current) {
      const url = `https://odbpo.oc.ntu.edu.tw/static/figs/${identifier}/${identifier}${date}.png`
      ref.current.setUrl(url)
    }
  })
  return (
    <>
      <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
        <RadioGroup
          aria-labelledby="radio-buttons-group-label"
          defaultValue="close"
          name="radio-buttons-group"
        >
          {optionList.map((value) => {
            const labelId = `checkbox-list-label-${value}`;
            return (
              <ListItem
                key={value}
                disablePadding
              >
                <ListItemButton role={undefined} onClick={handleToggle(value)} dense>
                  <FormControlLabel
                    value={value}
                    control={<Radio />}
                    label=""
                    checked={identifier === value}
                  />
                  <ListItemText id={labelId} primary={t(`APIlayers.${value}`)} />
                </ListItemButton>
                <InfoButton dataId={value} />
              </ListItem>
            );
          })}
        </RadioGroup>
      </List>
      {identifier !== 'close' && <ImageOverlay ref={ref} url={''} crossOrigin='anonymous' bounds={[[2, 105], [35, 150]]} />}
    </>
  );
}

export default SatelliteData