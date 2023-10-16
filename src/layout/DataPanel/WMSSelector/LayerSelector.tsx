import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "store/store"
import {
  FormControl, Select, MenuItem, SelectChangeEvent, Stack, TextField, InputLabel, Button, FormLabel,
  FormControlLabel, Radio, RadioGroup, Alert, CircularProgress, Box
} from "@mui/material"
import { AddWMS } from "./AddWMS";
import { AddWMTS } from "./AddWMTS";
import { useTranslation } from "react-i18next";
import InfoButton from "components/InfoButton";
import { OpacitySlider } from "components/OpacitySlider";
import { RenderIf } from "components/RenderIf/RenderIf";
import { checkServiceType } from "Utils/UtilsURL";
import { ServiceType } from "types"
import { useMap, useMapEvents } from "react-leaflet";
import { AlertSlide } from "components/AlertSlide/AlertSlide";

const defaultOptions = [
  { value: 'https://gibs.earthdata.nasa.gov/wms/epsg3857/best/wms.cgi', label: 'NASA GIBS WMS' },
];

export const LayerSelector = () => {
  const { t } = useTranslation()
  const map = useMap()
  const datetime = useSelector((state: RootState) => state.map.datetime).split('.')[0] + 'Z';
  const [selectedURL, setSelectedURL] = useState(defaultOptions[0].value);
  const [urlOptions, setUrlOptions] = useState(defaultOptions)
  const [urlInput, setUrlInput] = useState('');
  const [layerKeyword, setLayerKeyword] = useState('*');
  const [selectedLayer, setSelectedLayer] = useState('');
  const [layers, setLayers] = useState([''])
  const [serviceType, setServiceType] = useState<ServiceType>('WMS')
  const [showAlert, setShowAlert] = useState({ show: false, message: '' })
  const [dupOption, setDupOption] = useState(false)
  const [layerProps, setLayerProps] = useState({})
  const [showLayer, setShowLayer] = useState(false)
  const [opacity, setOpacity] = useState(100)
  const [loadingLayers, setLoadingLayers] = useState(false)
  const [matrixSetLevel, setMatrixSetLevel] = useState(25)
  const [openZoomAlert, setOpenZoomAlert] = useState(false)

  useMapEvents({
    'zoomend': () => {
      setOpenZoomAlert((map.getZoom() > matrixSetLevel) ? true : false)
    },
  })

  const handleSelectLayer = async (event: SelectChangeEvent) => {
    setLoadingLayers(true)
    await setSelectedLayer(event.target.value as string);
    const query = new URLSearchParams({
      url: selectedURL,
      type: serviceType,
      layer: event.target.value
    })
    await fetch('https://api.odb.ntu.edu.tw/ogcquery/capability?' + query)
      .then(res => res.json())
      .then(json => {
        const capability = json.capability[0]
        if (capability.TileMatrixSet) {
          const matrixSet = Number(capability.TileMatrixSet.slice(-1))
          const level = isNaN(matrixSet) ? 25 : matrixSet
          setMatrixSetLevel(level)
          setOpenZoomAlert((map.getZoom() > level) ? true : false)
        }
        if (serviceType === 'WMTS') {
          setLayerProps({
            url: selectedURL,
            layer: event.target.value,
            TileMatrixSet: capability.TileMatrixSet,
            template: capability.template[0],
            format: capability.format[0],
            style: capability.default ? capability.default : capability.example,
            time: datetime
          })
        } else {
          setLayerProps({
            url: selectedURL,
            layer: event.target.value,
            service: serviceType,
            time: datetime
          })
        }
        setShowLayer(true)
      })
      .then(() => setLoadingLayers(false))
  };
  const handleOpacity = (event: Event, newValue: number | number[]) => {
    setOpacity(newValue as number);
  };

  // const checkServiceType = (selected: any) => {
  //   const patternWMTS = new RegExp(/wmts/i)
  //   patternWMTS.test(selected) ? setServiceType('WMTS') : setServiceType('WMS')
  // }

  const handleSelectUrlOption = (event: any) => {
    const selected = event.target.value
    setServiceType(checkServiceType(selected))
    setLayers([])
    setSelectedLayer('')
    setShowLayer(false)
    setSelectedURL(selected);
  };

  const handleAddOption = () => {
    const url = urlInput.split('?')[0].replaceAll(/\s/ig, '')
    const duplicate = urlOptions.filter(option => option.value === url).length > 0 ? true : false
    setDupOption(duplicate)
    if (url.length > 0 && !duplicate) {
      setUrlOptions([{ value: url, label: url }, ...urlOptions])
      setSelectedURL(url)
      setServiceType(checkServiceType(url))
      setUrlInput('')
      setLayers([''])
    }
  }
  const handleServiceType = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleClearLayer()
    setLayers([])
    setServiceType(event.target.value as ServiceType)
  }

  const handleSearch = () => {
    const query = new URLSearchParams({
      url: selectedURL,
      type: serviceType,
      layer: layerKeyword
    })
    setShowAlert({ show: false, message: '' })
    setSelectedLayer('')
    setLayers([])
    setLoadingLayers(true)

    fetch('https://api.odb.ntu.edu.tw/ogcquery/capability?' + query)
      .then(res => res.json())
      .then(json => {
        if (json.statusCode) {
          setShowAlert({ show: true, message: t('WMSSelector.alert.inputError') })
        } else {
          if (json.layers && json.layers <= 0) {
            setShowAlert({ show: true, message: t('WMSSelector.alert.noLayer') })
          } else {
            setLayers(json.layers)
            setShowAlert({ show: false, message: t('WMSSelector.alert.error') })
          }
        }
      })
      .then(() => setLoadingLayers(false))
      .catch(e => {
        setLoadingLayers(false)
        setShowAlert({ show: true, message: 'Please check options or contact ODB' })
      })
  }

  const handleClearLayer = () => {
    setShowLayer(false)
    setSelectedLayer('')
    setLoadingLayers(false)
    setMatrixSetLevel(25)
    setOpenZoomAlert(false)
  }

  const eventHandlers = {
    // tileerror: (e: any) => console.log('ppppp', e),
    // error: () => console.log('error'),
    load: () => setLoadingLayers(false),
    loading: () => setLoadingLayers(true)
  }
  return (
    <>
      <Stack>
        <Stack direction="row" alignItems="center">
          <InputLabel sx={{ mt: 0.4 }}>{t('WMSSelector.addUrlOption')}</InputLabel>
          <InfoButton dataId="addUrlOption" />
        </Stack>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <TextField
            multiline={true}
            variant="outlined"
            size="small"
            label={t('WMSSelector.serverUrl')}
            value={urlInput}
            onChange={(event) => setUrlInput(event.target.value)}
            sx={{
              width: '75%',
              "& label": { fontSize: 14, }
            }}
          />
          <Button variant="contained" onClick={handleAddOption}>{t('WMSSelector.add')}</Button>
        </Stack>
        <RenderIf isTrue={dupOption}>
          <Alert severity="warning">{t('WMSSelector.alert.dupOption')}</Alert>
        </RenderIf>

        <Stack direction="row" alignItems="center">
          <InputLabel sx={{ mt: 0.4 }}>{t('WMSSelector.selectUrl')}</InputLabel>
          <InfoButton dataId="selectUrl" />
        </Stack>
        <Select
          value={selectedURL}
          onChange={handleSelectUrlOption}
          size="small"
          sx={{ maxWidth: 344 }}
        >
          {urlOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>

        <br />

        <FormControl>
          <Stack direction="row" alignItems="center">
            <FormLabel>{t('WMSSelector.serviceType')}</FormLabel>
            <InfoButton dataId="serviceType" />
          </Stack>
          <RadioGroup
            row
            name="Service Type"
            value={serviceType}
            onChange={handleServiceType}
          >
            <FormControlLabel value="WMS" control={<Radio />} label="WMS" />
            <FormControlLabel value="WMTS" control={<Radio />} label="WMTS" />
          </RadioGroup>
        </FormControl>

        <Stack direction="row" alignItems="center" sx={{ mb: 1 }}>
          <InputLabel sx={{ mt: 0.4 }}>{t('WMSSelector.layerKeyword')}</InputLabel>
          <InfoButton dataId="layerKeyword" />
        </Stack>
        <TextField
          label={t('WMSSelector.keyword')}
          value={layerKeyword}
          onChange={(event) => setLayerKeyword(event.target.value)}
          variant="outlined"
          size="small"
        />

        <br />
        <RenderIf isTrue={showAlert.show}>
          <Alert severity="error">{showAlert.message}</Alert>
        </RenderIf>
        <Button variant="contained" onClick={handleSearch}>{t('WMSSelector.search')}</Button>

        <br />
        <RenderIf isTrue={loadingLayers}>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <CircularProgress />
          </Box>
        </RenderIf>
        {(layers && layers.length >= 1 && layers[0] !== '') &&
          <>
            <InputLabel sx={{ marginBottom: 1 }}>{t('WMSSelector.selectLayer')}</InputLabel>
            <Select
              value={selectedLayer}
              label="Layers"
              onChange={handleSelectLayer}
              size="small"
              sx={{ maxWidth: 344 }}
            >
              {layers.map((layer) =>
                <MenuItem key={layer} value={layer}>
                  {layer}
                </MenuItem>
              )}
            </Select>

            <br />

            <OpacitySlider opacity={opacity} onChange={handleOpacity} />

            <br />
            {showLayer && <Button variant="contained" color={'error'} onClick={handleClearLayer}>{t('WMSSelector.clearLayer')}</Button>}
          </>
        }

        {(showLayer && serviceType === 'WMS') && <AddWMS params={layerProps} opacity={opacity} eventHandlers={eventHandlers} />}
        {(showLayer && serviceType === 'WMTS') && <AddWMTS params={layerProps} opacity={opacity} eventHandlers={eventHandlers} />}
      </Stack>
      <AlertSlide open={openZoomAlert} setOpen={setOpenZoomAlert} severity='warning' > {t('WMSSelector.alert.zoomLevel')} </AlertSlide>
    </>
  )
}