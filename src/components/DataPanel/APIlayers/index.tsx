import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "store/store"
import { coordInputSlice } from "store/slice/mapSlice";
import { List, ListItemButton, ListItemText, RadioGroup, ListItem, FormControlLabel, Radio } from '@mui/material';
import ProcWMTS from './ProcWMTS'
import InfoButton from "components/DataPanel/InfoButton";

const optionList = ["close", "GHRSST_L4_MUR_Sea_Surface_Temperature",
  "GHRSST_L4_MUR_Sea_Surface_Temperature_Anomalies", "MODIS_Aqua_CorrectedReflectance_TrueColor", "Himawari_AHI_Band3_Red_Visible_1km"]
const APILayers = (props: { cache: any }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const identifier = useSelector((state: RootState) => state.coordInput.layerIdent);
  const datetime = useSelector((state: RootState) => state.coordInput.datetime);

  const cache = props.cache
  const handleToggle = (value: string) => () => {
    dispatch(coordInputSlice.actions.layerIdentifier(value))
  };
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
                    checked={identifier === value} />
                  <ListItemText id={labelId} primary={t(`APIlayers.${value}`)} />
                </ListItemButton>
                <InfoButton dataId={value} />
              </ListItem>
            );
          })}
        </RadioGroup>
      </List>
      {
        identifier !== "close" &&
        <ProcWMTS
          Identifier={identifier}
          Time={datetime}
          cache={cache}
        />
      }
    </>
  )
}

export default APILayers