import { ImageOverlay } from "react-leaflet";
import { useEffect, useState } from "react";

const imgList = Array.from(Array(13), (e, i) => i + 10)
const urlList: string[] = []
imgList.forEach((i) => {
  urlList.unshift('https://odbpo.oc.ntu.edu.tw/static/figs/cwbdata/R' + i + '.png')
})

const CwbRadar = () => {
  const [imgUrl, setImgUrl] = useState<string>(urlList[0]);
  const [index, setIndex] = useState(0);
  useEffect(() => {

    const timerID = setInterval(() =>
      setIndex((i) => (i + 1) % imgList.length),
      1000);
    return () => clearInterval(timerID)
  }, []);

  useEffect(() => {
    setImgUrl(urlList[index]);
  }, [index]);

  return (
    <ImageOverlay url={imgUrl} crossOrigin='anonymous' bounds={[[17.75, 115], [29.25, 126.5]]} />
  )
}

export default CwbRadar