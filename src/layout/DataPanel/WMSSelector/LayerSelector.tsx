import { useMemo, useState } from "react";
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
import { AlertSlide } from "components/AlertSlide/AlertSlide";
import { useAlert } from "hooks/useAlert";
import { useAppDispatch, useAppSelector } from "hooks/reduxHooks";
import { wmsSelectorSlice } from "store/slice/wmsSelectorSlice";

interface Capabilities {
  capability: any
  layers: string[]
  service: any
}

export const LayerSelector = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()

  const datetime = useAppSelector(state => state.map.datetime).split('.')[0] + 'Z';
  const queryOptions = useAppSelector(state => state.wmsSelector.urlOptions)

  const urlOptions = useMemo(() => {
    const defaultOptions = [
      { value: 'https://wmts.nlsc.gov.tw/wmts', label: t('WMSSelector.nlsc') },
      { value: 'https://data.csrsr.ncu.edu.tw/SP/wmts', label: t('WMSSelector.csrsr1') },
      { value: 'https://data.csrsr.ncu.edu.tw/SP_TW_FC/wmts', label: t('WMSSelector.csrsr2') },
      { value: 'https://data.csrsr.ncu.edu.tw/SP_PH/wmts', label: t('WMSSelector.csrsr3') },
      { value: 'https://data.csrsr.ncu.edu.tw/SP_PH_FC/wmts', label: t('WMSSelector.csrsr4') },
      { value: 'https://gibs.earthdata.nasa.gov/wms/epsg3857/best/wms.cgi', label: 'NASA GIBS WMS' },
    ]
    const allOptions = [...queryOptions, ...defaultOptions]
    return Array.from(new Set(allOptions.map(item => item.value)))
      .map(value => {
        const matchingItems = allOptions.filter(item => item.value === value);
        return matchingItems.length > 1 ? matchingItems[1] : matchingItems[0]; // 用matchingItems[1]語言切換才會成功
      });
  }, [t, queryOptions])

  const defaultURL = useAppSelector(state => state.wmsSelector.selectedUrl)
  const selectedURL = defaultURL === '' ? urlOptions[0].value : defaultURL
  const serviceType = useAppSelector(state => state.wmsSelector.serviceType)


  const [urlInput, setUrlInput] = useState('');
  const [layerKeyword, setLayerKeyword] = useState('*');
  const [selectedLayer, setSelectedLayer] = useState('');
  const [layers, setLayers] = useState([''])
  // const [serviceType, setServiceType] = useState<ServiceType>('WMS')
  const [dupOption, setDupOption] = useState(false)
  const [layerProps, setLayerProps] = useState({})
  const [showLayer, setShowLayer] = useState(false)
  const [opacity, setOpacity] = useState(100)
  const [loadingLayers, setLoadingLayers] = useState(false)
  const [capabilities, setCapabilities] = useState<Capabilities>()
  const [globalController, setGlobalController] = useState<any>()
  const { openAlert, setOpenAlert, alertMessage, setMessage } = useAlert()

  const handleSelectLayer = async (event: SelectChangeEvent) => {
    setSelectedLayer(event.target.value as string);
    if (capabilities) {
      const capability = capabilities.capability.find((obj: any) => obj.name === event.target.value)
      if (serviceType === 'WMTS') {
        setLayerProps({
          url: selectedURL,
          layer: event.target.value,
          TileMatrixSet: capability.TileMatrixSet,
          template: capability.template[0],
          format: capability.format[0],
          style: capability.style ? capability.style.default : '',
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
    }

  };
  const handleOpacity = (event: Event, newValue: number | number[]) => {
    setOpacity(newValue as number);
  };

  const handleSelectUrlOption = (event: any) => {
    const selected = event.target.value
    if (globalController) {
      globalController.abort();
    }
    // setServiceType(checkServiceType(selected))
    dispatch(wmsSelectorSlice.actions.setServiceType(checkServiceType(selected)))
    setLayers([])
    setSelectedLayer('')
    setShowLayer(false)
    // setSelectedURL(selected);
    dispatch(wmsSelectorSlice.actions.setSelectedUrl(selected))
  };

  const handleAddOption = () => {
    const url = urlInput.split('?')[0].replaceAll(/\s/ig, '')
    const duplicate = urlOptions.filter(option => option.value === url).length > 0 ? true : false
    setDupOption(duplicate)
    if (url.length > 0 && !duplicate) {
      // setUrlOptions([{ value: url, label: url }, ...urlOptions])
      dispatch(wmsSelectorSlice.actions.setUrlOptions([{ value: url, label: url }, ...urlOptions]))
      // setSelectedURL(url)
      dispatch(wmsSelectorSlice.actions.setSelectedUrl(url))
      // setServiceType(checkServiceType(url))
      dispatch(wmsSelectorSlice.actions.setServiceType(checkServiceType(url)))
      setUrlInput('')
      setLayers([])
      handleClearLayer()
    }
  }
  const handleServiceType = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleClearLayer()
    setLayers([])
    // setServiceType(event.target.value as ServiceType)
    dispatch(wmsSelectorSlice.actions.setServiceType(event.target.value as ServiceType))
  }

  const handleSearch = () => {
    if (globalController) {
      globalController.abort()
      setGlobalController(undefined)
    }
    const controller = new AbortController()
    setGlobalController(controller)
    const signal = controller.signal;
    const query = new URLSearchParams({
      url: selectedURL,
      type: serviceType,
      layer: layerKeyword
    })
    setSelectedLayer('')
    setLayers([])
    setLoadingLayers(true)

    fetch('https://api.odb.ntu.edu.tw/ogcquery/capability?' + query, { signal })
      .then(res => res.json())
      .then(json => {
        if (json.statusCode) {
          setMessage(t('WMSSelector.alert.inputError'))
        } else {
          if (json.layers && json.layers <= 0) {
            setMessage(t('WMSSelector.alert.noLayer'))
          } else {
            setCapabilities(json)
            setLayers(json.layers)
          }
        }
      })
      .then(() => setLoadingLayers(false))
      .catch(e => {
        setLoadingLayers(false)
        setMessage(t('WMSSelector.alert.error'))
      })
  }

  const handleClearLayer = () => {
    setShowLayer(false)
    setSelectedLayer('')
    setLoadingLayers(false)
  }

  const eventHandlers = {
    load: () => setLoadingLayers(false),
    loading: () => setLoadingLayers(true),
  }

  // useEffect(() => {
  //   const defaultUrls = defaultOptions.map(option => option.value)
  //   const newAdded = urlOptions.filter(option => !defaultUrls.includes(option.value))
  //   setUrlOptions([...newAdded, ...defaultOptions])
  // }, [t])

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

        <Button variant="contained" onClick={handleSearch} disabled={loadingLayers}>{t('WMSSelector.search')}</Button>

        <br />
        <RenderIf isTrue={loadingLayers}>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <CircularProgress />
          </Box>
        </RenderIf>
        {(layers && layers.length >= 1 && layers[0] !== '') &&
          <>
            <FormControl size="small" sx={{ marginTop: 1 }}>
              <InputLabel id='layers-label'>{t('WMSSelector.selectLayer')}</InputLabel>
              <Select
                labelId="layers-label"
                label={t('WMSSelector.selectLayer')}
                value={selectedLayer}
                onChange={handleSelectLayer}
                sx={{ maxWidth: 344 }}
              >
                {layers.map((layer) =>
                  <MenuItem key={layer} value={layer}>
                    {layer}
                  </MenuItem>
                )}
              </Select>
            </FormControl>
            <br />

            <OpacitySlider opacity={opacity} onChange={handleOpacity} />

            <br />
            {showLayer && <Button variant="contained" color={'error'} onClick={handleClearLayer}>{t('WMSSelector.clearLayer')}</Button>}
          </>
        }
        {(showLayer && serviceType === 'WMS') && <AddWMS params={layerProps} opacity={opacity} eventHandlers={eventHandlers} />}
        {(showLayer && serviceType === 'WMTS') && <AddWMTS params={layerProps} opacity={opacity} eventHandlers={eventHandlers} />}
      </Stack>
      <AlertSlide open={openAlert} setOpen={setOpenAlert} severity='error' timeout={3000} > {alertMessage} </AlertSlide>
    </>
  )
}