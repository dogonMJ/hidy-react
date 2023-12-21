import { useEffect, useMemo, useState } from "react";
import {
  FormControl, Select, MenuItem, Stack, TextField, InputLabel, Button, FormLabel,
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
import { layerSelectorSlice } from "store/slice/layerSelectorSlice";

interface Capabilities {
  capability: any
  layers: string[]
  service: any
}

export const LayerSelector = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { openAlert, setOpenAlert, alertMessage, setMessage } = useAlert()
  const [urlInput, setUrlInput] = useState('');
  const [layers, setLayers] = useState([''])
  const [dupOption, setDupOption] = useState(false)
  const [layerProps, setLayerProps] = useState({})
  const [loadingLayers, setLoadingLayers] = useState(false)
  const [capabilities, setCapabilities] = useState<Capabilities>()
  const [globalController, setGlobalController] = useState<any>()
  const [addedOptions, setAddedOptions] = useState<{ value: string, label: string }[]>([])

  const datetime = useAppSelector(state => state.map.datetime).split('.')[0] + 'Z';
  const queryURL = useAppSelector(state => state.layerSelector.selectedUrl)
  const serviceType = useAppSelector(state => state.layerSelector.serviceType)
  const keyword = useAppSelector(state => state.layerSelector.keyword)
  const showLayer = useAppSelector(state => state.layerSelector.showLayer)
  const selectedLayer = useAppSelector(state => state.layerSelector.selectedLayer)
  const opacity = useAppSelector(state => state.layerSelector.opacity)
  const urlOptions = useMemo(() => {
    const defaultOptions = [
      { value: 'https://wmts.nlsc.gov.tw/wmts', label: t('CustomLayer.nlsc') },
      { value: 'https://data.csrsr.ncu.edu.tw/SP/wmts', label: t('CustomLayer.csrsr1') },
      { value: 'https://data.csrsr.ncu.edu.tw/SP_TW_FC/wmts', label: t('CustomLayer.csrsr2') },
      { value: 'https://data.csrsr.ncu.edu.tw/SP_PH/wmts', label: t('CustomLayer.csrsr3') },
      { value: 'https://data.csrsr.ncu.edu.tw/SP_PH_FC/wmts', label: t('CustomLayer.csrsr4') },
      { value: 'https://gibs.earthdata.nasa.gov/wms/epsg3857/best/wms.cgi', label: 'NASA GIBS WMS' },
    ]
    const allOptions = [...addedOptions, ...defaultOptions]
    if (queryURL && queryURL !== '' && allOptions.filter(item => item.value === queryURL).length === 0) {
      allOptions.unshift({ value: queryURL, label: queryURL })
    }
    return Array.from(new Set(allOptions.map(item => item.value)))
      .map(value => {
        const matchingItems = allOptions.filter(item => item.value === value);
        return matchingItems.length > 1 ? matchingItems[1] : matchingItems[0]; // 用matchingItems[1]語言切換才會成功
      });
  }, [t, queryURL, addedOptions])
  const selectedURL = queryURL === '' ? urlOptions[0].value : queryURL

  const eventHandlers = {
    load: () => setLoadingLayers(false),
    loading: () => setLoadingLayers(true),
  }

  const handleClearLayer = () => {
    dispatch(layerSelectorSlice.actions.setShowLayer(false))
    dispatch(layerSelectorSlice.actions.setSelectedLayer(''))
    setLoadingLayers(false)
  }

  const handleOpacity = (event: Event, newValue: number | number[]) => {
    dispatch(layerSelectorSlice.actions.setOpacity(newValue as number))
  };

  const handleAddOption = () => {
    const url = urlInput.split('?')[0].replaceAll(/\s/ig, '')
    const duplicate = urlOptions.filter(option => option.value === url).length > 0 ?? false
    setDupOption(duplicate)
    if (url.length > 0 && !duplicate) {
      // dispatch(layerSelectorSlice.actions.setUrlOptions([{ value: url, label: url }, ...urlOptions]))
      setAddedOptions([{ value: url, label: url }, ...urlOptions])
      dispatch(layerSelectorSlice.actions.setSelectedUrl(url))
      dispatch(layerSelectorSlice.actions.setServiceType(checkServiceType(url)))
      setUrlInput('')
      setLayers([])
      handleClearLayer()
    }
  }

  const handleSelectUrlOption = (event: any) => {
    const selected = event.target.value
    if (globalController) {
      globalController.abort();
    }
    dispatch(layerSelectorSlice.actions.setServiceType(checkServiceType(selected)))
    setLayers([])
    dispatch(layerSelectorSlice.actions.setSelectedLayer(''))
    dispatch(layerSelectorSlice.actions.setShowLayer(false))
    dispatch(layerSelectorSlice.actions.setSelectedUrl(selected))
  };

  const handleServiceType = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleClearLayer()
    setLayers([])
    dispatch(layerSelectorSlice.actions.setServiceType(event.target.value as ServiceType))
  }

  const handleSearch = async () => {
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
      layer: keyword
    })
    dispatch(layerSelectorSlice.actions.setSelectedLayer(''))
    setLayers([])
    setLoadingLayers(true)

    try {
      const response = await fetch('https://api.odb.ntu.edu.tw/ogcquery/capability?' + query, { signal })
      const json = await response.json()
      setLoadingLayers(false)
      if (json.statusCode) {
        setMessage(t('CustomLayer.alert.inputError'))
      } else {
        if (json.layers && json.layers <= 0) {
          setMessage(t('CustomLayer.alert.noLayer'))
        } else {
          setCapabilities(json)
          setLayers(json.layers)
          return json
        }
      }
      return null
    } catch (e) {
      setLoadingLayers(false)
      setMessage(t('CustomLayer.alert.error'))
      return null
    }
  }

  const handleSelectLayer = async (value: string, capabilities: Capabilities) => {
    if (capabilities && capabilities.layers.includes(value)) {
      dispatch(layerSelectorSlice.actions.setSelectedLayer(value))
      const capability = capabilities.capability.find((obj: any) => obj.name === value)
      if (serviceType === 'WMTS') {
        setLayerProps({
          url: selectedURL,
          layer: value,
          TileMatrixSet: capability.TileMatrixSet,
          template: capability.template[0],
          format: capability.format[0],
          style: capability.style ? capability.style.default : '',
          time: datetime
        })
      } else {
        setLayerProps({
          url: selectedURL,
          layer: value,
          service: serviceType,
          time: datetime
        })
      }
      dispatch(layerSelectorSlice.actions.setShowLayer(true))
    } else if (!capabilities) {
      setMessage('empty capabilities, wrong type or wrong URL')
    } else if (!capabilities.layers.includes(value)) {
      setMessage('incorrect layer name')
    }
  };

  useEffect(() => {
    if (showLayer) {
      const fetchUrlQuery = async () => {
        const caps = await handleSearch()
        await handleSelectLayer(selectedLayer, caps)
      }
      fetchUrlQuery()
    }
  }, [])

  return (
    <>
      <Stack>
        <Stack direction="row" alignItems="center">
          <InputLabel sx={{ mt: 0.4 }}>{t('CustomLayer.addUrlOption')}</InputLabel>
          <InfoButton dataId="addUrlOption" />
        </Stack>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <TextField
            multiline={true}
            variant="outlined"
            size="small"
            label={t('CustomLayer.serverUrl')}
            value={urlInput}
            onChange={(event) => setUrlInput(event.target.value)}
            sx={{
              width: '75%',
              "& label": { fontSize: 14, }
            }}
          />
          <Button variant="contained" onClick={handleAddOption}>{t('CustomLayer.add')}</Button>
        </Stack>
        <RenderIf isTrue={dupOption}>
          <Alert severity="warning">{t('CustomLayer.alert.dupOption')}</Alert>
        </RenderIf>

        <Stack direction="row" alignItems="center">
          <InputLabel sx={{ mt: 0.4 }}>{t('CustomLayer.selectUrl')}</InputLabel>
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
            <FormLabel>{t('CustomLayer.serviceType')}</FormLabel>
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
          <InputLabel sx={{ mt: 0.4 }}>{t('CustomLayer.layerKeyword')}</InputLabel>
          <InfoButton dataId="layerKeyword" />
        </Stack>
        <TextField
          label={t('CustomLayer.keyword')}
          value={keyword}
          onChange={(event) => dispatch(layerSelectorSlice.actions.setKeyword(event.target.value))}
          variant="outlined"
          size="small"
        />

        <br />

        <Button variant="contained" onClick={handleSearch} disabled={loadingLayers} sx={{ mt: 1, mb: 1 }}>{t('CustomLayer.search')}</Button>

        <br />
        <RenderIf isTrue={loadingLayers}>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <CircularProgress />
          </Box>
        </RenderIf>
        {(layers && layers.length >= 1 && layers[0] !== '') &&
          <>
            <FormControl size="small" sx={{ marginTop: 1 }}>
              <InputLabel id='layers-label'>{t('CustomLayer.selectLayer')}</InputLabel>
              <Select
                labelId="layers-label"
                label={t('CustomLayer.selectLayer')}
                value={selectedLayer}
                onChange={(e) => {
                  if (capabilities) { handleSelectLayer(e.target.value, capabilities) }
                }
                }
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
            {showLayer && <Button variant="contained" color={'error'} onClick={handleClearLayer}>{t('CustomLayer.clearLayer')}</Button>}
          </>
        }
        {(showLayer && Object.keys(layerProps).length > 0 && serviceType === 'WMS') && <AddWMS params={layerProps} opacity={opacity} eventHandlers={eventHandlers} />}
        {(showLayer && Object.keys(layerProps).length > 0 && serviceType === 'WMTS') && <AddWMTS params={layerProps} opacity={opacity} eventHandlers={eventHandlers} />}
      </Stack>
      <AlertSlide open={openAlert} setOpen={setOpenAlert} severity='error' timeout={3000} > {alertMessage} </AlertSlide>
    </>
  )
}