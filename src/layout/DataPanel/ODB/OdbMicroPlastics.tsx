import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Select, OutlinedInput, Box, Chip, MenuItem, Typography, Stack, Divider, Link } from "@mui/material"
import { useEffect, useRef, SyntheticEvent, useCallback } from "react";
import { renderToString } from 'react-dom/server';
import { odbPlasticSlice } from "store/slice/odbPlasticSlice";
import { useAppSelector, useAppDispatch } from "hooks/reduxHooks";
import { GeoJSON } from "react-leaflet"
import L, { LatLng } from "leaflet"
import { SelectChangeEvent } from "@mui/material";
import { AlertSlide } from "components/AlertSlide/AlertSlide";
import FormatCoordinate from "components/FormatCoordinate";
import * as geojson from 'geojson';
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
//@ts-ignore
import MarkerCluster from '@changey/react-leaflet-markercluster'
import { useTranslation } from "react-i18next";
import { useAlert } from "hooks/useAlert";
import { PanelSlider } from "components/PanelSlider";
import { PanelTimeRangePickr } from "components/PanelTimePickr";
import { MPLevels } from "types";


interface PlasticConcentration {
  [key: MPLevels]: {
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
  const dispatch = useAppDispatch()//useDispatch()
  const ref = useRef<any>()
  const refCluster = useRef<any>()
  const { openAlert, alertMessage, setOpenAlert, showAlert } = useAlert()
  const latlonFormat = useAppSelector(state => state.coordInput.latlonformat)
  const dataset = useAppSelector(state => state.odbMP.dataset)
  const date = useAppSelector(state => state.odbMP.date)
  const levels = useAppSelector(state => state.odbMP.levels)
  const lat = useAppSelector(state => state.odbMP.lat)
  const lon = useAppSelector(state => state.odbMP.lon)
  const clusterLevel = useAppSelector(state => state.odbMP.clusterLevel)

  const onEachFeature = (feature: geojson.Feature<geojson.Point, any>, layers: L.LayerGroup) => {
    const property = feature.properties
    const content = (
      <Box>
        {/* {t('OdbData.location')}: {feature.geometry.coordinates[1]}, {feature.geometry.coordinates[0]}<br /> */}
        <FormatCoordinate coords={feature.geometry.coordinates} format={latlonFormat} /><br />
        {t('OdbData.date')}: {property.eventDate}<br />
        {t('OdbData.plastic.type')}: {property.measurementType}<br />
        {t('OdbData.plastic.concentration')}:
        {" "}{t(`OdbData.plastic.${property.densityClass}`)} {" "}
        <b style={{
          background: levelList[property.densityClass].color,
          color: levelList[property.densityClass].color
        }}>●</b>
        <br />
      </Box>
    )
    const refernce = property.DOI ?
      (<Box>
        {t('OdbData.source')}:<br />
        {property.organization}<br />
        {t('OdbData.cite')}:<br />
        <Link href={property.DOI} target="_blank" rel="noreferrer" >
          <Typography style={{ paddingLeft: '15px', textIndent: '-15px', margin: 0 }}>
            {property.bibliographicCitation}
          </Typography>
        </Link>
      </Box>)
      :
      (<Box>
        {t('OdbData.source')}:<br />
        {property.organization}<br />
        {t('OdbData.cite')}:<br />
        <Typography style={{ paddingLeft: '15px', textIndent: '-15px', margin: 0 }}>
          {property.bibliographicCitation}
        </Typography>
      </Box>)
    layers.getLayers().forEach((layer: L.Layer) => {
      layer.bindPopup(renderToString(content) + renderToString(refernce))
      layer.bindTooltip(renderToString(content))
    })
  }

  const pointToLayer = (feature: geojson.Feature<geojson.Point, any>, latlng: LatLng) => {
    const density = feature.properties.densityClass as string
    const marker = new L.CircleMarker(latlng, { radius: 4, weight: 2, color: levelList[density].color })
    const shiftedMarker = new L.CircleMarker([latlng.lat, latlng.lng + 360], { radius: 4, weight: 2, color: levelList[density].color })
    const markerGroup = L.layerGroup([marker, shiftedMarker]);
    return markerGroup
  }

  const handleLevelChange = (event: SelectChangeEvent<typeof levels>) => {
    const { target: { value } } = event
    dispatch(odbPlasticSlice.actions.setLevels(typeof value === 'string' ? value.split(',') : value))
  }

  const handleDatasetChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(odbPlasticSlice.actions.setDataset((event.target as HTMLInputElement).value))
  };

  const handleDateChange = useCallback((newDate: Date[]) => {
    if (newDate.length === 0) {
      showAlert(t('alert.noDate'))
    } else if (newDate.length === 1) {
      const dt = dateToApiString(newDate[0])
      dispatch(odbPlasticSlice.actions.setDate([dt, dt]))
    } else {
      const from = dateToApiString(newDate[0])
      const to = dateToApiString(newDate[1])
      dispatch(odbPlasticSlice.actions.setDate([from, to]))
    }
  }, [])

  const handleLatChangeCommitted = (event: SyntheticEvent | Event, newValue: number | number[]) => {
    dispatch(odbPlasticSlice.actions.setLat(newValue as number[]))
  };
  const handleLonChangeCommitted = (event: SyntheticEvent | Event, newValue: number | number[]) => {
    dispatch(odbPlasticSlice.actions.setLon(newValue as number[]))
  };
  const handleClusterLevelChange = (event: SyntheticEvent | Event, newValue: number | number[]) => {
    dispatch(odbPlasticSlice.actions.setClusterLevel(newValue as number))
    refCluster.current.options.disableClusteringAtZoom = newValue
    refCluster.current.clearLayers()
    refCluster.current.addLayers(ref.current.getLayers())
  }

  const handleDateClose = useCallback(() => {
    if (levels.length === 0) {
      showAlert(t('alert.noSelect'))
    }
  }, [])

  useEffect(() => {
    if (date.length < 2) {
      showAlert(t('alert.noDate'))
    } else {
      if (levels.toString()) {
        const url = `${process.env.REACT_APP_PROXY_BASE}/data/odbocc/litter/${dataset}?level=${levels.toString()}&minLat=${lat[0]}&maxLat=${lat[1]}&minLon=${lon[0]}&maxLon=${lon[1]}&startDate=${date[0]}&endDate=${date[1]}`
        fetch(url)
          .then(res => res.json())
          .then(json => {
            if (json.length === 0) {
              refCluster.current.clearLayers()
              ref.current.clearLayers()
              showAlert(t('alert.noData'))
            } else {
              // setData(json)
              refCluster.current.clearLayers()
              ref.current.clearLayers()
              ref.current.addData(json)
              refCluster.current.addLayers(ref.current.getLayers())
            }
          })
          .catch(() => showAlert(t('alert.fetchFail')))
      } else {
        refCluster.current.clearLayers()
        ref.current.clearLayers()
      }
    }
  }, [levels, dataset, lon, lat, date, t])

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
          <PanelTimeRangePickr onChange={handleDateChange} onClose={handleDateClose} defaultValues={date} options={{ minDate: '1972-04-20' }} />
          <Typography variant="subtitle2" gutterBottom>
            {t('OdbData.chemistryList.latRange')}&plusmn;90&deg;
          </Typography>
          <PanelSlider min={-90} max={90} initValue={lat} onChangeCommitted={handleLatChangeCommitted} />
          <Typography variant="subtitle2" gutterBottom>
            {t('OdbData.chemistryList.lonRange')}&plusmn;180&deg;
          </Typography>
          <PanelSlider min={-180} max={180} initValue={lon} onChangeCommitted={handleLonChangeCommitted} />
          <Typography variant="subtitle2" gutterBottom>
            {t('clusterLevel')}
          </Typography>
          <PanelSlider min={0} max={10} initValue={clusterLevel} onChangeCommitted={handleClusterLevelChange} track={false} />
          <Typography variant="subtitle2" gutterBottom>
            {t('OdbData.select')}{t('OdbData.plastic.concentration')} ({t('OdbData.plastic.pieces')}/m<sup>3</sup>){t(`muti`)}
          </Typography>
          <Select
            multiple
            fullWidth
            size="small"
            value={levels}
            onChange={handleLevelChange}
            input={<OutlinedInput label="Levels" />}
            sx={{
              maxWidth: 344
            }}
            renderValue={(selected) => {
              return (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={t(`OdbData.plastic.${value}`)} />
                  ))}
                </Box>
              )
            }
            }
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
          <AlertSlide open={openAlert} setOpen={setOpenAlert} severity='error' timeout={3000} > {alertMessage} </AlertSlide>
        </Stack>
      </Box>
      <MarkerCluster
        ref={refCluster}
        disableClusteringAtZoom={clusterLevel}
        maxClusterRadius={60}
      >
        <GeoJSON ref={ref} data={{ type: 'Feature' }} pointToLayer={pointToLayer} onEachFeature={onEachFeature} />
      </MarkerCluster>
    </>
  )
}