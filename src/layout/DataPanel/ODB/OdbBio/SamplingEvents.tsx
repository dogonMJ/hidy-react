import { Select, Box, Chip, MenuItem, Slider, Typography, Autocomplete, TextField, Modal, Link, FormControl, InputLabel } from "@mui/material"
import { useState, useEffect, useRef, SyntheticEvent } from "react";
import { renderToString } from 'react-dom/server';
import { GeoJSON, useMap } from "react-leaflet"
import { LatLng } from "leaflet"
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store/store"
import { SelectChangeEvent, Popper, styled, autocompleteClasses } from "@mui/material";
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
import FormatCoordinate from "components/FormatCoordinate";
import { BioTableAtPoint } from "./BioTableAtPoint";
import { dateToBioApiString, category23 } from "Utils/UtilsODB";
import { LargeFixedSizeListComponent } from "./LargeFixedSizeListComponent";
import { odbBioSlice } from "store/slice/odbBioSlice";
import { useAlert } from "hooks/useAlert";
declare const L: any;

const topicList = {
  "demersal fish": { color: category23[0] },
  "eDNA fish": { color: category23[1] },
  "larval fish": { color: category23[2] },
  "macrobenthos": { color: category23[3] },
  "zooplankton": { color: category23[4] },
} as { [key: string]: StringObject }

const StyledPopper = styled(Popper)({
  [`& .${autocompleteClasses.listbox}`]: {
    boxSizing: 'border-box',
    '& ul': {
      padding: 0,
      margin: 0,
    },
  },
});

export const SamplingEvents = (props: { dataset: BioDataset, filter: BioFilter }) => {
  const { dataset, filter } = props
  const { t, i18n } = useTranslation()
  const dispatch = useDispatch()
  const ref = useRef<any>()
  const refCluster = useRef<any>()
  const url = useRef('')
  const map = useMap()
  const { openAlert, setOpenAlert, alertMessage, showAlert } = useAlert()
  const bioDateRange = useSelector((state: RootState) => state.odbBio.dateRange)
  const latlonFormat = useSelector((state: RootState) => state.coordInput.latlonformat)
  const lat = useSelector((state: RootState) => state.odbBio.latRange)
  const lon = useSelector((state: RootState) => state.odbBio.lonRange)
  const topics = useSelector((state: RootState) => state.odbBio.topics)
  const taxon = useSelector((state: RootState) => state.odbBio.taxon)
  const clusterLevel = useSelector((state: RootState) => state.odbBio.cluster)
  const [taxaList, setTaxaList] = useState<string[]>([''])
  const [data, setData] = useState<any>()
  const [sliderLat, setSliderLat] = useState<number[]>(lat);
  const [sliderLon, setSliderLon] = useState<number[]>(lon);
  const [eventID, setEventID] = useState<string>('')
  const [cite, setCite] = useState<StringObject>({ cite: '', source: '' })
  const [openModal, setOpenModal] = useState(false)
  const [inputValue, setInputValue] = useState(taxon)
  const [dateClose, setDateClose] = useState(true)

  const onEachFeature = (feature: geojson.Feature<geojson.Point, any>, layer: L.Layer) => {
    const property = feature.properties
    let content;
    if (property.canonicalName) {
      content = (
        <Box>
          {/* {t('OdbData.location')}: {feature.geometry.coordinates[1]}, {feature.geometry.coordinates[0]}<br /> */}
          <FormatCoordinate coords={feature.geometry.coordinates} format={latlonFormat} /><br />
          {t('OdbData.date')}: {property.eventDate}<br />
          {t('OdbData.Bio.topic')}: {t(`OdbData.Bio.${property.dataTopic}`)}<br />
          {t('OdbData.Bio.rank')}: {t(`OdbData.Bio.${property.taxonRank}`)}<br />
          {t('OdbData.Bio.name')}: {i18n.language === 'zh-TW' ? `${property.canonicalName} ${property.chineseName}` : property.canonicalName}
        </Box>
      )
    } else {
      content = (
        <Box>
          {/* {t('OdbData.location')}: {feature.geometry.coordinates[1]}, {feature.geometry.coordinates[0]}<br /> */}
          <FormatCoordinate coords={feature.geometry.coordinates} format={latlonFormat} /><br />
          {t('OdbData.date')}: {property.eventDate}<br />
          {t('OdbData.Bio.topic')}: {t(`OdbData.Bio.${property.dataTopic}`)}
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
    dispatch(odbBioSlice.actions.setTopics(
      typeof value === 'string' ? value.split(',') : value,
    ))
  }

  const handleTaxaChange = (event: any, value: string | null) => {
    value ? dispatch(odbBioSlice.actions.setTaxon(value)) : dispatch(odbBioSlice.actions.setTaxon(''))
  };

  const handleDateChange = (newDate: Date[]) => {
    if (newDate.length === 0) {
      showAlert(t('alert.noDate'))
    } else if (newDate.length === 1) {
      const dt = dateToBioApiString(newDate[0])
      dispatch(odbBioSlice.actions.setDateRange([dt, dt]))
    } else {
      const from = dateToBioApiString(newDate[0])
      const to = dateToBioApiString(newDate[1])
      dispatch(odbBioSlice.actions.setDateRange([from, to]))
    }
  }
  const handleLatChange = (event: Event, newValue: number | number[]) => {
    setSliderLat(newValue as number[]);
  };
  const handleLonChange = (event: Event, newValue: number | number[]) => {
    setSliderLon(newValue as number[]);
  };
  const handleLatChangeCommitted = (event: SyntheticEvent | Event, newValue: number | number[]) => {
    dispatch(odbBioSlice.actions.setLat(newValue as number[]))
  };
  const handleLonChangeCommitted = (event: SyntheticEvent | Event, newValue: number | number[]) => {
    dispatch(odbBioSlice.actions.setLon(newValue as number[]))
  };
  const handleClusterLevelChange = (event: Event, newValue: number | number[]) => {
    dispatch(odbBioSlice.actions.setCluster(newValue as number))
    refCluster.current.options.disableClusteringAtZoom = newValue
    refCluster.current.clearLayers()
    refCluster.current.addLayers(ref.current.getLayers())
  }
  const handleModalClose = () => {
    map.dragging.enable()
    setEventID('')
    setOpenModal(false)
  };
  const handleDateClose = () => setDateClose(true)
  const handleDateOpen = () => setDateClose(false)

  useEffect(() => {
    if (bioDateRange.length < 2) {
      showAlert(t('alert.noDate'))
    } else if (topics.length === 0) {
      if (dateClose) { showAlert(t('alert.noSelect')) }
    } else {
      if (filter === 'topic') {
        const topic = topics.toString() ? topics.toString() : ' '
        url.current = `${process.env.REACT_APP_PROXY_BASE}/data/odbocc/event/${dataset}?topic=${topic}&minLat=${lat[0]}&maxLat=${lat[1]}&minLon=${lon[0]}&maxLon=${lon[1]}&startDate=${bioDateRange[0]}&endDate=${bioDateRange[1]}`
      } else if (filter === 'taxon') {
        url.current = `${process.env.REACT_APP_PROXY_BASE}/data/odbocc/taxa/${dataset}/${taxon}?minLat=${lat[0]}&maxLat=${lat[1]}&minLon=${lon[0]}&maxLon=${lon[1]}&startDate=${bioDateRange[0]}&endDate=${bioDateRange[1]}`
      }
      fetch(url.current)
        .then(res => res.json())
        .then(json => {
          if (json.length === 0) {
            refCluster.current.clearLayers()
            ref.current.clearLayers()
            setData(null)
            showAlert(t('alert.noData'))
          } else {
            setData(json)
            refCluster.current.clearLayers()
            ref.current.clearLayers()
            ref.current.addData(json)
            refCluster.current.addLayers(ref.current.getLayers())
          }
        })
        .catch(() => {
          showAlert(t('alert.fetchFail'))
        })
    }
  }, [filter, dataset, topics, taxon, lat, lon, bioDateRange, t])

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
            onClose={handleDateClose}
            onOpen={handleDateOpen}
            options={{
              defaultDate: bioDateRange,
              allowInput: true,
              weekNumbers: false,
              minDate: '1965-06-29',
              maxDate: new Date(),
              dateFormat: 'Y-m-d',
              altFormat: 'Y-m-d',
              ariaDateFormat: 'Y-m-d',
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
            {t('OdbData.select')}{t('OdbData.Bio.topic')}{t(`muti`)}
          </Typography>
          <FormControl fullWidth size="small">
            <InputLabel id='topic-label'>{t(`OdbData.Bio.topic`)}</InputLabel>
            <Select
              multiple
              fullWidth
              id='topic-label'
              label={t(`OdbData.Bio.topic`)}
              size="small"
              value={topics}
              onChange={handleTopicChange}
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
          </FormControl>
        </RenderIf>
        <RenderIf isTrue={filter === 'taxon'}>
          <Typography variant="subtitle2" gutterBottom>
            {t('OdbData.select')}{t('OdbData.Bio.taxon')}
          </Typography>
          <Autocomplete
            freeSolo
            disableClearable
            disableListWrap
            // disablePortal
            size="small"
            options={taxaList.map((taxon) => taxon)}
            onChange={handleTaxaChange}
            onFocus={() => {
              const panel = document.getElementById("navBar")
              panel!.style.overflow = 'hidden'
            }}
            onBlur={() => {
              const panel = document.getElementById("navBar")
              panel!.style.overflow = 'auto'
            }}
            PopperComponent={StyledPopper}
            ListboxComponent={LargeFixedSizeListComponent}
            inputValue={inputValue}
            onInputChange={(_, newInputValue) => {
              if (!newInputValue) {
                refCluster.current.clearLayers()
                ref.current.clearLayers()
                dispatch(odbBioSlice.actions.setTaxon(''))
              }
              setInputValue(newInputValue)
            }}
            renderOption={(props, option, state) => [props, option, state.index] as React.ReactNode}
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
        <AlertSlide open={openAlert} setOpen={setOpenAlert} severity='error' timeout={3000} >
          {alertMessage}
        </AlertSlide>
      </Box>
      <MarkerCluster
        ref={refCluster}
        disableClusteringAtZoom={clusterLevel}
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