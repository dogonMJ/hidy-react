import { useState, useEffect, useRef, useCallback } from 'react'
import { renderToString } from 'react-dom/server';
import { GeoJSON, Pane } from 'react-leaflet'
import { LatLng } from 'leaflet'
import { useTranslation } from 'react-i18next';
import { BioDataset, BioFilter } from 'types'
import { Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material'
import { SwitchSameColor } from "components/SwitchSameColor";
import { LegendControl } from 'components/LeafletLegend';
import { category23 } from 'Utils/UtilsODB';
import * as geojson from 'geojson';
// import { MiniCharts } from './PieChart.js'
import './charts.js'

declare const L: any

const GridSwitch = SwitchSameColor()

export const BioComposition = (props: { dataset: BioDataset, filter: BioFilter }) => {
  const { t } = useTranslation()
  const { dataset, filter } = props
  const ref = useRef<any>()
  const [grid, setGrid] = useState<1 | 2>(1)
  const [data, setData] = useState<any>()
  const [legendContent, setLegendContent] = useState<string[]>([])
  const handleGridSwitch = () => grid === 1 ? setGrid(2) : setGrid(1)

  const onEachFeature = useCallback((feature: geojson.Feature<geojson.GeometryObject, any>, layer: L.Layer) => {
    if (feature.geometry.type === 'Point') {
      const data: [string, null | number][] = Object.entries(feature.properties.data)
      const content = (
        <Table sx={{ minWidth: 650 }} size="small">
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell>{t('OdbData.Bio.count')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {
              data.map(([key, value], i) => {
                if (value) {
                  return (
                    <TableRow key={key}>
                      <TableCell scope="row" style={{ textAlign: 'right' }}>
                        {filter === 'topic' ? t(`OdbData.Bio.${key}`) : key} &nbsp;
                        <b style={{ background: category23[i], color: category23[i] }}>●</b>
                      </TableCell>
                      <TableCell style={{ textAlign: 'right' }}>
                        {value}
                      </TableCell>
                    </TableRow>
                  )
                } else {
                  return null
                }
              })
            }
          </TableBody>
        </Table>
      )
      layer.bindTooltip(renderToString(content))
      layer.bindPopup(renderToString(content))
    }
  }, [filter, t])

  const pointToLayer = (feature: geojson.Feature<geojson.Point, any>, latlng: LatLng) => {
    return L.minichart.Charts(latlng, {
      data: Object.values(feature.properties.data),
      type: 'pie',
      sizeFactor: 5,
      paneName: 'pieCharts',
      colors: category23,
    })
  }

  useEffect(() => {
    fetch(`https://seaimage.oc.ntu.edu.tw/occapi/grid/${dataset}/${grid}/${filter}`)
      .then(response => response.json())
      .then(json => {
        ref.current.clearLayers()
        setData(json)
        const legend: string[] = []
        if (filter === 'topic') {
          Object.keys(json[0].properties.data).forEach((name, i) => {
            legend.push(`<i style="background:${category23[i]}; color:${category23[i]}"></i>${t(`OdbData.Bio.${name}`)}`)
          })
        } else {
          Object.keys(json[0].properties.data).forEach((name, i) => {
            legend.push(`<i style="background:${category23[i]}; color:${category23[i]}"></i>${name}`)
          })
        }
        setLegendContent(legend)
        ref.current.addData(json)
      })
  }, [grid, filter, dataset, t])

  return (
    <>
      <Stack direction="row" spacing={1} alignItems="center">
        <Typography variant="subtitle2" gutterBottom>1&deg; {t('OdbData.Bio.grid')} </Typography>
        <GridSwitch onChange={handleGridSwitch} />
        <Typography variant="subtitle2" gutterBottom>2&deg; {t('OdbData.Bio.grid')} </Typography>
      </Stack>
      <Pane name='pieCharts' style={{ zIndex: 600 }}>
        <GeoJSON key={filter} ref={ref} data={data} pointToLayer={pointToLayer} onEachFeature={onEachFeature} />
        <LegendControl position='bottomleft' legendContent={legendContent.join('<br>')} legendClassNames={'sedLegend'} />
      </Pane>
    </>
  )
}