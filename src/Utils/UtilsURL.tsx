import { ElevationInfo } from 'types'

const round6Hour = (hour: string) => {
  const remainder = Number(hour) % 6
  return remainder === 0 ? hour : (Number(hour) - remainder).toString().padStart(2, '0')
}

const timeDuration = (time: string, duration: string | undefined) => {

  switch (duration) {
    case 'P1D':
      return time.split('T')[0]
    case 'P1D12':
      return `${time.split('T')[0]}T12:00:00Z`
    case 'PT10M':
      return time.substring(0, 15) + "0:00Z"
    case 'PT6H': {
      const hour = time.substring(11, 13).padStart(2, '0')
      const HH = round6Hour(hour)
      return `${time.split('T')[0]}T${HH}:00:00Z`
    }
    case 'PT1H30': {
      const HH = time.substring(11, 13).padStart(2, '0')
      return `${time.split('T')[0]}T${HH}:30:00Z`
    }
    default:
      return time
  }
}

const getUrlQuery = (url: string) => {
  const urlObj = new URL(url)
  const paramsObj = urlObj.searchParams
  const params: { [key: string]: any } = Array.from(paramsObj.keys()).reduce(
    (acc, val) => ({ ...acc, [val]: paramsObj.get(val) }),
    {}
  );
  const base = `${urlObj.origin}${urlObj.pathname}`
  return { base: base, params: params }
}

const checkServiceType = (url: string) => {
  const patternWMTS = new RegExp(/wmts/i)
  if (patternWMTS.test(url)) {
    return 'WMTS'
  } else {
    return 'WMS'
  }

}

const parseDuration = (durationString: string) => {
  const regex = /^P(?:([0-9]+)Y)?(?:([0-9]+)M)?(?:([0-9]+)W)?(?:([0-9]+)D)?(?:T(?:([0-9]+)H)?(?:([0-9]+)M)?(?:([0-9]+(?:\.[0-9]+)?)S)?)?$/;
  //0: full string; 1: year; 2: month; 3: week; 4: day; 5: hour; 6: minute; 7: second
  const matches = durationString.match(regex);
  const durationCode = matches?.map((value, index) => typeof value === 'string' ? index : 0)
  if (durationCode && matches) {
    const smallestUnitIndex = Math.max(...durationCode)
    return [smallestUnitIndex, Number(matches[smallestUnitIndex])]
  } else {
    return [0, 0]
  }
}

const modTimeString = (time: Date, start: string, duration: string) => {
  const result = new Date(start)
  const [timeUnitCode, unitValue] = [...parseDuration(duration)]
  switch (timeUnitCode) {
    case 1:
      result.setFullYear(time.getFullYear())
      break
    case 2:
      result.setFullYear(time.getFullYear())
      result.setMonth(time.getMonth())
      break
    case 3:
      break
    case 4:
      result.setFullYear(time.getFullYear())
      result.setMonth(time.getMonth())
      result.setDate(time.getDate())
      break
    case 5:
      const hour = time.getUTCHours()
      const baseHour = result.getUTCHours()
      const shiftH = Math.floor((hour - baseHour) / unitValue) * unitValue
      result.setFullYear(time.getFullYear())
      result.setMonth(time.getMonth())
      result.setDate(time.getDate())
      result.setUTCHours(baseHour + shiftH)
      break
    case 6:
      const minute = time.getUTCMinutes()
      const baseMinute = result.getUTCMinutes()
      const shiftM = Math.floor((minute - baseMinute) / unitValue) * unitValue
      result.setFullYear(time.getFullYear())
      result.setMonth(time.getMonth())
      result.setDate(time.getDate())
      result.setHours(time.getHours())
      result.setMinutes(baseMinute + shiftM)
      break
    case 7:
      return time.toISOString()
  }
  if (start.includes('T')) {
    return result.toISOString()
  } else {
    const [withoutT] = result.toISOString().split('T')
    return withoutT
  }
}

const timeDurations = (timeString: string, timeInfo: string | undefined): [string, boolean] => {
  if (timeInfo && timeString) {
    const [st, ed, duration] = timeInfo.split('/')
    const start = new Date(st)
    const end = new Date(ed)
    const time = new Date(timeString)
    const inRange = (time >= start) && (time <= end)
    const formattedTime = modTimeString(time, st, duration)
    return [formattedTime, inRange]
  } else {
    return [timeString, true]
  }
}

const getElevationInfo = (elevationObject: any): ElevationInfo => {
  const defaultValue = elevationObject.default ? Number(elevationObject.default) : undefined
  const unit = elevationObject.unit ? String(elevationObject.unit) : undefined
  const objValues = elevationObject.value
  let values;
  if (objValues) {
    if (Array.isArray(objValues)) {
      values = objValues.length === 1 ? String(objValues[0]).split(',').map(Number) : objValues.map(Number)
    } else {
      values = typeof objValues === 'string' ? objValues.split(',').map(Number) : [objValues]
    }
  } else {
    values = undefined
  }
  return { defaultValue, unit, values }
}



export { timeDuration, timeDurations, getUrlQuery, checkServiceType, getElevationInfo }

// const timeShift = (time: Date, parsedDuration: Durations) => {
//   const validKeys = Object.keys(parsedDuration).filter(key => !Number.isNaN(parsedDuration[key as keyof Durations]))
//   validKeys.forEach((key) => {
//     switch (key) {
//       case 'years':
//         time.setFullYear(time.getFullYear() + parsedDuration[key])
//         break
//       case 'months':
//         time.setMonth(time.getMonth() + parsedDuration[key])
//         break
//       case 'weeks':
//         time.setDate(time.getDate() + parsedDuration[key] * 7)
//         break
//       case 'days':
//         time.setDate(time.getDate() + parsedDuration[key])
//         break
//       case 'hours':
//         time.setTime(time.getTime() + parsedDuration[key] * 60 * 60 * 1000)
//         break
//       case 'minutes':
//         time.setTime(time.getTime() + parsedDuration[key] * 60 * 1000)
//         break
//       case 'seconds':
//         time.setTime(time.getTime() + parsedDuration[key] * 1000)
//         break
//     }
//   })
//   return time
// }