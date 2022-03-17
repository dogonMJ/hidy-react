import { useMap, useMapEvents } from 'react-leaflet';
import { useRef, useEffect, useCallback } from 'react';
import { useSelector } from "react-redux";
import { RootState } from "store/store"
import Windy from './kuo_olmodwindy_color.js'

const createUrl = (indetifier: string, date: string) => {
  return `https://odbgo.oc.ntu.edu.tw/odbargo/static/data/json/${indetifier}/${date}.json`
}

const AnimatedLayers = (props: { indetifier: string }) => {
  const canvasRef = useRef<any>(null)
  const windy = useRef<any>()
  const map = useMap()
  const identifier = props.indetifier
  const datetime = useSelector((state: RootState) => state.coordInput.datetime);

  const date = datetime.split('T')[0].replace(/\D/g, '')
  const url = createUrl(identifier, date)

  const loadWindy = (jsonUrl: string) => {
    if (windy.current) {
      windy.current.stop()
    }
    const canvas = canvasRef.current
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    const mapSize = map.getSize()
    const mapView = map.getBounds()
    canvas.width = mapSize.x
    canvas.height = mapSize.y
    fetch(jsonUrl)
      .then(response => response.json())
      .then((json) => {
        windy.current = Windy({ canvas: canvas, data: json })
        windy.current.start(
          [[0, 0], [canvas.width, canvas.height]],
          canvas.width,
          canvas.height,
          [[mapView.getWest(), mapView.getSouth()], [mapView.getEast(), mapView.getNorth()]]);
      })
  }


  useEffect(() => {
    loadWindy(url)
  }, [url])

  useMapEvents({
    moveend: () => {
      loadWindy(url)
    },
  });

  return <canvas ref={canvasRef} style={{ position: 'absolute', zIndex: 999 }} />
}

export default AnimatedLayers