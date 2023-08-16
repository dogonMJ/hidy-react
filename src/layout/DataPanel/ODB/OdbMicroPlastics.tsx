import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Select, OutlinedInput, Box, Chip, MenuItem, Slider, Typography, Stack, Divider } from "@mui/material"
import { useState, useEffect, useRef } from "react";
import { GeoJSON } from "react-leaflet"
import { LatLng } from "leaflet"
import { SelectChangeEvent } from "@mui/material";
import { AlertSlide } from "components/AlertSlide/AlertSlide";
import * as geojson from 'geojson';
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import Flatpickr from "react-flatpickr";
import 'flatpickr/dist/plugins/monthSelect/style.css'
//@ts-ignore
import MarkerCluster from '@changey/react-leaflet-markercluster'
import { useTranslation } from "react-i18next";

declare const L: any;

interface PlasticConcentration {
  [key: string]: {
    color: string,
    concentration: string
  }
}

const dateToApiString = (dateObj: Date) => {
  dateObj.setTime(dateObj.getTime() + 8 * 3600000)
  return dateObj.toISOString().split('T')[0]
}

const levelList: PlasticConcentration = {
  "Very Low": { color: '#8ff1b1', concentration: '<0.0005' },
  "Low": { color: '#acd36c', concentration: '0.0005-0.005' },
  "Medium": { color: '#fce72b', concentration: '0.005-1' },
  "High": { color: '#e68128', concentration: '1-10' },
  "Very High": { color: '#f34545', concentration: '>=10' },
}

export const OdbMicroplastics = () => {
  const { t } = useTranslation()
  const ref = useRef<any>()
  const refCluster = useRef<any>()
  const [levels, setLevels] = useState<string[]>([])
  const [dataset, setDataset] = useState('all')
  const [openAlert, setOpenAlert] = useState(false)
  const [data, setData] = useState<any>()
  const [date, setDate] = useState<string[]>([])
  const [lat, setLat] = useState<number[]>([10, 40]);
  const [lon, setLon] = useState<number[]>([109, 135]);
  const [clusterLevel, setClusterLevel] = useState<number>(8)

  const onEachFeature = (feature: geojson.Feature<geojson.Point, any>, layer: L.Layer) => {
    const property = feature.properties
    const content = `Date: ${property.eventDate}<br>
    Location: ${feature.geometry.coordinates[1]}, ${feature.geometry.coordinates[0]}<br>
    Source: ${property.organization}<br>
    Creator: ${property.creator}<br>
    Type: ${property.measurementType}<br>
    Density: ${property.densityClass}&nbsp;<b style="background:${levelList[property.densityClass].color};color:${levelList[property.densityClass].color}">●</b>
    `
    layer.bindTooltip(content)
  }

  const pointToLayer = (feature: geojson.Feature<geojson.Point, any>, latlang: LatLng) => {
    const density = feature.properties.densityClass as string
    return new L.CircleMarker(latlang, { radius: 4, weight: 2, color: levelList[density].color })
  }

  const handleLevelChange = (event: SelectChangeEvent<typeof levels>) => {
    const { target: { value } } = event
    setLevels(typeof value === 'string' ? value.split(',') : value);
  }

  const handleDatasetChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDataset((event.target as HTMLInputElement).value);
  };

  const handleDateChange = (newDate: Date[]) => {
    if (newDate.length === 1) {
      const dt = dateToApiString(newDate[0])
      setDate([dt, dt])
    } else {
      const from = dateToApiString(newDate[0])
      const to = dateToApiString(newDate[1])
      setDate([from, to])
    }
  }
  const handleLatChange = (event: Event, newValue: number | number[]) => {
    setLat(newValue as number[]);
  };
  const handleLonChange = (event: Event, newValue: number | number[]) => {
    setLon(newValue as number[]);
  };
  const handleClusterLevelChange = (event: Event, newValue: number | number[]) => {
    setClusterLevel(newValue as number)
    refCluster.current.options.disableClusteringAtZoom = newValue
    refCluster.current.clearLayers()
    refCluster.current.addLayers(ref.current.getLayers())
  }
  useEffect(() => {
    if (levels.toString()) {
      const url = `${process.env.REACT_APP_PROXY_BASE}/data/odbocc/litter/${dataset}?level=${levels.toString()}&minLat=${lat[0]}&maxLat=${lat[1]}&minLon=${lon[0]}&maxLon=${lon[1]}&startDate=${date[0]}&endDate=${date[1]}`
      fetch(url)
        .then(res => res.json())
        .then(json => {
          if (json.length === 0) {
            refCluster.current.clearLayers()
            ref.current.clearLayers()
            setOpenAlert(true)
          } else {
            setData(json)
            refCluster.current.clearLayers()
            ref.current.clearLayers()
            ref.current.addData(json)
            refCluster.current.addLayers(ref.current.getLayers())
          }
        })
    } else {
      refCluster.current.clearLayers()
      ref.current.clearLayers()
    }
  }, [levels, dataset, lon, lat, date])

  return (
    <>
      <Divider variant="middle" />
      <Box sx={{ margin: 2 }}>
        <Stack>
          <FormControl>
            <FormLabel>{t('OdbData.dataset')}</FormLabel>
            <RadioGroup
              row
              defaultValue={dataset}
              value={dataset}
              onChange={handleDatasetChange}
            >
              <FormControlLabel value="all" control={<Radio size="small" />} label={t('OdbData.all')} />
              <FormControlLabel value="ncei" control={<Radio size="small" />} label={t('OdbData.NCEI')} />
              <FormControlLabel value="oca" control={<Radio size="small" />} label={t('OdbData.OCA')} />
            </RadioGroup>
          </FormControl>
          <FormLabel>{t('OdbData.filter')}</FormLabel>
          <Typography variant="subtitle2" gutterBottom>
            {t('OdbData.chemistryList.dateRange')} 1972-Apr-20~
          </Typography>
          <div style={{ marginBottom: 10, marginLeft: 15 }}>
            <Flatpickr
              className='chemDatePickr'
              onChange={handleDateChange}
              options={{
                allowInput: true,
                weekNumbers: false,
                minDate: '1972-04-20',
                dateFormat: 'Y-M-d',
                altFormat: 'Y-M-d',
                ariaDateFormat: 'Y-M-d',
                mode: "range",
              }}
            />
          </div>
          <Typography variant="subtitle2" gutterBottom>
            {t('OdbData.chemistryList.latRange')}&plusmn;90&deg;
          </Typography>
          <Slider
            value={lat}
            onChange={handleLatChange}
            min={-90}
            max={90}
            valueLabelDisplay="auto"
            marks
            sx={{ width: '85%', marginLeft: 2.1 }}
          />
          <Typography variant="subtitle2" gutterBottom>
            {t('OdbData.chemistryList.lonRange')}&plusmn;180&deg;
          </Typography>
          <Slider
            value={lon}
            onChange={handleLonChange}
            min={-180}
            max={180}
            valueLabelDisplay="auto"
            marks
            sx={{ width: '85%', marginLeft: 2.1 }}
          />
          <Typography variant="subtitle2" gutterBottom>
            {t('OdbData.plastic.cluster')}
          </Typography>
          <Slider
            value={clusterLevel}
            onChange={handleClusterLevelChange}
            min={0}
            max={10}
            valueLabelDisplay="auto"
            marks
            track={false}
            sx={{ width: '85%', marginLeft: 2.1 }}
          />
          <Typography variant="subtitle2" gutterBottom>
            {t('OdbData.select')}{t('OdbData.plastic.concentraion')} ({t('OdbData.plastic.pieces')}/m<sup>3</sup>)
          </Typography>
          <Select
            multiple
            fullWidth
            size="small"
            value={levels}
            onChange={handleLevelChange}
            input={<OutlinedInput label="Levels" />}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip key={value} label={t(`OdbData.plastic.${value}`)} />
                ))}
              </Box>
            )}
            sx={{
              maxWidth: 344
            }}
          >
            {Object.keys(levelList).map((level) => (
              <MenuItem
                key={level}
                value={level}
              >
                <Typography sx={{ backgroundColor: levelList[level].color, color: levelList[level].color }}>&nbsp;&nbsp;</Typography>&nbsp;&nbsp;
                {t(`OdbData.plastic.${level}`)}&nbsp;&nbsp;({levelList[level].concentration})
              </MenuItem>
            ))}
          </Select>
          <AlertSlide open={openAlert} setOpen={setOpenAlert} severity='error' timeout={3000} > {t('OdbData.nodata')} </AlertSlide>
        </Stack>
      </Box>
      <MarkerCluster
        ref={refCluster}
        disableClusteringAtZoom={clusterLevel}
        maxClusterRadius={60}
      >
        <GeoJSON ref={ref} data={data} pointToLayer={pointToLayer} onEachFeature={onEachFeature} />
      </MarkerCluster>
    </>
  )
}