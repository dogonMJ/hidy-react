import { useTranslation } from "react-i18next"
import { TileLayerCanvas } from "../../../components/TileLayerCanvas"
import { FormControl, FormControlLabel, FormLabel, Stack, Radio, RadioGroup, TextField, CircularProgress, Box, InputLabel, Typography, IconButton, Button, Popover } from "@mui/material"
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
  const url = useAppSelector(state => state.addWmsLayer.url).replaceAll('%26', '&')
  const serviceType = useAppSelector(state => state.addWmsLayer.serviceType)
  const opacity = useAppSelector(state => state.addWmsLayer.opacity)
  const layerName = useAppSelector(state => state.addWmsLayer.layerName)
  const layerList = useAppSelector(state => state.addWmsLayer.layerList)
  const [inputUrl, setInputURL] = useState(url)
  const [inputLayerName, setInputLayerName] = useState(layerName)
  const [key, setKey] = useState(0)
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
  const [selectedLayer, setSelectedLayer] = useState<string | null>(null)
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
      setInputLayerName(`layer${layeri}`)
      dispatch(addWmsLayerSlice.actions.setLayerName(`layer${layeri}`))
      layeri += 1
    } else {
      if (url) {
        if (serviceType === 'WMS') {
          dispatch(addWmsLayerSlice.actions.setLayerList([{ name: inputLayerName, base: url, serviceType, opacity }, ...layerList]))
        } else {
          dispatch(addWmsLayerSlice.actions.setLayerList([{ name: inputLayerName, base: url, serviceType, opacity }, ...layerList]))
        }
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
  const handlePopover = (event: React.MouseEvent<HTMLButtonElement>, layerName: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedLayer(layerName);
  };
  const handleClosePopover = () => {
    setAnchorEl(null);
    setSelectedLayer(null);
  };
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
      {layerList && layerList.map((layer, index) => {
        const layerIndex = layerList.findIndex(item => item.name === layer.name);
        return (
          <Box key={layer.name} sx={{ border: 1, padding: 1, borderRadius: 1, borderColor: '#C0C0C0' }}>
            <Button
              size="small"
              sx={{ maxWidth: '100%', textTransform: 'none', justifyContent: 'flex-start' }}
              onClick={(event) => handlePopover(event, layer.name)}
            >
              <Typography sx={{ maxWidth: '100%', wordWrap: 'break-word', textAlign: 'left' }}>{layer.name}</Typography>
            </Button>
            <Popover
              open={selectedLayer === layer.name && Boolean(anchorEl)}
              anchorEl={anchorEl}
              onClose={handleClosePopover}
              anchorOrigin={{ vertical: 'top', horizontal: 'left', }}
              transformOrigin={{ vertical: 'bottom', horizontal: 'left', }}
              sx={{ maxWidth: '60%' }}
            >
              <Typography sx={{ p: 2, wordWrap: 'break-word' }}>{layer.base}</Typography>
            </Popover>
            <Stack direction={'row'}>
              <IconButton
                color={'error'}
                onClick={() => dispatch(addWmsLayerSlice.actions.setLayerList(layerList.filter((_, i) => i !== index)))}
              >
                <LayersClearIcon />
              </IconButton>
              <OpacitySlider
                opacity={layer.opacity}
                onChange={(e, value) => {
                  const updatedLayerList = [...layerList];
                  updatedLayerList[layerIndex] = { ...updatedLayerList[layerIndex], opacity: value as number };
                  dispatch(addWmsLayerSlice.actions.setLayerList(updatedLayerList))
                }}
                componentSx={{ width: '80%' }}
                sx={{ width: '56%' }}
              />
            </Stack>
          </Box>
        )
      })
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
        const decodedURL = layer.base.replaceAll('%26', '&')
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