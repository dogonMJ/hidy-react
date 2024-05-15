import { Box, Button, TextField, Grid, InputLabel, Stack, SxProps } from "@mui/material"
import { ChangeEventHandler, FocusEventHandler, Fragment, KeyboardEventHandler, ReactNode, useRef, useState } from "react"
import { ImageOverlay } from "react-leaflet"
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
  onChange?: ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement> | undefined
  onBlur?: FocusEventHandler<HTMLTextAreaElement | HTMLInputElement> | undefined
  onKeyDown?: KeyboardEventHandler<HTMLDivElement> | undefined
  sx?: SxProps
}

const CustomTextField = ({ label, value, onChange, onBlur, onKeyDown, sx }: AddImageCustomTextField) => {
  return (
    <TextField
      size="small"
      type="number"
      label={label}
      sx={{ width: 75, ...sx }}
      value={value === null ? '' : value}
      onChange={onChange}
      onBlur={onBlur}
      onKeyDown={onKeyDown}
    />
  );
};

export const AddImage = () => {
  const ref = useRef<any>()
  const dispatch = useAppDispatch()
  const { t } = useTranslation()
  const { openAlert, setOpenAlert, alertMessage, setMessage } = useAlert()
  const opacity = useAppSelector(state => state.addImage.opacity)
  const bounds = useAppSelector(state => state.addImage.bbox)
  const layerName = useAppSelector(state => state.addImage.layerName)
  const layerList = useAppSelector(state => state.addImage.layerList)
  const externalURL = useAppSelector(state => state.addImage.url)
  const [inputURL, setInputURL] = useState(externalURL)
  const [inputLayerName, setInputLayerName] = useState(layerName)
  const [swne, setSwne] = useState<SWNE>(
    bounds ?
      { south: bounds[0][0], west: bounds[0][1], north: bounds[1][0], east: bounds[1][1] } :
      { south: null, west: null, north: null, east: null }
  )

  const url = `https://service.oc.ntu.edu.tw/data/proxy-image?url=${externalURL}`
  let layeri = layerList ? layerList.length + 1 : 1

  const confirm = () => {
    if (layerList && layerList.some(layer => layer.name === inputLayerName)) {
      setMessage(t('CustomLayer.alert.dupName'))
      layeri += 1
      setInputLayerName(`layer${layeri}`)
    } else {
      if (layerList) {
        dispatch(addImageSlice.actions.setLayerList([{ name: inputLayerName, url, bounds }, ...layerList]))
      } else {
        dispatch(addImageSlice.actions.setLayerList([{ name: inputLayerName, url, bounds }]))
      }
    }
  }

  const handleURLBlur = () => {
    dispatch(addImageSlice.actions.setUrl(inputURL))
  }
  const handleCoorBlur = () => {
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
    setInputURL('')
    setSwne({ south: null, west: null, north: null, east: null })
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
        <InputLabel>{t('CustomLayer.layerName')}</InputLabel>
        <TextField
          size="small"
          value={inputLayerName}
          onChange={(e) => setInputLayerName(e.target.value)}
          onBlur={() => dispatch(addImageSlice.actions.setLayerName(inputLayerName))}
        />
        <InputLabel>{t('CustomLayer.enterUrl')}</InputLabel>
        <TextField
          size="small"
          value={inputURL}
          sx={{ width: 328 }}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setInputURL(event.target.value)
          }}
          onBlur={handleURLBlur}
          onKeyDown={(ev) => {
            if (ev.key.toLowerCase() === 'enter') {
              handleURLBlur()
            }
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
                    onBlur={handleCoorBlur}
                    onKeyDown={(ev) => {
                      if (ev.key.toLowerCase() === 'enter') {
                        handleCoorBlur()
                      }
                    }}
                  />
                </Grid >
                <Grid item xs={4}></Grid>
              </Fragment>
            )
          }
        </Grid>
        <Stack direction='row' spacing={1} justifyContent="flex-end" sx={{ mt: 2, mb: 2, pr: 3 }}>
          <Button size="small" variant='contained' color='error' startIcon={<ClearRoundedIcon />} onClick={clear}>{t('CustomLayer.clearData')}</Button>
          <Button size="small" variant='contained' color='primary' startIcon={<CheckRoundedIcon />} onClick={confirm}>{t('CustomLayer.addLayer')}</Button>
        </Stack>
        <OpacitySlider opacity={opacity} onChange={handleOpacity} />
        {layerList &&
          layerList.map((layer, index) => (
            <Button
              key={layer.name}
              onClick={() => dispatch(addImageSlice.actions.setLayerList(layerList.filter((_, i) => i !== index)))}
              size="small"
              variant='contained'
              color='error'
              startIcon={<ClearRoundedIcon />}
              sx={{ marginRight: '3px' }}
            >
              {layer.name}
            </Button>
          ))}
      </Box >
      {url && bounds &&
        <ImageOverlay ref={ref} url={url} bounds={bounds} crossOrigin='anonymous' zIndex={405} opacity={opacity / 100} eventHandlers={eventHandlers} />
      }
      {layerList && layerList.length > 0 &&
        layerList.map(layer =>
          <ImageOverlay key={layer.name} url={layer.url} bounds={layer.bounds} crossOrigin='anonymous' opacity={opacity / 100} eventHandlers={eventHandlers} />
        )
      }
      <AlertSlide open={openAlert} setOpen={setOpenAlert} severity='error' timeout={3000} > {alertMessage} </AlertSlide>
    </>

  )
}