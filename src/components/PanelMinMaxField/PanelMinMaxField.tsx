import { TextField } from "@mui/material"
import { ChangeEvent } from "react"
import { useTranslation } from "react-i18next"
import { MinMax } from "types"

export const PanelMinMaxField = (props: { inputRange: MinMax, setInputRange: (arg: MinMax) => void, setRange: (arg: MinMax) => void, minText?: string, maxText?: string }) => {
  const { inputRange, setInputRange, setRange, minText, maxText } = props
  const { t } = useTranslation()
  const handleMinChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputRange({ min: Number(event.target.value), max: inputRange.max })
  }
  const handleMaxChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputRange({ min: inputRange.min, max: Number(event.target.value) })
  }
  const handleMinMaxBlur = () => {
    const newMin = inputRange.min
    const newMax = inputRange.max
    if (newMin > newMax) {
      setInputRange({ min: newMax, max: newMin })
      setRange({ min: newMax, max: newMin })
    } else {
      setRange({ min: newMin, max: newMax })
    }
  }
  return (
    <>
      <TextField
        label={minText ?? t('OdbData.min')}
        size="small"
        type="number"
        variant="standard"
        value={inputRange.min}
        onChange={handleMinChange}
        onBlur={handleMinMaxBlur}
        onKeyDown={(ev) => {
          if (ev.key.toLowerCase() === 'enter') {
            handleMinMaxBlur()
          }
        }}
        sx={{ width: 70 }}
      />
      <TextField
        label={maxText ?? t('OdbData.max')}
        size="small"
        type="number"
        variant="standard"
        value={inputRange.max}
        onChange={handleMaxChange}
        onBlur={handleMinMaxBlur}
        onKeyDown={(ev) => {
          if (ev.key.toLowerCase() === 'enter') {
            handleMinMaxBlur()
          }
        }}
        sx={{ width: 70 }}
      />
    </>
  )
}