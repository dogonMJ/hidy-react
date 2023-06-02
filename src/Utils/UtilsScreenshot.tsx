import { Map, LatLngBounds } from "leaflet";
import html2canvas from "html2canvas";

const mapLengthInterval = [
  { min: 0, step: 0.01 },
  { min: 0.4, step: 0.1 },
  { min: 1, step: 0.5 },
  { min: 4, step: 1 },
  { min: 8, step: 2 },
  { min: 15, step: 5 },
]
const mapPixelInterval = [0, 100, 200, 500, 800]
const binarySearch = (arr: number[], target: number) => {
  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    if (arr[mid] === target) {
      return mid; // Found the target, return the index
    } else if (arr[mid] < target) {
      left = mid + 1; // Target is in the right half
    } else {
      right = mid - 1; // Target is in the left half
    }
  }
  return left;
}
const calMarks = (min: number, max: number, step: number, markNumber: number) => {
  const factor = 1 / step
  const lower = Math.ceil(min * factor) / factor
  const upper = Math.floor(max * factor) / factor
  const len = Math.round((upper - lower) / step) + 1
  const marks = [...Array.from(Array(len), (e, i) => Math.round((i * step + lower) * factor) / factor)]
  if (len > markNumber) {
    const secLen = Math.ceil(len / markNumber)
    const sections = Array.from(Array(markNumber).keys())
    let res = sections.map((i) => marks[i * secLen])
    res = res.filter((ele) => ele !== undefined)
    return [min, ...res, max]
  } else {
    return [min, ...marks, max]
  }
}

const getMarks = (min: number, max: number, length: number) => {
  const diff = Math.round((max - min) * 10000) / 10000
  const intervalMin = mapLengthInterval.map(e => e.min)
  const index = binarySearch(intervalMin, diff) - 1
  const step = mapLengthInterval[index].step
  const markNumber = binarySearch(mapPixelInterval, length)
  return calMarks(min, max, step, markNumber)
}

const calDifference = (arr: number[]) => {
  const differences = [];
  for (let i = 0; i < arr.length - 1; i++) {
    differences.push(arr[i + 1] - arr[i]);
  }
  return differences;
}

const calScaleLength = (map: Map, bbox: number[], marks: number[], direction: 'x' | 'y', scale: number = 1) => {
  const [minLng, minLat, maxLng, maxLat] = [...bbox]
  if (direction === 'x') {
    const xs = marks.map((mark) => map.latLngToLayerPoint([maxLat, mark]).x * scale)
    return calDifference(xs)
  } else {
    const ys = marks.map((mark) => map.latLngToLayerPoint([mark, minLng]).y * scale)
    return calDifference(ys)//.map(Math.abs)
  }
}

export const screenshot = async (map: Map, bounds: LatLngBounds) => {
  const topLeft = map.latLngToContainerPoint(bounds.getNorthWest());
  const bottomRight = map.latLngToContainerPoint(bounds.getSouthEast());
  const width = bottomRight.x - topLeft.x;
  const height = bottomRight.y - topLeft.y;
  const mapScale = 1
  const clipped = await html2canvas(map.getContainer(), {
    scale: mapScale,
    x: topLeft.x,
    y: topLeft.y,
    width,
    height,
    useCORS: true,
    ignoreElements: (element) => {
      const ignoreClass = ['leaflet-control-container', 'leaflet-pane leaflet-clip-pane']
      const ignoreId = ['mouseCoordinates', 'dataPanel']
      if (ignoreClass.includes(element.className) || ignoreId.includes(element.id)) { return true } else { return false }
    }
  });
  // const dataURL = canvas.toDataURL("image/png");
  // const ctx = clipped.getContext('2d');
  const canvas = document.createElement('canvas');
  document.body.appendChild(canvas);
  const scaleWidth = 10
  const frameWidth = 25
  canvas.width = clipped.width + frameWidth * 2;
  canvas.height = clipped.height + frameWidth * 2;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    //background
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    //get coordinates
    const bbox = bounds.toBBoxString().split(',').map(Number)

    if (bbox) {
      const [minLng, minLat, maxLng, maxLat] = [...bbox]
      const lngMarks = getMarks(minLng, maxLng, width)
      const latMarks = getMarks(minLat, maxLat, height).reverse()
      const x_secLength = calScaleLength(map, bbox, lngMarks, 'x', mapScale)
      const y_secLength = calScaleLength(map, bbox, latMarks, 'y', mapScale)
      //draw
      ctx.drawImage(clipped, frameWidth, frameWidth);
      ctx.font = "15px Rubik";
      //draw -- x scale
      let acc = 0
      x_secLength.forEach((section, i) => {
        ctx.fillStyle = (i % 2 === 0) ? "black" : "#ccc"
        ctx.fillRect(frameWidth + acc, frameWidth - scaleWidth, section, scaleWidth);
        ctx.fillRect(frameWidth + acc, frameWidth + clipped.height, section, scaleWidth);
        if (i !== 0) {
          ctx.fillText(lngMarks[i].toFixed(2), frameWidth + acc - 20, frameWidth - scaleWidth - 3)
        }
        acc += section
      })
      //draw -- y scale
      acc = 0
      y_secLength.forEach((section, i) => {
        ctx.fillStyle = (i % 2 === 0) ? "black" : "#ccc"
        ctx.fillRect(frameWidth - scaleWidth, frameWidth + acc, scaleWidth, section);
        ctx.fillRect(frameWidth + clipped.width, frameWidth + acc, scaleWidth, section);
        if (i !== 0) {
          ctx.save()
          ctx.translate(frameWidth - scaleWidth - 3, frameWidth + acc)
          ctx.rotate(270 * Math.PI / 180)
          ctx.fillText(latMarks[i].toFixed(2), -20, 0)
          ctx.restore()
        }
        acc += section
      })
      // border
      ctx.lineWidth = 1
      ctx.strokeStyle = 'black'
      ctx.strokeRect(0 + frameWidth - scaleWidth, 0 + frameWidth - scaleWidth, clipped.width + scaleWidth * 2, clipped.height + scaleWidth * 2)
    }
    //download
    const link = document.createElement('a');
    link.download = 'hidy.png';
    link.href = canvas.toDataURL();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  document.body.removeChild(canvas);
}