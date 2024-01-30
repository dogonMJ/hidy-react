import { Select, Box, Chip, MenuItem, Typography, Autocomplete, TextField, Modal, Link, FormControl, InputLabel, SelectChangeEvent, Popper, styled, autocompleteClasses } from "@mui/material"
import { useState, useEffect, useRef, SyntheticEvent, useCallback } from "react";
import { renderToString } from 'react-dom/server';
import { GeoJSON, useMap } from "react-leaflet"
import { LatLng } from "leaflet"
import { useTranslation } from "react-i18next";
import { useAppSelector, useAppDispatch } from "hooks/reduxHooks";
import * as geojson from 'geojson';
import { BioDataset, BioFilter, BioTopics, StringObject, isBioTopics } from "types";
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
import { PanelSlider } from "components/PanelSlider";
import { PanelTimeRangePickr } from "components/PanelTimePickr";

declare const L: any;

const topicList = {
  "demersal fish": { color: category23[0] },
  "eDNA fish": { color: category23[1] },
  "larval fish": { color: category23[2] },
  "macrobenthos": { color: category23[3] },
  "zooplankton": { color: category23[4] },
} as { [key in BioTopics]: StringObject }

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
  const dispatch = useAppDispatch()
  const ref = useRef<any>()
  const refCluster = useRef<any>()
  const url = useRef('')
  const map = useMap()
  const { openAlert, setOpenAlert, alertMessage, setMessage } = useAlert()
  const bioDateRange = useAppSelector(state => state.odbBio.dateRange)
  const latlonFormat = useAppSelector(state => state.map.latlonformat)
  const lat = useAppSelector(state => state.odbBio.latRange)
  const lon = useAppSelector(state => state.odbBio.lonRange)
  const topics = useAppSelector(state => state.odbBio.topics)
  const taxon = useAppSelector(state => state.odbBio.taxon)
  const clusterLevel = useAppSelector(state => state.odbBio.cluster)
  const [taxaList, setTaxaList] = useState<string[]>([''])
  const [data, setData] = useState<any>()
  const [eventID, setEventID] = useState<string>('')
  const [cite, setCite] = useState<StringObject>({ cite: '', source: '' })
  const [openModal, setOpenModal] = useState(false)
  const [inputValue, setInputValue] = useState(taxon)

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
    const topic: BioTopics = feature.properties.dataTopic
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

  const handleDateChange = useCallback((newDate: Date[]) => {
    if (newDate.length === 0) {
      setMessage(t('alert.noDate'))
    } else if (newDate.length === 1) {
      const dt = dateToBioApiString(newDate[0])
      dispatch(odbBioSlice.actions.setDateRange([dt, dt]))
    } else {
      const from = dateToBioApiString(newDate[0])
      const to = dateToBioApiString(newDate[1])
      dispatch(odbBioSlice.actions.setDateRange([from, to]))
    }
  }, [])

  const handleLatChangeCommitted = (event: SyntheticEvent | Event, newValue: number | number[]) => {
    dispatch(odbBioSlice.actions.setLat(newValue as number[]))
  };
  const handleLonChangeCommitted = (event: SyntheticEvent | Event, newValue: number | number[]) => {
    dispatch(odbBioSlice.actions.setLon(newValue as number[]))
  };
  const handleClusterLevelChange = (event: SyntheticEvent | Event, newValue: number | number[]) => {
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
  const handleDateClose = useCallback(() => {
    if (topics.length === 0) {
      setMessage(t('alert.noSelect'))
    }
  }, [])

  useEffect(() => {
    if (bioDateRange.length < 2) {
      setMessage(t('alert.noDate'))
    } else {
      if (filter === 'topic') {
        const topic = topics.toString() ? topics.toString() : ' '
        url.current = `${process.env.REACT_APP_PROXY_BASE}/data/odbocc/event/${dataset}?topic=${topic}&minLat=${lat[0]}&maxLat=${lat[1]}&minLon=${lon[0]}&maxLon=${lon[1]}&startDate=${bioDateRange[0]}&endDate=${bioDateRange[1]}`
      } else if (filter === 'taxon') {
        url.current = `${process.env.REACT_APP_PROXY_BASE}/data/odbocc/taxa/${dataset}/${taxon}?minLat=${lat[0]}&maxLat=${lat[1]}&minLon=${lon[0]}&maxLon=${lon[1]}&startDate=${bioDateRange[0]}&endDate=${bioDateRange[1]}`
      }
      if (topics.length > 0) {
        fetch(url.current)
          .then(res => res.json())
          .then(json => {
            if (json.length === 0) {
              refCluster.current.clearLayers()
              ref.current.clearLayers()
              setData(null)
              setMessage(t('alert.noData'))
            } else {
              setData(json)
              refCluster.current.clearLayers()
              ref.current.clearLayers()
              ref.current.addData(json)
              refCluster.current.addLayers(ref.current.getLayers())
            }
          })
          .catch(() => {
            setMessage(t('alert.fetchFail'))
          })
      } else {
        refCluster.current.clearLayers()
        ref.current.clearLayers()
      }
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
          {t('OdbData.chemistryList.dateRange')} 1965-Jun-29 ~ 2022-Dec-31
        </Typography>
        <PanelTimeRangePickr onChange={handleDateChange} onClose={handleDateClose} defaultValues={bioDateRange} options={{ minDate: '1965-06-29', maxDate: '2022-12-31' }} />
        <Typography variant="subtitle2" gutterBottom>
          {t('OdbData.chemistryList.latRange')} 10 ~ 40&deg;N
        </Typography>
        <PanelSlider initValue={lat} min={10} max={40} onChangeCommitted={handleLatChangeCommitted} />
        <Typography variant="subtitle2" gutterBottom>
          {t('OdbData.chemistryList.lonRange')} 109 ~ 135&deg;E
        </Typography>
        <PanelSlider initValue={lon} min={109} max={135} onChangeCommitted={handleLonChangeCommitted} />
        <Typography variant="subtitle2" gutterBottom>
          {t('clusterLevel')}
        </Typography>
        <PanelSlider initValue={clusterLevel} min={0} max={15} onChangeCommitted={handleClusterLevelChange} track={false} />
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
              {Object.keys(topicList).map((topic) => {
                if (isBioTopics(topic)) {
                  return (
                    <MenuItem
                      key={topic}
                      value={topic}
                    >
                      <Typography sx={{ backgroundColor: topicList[topic].color, color: topicList[topic].color }}>&nbsp;&nbsp;</Typography>&nbsp;&nbsp;
                      {t(`OdbData.Bio.${topic}`)}
                    </MenuItem>
                  )
                } else {
                  return null
                }
              })}
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