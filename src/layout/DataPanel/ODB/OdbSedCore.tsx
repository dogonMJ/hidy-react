import { useEffect, useState, useRef } from 'react'
import { GeoJSON, Tooltip } from 'react-leaflet'
import { useSelector } from "react-redux";
import { RootState } from "store/store"
import { coor } from 'types';
import FormatCoordinate from 'components/FormatCoordinate';
import { LatLng } from 'leaflet';
import L from "leaflet";

interface Style {
  color: string
  radius: number
  opacity: number
}

export const OdbSedCore = () => {
  const ref = useRef<any>()
  const [data, setData] = useState<any>()
  const [position, setPosition] = useState<coor>({ lat: 0, lng: 0 })
  const [content, setContent] = useState('')
  const latlonFormat = useSelector((state: RootState) => state.coordInput.latlonformat)

  const mouseOver = (e: any) => {
    const feature = e.layer.feature
    const coordinate = feature.geometry.coordinates.slice(0, -1)
    const instrument = feature.properties.instrument
    setPosition({ lat: coordinate[1], lng: coordinate[0] })
    setContent(instrument)
  }

  const pointToLayer = (f: any, l: LatLng) => {
    return new L.CircleMarker(l)
  }

  const styleFunc = (feature: any) => {
    const instrument = feature.properties.instrument
    const style: Style = {
      color: '#687978 ',
      radius: 2,
      opacity: 0.8
    }
    switch (instrument) {
      case 'SG(Sediment Grab)沉積物抓攫器':
        style.color = "#ff7800"
        return style
      case 'GC(Gravity core)重力岩心採樣器':
        style.color = "#5bc2e7"
        return style
      case 'BC(Box core)箱形岩心採樣器':
        style.color = "#8fce00"
        return style
      case 'GHP地熱探針':
        style.color = "#8e7cc3"
        return style
      case 'PC(Piston core)活塞型沈積物採樣器':
        style.color = "#ffed00"
        return style
      default:
        return style;
    }
  }
  useEffect(() => {
    fetch('https://odbpo.oc.ntu.edu.tw/static/figs/odb/sedcore.json')
      .then((response) => response.json())
      .then((json) => {
        setData(json)
        ref.current.clearLayers()
        ref.current.addData(json)
      });
  }, [])

  return (
    <>
      <GeoJSON ref={ref} data={data} style={styleFunc} pointToLayer={pointToLayer} eventHandlers={{ mouseover: mouseOver }}>
        <Tooltip>
          <FormatCoordinate coords={position} format={latlonFormat} /><br />
          <span style={{ whiteSpace: 'pre-line' }}>{content}</span>
        </Tooltip>
      </GeoJSON>
    </>
  )
}