import { SyntheticEvent, useCallback, useEffect, useMemo, useRef } from "react"
import { GeoJSON } from "react-leaflet"
import { LatLng } from "leaflet"
import { renderToString } from 'react-dom/server';
import { useAppDispatch, useAppSelector } from 'hooks/reduxHooks';
import { Box, Checkbox, FormControlLabel, Typography, Grid, Divider } from '@mui/material'
import { useTranslation } from "react-i18next";
import FormatCoordinate from "components/FormatCoordinate";
import { AlertSlide } from 'components/AlertSlide/AlertSlide';
import * as geojson from 'geojson';
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
//@ts-ignore
import MarkerCluster from '@changey/react-leaflet-markercluster'
import { useAlert } from 'hooks/useAlert';
import { odbChemSlice } from 'store/slice/odbChemSlice';
import { PanelTimeRangePickr } from 'components/PanelTimePickr';
import { PanelSlider } from 'components/PanelSlider';
import { chemDepthList as depthList } from "Utils/UtilsODB";
import { ChemPar, StringObject } from "types";

declare const L: any;

const handleJsonStringList = (string: string) => JSON.parse(string.replace(/'/g, '"'))
const handleIsoString = (dateObj: Date) => dateObj.toISOString().split('T')[0]

export const OdbChemistry = () => {
  const ref = useRef<any>()
  const refCluster = useRef<any>()
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { openAlert, alertMessage, setOpenAlert, setMessage } = useAlert()
  const latlonFormat = useAppSelector(state => state.map.latlonformat)
  const date = useAppSelector(state => state.odbChem.date)
  const lat = useAppSelector(state => state.odbChem.lat)
  const lon = useAppSelector(state => state.odbChem.lon)
  const depthIndex = useAppSelector(state => state.odbChem.iDepth)
  const parameters = useAppSelector(state => state.odbChem.par)

  const varList: { [key in ChemPar]: StringObject } = useMemo(() => {
    return {
      'Sal': {
        name: t('OdbData.chemistryList.Sal'),
        code: 'Salinity',
        unit: '(psu)'
      },
      'DO': {
        name: t('OdbData.chemistryList.DO'),
        code: 'D.O.',
        unit: '(\u00B5M)'
      },
      'NO3': {
        name: t('OdbData.chemistryList.NO3'),
        code: 'NO3',
        unit: '(\u00B5M)'
      },
      'NO2': {
        name: t('OdbData.chemistryList.NO2'),
        code: 'NO2',
        unit: '(\u00B5M)'
      },
      'PO4': {
        name: t('OdbData.chemistryList.PO4'),
        code: 'PO4',
        unit: '(\u00B5M)'
      },
      'SiOx': {
        name: t('OdbData.chemistryList.SiOx'),
        code: 'Silicate',
        unit: '(\u00B5M)'
      },
      'NH4': {
        name: t('OdbData.chemistryList.NH4'),
        code: 'NH4',
        unit: '(\u00B5M)'
      },
      'Chl': {
        name: t('OdbData.chemistryList.Chl'),
        code: 'Chlorophyll a',
        unit: '(\u00B5g/l)'
      },
      'POC': {
        name: t('OdbData.chemistryList.POC'),
        code: 'POC',
        unit: '(\u00B5g/l)'
      },
      'PON': {
        name: t('OdbData.chemistryList.PON'),
        code: 'PON',
        unit: '(\u00B5g/l)'
      },
      'DOC': {
        name: t('OdbData.chemistryList.DOC'),
        code: 'DOC',
        unit: '(\u00B5g/l)'
      },
      'DIC': {
        name: t('OdbData.chemistryList.DIC'),
        code: 'DIC',
        unit: '(\u00B5mol/kg)'
      },
      'pH_NBS': {
        name: t('OdbData.chemistryList.pH_NBS'),
        code: 'pH(NBS)',
        unit: ''
      },
      'pH_total': {
        name: t('OdbData.chemistryList.pH_total'),
        code: 'pH(total)',
        unit: ''
      },
      'Alk': {
        name: t('OdbData.chemistryList.Alk'),
        code: 'Total alkalinity',
        unit: '(\u00B5mol/kg)'
      },
    }
  }, [t])

  const pointToLayer = (feature: geojson.Feature<geojson.Point, any>, latlang: LatLng) => {
    return new L.CircleMarker(latlang, { radius: 6 })
  }

  const onEachFeature = (feature: geojson.Feature<geojson.GeometryObject, any>, layer: L.Layer) => {
    if (feature.geometry.type === 'Point') {
      const property = feature.properties
      const content = (
        <Box>
          <FormatCoordinate coords={feature.geometry.coordinates} format={latlonFormat} /><br />
          {t('OdbData.date')}: {property.date} {property.time}<br />
          {t('OdbData.chemistryList.cruise')}: {property.ship}-{property.cruise}<br />
          {t('OdbData.depth')}: {handleJsonStringList(property.depths).join(', ')} m<br />
          {t('OdbData.chemistryList.para')}: {handleJsonStringList(property.parameters).join(', ')}
        </Box>
      )
      layer.bindTooltip(renderToString(content))
      //   const property = feature.properties
      //   const content = `${property.ship}-${property.cruise}<br>
      // ${property.date} ${property.time}<br>
      // Location: ${feature.geometry.coordinates[1]}, ${feature.geometry.coordinates[0]}<br>
      // Depths (m): ${handleJsonStringList(property.depths).join(', ')}<br>
      // Parameters: ${handleJsonStringList(property.parameters).join(', ')}
      // `
      // layer.bindTooltip(content)
    }
  }
  const styleFunc = () => {
    return {
      weight: 2
    }
  }
  const handleLatChangeCommitted = (event: SyntheticEvent | Event, newValue: number | number[]) => {
    dispatch(odbChemSlice.actions.setLat(newValue as number[]))
  };
  const handleLonChangeCommitted = (event: SyntheticEvent | Event, newValue: number | number[]) => {
    dispatch(odbChemSlice.actions.setLon(newValue as number[]))
  };
  const handleDateChange = useCallback((newDate: Date[]) => {
    if (newDate.length === 1) {
      const dt = handleIsoString(newDate[0])
      dispatch(odbChemSlice.actions.setDate([dt, dt]))
    } else {
      const from = handleIsoString(newDate[0])
      const to = handleIsoString(newDate[1])
      dispatch(odbChemSlice.actions.setDate([from, to]))
    }
  }, [])
  const handleDepthChangeCommitted = (event: SyntheticEvent | Event, newValue: number | number[]) => {
    dispatch(odbChemSlice.actions.setIDpeth(newValue as number[]))
  };
  const depthLabelFormat = (value: number) => {
    return `${depthList[value]} m`
  }

  const handleParameters = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      dispatch(odbChemSlice.actions.setPar([...parameters, event.target.name as ChemPar]))
    } else {
      dispatch(odbChemSlice.actions.setPar(parameters.filter(ele => ele !== event.target.name)))
    }
  }

  const handleDateClose = useCallback(() => {
    if (parameters.length === 0) {
      setMessage(t('alert.noSelect'))
    }
  }, [])

  useEffect(() => {
    if (date.length === 0) {
      setMessage(t('alert.noDate'))
    } else if (parameters.length === 0) {
      setMessage(t('alert.noSelect'))
      refCluster.current.clearLayers()
      ref.current.clearLayers()
    } else {
      const pars = parameters.map(p => varList[p].code).join(',')
      const url = `${process.env.REACT_APP_PROXY_BASE}/data/odbchem/bottlehidy?lat_from=${lat[0]}&lat_to=${lat[1]}&lon_from=${lon[0]}&lon_to=${lon[1]}&dep1=${depthList[depthIndex[0]]}&dep2=${depthList[depthIndex[1]]}&var=${pars}&date_from=${date[0].replace(/-/g, '')}&date_to=${date[1].replace(/-/g, '')}`
      fetch(url)
        .then((response) => response.json())
        .then((json) => {
          if (json === 'No result') {
            refCluster.current.clearLayers()
            ref.current.clearLayers()
            setMessage(t('alert.noData'))
          } else {
            refCluster.current.clearLayers()
            ref.current.clearLayers()
            ref.current.addData(json)
            refCluster.current.addLayers(ref.current.getLayers())
          }
        })
        .catch(() => {
          setMessage(t('alert.fetchFail'))
        })
    }
  }, [lat, lon, depthIndex, date, parameters, t])

  return (
    <>
      <Divider variant="middle" />
      <Box sx={{ margin: 1 }}>
        <Typography variant="subtitle2" gutterBottom>
          {t('OdbData.chemistryList.dateRange')} 1988 ~ 2016
        </Typography>
        <PanelTimeRangePickr onChange={handleDateChange} onClose={handleDateClose} defaultValues={date} options={{ minDate: '1988-12-181', maxDate: '2016-12-31' }} />
        <Typography variant="subtitle2" gutterBottom>
          {t('OdbData.chemistryList.latRange')} 3 ~ 33&deg;N
        </Typography>
        <PanelSlider min={3} max={33} initValue={lat} onChangeCommitted={handleLatChangeCommitted} />
        <Typography variant="subtitle2" gutterBottom>
          {t('OdbData.chemistryList.lonRange')} 106 ~ 128&deg;E
        </Typography>
        <PanelSlider min={106} max={128} initValue={lon} onChangeCommitted={handleLonChangeCommitted} />
        <Typography variant="subtitle2" gutterBottom>
          {t('OdbData.chemistryList.depthRange')} 0 ~ -4250m
        </Typography>
        <PanelSlider min={0} max={depthList.length - 1} initValue={depthIndex} onChangeCommitted={handleDepthChangeCommitted} valueLabelFormat={depthLabelFormat} />
        <Typography variant="subtitle2" gutterBottom>
          {t('OdbData.chemistryList.para')}
        </Typography>
        <Grid container columns={12} sx={{ width: 340, marginLeft: 0.5 }}>
          {Object.keys(varList).map((parKey: string, id: number) => {
            const par = parKey as ChemPar
            return (
              <Grid item sm={6} key={id}>
                <FormControlLabel
                  key={id}
                  control={
                    <Checkbox size='small' onChange={handleParameters} name={par} checked={parameters.includes(par)} />
                  }
                  label={<Typography variant='caption' sx={{ width: 135 }}>{varList[par].name} {varList[par].unit}</Typography>}
                />
              </Grid>
            )
          })}
        </Grid>
      </Box>
      <Divider variant="middle" />
      <MarkerCluster
        ref={refCluster}
        disableClusteringAtZoom={12}
      >
        <GeoJSON ref={ref} data={{ type: 'Feature' }} style={styleFunc} pointToLayer={pointToLayer} onEachFeature={onEachFeature} />
      </MarkerCluster>
      <AlertSlide open={openAlert} setOpen={setOpenAlert} severity='error'>
        {alertMessage}
      </AlertSlide>
    </>
  )
}