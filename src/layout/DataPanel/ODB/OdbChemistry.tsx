import 'leaflet'
import { useEffect, useRef, useState } from "react"
import { GeoJSON, useMap } from "react-leaflet"
import { LatLng } from "leaflet"
import * as geojson from 'geojson';
import Flatpickr from "react-flatpickr";
// import "flatpickr/dist/themes/light.css";
import monthSelectPlugin from 'flatpickr/dist/plugins/monthSelect'
import 'flatpickr/dist/plugins/monthSelect/style.css'
import 'leaflet.markercluster/dist/leaflet.markercluster.js'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import MarkerClusterGroup from 'react-leaflet-markercluster';
import { Box, Checkbox, FormControlLabel, Slider, Typography, Grid } from '@mui/material'
import { useTranslation } from "react-i18next";

declare const L: any;

const depthList = [0, 20, 50, 100, 150, 200, 250, 300, 400, 500, 1000, 1500, 2000, 3000, '4000+']
const handleJsonStringList = (string: string) => JSON.parse(string.replace(/'/g, '"'))
const handleIsoString = (dateObj: Date) => {
  dateObj.setTime(dateObj.getTime() + 8 * 3600000)
  return dateObj.toISOString().split('T')[0].replaceAll('-', '')
}

export const OdbChemistry = () => {
  const ref = useRef<any>()
  const refCluster = useRef<any>()
  const { t } = useTranslation()
  const [data, setData] = useState<any>()
  const [lat, setLat] = useState<number[]>([3, 33]);
  const [lon, setLon] = useState<number[]>([106, 128]);
  const [depthIndex, setDepthIndex] = useState<number[]>([0, depthList.length - 1]);
  const [date, setDate] = useState<string[]>(['19881218', '20161231'])
  const [parameters, setParameters] = useState<string[]>(['none'])
  const varList: { [key: string]: { [key: string]: string } } = {
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
      code: 'ph(NBS)',
      unit: ''
    },
    'pH_total': {
      name: t('OdbData.chemistryList.pH_total'),
      code: 'ph(total)',
      unit: ''
    },
    'Alk': {
      name: t('OdbData.chemistryList.Alk'),
      code: 'Total alkalinity',
      unit: '(\u00B5mol/kg)'
    },
  }
  const pointToLayer = (feature: geojson.Feature<geojson.Point, any>, latlang: LatLng) => {
    return new L.CircleMarker(latlang, { radius: 6 })
  }
  const onEachFeature = (feature: geojson.Feature<geojson.GeometryObject, any>, layer: L.Layer) => {
    if (feature.geometry.type === 'Point') {
      const property = feature.properties
      const content = `${property.ship}-${property.cruise}<br>
    ${property.date} ${property.time}<br>
    Location: ${feature.geometry.coordinates[1]}, ${feature.geometry.coordinates[0]}<br>
    Depths (m): ${handleJsonStringList(property.depths).join(', ')}<br>
    Parameters: ${handleJsonStringList(property.parameters).join(', ')}
    `
      layer.bindTooltip(content)
    }
  }
  const styleFunc = () => {
    return {
      weight: 2
    }
  }
  const handleLatChange = (event: Event, newValue: number | number[]) => {
    setLat(newValue as number[]);
  };
  const handleLonChange = (event: Event, newValue: number | number[]) => {
    setLon(newValue as number[]);
  };
  const handleDateChange = (newDate: Date[]) => {
    if (newDate.length === 1) {
      const dt = handleIsoString(newDate[0])
      setDate([dt, dt])
    } else {
      const from = handleIsoString(newDate[0])
      const to = handleIsoString(newDate[1])
      setDate([from, to])
    }
  }
  const handleDepthChange = (event: Event, newValue: number | number[]) => {
    setDepthIndex(newValue as number[]);
  };
  const depthLabelFormat = (value: number) => {
    return `${depthList[value]} m`
  }

  const handleParameters = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setParameters([...parameters, event.target.name])
    } else {
      setParameters(parameters.filter(ele => ele !== event.target.name))
    }
  }

  useEffect(() => {
    const url = `https://chemview.odb.ntu.edu.tw/bottlehidy?lat_from=${lat[0]}&lat_to=${lat[1]}&lon_from=${lon[0]}&lon_to=${lon[1]}&dep1=${depthList[depthIndex[0]]}&dep2=${depthList[depthIndex[1]]}&var=${parameters.join(',')}&date_from=${date[0]}&date_to=${date[1]}`
    fetch(url)
      .then((response) => response.json())
      .then((json) => {
        if (json === 'No result') {
          refCluster.current.clearLayers()
          ref.current.clearLayers()
        } else {
          setData(json)
          refCluster.current.clearLayers()
          ref.current.clearLayers()
          ref.current.addData(json)
          refCluster.current.addLayers(ref.current.getLayers())
        }
      })
  }, [lat, lon, depthIndex, date, parameters])

  return (
    <>
      <Box sx={{ margin: 1 }}>
        <Typography variant="subtitle2" gutterBottom>
          {t('OdbData.chemistryList.dateRange')} 1988 ~ 2016
        </Typography>
        <div style={{ marginBottom: 10, marginLeft: 15 }}>
          <Flatpickr
            className='chemDatePickr'
            onChange={handleDateChange}
            options={{
              allowInput: true,
              weekNumbers: false,
              minDate: '1988-12-18',
              maxDate: '2016-12-31',
              dateFormat: 'Y-M-d',
              altFormat: 'Y-M-d',
              ariaDateFormat: 'Y-M-d',
              defaultDate: [new Date(1988, 11, 18), new Date(2016, 11, 31)],
              mode: "range",
              // plugins: [
              //   monthSelectPlugin({
              //     shorthand: true, //defaults to false
              //     dateFormat: "Y-M", //defaults to "F Y"
              //     altFormat: "F Y", //defaults to "F Y"
              //   })
              // ]
            }}
          />
        </div>
        <Typography variant="subtitle2" gutterBottom>
          {t('OdbData.chemistryList.latRange')} 3 ~ 33&deg;N
        </Typography>
        <Slider
          value={lat}
          onChange={handleLatChange}
          min={3}
          max={33}
          valueLabelDisplay="auto"
          marks
          sx={{ width: '85%', marginLeft: 2.1 }}
        />
        <Typography variant="subtitle2" gutterBottom>
          {t('OdbData.chemistryList.lonRange')} 106 ~ 128&deg;E
        </Typography>
        <Slider
          value={lon}
          onChange={handleLonChange}
          min={106}
          max={128}
          valueLabelDisplay="auto"
          marks
          sx={{ width: '85%', marginLeft: 2.1 }}
        />
        <Typography variant="subtitle2" gutterBottom>
          {t('OdbData.chemistryList.depthRange')} 0 ~ -4250m
        </Typography>
        <Slider
          value={depthIndex}
          onChange={handleDepthChange}
          min={0}
          max={depthList.length - 1}
          valueLabelDisplay="auto"
          valueLabelFormat={depthLabelFormat}
          marks
          sx={{ width: '85%', marginLeft: 2.1 }}
        />
        <Typography variant="subtitle2" gutterBottom>
          {t('OdbData.chemistryList.para')}
        </Typography>
        <Grid container columns={12} sx={{ width: 340, marginLeft: 0.5 }}>
          {Object.keys(varList).map((par: string, id: number) => {
            return (
              <Grid item sm={6} key={id}>
                <FormControlLabel
                  key={id}
                  control={
                    <Checkbox size='small' onChange={handleParameters} name={varList[par].code} />
                  }
                  label={<Typography variant='caption' sx={{ width: 135 }}>{varList[par].name} {varList[par].unit}</Typography>}
                />
              </Grid>
            )
          })}
        </Grid>
      </Box>
      <MarkerClusterGroup
        ref={refCluster}
        disableClusteringAtZoom={12}
      >
        <GeoJSON ref={ref} data={data} style={styleFunc} pointToLayer={pointToLayer} onEachFeature={onEachFeature} >
        </GeoJSON>
      </MarkerClusterGroup>
    </>
  )
}