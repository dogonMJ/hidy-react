
import { Pane } from 'react-leaflet'
import { useDispatch, useSelector } from "react-redux";
import { coordInputSlice } from "store/slice/mapSlice";
import { RootState } from "store/store"
import { useTranslation } from "react-i18next";
import { List, ListItemButton, ListItemText, RadioGroup, ListItem, FormControlLabel, Radio } from '@mui/material';
import AnimatedLayers from "components/DataPanel/AnimatedCurrents/AnimatedLayers";
import InfoButton from "components/DataPanel/InfoButton";

const optionList = ["close", "madt", "msla"]
const AnimatedCurrents = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const identifier = useSelector((state: RootState) => state.coordInput.animateIdent);
  const handleToggle = (value: string) => () => {
    dispatch(coordInputSlice.actions.animateIdentifier(value))
  };

  return (
    <>
      <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
        <RadioGroup
          aria-labelledby="animatedCurrents-group-label"
          defaultValue="close"
          name="animatedCurrents-group"
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
                    checked={identifier === value} />
                  <ListItemText id={labelId} primary={t(`Animated.${value}`)} />
                </ListItemButton>
                <InfoButton dataId={value} />
              </ListItem>
            );
          })}
        </RadioGroup>
      </List>
      {
        identifier !== "close" &&
        <Pane name="canvas" style={{ zIndex: 400 }}>
          <AnimatedLayers indetifier={identifier} />
        </Pane>
      }
    </>
  )
}

export default AnimatedCurrents