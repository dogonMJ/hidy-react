import { Box, Button, TextField, Grid, InputLabel, Stack, SxProps } from "@mui/material"
import { ChangeEventHandler, Fragment, ReactNode, useRef, useState } from "react"
import { ImageOverlay, useMap } from "react-leaflet"
import { useAlert } from "hooks/useAlert"
import { AlertSlide } from "components/AlertSlide/AlertSlide"
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import { useTranslation } from "react-i18next"
import { OpacitySlider } from "components/OpacitySlider"
import { useAppDispatch, useAppSelector } from "hooks/reduxHooks"
import { addImageSlice } from "store/slice/addImageSlice"

interface SWNE {
  [key: string]: number | null;
}

interface AddImageCustomTextField {
  label: ReactNode | string
  value: any
  onChange: ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement> | undefined
  sx?: SxProps
}

const CustomTextField = ({ label, value, onChange, sx }: AddImageCustomTextField) => {
  return (
    <TextField
      size="small"
      type="number"
      label={label}
      sx={{ width: 75, ...sx }}
      value={value === null ? '' : value}
      onChange={onChange}
    />
  );
};

export const AddImage = () => {
  const ref = useRef<any>()
  const map = useMap()
  const dispatch = useAppDispatch()
  const { t } = useTranslation()
  const { openAlert, setOpenAlert, alertMessage, setMessage } = useAlert()
  const url = useAppSelector(state => state.addImage.url)
  const opacity = useAppSelector(state => state.addImage.opacity)
  const bounds = useAppSelector(state => state.addImage.bbox)
  const [swne, setSwne] = useState<SWNE>(bounds ? { south: bounds[0][0], west: bounds[0][1], north: bounds[1][0], east: bounds[1][1] } : { south: null, west: null, north: null, east: null })
  //L.latLngBounds([20.5, 118], [26.5, 124]) https://cwaopendata.s3.ap-northeast-1.amazonaws.com/Observation/O-A0058-003.png

  const confirm = () => {
    const valid = Object.values(swne).every((value) => value !== null)
    if (valid) {
      dispatch(addImageSlice.actions.setBbox([[swne.south!, swne.west!], [swne.north!, swne.east!]]))
    } else {
      setMessage(t('alert.noCoords'))
    }
  }

  const clear = () => {
    dispatch(addImageSlice.actions.setUrl(''))
    dispatch(addImageSlice.actions.setBbox(undefined))
    setSwne({ south: null, west: null, north: null, east: null })
    ref.current && map.removeLayer(ref.current)
  }

  const handleOpacity = (event: Event, newValue: number | number[]) => {
    dispatch(addImageSlice.actions.setOpacity(newValue as number))
  };

  const eventHandlers = {
    error: () => setMessage(t('alert.checkImage'))
  }
  return (
    <>
      <Box>
        <InputLabel>{t('CustomLayer.enterUrl')}</InputLabel>
        <TextField
          size="small"
          value={url}
          sx={{ width: 328 }}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            dispatch(addImageSlice.actions.setUrl(event.target.value))
          }}
        />
        <InputLabel sx={{ mt: 1, mb: 1 }}>{t('CustomLayer.enterCoords')}</InputLabel>
        <Grid container sx={{ width: 328, paddingLeft: 3 }} alignItems="center" justifyContent="center">
          <Grid item xs={4}></Grid>
          {
            ['north', 'west', 'east', 'south'].map(dir =>
              <Fragment key={dir}>
                <Grid item xs={4} >
                  <CustomTextField
                    label={t(`screenshot.${dir}`)}
                    value={swne[dir]}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      setSwne(prevState => ({
                        ...prevState,
                        [dir]: Number(event.target.value),
                      }));
                    }}
                  />
                </Grid >
                <Grid item xs={4}></Grid>
              </Fragment>
            )
          }
        </Grid>
        <Stack direction='row' spacing={1} justifyContent="flex-end" sx={{ mt: 2, mb: 2, pr: 3 }}>
          <Button size="small" variant='contained' color='error' startIcon={<ClearRoundedIcon />} onClick={clear}>{t('CustomLayer.clearLayer')}</Button>
          <Button size="small" variant='contained' color='primary' startIcon={<CheckRoundedIcon />} onClick={confirm}>{t('CustomLayer.addLayer')}</Button>
        </Stack>
        <OpacitySlider opacity={opacity} onChange={handleOpacity} />
      </Box >
      {url && bounds && <ImageOverlay ref={ref} url={url} bounds={bounds} crossOrigin='anonymous' zIndex={600} opacity={opacity / 100} eventHandlers={eventHandlers}
      />
      }
      <AlertSlide open={openAlert} setOpen={setOpenAlert} severity='error' timeout={3000} > {alertMessage} </AlertSlide>
    </>

  )
}