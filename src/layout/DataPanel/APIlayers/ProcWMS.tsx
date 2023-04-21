import { useEffect, useRef, useState } from "react";
import { LayerGroup } from 'react-leaflet'
import L from 'leaflet'
import wmsList from 'assets/jsons/WMSList.json'
import { TileLayerCanvas } from '../../../components/TileLayerCanvas'
import ShowData from './ShowData'
import { Api, TileProp } from 'types'
import { DepthMeter } from 'components/DepthlMeter';
import { useSelector } from "react-redux";
import { RootState } from "store/store"
import { RenderIf } from "components/RenderIf/RenderIf";
import { timeDuration } from "Utils/UtilsURL";
import { getMarks, noTileCached, checkTile } from "Utils/UtilsApi";

/*
PROCESS NASA GIBS URL
WMS Capabilities:
https://gibs.earthdata.nasa.gov/wms/epsg3857/best/wms.cgi?SERVICE=WMS&REQUEST=GetCapabilities&VERSION=1.3.0
*/
interface Urls {
  Identifier: string
  Time: string
  cache: any
  // elevation: number
}
const propsWMTS = (api: Api, time: string, key: string) => {
  return {
    type: api.type,
    url: `${api.url}/${api.layer}/${api.style}/${time}/${api.tileMatrixSet}/{z}/{y}/{x}.${api.formatExt}`,
    params: {
      key: key,
      crossOrigin: api.crossOrigin,
      opacity: 0,
    },
  }
}
const propsWMS = (api: Api, time: string, key: string, elevation: number) => {
  return {
    type: api.type,
    url: api.url,
    params: {
      time: time,
      key: key,
      elevation: elevation,
      crossOrigin: api.crossOrigin,
      layers: api.layer,
      styles: api.style,
      format: api.format,
      transparent: api.transparent,
    },
  }
}

const depths = [-5727.9169921875, -5274.7841796875, -4833.291015625, -4405.22412109375, -3992.48388671875, -3597.031982421875, -3220.820068359375, -2865.702880859375, -2533.3359375, -2225.077880859375, -1941.8929443359375, -1684.2840576171875, -1452.2509765625, -1245.291015625, -1062.43994140625, -902.3392944335938, -763.3331298828125, -643.5667724609375, -541.0889282226562, -453.9377136230469, -380.2130126953125, -318.1274108886719, -266.0403137207031, -222.47520446777344, -186.12559509277344, -155.85069274902344, -130.66600036621094, -109.72930145263672, -92.3260726928711, -77.85385131835938, -65.80726623535156, -55.76428985595703, -47.37369155883789, -40.344051361083984, -34.43415069580078, -29.444730758666992, -25.211410522460938, -21.598819732666016, -18.495559692382812, -15.810070037841797, -13.467140197753906, -11.404999732971191, -9.572997093200684, -7.92956018447876, -6.440614223480225, -5.078224182128906, -3.8194949626922607, -2.6456689834594727, -1.5413750410079956, -0.49402499198913574]
// depths from https://nrt.cmems-du.eu/thredds/wms/global-analysis-forecast-phy-001-024-3dinst-thetao?request=GetCapabilities&service=WMS
const is3D = (identifier: string) => identifier.slice(0, 2) === '3d' ? true : false

const tileProps: TileProp[] = []
const ProcWMS = (props: Urls) => {
  const depthMeterValue = useSelector((state: RootState) => state.coordInput.depthMeterValue)
  const ref = useRef<L.LayerGroup>(null)
  const [layerId, setLayerId] = useState<number | null>(null)
  const [tileExist, setTileExist] = useState(false)
  const api: Api = wmsList[props.Identifier as keyof typeof wmsList]
  const time = timeDuration(props.Time, api.duration)

  const depth = depths[depthMeterValue] && is3D(props.Identifier) ? depths[depthMeterValue] : -0.49402499198913574
  const key = api.layer + time + depth

  if (noTileCached(tileProps, key)) {
    switch (api.type) {
      case 'wms':
        checkTile(api.url, api.layer, time)
          .then((exist) => setTileExist(exist))
        if (tileExist) {
          tileProps.push(propsWMS(api, time, key, depth))
        }
        break;
      case 'wmts':
        tileProps.push(propsWMTS(api, time, key))
        break;
    }
  }

  const layerEventHandlers = {
    error: () => console.log('error'),
    load: (e: any) => console.log('load', e),
    loading: (e: any) => console.log('loading', e),
    tileerror: () => console.log('tileerror')
  }

  useEffect(() => {
    if (ref.current) {
      ref.current.eachLayer((layer: any) => {
        if (layer.options.key === key && ref.current) {
          setLayerId(ref.current.getLayerId(layer))
          layer.setOpacity(1)
        } else {
          layer.setOpacity(0)
        }
      })
    } else {
      setTileExist(false)
    }

  }, [key]);

  return (
    <>
      <LayerGroup ref={ref}>
        {tileProps.map((tileProp: TileProp) => {
          return <TileLayerCanvas key={tileProp.params.key} type={tileProp.type} url={tileProp.url} params={tileProp.params} eventHandlers={layerEventHandlers} />
        })}
      </LayerGroup>
      <ShowData layergroup={ref.current} layerId={layerId} identifier={props.Identifier} datetime={time} elevation={depth} param={api} />
      <RenderIf isTrue={is3D(props.Identifier)}>
        <DepthMeter values={depths} marks={getMarks('m', depths)} />
      </RenderIf>
    </>
  )
}
export default ProcWMS