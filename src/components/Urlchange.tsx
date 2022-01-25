import React, { useEffect, useRef } from "react";
import { TileLayer } from 'react-leaflet'

type Urls = {
  urlRoot: string
  urlDate: Date
  urlEnd: string
}
const ProcUrls = (props: Urls) => {
  const ref = useRef<any>(null)
  const newDate = props.urlDate.toISOString().split('T')[0]
  const url = props.urlRoot + newDate + props.urlEnd
  useEffect(() => {
    // 3. 觸發side effect，TileLayer執行setUrl method，重繪
    // setUrl: Updates the layer's URL template and redraws it
    ref.current.setUrl(url)
  });
  // 1.更改url

  return (
    <>
      {/* 2.渲染DOM */}
      <TileLayer ref={ref} url={url} />
    </>
  )
}

export default ProcUrls