import { useMap, useMapEvents } from 'react-leaflet';
import { useRef, useEffect, useState } from 'react';
import Windy from './kuo_olmodwindy_color.js'
import DataToolTip from 'components/DataToolTip';

interface ToolTip {
  lat: number | null
  lng: number | null
  north: number | null
  east: number | null
  composite: string | null
}

const changeDate = (datetime: string) => {
  // 008_046 time coverage 12:00~12:00(+1) UTC
  if (Number(datetime[11] + datetime[12]) >= 12) {
    const d = new Date(datetime)
    d.setDate(d.getDate() + 1)
    return d.toISOString().split('T')[0].replace(/\D/g, '')
  } else {
    return datetime.split('T')[0].replace(/\D/g, '')
  }
}

const AnimatedLayers = (props: { identifier: string, time: string }) => {
  const { identifier, time } = props

  const canvasRef = useRef<any>(null)
  const windy = useRef<any>()
  const map = useMap()
  const [topLeft, setTopLeft] = useState({ top: 0, left: 0 })
  const [toolTip, setToolTip] = useState<ToolTip>({ lat: null, lng: null, north: null, east: null, composite: null })

  const date = changeDate(time)
  const url = `${process.env.REACT_APP_PROXY_BASE}/data/odbdata/json/${identifier}/${date}.json`
  const loadWindy = async (jsonUrl: string) => {
    if (windy.current) {
      windy.current.stop()
    }
    const canvas = canvasRef.current
    const mapSize = map.getSize()
    const mapView = map.getBounds()
    canvas.width = mapSize.x
    canvas.height = mapSize.y
    fetch(jsonUrl)
      .then((response) => response.json())
      .then((json) => {
        sessionStorage['jsonData'] = JSON.stringify(json);
        windy.current = Windy({ canvas: canvas, data: json })
        windy.current.start(
          [[0, 0], [canvas.width, canvas.height]],
          canvas.width,
          canvas.height,
          [[mapView.getWest(), mapView.getSouth()], [mapView.getEast(), mapView.getNorth()]]
        );
      })
      .catch((e) => { })
  }

  const adjustXY = (boundOrigin: L.Bounds, origin: L.Point) => {
    if (boundOrigin.min) {
      setTopLeft({ top: boundOrigin.min.y - origin.y, left: boundOrigin.min?.x - origin.x })
    }
  }
  useEffect(() => {
    adjustXY(map.getPixelBounds(), map.getPixelOrigin())
    return () => {
      sessionStorage.removeItem('jsonData')
    }
  }, [])
  useEffect(() => {
    // adjustXY(map.getPixelBounds(), map.getPixelOrigin())
    loadWindy(url)
  }, [url])

  useMapEvents({
    moveend: () => {
      adjustXY(map.getPixelBounds(), map.getPixelOrigin())
      loadWindy(url)
    },
    mousedown: (e) => {
      // kuo修改之json有東+0.125北-0.125度，方格和CMEMS對不上,須修正
      if (sessionStorage['jsonData']) {
        const jsonData = JSON.parse(sessionStorage['jsonData']);
        const nx = jsonData[0].header.nx
        const ny = jsonData[0].header.ny
        const dx = jsonData[0].header.dx
        const dy = jsonData[0].header.dy
        const ul = [jsonData[0].header.lo1, jsonData[0].header.la1]
        const x = Math.ceil((e.latlng.lng - (ul[0] - dx / 2)) / dx) - 1
        const y = Math.floor(((ul[1] + dy / 2) - e.latlng.lat) / dy)
        if (x < nx && x >= 0 && y < ny) {
          const i = x + y * nx
          const east = jsonData[0].data[i] //ugos, ugosa
          const north = jsonData[1].data[i] //vgos, vgosa
          const composite = Math.sqrt(Math.pow(east, 2) + Math.pow(north, 2)).toFixed(2)
          setToolTip({ lat: e.latlng.lat, lng: e.latlng.lng, north: north, east: east, composite: composite })
        } else {
          setToolTip({ lat: null, lng: null, north: null, east: null, composite: null })
        }
      }
    }
  });

  return (
    <>
      {
        toolTip.east && toolTip.north && toolTip.composite && toolTip.lat && toolTip.lng &&
        <DataToolTip
          position={{ lat: toolTip.lat, lng: toolTip.lng }}
          content={
            `${toolTip.composite} m/s \n${toolTip.east} m/s → \n${toolTip.north} m/s ↑`
          } />
      }
      <canvas ref={canvasRef} style={{ left: topLeft.left, top: topLeft.top }} />
    </>
  )
}

export default AnimatedLayers