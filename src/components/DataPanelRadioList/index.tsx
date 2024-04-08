import { List, RadioGroup, ListItemButton, FormControlLabel, ListItemText, ListItem, Radio, ListItemIcon, IconButton } from '@mui/material';
import InfoButton from "components/InfoButton";
import { RenderIf } from 'components/RenderIf/RenderIf';
import { memo } from 'react';
import { useTranslation } from "react-i18next";

interface Props {
  identifier: any
  handleClick: any
  group: string
  optionList: string[]
  customButtonProps?: any
  customPanel?: JSX.Element
}

const CustomButton = memo((props: {
  id: string
  handleClick: () => void,
  Icon: any,
  open?: boolean,
  closeIcon?: any
  disableWhenNotSelect?: boolean
}) => {
  return (
    <ListItemIcon sx={{ minWidth: '20px' }}>
      <IconButton
        id={props.id}
        onClick={props.handleClick} sx={{ paddingBlock: 0 }}
        disabled={props.disableWhenNotSelect ?? false}
      >
        {(props.open && !props.disableWhenNotSelect) ? props.Icon : props.closeIcon}
      </IconButton>
    </ListItemIcon>
  )
})

export const DataPanelRadioList = (props: Props) => {
  const { t } = useTranslation()
  const {
    identifier,
    handleClick,
    group,
    optionList,
    customButtonProps,
    customPanel
  } = props
  return (
    <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }
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
              <div key={value}>
                <ListItem
                  key={value}
                  disablePadding
                >
                  <ListItemButton role={undefined} onClick={() => handleClick(value)} dense>
                    <FormControlLabel
                      value={value}
                      control={<Radio />}
                      label=""
                      checked={identifier === value}
                    />
                    <ListItemText id={labelId} primary={t(`${group}.${value}`)} />
                  </ListItemButton>
                  {customButtonProps && value !== 'close' && <CustomButton id={value} disableWhenNotSelect={value !== identifier} {...customButtonProps} />}
                  <InfoButton dataId={value} iconSx={{ paddingBlock: 0 }} />
                </ListItem>
                {customPanel && value !== 'close' &&
                  <RenderIf isTrue={value === identifier} >
                    {customPanel}
                  </RenderIf >
                }
              </div>
            )
          })
        }
      </RadioGroup>
    </List >
  )
}