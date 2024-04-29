import { CtdParameters, CtdPeriods, CTDPalette, SliderMarks } from 'types'
import { Point, Polygon } from 'geojson'

export const createIntervalList = (min: number, max: number, length: number) => {
  if (length === 0) {
    return [min]
  } else {
    const intervalSize = (max - min) / length
    const list = Array.from({ length: length }, (v, i) => min + intervalSize * i)
    list.push(max)
    return list
  }
}

export const findInterval = (inputValue: number, intervalList: number[]) => {
  for (let i = 0; i < intervalList.length - 1; i++) {
    if (inputValue > intervalList[i] && inputValue <= intervalList[i + 1]) {
      return i + 1; // Interval numbers start from 1
    }
  }
  if (inputValue <= intervalList[0]) {
    return 0;
  }
  if (inputValue > intervalList[intervalList.length - 1]) {
    return intervalList.length;
  }
  return -1
}

export const getColorWithInterval = (list: string[], num: number) => {
  if (num < 2 || !Array.isArray(list) || list.length === 0) {
    return [];
  }

  const interval = (list.length - 1) / (num - 1);
  const result = [];

  for (let i = 0; i < num; i++) {
    const index = Math.round(i * interval);
    result.push(list[index]);
  }

  return result;
}

export const point2polygon = (geometry: Point, cellSize: number): Polygon => {
  const center = geometry.coordinates
  const extend = cellSize / 2
  const polygon: Polygon = {
    type: 'Polygon',
    coordinates: [[
      [center[0] + extend, center[1] + extend],
      [center[0] - extend, center[1] + extend],
      [center[0] - extend, center[1] - extend],
      [center[0] + extend, center[1] - extend]
    ]]
  }
  return polygon
}

export const sortXY = (pairs: { x: number, y: number }[]) => {
  pairs.sort((a, b) => a.y - b.y);
  const x = pairs.map((pair: { x: number, y: number }) => pair.x)
  const y = pairs.map((pair: { x: number, y: number }) => -pair.y)
  return { x, y }
}

export const ctdDepthMeterProps = () => {
  const ctdDepths = [...Array(101)].map((e, i) => i * 10).reverse()
  const marks: SliderMarks[] = []
  ctdDepths.forEach((depth, i) => {
    if (depth % 100 === 0 || depth === 0) {
      marks.push({
        value: i,
        label: depth === 0 ? `${depth.toString()}` : `-${depth.toString()}`
      })
    } else {
      marks.push({
        value: i,
        label: ``
      })
    }
  })
  return { ctdDepths, marks }
}

export const adcpDepthMeterProps = () => {
  const adcpDepths = [...Array(51)].map((e, i) => i * 10).reverse()
  adcpDepths.pop()
  const marks: SliderMarks[] = []
  adcpDepths.forEach((depth, i) => {
    if (depth % 50 === 0 || depth === 10) {
      marks.push({
        value: i,
        label: `-${depth.toString()}`
      })
    } else {
      marks.push({
        value: i,
        label: ``
      })
    }
  })
  return { adcpDepths, marks }
}

export const palettes: { [key in CTDPalette]: string[] } = {
  plasma: ["#0d0887", "#220690", "#330597", "#41049d", "#5002a2", "#5c01a6", "#6a00a8", "#7701a8", "#8405a7", "#8f0da4", "#9c179e", "#a62098", "#b12a90", "#ba3388", "#c33d80", "#cc4778", "#d35171", "#da5b69", "#e16462", "#e76f5a", "#ed7953", "#f2844b", "#f68f44", "#fa9b3d", "#fca636", "#fdb42f", "#fec029", "#fcce25", "#f9dc24", "#f5eb27", "#f0f921"],
  coolwarm: ["#3b4cc0", "#455bcd", "#4f69d9", "#5978e3", "#6485ec", "#7092f3", "#7b9ff9", "#87aafc", "#93b5fe", "#9fbeff", "#aac7fd", "#b5cefa", "#c0d4f5", "#cad8ee", "#d4dbe6", "#dddddd", "#e5d8d1", "#ecd2c4", "#f2cbb7", "#f5c2aa", "#f7b89c", "#f7ad8f", "#f5a081", "#f29374", "#ee8468", "#e7755b", "#e0654f", "#d75344", "#cc403a", "#c12a30", "#b40426"],
  bwr: ['#0000ff', '#1111ff', '#2222ff', '#3333ff', '#4444ff', '#5555ff', '#6666ff', '#7777ff', '#8888ff', '#9999ff', '#aaaaff', '#bbbbff', '#ccccff', '#ddddff', '#eeeeff', '#ffffff', '#ffeeee', '#ffdddd', '#ffcccc', '#ffbbbb', '#ffaaaa', '#ff9999', '#ff8888', '#ff7777', '#ff6666', '#ff5555', '#ff4444', '#ff3333', '#ff2222', '#ff1111', '#ff0000'],
  jet: ['#000080', '#0000a6', '#0000cd', '#0000f3', '#0008ff', '#002aff', '#004cff', '#006eff', '#0090ff', '#00b2ff', '#00d4ff', '#0ef6e9', '#29ffce', '#45ffb2', '#60ff97', '#7bff7b', '#97ff60', '#b2ff45', '#ceff29', '#e9ff0e', '#ffe600', '#ffc600', '#ffa700', '#ff8700', '#ff6800', '#ff4800', '#ff2900', '#f30900', '#cd0000', '#a60000', '#800000'],
  magma: ['#000004', '#030312', '#0b0924', '#140e36', '#20114b', '#2c115f', '#3b0f70', '#491078', '#57157e', '#641a80', '#721f81', '#7e2482', '#8c2981', '#992d80', '#a8327d', '#b73779', '#c43c75', '#d2426f', '#de4968', '#e95462', '#f1605d', '#f7705c', '#fa7f5e', '#fc9065', '#fe9f6d', '#feb078', '#febf84', '#fecf92', '#fddea0', '#fceeb0', '#fcfdbf'],
  viridis: ['#440154', '#470d60', '#481a6c', '#482475', '#472f7d', '#443983', '#414487', '#3d4d8a', '#39568c', '#355f8d', '#31688e', '#2d708e', '#2a788e', '#27808e', '#23888e', '#21918c', '#1f988b', '#1fa188', '#22a884', '#2ab07f', '#35b779', '#44bf70', '#54c568', '#67cc5c', '#7ad151', '#90d743', '#a5db36', '#bddf26', '#d2e21b', '#eae51a', '#fde725'],
  YlOrRd: ['#ffffcc', '#fffac0', '#fff5b5', '#fff1a9', '#ffec9d', '#ffe692', '#fee187', '#fedc7c', '#fed470', '#fec965', '#febf5a', '#feb54f', '#feab49', '#fea145', '#fd9740', '#fd8d3c', '#fd7c37', '#fc6b32', '#fc5b2e', '#fa4b29', '#f43d25', '#ed2f22', '#e6211e', '#de171d', '#d41020', '#ca0923', '#c00225', '#b10026', '#a10026', '#900026', '#800026'],
  YlGnBu: ['#ffffd9', '#fafdce', '#f5fbc4', '#f1f9b9', '#eaf7b1', '#e0f3b2', '#d6efb3', '#ccebb4', '#bde5b5', '#aadeb7', '#97d6b9', '#84cfbb', '#73c8bd', '#62c2bf', '#52bcc2', '#41b6c4', '#37acc3', '#2ea2c2', '#2498c1', '#1d8ebe', '#1f80b8', '#2072b2', '#2165ab', '#2258a5', '#234da0', '#24429b', '#253795', '#1f2f88', '#172978', '#102368', '#081d58'],
}

export const defaultCtdRange: { [key in CtdParameters]: { min: number, max: number } } = {
  temperature: { min: 0, max: 30 },
  salinity: { min: 34, max: 35 },
  density: { min: 21, max: 28 },
  transmission: { min: 0, max: 100 },
  fluorescence: { min: 0, max: 0.3 },
  oxygen: { min: 50, max: 220 },
}

export const calSpd = (u: number, v: number) => Math.sqrt(u ** 2 + v ** 2)
export const calDir = (u: number, v: number) => {
  const dir = 90 - Math.atan2(v, u) * 180 / Math.PI;
  return dir < 0 ? dir + 360 : dir
}

export const periodTransform: { [key in CtdPeriods]: string } = {
  'avg': '0',
  'NE': '17',
  'SW': '18',
  'spring': '14',
  'summer': '15',
  'fall': '16',
  'winter': '13'
}
///// Bio /////

export const dateToBioApiString = (dateObj: Date) => {
  dateObj.setTime(dateObj.getTime() + 8 * 3600000)
  return dateObj.toISOString().split('T')[0]
}

//D:\GitHub\hidy-react\node_modules\d3\src\scale\category.js
export const d3_category10 = [
  0x1f77b4, 0xff7f0e, 0x2ca02c, 0xd62728, 0x9467bd,
  0x8c564b, 0xe377c2, 0x7f7f7f, 0xbcbd22, 0x17becf
].map(value => '#' + value.toString(16));
// d3_category20+3
// export const category23 = [
//   0x1f77b4, 0xaec7e8, 0xff7f0e, 0xffbb78, 0x2ca02c, 0x98df8a, 0xd62728, 0xff9896, 0x9467bd, 0xc5b0d5,
//   0x8c564b, 0xc49c94, 0xe377c2, 0xf7b6d2, 0x7f7f7f, 0xc7c7c7, 0xbcbd22, 0xdbdb8d, 0x17becf, 0x9edae5,
//   0xffff33, 0xa65628, 0xf781bf
// ].map(value => '#' + value.toString(16));

export const category23 = [
  0xf2cc8f, 0x8d99ae, 0xccd5ae, 0x118ab2, 0xe07a5f, 0x98df8a, 0xd62728, 0xff9896, 0x9467bd, 0xc5b0d5,
  0x8c564b, 0xc49c94, 0xe377c2, 0xf7b6d2, 0x7f7f7f, 0xc7c7c7, 0xbcbd22, 0xdbdb8d, 0x17becf, 0x9edae5,
  0xffff33, 0xa65628, 0xf781bf
].map(value => '#' + value.toString(16));

export const chemDepthList = [0, 20, 50, 100, 150, 200, 250, 300, 400, 500, 1000, 1500, 2000, 3000, '4000+']