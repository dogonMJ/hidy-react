import { SliderMarks, TileProp } from 'types'
// const depths = [-5727.9169921875, -5274.7841796875, -4833.291015625, -4405.22412109375, -3992.48388671875, -3597.031982421875, -3220.820068359375, -2865.702880859375, -2533.3359375, -2225.077880859375, -1941.8929443359375, -1684.2840576171875, -1452.2509765625, -1245.291015625, -1062.43994140625, -902.3392944335938, -763.3331298828125, -643.5667724609375, -541.0889282226562, -453.9377136230469, -380.2130126953125, -318.1274108886719, -266.0403137207031, -222.47520446777344, -186.12559509277344, -155.85069274902344, -130.66600036621094, -109.72930145263672, -92.3260726928711, -77.85385131835938, -65.80726623535156, -55.76428985595703, -47.37369155883789, -40.344051361083984, -34.43415069580078, -29.444730758666992, -25.211410522460938, -21.598819732666016, -18.495559692382812, -15.810070037841797, -13.467140197753906, -11.404999732971191, -9.572997093200684, -7.92956018447876, -6.440614223480225, -5.078224182128906, -3.8194949626922607, -2.6456689834594727, -1.5413750410079956, -0.49402499198913574]
// depths from https://nrt.cmems-du.eu/thredds/wms/global-analysis-forecast-phy-001-024-3dinst-thetao?request=GetCapabilities&service=WMS

const isValueExist = (value: any) => value ? true : false
const getTickValues = (ticks: number[], valueArray: number[]) => {
  const values: number[] = []
  ticks.forEach((tick) => {
    const found = valueArray.find((value) => value >= tick)
    if (found) {
      values.push(found)
    }
  })
  return values
}
export const getMarks = (unit: string, valueArray: number[], ticks = [0, -20, -100, -500, -1000, -2000, -3000, -4000]) => {
  const result: SliderMarks[] = []
  const sorted = valueArray.sort((a, b) => a - b)
  const tickValues = getTickValues(ticks, sorted)
  sorted.forEach((value, i) => {
    result.push({ value: i, label: '' })
  })
  tickValues.filter(isValueExist).forEach((value) => {
    const index = sorted.indexOf(value)
    result[index] = { value: index, label: `${Math.round(value)} ${unit}` }
  })
  const lstIdx = sorted.length - 1
  result[lstIdx] = { value: lstIdx, label: `${Math.round(sorted[lstIdx])} ${unit}` }
  result[0] = { value: 0, label: `${Math.round(sorted[0])} ${unit}` }
  return result
}

export const noTileCached = (tileProps: TileProp[], key: string) => !tileProps.some((tile: TileProp) => tile.params.key === key)

const checkTime = async (url: string, time: string) => {
  const timeout = 10000
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  let res = false
  await fetch(url, { signal: controller.signal })
    .then((response) => response.text())
    .then((text) => new window.DOMParser().parseFromString(text, "text/html"))
    .then((xml) => xml.getElementsByName("time")[0].childNodes[0].nodeValue)
    .then((str) => {
      if (str) {
        const tileTime = str.replace(/\s/g, '').split('/')
        const startTime = Date.parse(tileTime[0])
        const lastTime = Date.parse(tileTime[1])
        const currentTime = Date.parse(time)
        if (currentTime < lastTime && currentTime > startTime) {
          res = true
        }
      }
    })
    .catch(() => false);
  clearTimeout(id)
  return res
}

export const checkTile = async (url: string, layer: string, time: string) => {
  const getCapabilities = `${url}?service=WMS&request=GetCapabilities&layers=${layer}`
  const exist = await checkTime(getCapabilities, time)
  return exist
}

export const is3D = (identifier: string) => identifier.slice(0, 2) === '3d' ? true : false
