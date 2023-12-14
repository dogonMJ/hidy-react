import { Box, Button, TextField, Grid, InputLabel, Stack, SxProps, Slider } from "@mui/material"
import L, { LatLngBounds } from "leaflet"
import { ChangeEventHandler, ReactNode, useRef, useState } from "react"
import { ImageOverlay, useMap } from "react-leaflet"
import { useAlert } from "hooks/useAlert"
import { AlertSlide } from "components/AlertSlide/AlertSlide"
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import { useTranslation } from "react-i18next"
import { OpacitySlider } from "components/OpacitySlider"

interface NSEW {
  N: number | null;
  S: number | null;
  E: number | null;
  W: number | null;
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
      // InputLabelProps={{
      //   style: {
      //     height: '50%',
      //     width: '60%',
      //     display: 'flex',
      //     alignItems: 'center',
      //     justifyContent: 'cneter'
      //   }
      // }}
      onChange={onChange}
    />
  );
};

export const AddImage = () => {
  const ref = useRef<any>()
  const map = useMap()
  const { t } = useTranslation()
  const { openAlert, setOpenAlert, alertMessage, setMessage } = useAlert()
  const [url, setUrl] = useState('')
  const [bounds, setBounds] = useState<LatLngBounds>() //L.latLngBounds([20.5, 118], [26.5, 124]) https://cwaopendata.s3.ap-northeast-1.amazonaws.com/Observation/O-A0058-003.png
  const [nsew, setNsew] = useState<NSEW>({ N: null, S: null, E: null, W: null })
  const [opacity, setOpacity] = useState(100)

  const confirm = () => {
    const valid = Object.values(nsew).every((value) => value !== null)
    if (valid) {
      setBounds(L.latLngBounds([nsew.S!, nsew.W!], [nsew.N!, nsew.E!]))
    } else {
      setMessage('input coodinates')
    }
  }

  const clear = () => {
    setUrl('')
    setBounds(undefined)
    setNsew({ N: null, S: null, E: null, W: null })
    ref.current && map.removeLayer(ref.current)
  }

  const handleOpacity = (event: Event, newValue: number | number[]) => {
    setOpacity(newValue as number);
  };
  return (
    <>
      <Box>
        <InputLabel>{t('WMSSelector.enterUrl')}</InputLabel>
        <TextField
          size="small"
          value={url}
          sx={{ width: 328 }}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setUrl(event.target.value);
          }}
        />
        <InputLabel sx={{ mt: 1, mb: 1 }}>{t('WMSSelector.enterCoords')}</InputLabel>
        <Grid container sx={{ width: 328, paddingLeft: 3 }} alignItems="center" justifyContent="center">
          <Grid item xs={4}></Grid>
          <Grid item xs={4} alignItems="center" justifyContent="center">
            <CustomTextField
              label={t('screenshot.north')}
              value={nsew.N}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setNsew(prevState => ({
                  ...prevState,
                  N: Number(event.target.value),
                }));
              }}
            />
          </Grid>
          <Grid item xs={4}></Grid>
          <Grid item xs={4}>
            <CustomTextField
              label={t('screenshot.west')}
              value={nsew.W}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setNsew(prevState => ({
                  ...prevState,
                  W: Number(event.target.value),
                }));
              }}
            />
          </Grid>
          <Grid item xs={4}></Grid>
          <Grid item xs={4}>
            <CustomTextField
              label={t('screenshot.east')}
              value={nsew.E}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setNsew(prevState => ({
                  ...prevState,
                  E: Number(event.target.value),
                }));
              }}
            />
          </Grid>
          <Grid item xs={4}></Grid>

          <Grid item xs={4}>
            <CustomTextField
              label={t('screenshot.south')}
              value={nsew.S}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setNsew(prevState => ({
                  ...prevState,
                  S: Number(event.target.value),
                }));
              }}
            />
          </Grid>
          <Grid item xs={4}></Grid>
        </Grid>
        <Stack direction='row' spacing={1} justifyContent="flex-end" sx={{ mt: 2, mb: 2, pr: 3 }}>
          <Button size="small" variant='contained' color='error' startIcon={<ClearRoundedIcon />} onClick={clear}>{t('WMSSelector.clearLayer')}</Button>
          <Button size="small" variant='contained' color='primary' startIcon={<CheckRoundedIcon />} onClick={confirm}>{t('WMSSelector.addLayer')}</Button>
        </Stack>
        <OpacitySlider opacity={opacity} onChange={handleOpacity} />
      </Box>
      {url && bounds && <ImageOverlay ref={ref} url={url} bounds={bounds} crossOrigin='anonymous' zIndex={600} opacity={opacity / 100} />}
      <AlertSlide open={openAlert} setOpen={setOpenAlert} severity='error' timeout={3000} > {alertMessage} </AlertSlide>
    </>

  )
}