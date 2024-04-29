import { Button } from "@mui/material"
import { useTranslation } from "react-i18next"

export const DefaultRangeButton = (props: { setRange: () => void, text?: string }) => {
  const { t } = useTranslation()
  const { setRange, text } = props
  return (
    <Button
      size="small"
      variant='outlined'
      sx={{
        height: 20,
        p: 0,
        color: 'black',
        borderColor: 'lightgray',
        '&:hover': {
          borderColor: 'lightgrey',
          bgcolor: 'whitesmoke'
        },
      }}
      onClick={setRange}
    >
      {text ?? t('OdbData.CTD.defaultRange')}
    </Button>
  )
}