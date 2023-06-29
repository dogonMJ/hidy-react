import { useTranslation } from "react-i18next"
import { useMap, useMapEvents } from "react-leaflet"
import { TileLayerCanvas } from "../../../components/TileLayerCanvas"
import { FormControl, FormControlLabel, FormLabel, Stack, Radio, RadioGroup, TextField, Button, CircularProgress, Box } from "@mui/material"
import InfoButton from "components/InfoButton"
import { useEffect, useState, useRef } from "react"
import { OpacitySlider } from "../../../components/OpacitySlider"
import { getUrlQuery, checkServiceType } from "Utils/UtilsURL"
import { AlertSlide } from "components/AlertSlide/AlertSlide";
import { ServiceType } from "types"

//https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/BlueMarble_NextGeneration/default/GoogleMapsCompatible_Level8/{z}/{y}/{x}.jpeg
//https://gibs.earthdata.nasa.gov/wms/epsg3857/best/wms.cgi?&service=WMS&request=GetMap&layers=GHRSST_L4_AVHRR-OI_Sea_Surface_Temperature&styles=&format=image%2Fpng&transparent=true&version=1.1.1&time=2019-03-17&width=256&height=256&srs=EPSG%3A3857

interface Params {
  base: string
  params: { [key: string]: any }
}

export const DirectAddLayers = () => {
  const { t } = useTranslation()
  const map = useMap()
  const ref = useRef<any>(null)
  const [serviceType, setServiceType] = useState<ServiceType>('WMTS')
  const [url, setUrl] = useState<string>('')
  const [key, setKey] = useState<string>()
  const [showLayer, setShowLayer] = useState<string | null>(null)
  const [opacity, setOpacity] = useState(100)
  const [loading, setLoading] = useState(false)
  const [params, setParams] = useState<Params>({ base: '', params: {} })
  const [openZoomAlert, setOpenZoomAlert] = useState(false)
  const [zoomLevel, setZoomLevel] = useState('')

  useMapEvents({
    'zoomend': () => {
      if (showLayer) {
        setOpenZoomAlert(true)
        setZoomLevel(map.getZoom().toString())
        setTimeout(() => setOpenZoomAlert(false), 3000)
      }
    },
  })

  const handleServiceType = (event: React.ChangeEvent<HTMLInputElement>) => {
    setShowLayer(null)
    setServiceType(event.target.value as ServiceType)
  }

  const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const url = event.target.value
    setServiceType(checkServiceType(url))
    // setShowLayer(null)
    setUrl(url)
  }

  const handleAddLayer = () => {
    if (serviceType === 'WMS') {
      const paramsObject = getUrlQuery(url)
      Object.assign(paramsObject.params, {
        crossOrigin: 'anonymous',
        uppercase: true,
      })
      setParams(paramsObject)
    } else {
      setParams({ base: url, params: {} })
    }
    setKey(new Date().toTimeString())
    setShowLayer(serviceType)
  }

  const handleOpacity = (event: Event, newValue: number | number[]) => {
    setOpacity(newValue as number);
  };

  const handleClearLayer = () => {
    setShowLayer(null)
    setOpenZoomAlert(false)
    setZoomLevel('')
  }

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
          value={serviceType}
          onChange={handleServiceType}
        >
          <FormControlLabel value="WMS" control={<Radio />} label="WMS" />
          <FormControlLabel value="WMTS" control={<Radio />} label="WMTS" />
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
          <Button variant="contained" color={'error'} onClick={handleClearLayer}>{t('WMSSelector.clearLayer')}</Button>
        </>
      }
      {showLayer &&
        <TileLayerCanvas
          type={showLayer}
          ref={ref}
          key={key}
          url={params.base}
          eventHandlers={eventHandlers}
          params={params.params}
        />
      }
      <AlertSlide open={openZoomAlert} setOpen={setOpenZoomAlert} severity='info' > {`TileMatrix (Zoom Level): ${zoomLevel}`} </AlertSlide>
    </>
  )
}