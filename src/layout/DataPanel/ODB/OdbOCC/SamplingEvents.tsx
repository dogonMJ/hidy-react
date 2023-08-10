import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Select, OutlinedInput, Box, Chip, MenuItem, Slider, Typography, Stack, useEventCallback } from "@mui/material"
import { useState, useEffect, useRef, useCallback } from "react";
import { GeoJSON } from "react-leaflet"
import { LatLng } from "leaflet"
import { SelectChangeEvent } from "@mui/material";
import { AlertSlide } from "components/AlertSlide/AlertSlide";
// import { SwitchSameColor } from "components/SwitchSameColor";
import * as geojson from 'geojson';
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import Flatpickr from "react-flatpickr";
import 'flatpickr/dist/plugins/monthSelect/style.css'
//@ts-ignore
import MarkerCluster from '@changey/react-leaflet-markercluster'
import { useTranslation } from "react-i18next";
import { RenderIf } from "components/RenderIf/RenderIf";
import { BioDataset, BioFilter } from "types";

declare const L: any;

const topicList = ["zooplankton", "larval fish", "demersal fish", "environment fish", "macorbenthos"]

const dateToApiString = (dateObj: Date) => {
  dateObj.setTime(dateObj.getTime() + 8 * 3600000)
  return dateObj.toISOString().split('T')[0]
}

export const SamplingEvents = (props: { dataset: BioDataset, filter: BioFilter }) => {
  const { dataset, filter } = props
  const { t } = useTranslation()
  const ref = useRef<any>()
  const refCluster = useRef<any>()
  const [topics, setTopics] = useState<string[]>([])
  const [taxon, setTaxon] = useState<string>('')
  const [taxaList, setTaxaList] = useState<string[]>([''])
  const [openAlert, setOpenAlert] = useState(false)
  const [data, setData] = useState<any>()
  const [date, setDate] = useState<string[]>([])
  const [lat, setLat] = useState<number[]>([10, 40]);
  const [lon, setLon] = useState<number[]>([109, 135]);

  const onEachFeature = (feature: geojson.Feature<geojson.Point, any>, layer: L.Layer) => {
    const property = feature.properties
    let content = ''
    if (property.canonicalName) {
      content = `Date: ${property.eventDate}<br>
    Location: ${feature.geometry.coordinates[1]}, ${feature.geometry.coordinates[0]}<br>
    Source: ${property.dataSource}<br>
    Topic: ${property.dataTopic}<br>
    Rank: ${property.taxonRank}<br>
    Name: ${property.canonicalName}<br>
    `
    } else {
      content = `Date: ${property.eventDate}<br>
    Location: ${feature.geometry.coordinates[1]}, ${feature.geometry.coordinates[0]}<br>
    Source: ${property.dataSource}<br>
    Topic: ${property.dataTopic}
    `
    }
    layer.bindTooltip(content)
  }

  const pointToLayer = (feature: geojson.Feature<geojson.Point, any>, latlng: LatLng) => {
    return new L.CircleMarker(latlng, { radius: 6 })
  }

  const handleTopicChange = (event: SelectChangeEvent<typeof topics>) => {
    const { target: { value } } = event
    setTopics(
      typeof value === 'string' ? value.split(',') : value,
    );
  }
  const handleTaxaChange = (event: SelectChangeEvent<typeof taxon>) => {
    const { target: { value } } = event
    setTaxon(value);
  }

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
  useEffect(() => {
    let url = ''
    if (filter === 'topic') {
      url = `${process.env.REACT_APP_PROXY_BASE}/data/odbocc/event/${dataset}?topic=${topics.toString()}&minLat=${lat[0]}&maxLat=${lat[1]}&minLon=${lon[0]}&maxLon=${lon[1]}&startDate=${date[0]}&endDate=${date[1]}`
    } else if (filter === 'taxon') {
      url = `${process.env.REACT_APP_PROXY_BASE}/data/odbocc/taxa/${dataset}/${taxon}?minLat=${lat[0]}&maxLat=${lat[1]}&minLon=${lon[0]}&maxLon=${lon[1]}&startDate=${date[0]}&endDate=${date[1]}`
    }
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
  }, [taxon, topics, dataset, lon, lat, date, filter])

  useEffect(() => {
    fetch(`${process.env.REACT_APP_PROXY_BASE}/data/odbocc/taxopt/${dataset}`)
      .then(response => response.json())
      .then(json => setTaxaList(json))
  }, [dataset])

  return (
    <>
      <Box sx={{ margin: 0 }}>
        <Typography variant="subtitle2" gutterBottom>
          {t('OdbData.chemistryList.dateRange')} 1965-Jun-29~
        </Typography>
        <div style={{ marginBottom: 10, marginLeft: 15 }}>
          <Flatpickr
            className='chemDatePickr'
            onChange={handleDateChange}
            options={{
              allowInput: true,
              weekNumbers: false,
              minDate: '1965-06-29',
              dateFormat: 'Y-M-d',
              altFormat: 'Y-M-d',
              ariaDateFormat: 'Y-M-d',
              mode: "range",
            }}
          />
        </div>
        <Typography variant="subtitle2" gutterBottom>
          {t('OdbData.chemistryList.latRange')} 10 ~ 40&deg;N
        </Typography>
        <Slider
          value={lat}
          onChange={handleLatChange}
          min={10}
          max={40}
          valueLabelDisplay="auto"
          marks
          sx={{ width: '85%', marginLeft: 2.1 }}
        />
        <Typography variant="subtitle2" gutterBottom>
          {t('OdbData.chemistryList.lonRange')} 109 ~ 135&deg;E
        </Typography>
        <Slider
          value={lon}
          onChange={handleLonChange}
          min={109}
          max={135}
          valueLabelDisplay="auto"
          marks
          sx={{ width: '85%', marginLeft: 2.1 }}
        />
        <RenderIf isTrue={filter === 'topic'}>
          <Typography variant="subtitle2" gutterBottom>
            Select Topic
          </Typography>
          <Select
            multiple
            fullWidth
            size="small"
            value={topics}
            onChange={handleTopicChange}
            input={<OutlinedInput label="Topics" />}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip key={value} label={value} />
                ))}
              </Box>
            )}
            sx={{
              maxWidth: 344
            }}
          >
            {topicList.map((topic) => (
              <MenuItem
                key={topic}
                value={topic}
              >
                {topic}
              </MenuItem>
            ))}
          </Select>
        </RenderIf>
        <RenderIf isTrue={filter === 'taxon'}>
          <Typography variant="subtitle2" gutterBottom>
            Select Taxon
          </Typography>
          <Select
            fullWidth
            size="small"
            value={taxon}
            onChange={handleTaxaChange}
            input={<OutlinedInput label="Taxa" />}
            defaultValue=""
            sx={{
              maxWidth: 344
            }}
          >
            {taxaList.map((taxon) => (
              <MenuItem
                key={taxon}
                value={taxon}
              >
                {taxon}
              </MenuItem>
            ))}
          </Select>
        </RenderIf>
        <AlertSlide open={openAlert} setOpen={setOpenAlert} severity='error' timeout={3000} > No Data </AlertSlide>
      </Box>
      <MarkerCluster
        ref={refCluster}
        disableClusteringAtZoom={12}
      >
        <GeoJSON ref={ref} data={data} pointToLayer={pointToLayer} onEachFeature={onEachFeature} />
      </MarkerCluster>
    </>
  )
}