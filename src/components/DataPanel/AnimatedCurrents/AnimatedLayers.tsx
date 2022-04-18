import { useMap, useMapEvents } from 'react-leaflet';
import { useRef, useEffect, useState } from 'react';
import { useSelector } from "react-redux";
import { RootState } from "store/store"
import { coor } from 'types';
import Windy from './kuo_olmodwindy_color.js'
import DataToolTip from 'components/DataToolTip';

const createUrl = (indetifier: string, date: string) => {
  return `https://odbgo.oc.ntu.edu.tw/odbargo/static/data/json/${indetifier}/${date}.json`
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

const AnimatedLayers = (props: { indetifier: string }) => {
  const canvasRef = useRef<any>(null)
  const windy = useRef<any>()
  const map = useMap()
  const datetime = useSelector((state: RootState) => state.coordInput.datetime);
  const [left, setLeft] = useState<number>(0)
  const [top, setTop] = useState<number>(0)
  const [position, setPosition] = useState<coor>({ lat: 0, lng: 0 })
  const [east, setEast] = useState<number | null>(null)
  const [north, setNorth] = useState<number | null>(null)
  const [currentSpd, setCurrentSpd] = useState<string | null>(null)

  const identifier = props.indetifier
  const date = changeDate(datetime)
  const url = createUrl(identifier, date)
  console.log(identifier)

  const loadWindy = (jsonUrl: string) => {
    if (windy.current) {
      windy.current.stop()
    }
    const canvas = canvasRef.current
    const mapSize = map.getSize()
    const mapView = map.getBounds()
    canvas.width = mapSize.x
    canvas.height = mapSize.y

    fetch(jsonUrl)
      .then(response => response.json())
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
  }

  const adjustXY = (boundOrigin: L.Bounds, origin: L.Point) => {
    if (boundOrigin.min) {
      setLeft(boundOrigin.min?.x - origin.x)
      setTop(boundOrigin.min.y - origin.y)
    }
  }

  useEffect(() => {
    adjustXY(map.getPixelBounds(), map.getPixelOrigin())
    loadWindy(url)
  }, [url])

  useMapEvents({
    moveend: () => {
      adjustXY(map.getPixelBounds(), map.getPixelOrigin())
      loadWindy(url)
    },
    mousedown: (e) => {
      // kuo修改之json有東+0.125北-0.125度，方格和CMEMS對不上,須修正
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
        const currentSpd = Math.sqrt(Math.pow(east, 2) + Math.pow(north, 2)).toFixed(2)
        setEast(east)
        setNorth(north)
        setCurrentSpd(currentSpd)
      } else {
        setCurrentSpd(null)
      }
      setPosition(e.latlng)
    }
  });

  return (
    <>
      {
        east && north && currentSpd &&
        <DataToolTip
          position={position}
          content={
            `${currentSpd} m/s \n${east} m/s → \n${north} m/s ↑`
          } />
      }
      <canvas ref={canvasRef} style={{ left: left, top: top }} />
    </>
  )
}

export default AnimatedLayers