import { Select, OutlinedInput, Box, Chip, MenuItem, Slider, Typography, Autocomplete, TextField, Modal, Link } from "@mui/material"
import { useState, useEffect, useRef, SyntheticEvent } from "react";
import { renderToString } from 'react-dom/server';
import { GeoJSON, useMap } from "react-leaflet"
import { LatLng } from "leaflet"
import { SelectChangeEvent } from "@mui/material";
import { useTranslation } from "react-i18next";
import * as geojson from 'geojson';
import Flatpickr from "react-flatpickr";
import 'flatpickr/dist/plugins/monthSelect/style.css'
import { BioDataset, BioFilter, StringObject } from "types";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
//@ts-ignore
import MarkerCluster from '@changey/react-leaflet-markercluster'
import { AlertSlide } from "components/AlertSlide/AlertSlide";
import { RenderIf } from "components/RenderIf/RenderIf";
import { BioTableAtPoint } from "./BioTableAtPoint";
import { category23 } from "./utils";

declare const L: any;

const topicList = {
  "demersal fish": { color: category23[0] },
  "eDNA fish": { color: category23[1] },
  "larval fish": { color: category23[2] },
  "macrobenthos": { color: category23[3] },
  "zooplankton": { color: category23[4] },
} as { [key: string]: StringObject }

const dateToApiString = (dateObj: Date) => {
  dateObj.setTime(dateObj.getTime() + 8 * 3600000)
  return dateObj.toISOString().split('T')[0]
}

export const SamplingEvents = (props: { dataset: BioDataset, filter: BioFilter }) => {
  const { dataset, filter } = props
  const { t } = useTranslation()
  const ref = useRef<any>()
  const refCluster = useRef<any>()
  const map = useMap()
  const [topics, setTopics] = useState<string[]>([])
  const [taxon, setTaxon] = useState<string>('')
  const [taxaList, setTaxaList] = useState<string[]>([''])
  const [openAlert, setOpenAlert] = useState(false)
  const [data, setData] = useState<any>()
  const [date, setDate] = useState<string[]>([])
  const [lat, setLat] = useState<number[]>([10, 40]);
  const [lon, setLon] = useState<number[]>([109, 135]);
  const [sliderLat, setSliderLat] = useState<number[]>([10, 40]);
  const [sliderLon, setSliderLon] = useState<number[]>([109, 135]);
  const [eventID, setEventID] = useState<string>('')
  const [cite, setCite] = useState<StringObject>({ cite: '', source: '' })
  const [clusterLevel, setClusterLevel] = useState<number>(8)
  const [openModal, setOpenModal] = useState(false)
  const [inputValue, setInputValue] = useState('')

  const onEachFeature = (feature: geojson.Feature<geojson.Point, any>, layer: L.Layer) => {
    const property = feature.properties
    let content;
    if (property.canonicalName) {
      content = (
        <Box>
          {t('OdbData.date')}: {property.eventDate}<br />
          {t('OdbData.location')}: {feature.geometry.coordinates[1]}, {feature.geometry.coordinates[0]}<br />
          {t('OdbData.Bio.topic')}: {property.dataTopic}<br />
          {t('OdbData.Bio.rank')}: {property.taxonRank}<br />
          {t('OdbData.Bio.name')}: {property.canonicalName}
        </Box>
      )
    } else {
      content = (
        <Box>
          {t('OdbData.date')}: {property.eventDate}<br />
          {t('OdbData.location')}: {feature.geometry.coordinates[1]}, {feature.geometry.coordinates[0]}<br />
          {t('OdbData.Bio.topic')}: {property.dataTopic}
        </Box>
      )
    }
    layer.bindTooltip(renderToString(content))
    if (filter === 'taxon') {
      const addContent =
        (<Box>
          {t('OdbData.source')}:{" "}
          {property.dataSource.startsWith('http') ? <Link href={property.dataSource} target="_blank" rel="noreferrer">Link</Link> : `${property.dataSource}`}<br />
          {t('OdbData.cite')}:<br />
          <Typography style={{ paddingLeft: '15px', textIndent: '-15px', margin: 0 }}>
            {property.bibliographicCitation}
          </Typography>
        </Box>)

      layer.bindPopup(renderToString(content) + renderToString(addContent))
    }
    layer.on({
      click: () => {
        setEventID(property.eventID)
        setCite({ cite: property.bibliographicCitation, source: property.dataSource })
        filter === 'topic' ? setOpenModal(true) : setOpenModal(false)
      }
    })
  }

  const pointToLayer = (feature: geojson.Feature<geojson.Point, any>, latlng: LatLng) => {
    const topic = feature.properties.dataTopic
    return new L.CircleMarker(latlng, { radius: 4, color: topicList[topic].color })
  }

  const handleTopicChange = (event: SelectChangeEvent<typeof topics>) => {
    const { target: { value } } = event
    setTopics(
      typeof value === 'string' ? value.split(',') : value,
    );
  }

  const handleTaxaChange = (event: any, value: string) => setTaxon(value);

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
    setSliderLat(newValue as number[]);
  };
  const handleLonChange = (event: Event, newValue: number | number[]) => {
    setSliderLon(newValue as number[]);
  };
  const handleLatChangeCommitted = (event: SyntheticEvent | Event, newValue: number | number[]) => {
    setLat(newValue as number[]);
  };
  const handleLonChangeCommitted = (event: SyntheticEvent | Event, newValue: number | number[]) => {
    setLon(newValue as number[]);
  };
  const handleClusterLevelChange = (event: Event, newValue: number | number[]) => {
    setClusterLevel(newValue as number)
    refCluster.current.options.disableClusteringAtZoom = newValue
    refCluster.current.clearLayers()
    refCluster.current.addLayers(ref.current.getLayers())
  }
  const handleModalClose = () => {
    map.dragging.enable()
    setEventID('')
    setOpenModal(false)
  };

  useEffect(() => {
    let url = ''
    if (filter === 'topic') {
      const topic = topics.toString() ? topics.toString() : ' '
      url = `${process.env.REACT_APP_PROXY_BASE}/data/odbocc/event/${dataset}?topic=${topic}&minLat=${lat[0]}&maxLat=${lat[1]}&minLon=${lon[0]}&maxLon=${lon[1]}&startDate=${date[0]}&endDate=${date[1]}`
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
  }, [taxon, topics, dataset, lon, lat, date, filter, t])

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
          value={sliderLat}
          onChange={handleLatChange}
          onChangeCommitted={handleLatChangeCommitted}
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
          value={sliderLon}
          onChange={handleLonChange}
          onChangeCommitted={handleLonChangeCommitted}
          min={109}
          max={135}
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
          max={15}
          valueLabelDisplay="auto"
          marks
          track={false}
          sx={{ width: '85%', marginLeft: 2.1 }}
        />
        <RenderIf isTrue={filter === 'topic'}>
          <Typography variant="subtitle2" gutterBottom>
            {t('OdbData.select')}{t('OdbData.Bio.topic')}
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
                  <Chip key={value} label={t(`OdbData.Bio.${value}`)} />
                ))}
              </Box>
            )}
            sx={{
              maxWidth: 344
            }}
          >
            {Object.keys(topicList).map((topic) => (
              <MenuItem
                key={topic}
                value={topic}
              >
                <Typography sx={{ backgroundColor: topicList[topic].color, color: topicList[topic].color }}>&nbsp;&nbsp;</Typography>&nbsp;&nbsp;
                {t(`OdbData.Bio.${topic}`)}
              </MenuItem>
            ))}
          </Select>
        </RenderIf>
        <RenderIf isTrue={filter === 'taxon'}>
          <Typography variant="subtitle2" gutterBottom>
            {t('OdbData.select')}{t('OdbData.Bio.taxon')}
          </Typography>
          <Autocomplete
            freeSolo
            disableClearable
            options={taxaList.map((taxon) => taxon)}
            onChange={handleTaxaChange}
            inputValue={inputValue}
            onInputChange={(_, newInputValue) => {
              setInputValue(newInputValue)
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label={`${t('OdbData.Bio.search')}`}
                InputProps={{
                  ...params.InputProps,
                  type: 'search',
                }}
              />
            )}
          />
        </RenderIf>
        <AlertSlide open={openAlert} setOpen={setOpenAlert} severity='error' timeout={3000} > {t('OdbData.nodata')} </AlertSlide>
      </Box>
      <MarkerCluster
        ref={refCluster}
        disableClusteringAtZoom={12}
      >
        <GeoJSON key={filter} ref={ref} data={data} pointToLayer={pointToLayer} onEachFeature={onEachFeature} />
      </MarkerCluster>
      <Modal
        open={openModal}
        onClose={handleModalClose}
      >
        <BioTableAtPoint eventID={eventID} citation={cite} />
      </Modal>
    </>
  )
}