import { Pane, useMap } from 'react-leaflet';
import { useEffect, useState, useRef } from 'react';
import { useTranslation } from "react-i18next";
import Draggable from "react-draggable"
import { IconButton } from "@mui/material"
import CloseIcon from '@mui/icons-material/Close';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

interface CplanDataTable {
  id: number | null;
  name: string | null;
  lat: number | null;
  lon: number | null;
  stay?: number;
  spd?: number;
  inst?: string | string[];
  dist?: number | string;
}

const instrumentList: { [index: string]: [number, string] } = {
  "C": [1, "CTD"],
  "R": [2, "Rosette"],
  "GC": [3, "Gravity-core"],
  "MC": [4, "Multi-core"],
  "SC": [5, "Smith-core"],
  "SG": [6, "Shipek Grab"],
  "T": [7, "Trawling"],
  "BT": [8, "Big Trawling"],
  "M": [9, "Mooring"],
  "SS": [10, "Side Scan"],
  "PT": [11, "Path through"],
  "O": [12, "Other"],
  "LADCP": [13, "LADCP"],
  "VMP500": [14, "VMP500"],
  "B": [15, "box-core"],
  "XBT": [16, "XBT"],
  "PC": [17, "Pistion-Core"],
  "D": [18, "Dredge"],
  "J": [19, "Seismic"],
  "ST": [20, "Sediment Trap"]
}

export const DataTable = (props: { data: any, setOpen: React.Dispatch<React.SetStateAction<boolean>>, }) => {
  const map = useMap()
  const nodeRef = useRef(null)
  const { t } = useTranslation()
  const [dragDisabled, setDragDisabled] = useState(false)
  const [content, setContent] = useState<CplanDataTable[]>([{
    id: null,
    name: null,
    lat: null,
    lon: null,
  }])

  const layerCenterPoint = map.latLngToLayerPoint(map.getBounds().getCenter())
  const disableMapAction = () => {
    map.dragging.disable()
    map.scrollWheelZoom.disable()
  }
  const enableMapAction = () => {
    map.dragging.enable()
    map.scrollWheelZoom.enable()
  }
  const onClick = () => {
    enableMapAction()
    props.setOpen(false)
  }
  const handleInstrument = (workitem: string) => {
    const instruments = JSON.parse(workitem)
    let res: string[] = []
    instruments.item.forEach((instrument: string) => {
      if (instrument === 'O') {
        res.push(instruments.other)
      }
      else if (instrument !== 'PT') {
        res.push(instrumentList[instrument][1])
      }
    })
    return res.join(', ')
  }

  useEffect(() => {
    const temp: any = []
    props.data.getLayers().forEach((layer: any) => {
      const feature = layer.feature
      if (feature.geometry.type === 'Point') {
        temp.push({
          id: feature.properties.id,
          name: feature.properties.name,
          lat: feature.geometry.coordinates[1],
          lon: feature.geometry.coordinates[0],
        })
      } else if (feature.geometry.type === 'LineString' && feature.properties.id.length > 0) {
        const length = [0]
        const coords = layer.getLatLngs()
        for (let i = 0; i < coords.length - 1; i++) {
          const dist = coords[i].distanceTo(coords[i + 1]) / 1.852
          length.push(Math.round(dist / 10) / 100)
        }
        temp.forEach((tempFeature: CplanDataTable) => {
          feature.properties.id.forEach((id: string, i: number) => {
            if (parseInt(id, 10) === tempFeature.id) {
              tempFeature.stay = feature.properties.stayhr[i]
              tempFeature.spd = feature.properties.shipspd[i]
              tempFeature.inst = handleInstrument(feature.properties.workitem[i])
              tempFeature.dist = length[i]
            }
          })
        })
      }
    })
    setContent([...temp])
  }, [props.data])

  return (
    <Pane name='cplaneDataTabelPane' style={{ zIndex: 800 }}>
      <Draggable
        nodeRef={nodeRef}
        defaultPosition={{ x: layerCenterPoint.x - 400, y: layerCenterPoint.y + 60 }}
        disabled={dragDisabled}
      >
        <div
          ref={nodeRef}
          onMouseEnter={disableMapAction}
          onMouseLeave={enableMapAction}
          style={{
            backgroundColor: '#e0e0e0',
            width: 800,
            height: 50,
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between'
            }}>
            <span
              style={{
                fontSize: 16,
                marginLeft: 16,
                display: 'flex',
                alignItems: 'center'
              }}>
              {props.data.layername}
            </span>
            <IconButton
              onClick={onClick}
            >
              <CloseIcon />
            </IconButton>
          </div>
          <TableContainer
            component={Paper}
            onMouseEnter={() => { setDragDisabled(true) }}
            onMouseLeave={() => { setDragDisabled(false) }}
          >
            <Table size="small" aria-label="cruise data table">
              <TableHead>
                <TableRow>
                  <TableCell>{t('CPlanLayers.table.id')}</TableCell>
                  <TableCell align="right">{t('CPlanLayers.table.name')}</TableCell>
                  <TableCell align="right">{t('CPlanLayers.table.lat')}</TableCell>
                  <TableCell align="right">{t('CPlanLayers.table.lon')}</TableCell>
                  <TableCell align="right">{t('CPlanLayers.table.time')}(hr)</TableCell>
                  <TableCell align="right">{t('CPlanLayers.table.speed')}(kt)</TableCell>
                  <TableCell align="right">{t('CPlanLayers.table.inst')}</TableCell>
                  <TableCell align="right">{t('CPlanLayers.table.dist')}(nm)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {content.map((content, i) => {
                  if (content.id === 0 || (content.id && content.id > 0)) {
                    return (
                      <TableRow
                        key={i}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                        <TableCell component="th" scope="row">
                          {content.id}
                        </TableCell>
                        <TableCell align="right">{content.name}</TableCell>
                        <TableCell align="right">{content.lat}</TableCell>
                        <TableCell align="right">{content.lon}</TableCell>
                        <TableCell align="right">{content.stay}</TableCell>
                        <TableCell align="right">{content.spd}</TableCell>
                        <TableCell align="right">{content.inst}</TableCell>
                        <TableCell align="right">{content.dist}</TableCell>
                      </TableRow>
                    )
                  } else {
                    return null
                  }
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </Draggable >
    </Pane >
  )
}