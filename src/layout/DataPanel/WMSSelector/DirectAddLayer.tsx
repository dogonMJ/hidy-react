import { useTranslation } from "react-i18next"
import { TileLayer } from "react-leaflet"
import { TileLayerCanvas } from "../../../components/TileLayerCanvas"
import { FormControl, FormControlLabel, FormLabel, Stack, Radio, RadioGroup, TextField, Button, CircularProgress, Box } from "@mui/material"
import InfoButton from "components/InfoButton"
import { useEffect, useState, useRef } from "react"
import { OpacitySlider } from "../../../components/OpacitySlider"
//https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/BlueMarble_NextGeneration/default/GoogleMapsCompatible_Level8/{z}/{y}/{x}.jpeg
//https://gibs.earthdata.nasa.gov/wms/epsg3857/best/wms.cgi?&service=WMS&request=GetMap&layers=GHRSST_L4_AVHRR-OI_Sea_Surface_Temperature&styles=&format=image%2Fpng&transparent=true&version=1.1.1&time=2019-03-17&width=256&height=256&srs=EPSG%3A3857
export const DirectAddLayers = () => {
  const { t } = useTranslation()
  const ref = useRef<any>(null)
  const [urlType, setUrlType] = useState('REST')
  const [url, setUrl] = useState<string>('')
  const [key, setKey] = useState<string>()
  const [showLayer, setShowLayer] = useState<string | null>(null)
  const [opacity, setOpacity] = useState(100)
  const [loading, setLoading] = useState(false)

  const handleUrlType = (event: React.ChangeEvent<HTMLInputElement>) => {
    setShowLayer(null)
    setUrlType(event.target.value)
  }

  const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    value.includes('?') ? setUrlType('KVP') : setUrlType('REST')
    setShowLayer(null)
    setUrl(value)
  }

  const handleAddLayer = () => {
    setKey(new Date().toTimeString())
    setShowLayer(urlType)
  }

  const handleOpacity = (event: Event, newValue: number | number[]) => {
    setOpacity(newValue as number);
  };

  const eventHandlers = {
    // tileerror: (e: any) => console.log('ppppp', e),
    error: () => console.log('error'),
    load: () => setLoading(false),
    loading: () => setLoading(true)
  }

  useEffect(() => {
    if (ref.current) {
      ref.current.setOpacity(opacity / 100)
    }
  })
  return (
    <>
      <FormControl>
        <Stack direction="row" alignItems="center">
          <FormLabel>{t('WMSSelector.urlType')}</FormLabel>
          <InfoButton dataId="urlType" />
        </Stack>
        <RadioGroup
          row
          name="URL Type"
          value={urlType}
          onChange={handleUrlType}
        >
          <FormControlLabel value="REST" control={<Radio />} label="RESTful" />
          <FormControlLabel value="KVP" control={<Radio />} label="KVP (Key-Value Pair)" />
        </RadioGroup>
      </FormControl>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <TextField
          multiline={true}
          label={t('WMSSelector.serverUrl')}
          value={url}
          onChange={handleUrlChange}
          variant="outlined"
          size="small"
          sx={{
            width: '75%',
            "& label": { fontSize: 14, }
          }}
        />
        <Button variant="contained" onClick={handleAddLayer}>{t('WMSSelector.add')}</Button>
      </Stack>
      {loading &&
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1, mb: 1 }}>
          <CircularProgress />
        </Box>
      }
      {!loading && showLayer &&
        <>
          <br />
          <OpacitySlider opacity={opacity} onChange={handleOpacity} />
          <br />
          <Button variant="contained" color={'error'} onClick={() => setShowLayer(null)}>{t('WMSSelector.clearLayer')}</Button>
        </>
      }
      {showLayer === 'REST' &&
        <TileLayer
          ref={ref}
          key={key}
          url={url}
          eventHandlers={eventHandlers}
          crossOrigin='anonymous'
        />}
      {showLayer === 'KVP' &&
        <TileLayerCanvas
          ref={ref}
          key={key}
          url={url}
          eventHandlers={eventHandlers}
          params={{
            crossOrigin: 'anonymous',
            uppercase: true,
          }}
        />
      }
    </>
  )
}