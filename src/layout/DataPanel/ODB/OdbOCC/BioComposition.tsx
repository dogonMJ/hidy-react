import { useState, useEffect, useRef, useCallback } from 'react'
import { renderToString } from 'react-dom/server';
import { GeoJSON, Pane } from 'react-leaflet'
import { LatLng } from 'leaflet'
import { BioDataset, BioFilter } from 'types'
import { Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Paper } from '@mui/material'
import { SwitchSameColor } from "components/SwitchSameColor";
import { LegendControl } from 'components/LeafletLegend';
import * as geojson from 'geojson';
// import { MiniCharts } from './PieChart.js'
import './charts.js'

declare const L: any

const GridSwitch = SwitchSameColor()
//D:\GitHub\hidy-react\node_modules\d3\src\scale\category.js
const d3_category10 = [
  0x1f77b4, 0xff7f0e, 0x2ca02c, 0xd62728, 0x9467bd,
  0x8c564b, 0xe377c2, 0x7f7f7f, 0xbcbd22, 0x17becf
].map(value => '#' + value.toString(16));
// d3_category20+3
const category23 = [
  0x1f77b4, 0xaec7e8, 0xff7f0e, 0xffbb78, 0x2ca02c, 0x98df8a, 0xd62728, 0xff9896, 0x9467bd, 0xc5b0d5,
  0x8c564b, 0xc49c94, 0xe377c2, 0xf7b6d2, 0x7f7f7f, 0xc7c7c7, 0xbcbd22, 0xdbdb8d, 0x17becf, 0x9edae5,
  0xffff33, 0xa65628, 0xf781bf
].map(value => '#' + value.toString(16));

export const BioComposition = (props: { dataset: BioDataset, filter: BioFilter }) => {
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
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} size="small">
            <TableHead>
              <TableRow>
                <TableCell></TableCell>
                <TableCell>Count</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map(([key, value], i) => {
                if (value) {
                  return (
                    <TableRow key={key}>
                      <TableCell scope="row" style={{ textAlign: 'right' }}>
                        {key}&nbsp;
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
        </TableContainer>
      )
      layer.bindTooltip(renderToString(content))
      layer.bindPopup(renderToString(content))
    }
  }, [])

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
        setData(json)
        const legend: string[] = []
        Object.keys(json[0].properties.data).forEach((name, i) => {
          legend.push(`<i style="background:${category23[i]}; color:${category23[i]}"></i>${name}`)
        })
        setLegendContent(legend)
        ref.current.clearLayers()
        ref.current.addData(json)
      })
  }, [grid, filter, dataset])

  return (
    <>
      <Stack direction="row" spacing={1} alignItems="center">
        <Typography variant="subtitle2" gutterBottom>1&deg; Grid </Typography>
        <GridSwitch onChange={handleGridSwitch} />
        <Typography variant="subtitle2" gutterBottom>2&deg; Grid </Typography>
      </Stack>
      <Pane name='pieCharts' style={{ zIndex: 600 }}>
        <GeoJSON ref={ref} data={data} pointToLayer={pointToLayer} onEachFeature={onEachFeature} />
        <LegendControl position='bottomleft' legendContent={legendContent.join('<br>')} legendClassNames={'sedLegend'} />
      </Pane>
    </>
  )
}