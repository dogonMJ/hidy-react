import { List, RadioGroup, ListItemButton, FormControlLabel, ListItemText, ListItem, Radio } from '@mui/material';
import InfoButton from "layout/DataPanel/InfoButton";
import { useTranslation } from "react-i18next";
interface Props {
  identifier: any
  handelClick: any
  group: string
  optionList: string[]
}
export const DataPanelRadioList = (props: Props) => {
  const { t } = useTranslation()
  const {
    identifier,
    handelClick,
    group,
    optionList
  } = props
  return (
    < List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }
    }>
      <RadioGroup
        aria-labelledby={group + "-group-label"}
        defaultValue="close"
        name={group + "-group"}
      >
        {
          optionList.map((value) => {
            const labelId = `checkbox-list-label-${value}`;
            return (
              <ListItem
                key={value}
                disablePadding
              >
                <ListItemButton role={undefined} onClick={handelClick(value)} dense>
                  <FormControlLabel
                    value={value}
                    control={<Radio />}
                    label=""
                    checked={identifier === value}
                  />
                  <ListItemText id={labelId} primary={t(`${group}.${value}`)} />
                </ListItemButton>
                <InfoButton dataId={value} />
              </ListItem>
            )
          })
        }
      </RadioGroup>
    </List>
  )
}