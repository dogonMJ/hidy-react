import { useTranslation } from "react-i18next"
import { TileLayerCanvas } from "../../../components/TileLayerCanvas"
import { FormControl, FormControlLabel, FormLabel, Stack, Radio, RadioGroup, TextField, CircularProgress, Box, InputLabel, IconButton } from "@mui/material"
import LayersClearIcon from '@mui/icons-material/LayersClear';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import InfoButton from "components/InfoButton"
import { useState, } from "react"
import { OpacitySlider } from "../../../components/OpacitySlider"
import { getUrlQuery, checkServiceType } from "Utils/UtilsURL"
import { AlertSlide } from "components/AlertSlide/AlertSlide";
import { ServiceType } from "types"
import { useAppDispatch, useAppSelector } from "hooks/reduxHooks"
import { addWmsLayerSlice } from "store/slice/addWmsLayerSlice"
import { useAlert } from "hooks/useAlert";
import { LayerControlPanel } from "./LayerControlPanel";

//https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/BlueMarble_NextGeneration/default/GoogleMapsCompatible_Level8/{z}/{y}/{x}.jpeg
//https://gibs.earthdata.nasa.gov/wms/epsg3857/best/wms.cgi?&service=WMS&request=GetMap&layers=GHRSST_L4_AVHRR-OI_Sea_Surface_Temperature&styles=&format=image%2Fpng&transparent=true&version=1.1.1&time=2019-03-17&width=256&height=256&srs=EPSG%3A3857

const getParams = (url: string, type: ServiceType) => {
  if (type === 'WMS' && url) {
    const paramsObject = getUrlQuery(url)
    Object.assign(paramsObject.params, {
      crossOrigin: 'anonymous',
    })
    return paramsObject.params
  } else {
    return {}
  }
}

export const DirectAddLayers = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { openAlert, setOpenAlert, alertMessage, setMessage, severity, setSeverity, hideAlert } = useAlert()
  const url = useAppSelector(state => state.addWmsLayer.url).replaceAll('%26', '&') //需要以%26取代&避免讀網址時出錯
  const serviceType = useAppSelector(state => state.addWmsLayer.serviceType)
  const opacity = useAppSelector(state => state.addWmsLayer.opacity)
  const layerName = useAppSelector(state => state.addWmsLayer.layerName)
  const layerList = useAppSelector(state => state.addWmsLayer.layerList)
  const [inputUrl, setInputURL] = useState(url)
  const [inputLayerName, setInputLayerName] = useState(layerName)
  const [key, setKey] = useState(0)
  const [loading, setLoading] = useState(false)
  let layeri = layerList ? layerList.length + 1 : 1

  const handleServiceType = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(addWmsLayerSlice.actions.setServiceType(event.target.value as ServiceType))
    handleURLBlur(event.target.value as ServiceType)
  }

  const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputURL(event.target.value)
  }
  const handleURLBlur = (serviceType: ServiceType) => {
    if (checkServiceType(inputUrl) !== serviceType) {
      setSeverity('warning')
      setMessage(t('CustomLayer.alert.warnType'))
    } else {
      hideAlert()
    }
    dispatch(addWmsLayerSlice.actions.setWmsUrl(inputUrl))
    setKey(key + 1)
  }

  const handleAddLayer = () => {
    if (layerList && layerList.some(layer => layer.name === inputLayerName)) {
      setSeverity('error')
      setMessage(t('CustomLayer.alert.dupName'))
      setInputLayerName(`layer ${layeri}`)
      dispatch(addWmsLayerSlice.actions.setLayerName(`layer ${layeri}`))
      layeri += 1
    } else {
      if (url) {
        dispatch(addWmsLayerSlice.actions.setLayerList([{ name: inputLayerName, url, serviceType, opacity }, ...layerList]))
        dispatch(addWmsLayerSlice.actions.setWmsUrl(''))
        setInputURL('')
      } else {
        setSeverity('error')
        setMessage('CustomLayer.alert.noUrl')
      }
    }
  }

  const handleOpacity = (event: Event, newValue: number | number[]) => {
    dispatch(addWmsLayerSlice.actions.setWmsOpacity(newValue as number))
  };

  const handleClearLayer = () => {
    setLoading(false)
    setInputURL('')
    dispatch(addWmsLayerSlice.actions.setWmsUrl(''))
  }
  const eventHandlers = {
    load: () => setLoading(false),
    loading: () => setLoading(true)
  }

  return (
    <>
      <InputLabel>{t('CustomLayer.layerName')}</InputLabel>
      <TextField
        size="small"
        value={inputLayerName}
        onChange={(e) => setInputLayerName(e.target.value)}
        onBlur={() => dispatch(addWmsLayerSlice.actions.setLayerName(inputLayerName))}
      />
      <Stack direction="row" alignItems="center">
        <InputLabel>{t('CustomLayer.serviceUrl')}</InputLabel>
        <InfoButton dataId="serviceUrl" />
      </Stack>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <TextField
          multiline={true}
          value={inputUrl}
          onChange={handleUrlChange}
          onBlur={() => handleURLBlur(serviceType)}
          variant="outlined"
          size="small"
          sx={{
            width: '75%',
            "& label": { fontSize: 14, }
          }}
        />
        <IconButton color={'primary'} onClick={handleAddLayer}>
          <LibraryAddIcon />
        </IconButton>
        <IconButton color={'error'} onClick={handleClearLayer}>
          <LayersClearIcon />
        </IconButton>
      </Stack>
      <FormControl>
        <Stack direction="row" alignItems="center">
          <FormLabel>{t('CustomLayer.serviceType')}</FormLabel>
          <InfoButton dataId="serviceType" />
        </Stack>
        <RadioGroup
          row
          name="URL Type"
          value={serviceType}
          onChange={handleServiceType}
          sx={{ pl: 0.8 }}
        >
          <FormControlLabel value="WMS" control={<Radio />} label="WMS" />
          <FormControlLabel value="WMTS" control={<Radio />} label="WMTS" />
        </RadioGroup>
        {url && <OpacitySlider opacity={opacity} onChange={handleOpacity} />}
      </FormControl>
      {loading &&
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1, mb: 1 }}>
          <CircularProgress />
        </Box>
      }
      {layerList &&
        <LayerControlPanel layerList={layerList} setLayerList={addWmsLayerSlice.actions.setLayerList} />
      }
      {url &&
        <TileLayerCanvas
          key={key}
          type={serviceType}
          url={url}
          eventHandlers={eventHandlers}
          params={getParams(url, serviceType)}
          opacity={opacity / 100}
          zIndex={399}
        />
      }
      {layerList && [...layerList].reverse().map((layer) => {
        const decodedURL = layer.url.replaceAll('%26', '&')
        return (
          <TileLayerCanvas
            key={layer.name}
            type={layer.serviceType}
            url={decodedURL}
            eventHandlers={eventHandlers}
            params={getParams(decodedURL, layer.serviceType)}
            opacity={layer.opacity / 100}
            zIndex={200}
          />
        )
      })
      }
      <AlertSlide open={openAlert} setOpen={setOpenAlert} severity={severity}>{alertMessage}</AlertSlide>
    </>
  )
}