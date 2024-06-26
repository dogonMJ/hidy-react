import { LongtermPar, LongtermPeriod } from "types"

export const varList: { [key in LongtermPar]: { name: string, unit: string } } = {
  close: { name: 'StatMean.close', unit: '' },
  t: { name: 'StatMean.temp', unit: '\u00b0C' },
  s: { name: 'StatMean.sal', unit: 'psu' },
  o: { name: 'StatMean.do', unit: '\u03bcM' },
  i: { name: 'StatMean.ds', unit: '\u03bcM' },
  p: { name: 'StatMean.po4', unit: '\u03bcM' },
  n: { name: 'StatMean.no3', unit: '\u03bcM' },
  c: { name: 'StatMean.chl', unit: '\u03bcg/L' },
  k: { name: 'StatMean.plk', unit: '\u03bcM' },
  m: { name: 'StatMean.npp', unit: '\u03bcg/L' },
  h: { name: 'StatMean.ph', unit: '' },
  w: { name: 'StatMean.spd', unit: 'm/s' },
  u: { name: 'StatMean.u', unit: 'm/s' },
  v: { name: 'StatMean.v', unit: 'm/s' },
}

export const avgTimeList: { [key in LongtermPeriod]: { [key: string]: string } } = {
  mean: { code: '00', text: 'StatMean.all' },
  winter: { code: '13', text: 'StatMean.winter' },
  spring: { code: '14', text: 'StatMean.spring' },
  summer: { code: '15', text: 'StatMean.summer' },
  fall: { code: '16', text: 'StatMean.fall' },
  jan: { code: '01', text: 'StatMean.jan' },
  feb: { code: '02', text: 'StatMean.feb' },
  mar: { code: '03', text: 'StatMean.mar' },
  apr: { code: '04', text: 'StatMean.apr' },
  may: { code: '05', text: 'StatMean.may' },
  jun: { code: '06', text: 'StatMean.jun' },
  jul: { code: '07', text: 'StatMean.jul' },
  aug: { code: '08', text: 'StatMean.aug' },
  sep: { code: '09', text: 'StatMean.sep' },
  oct: { code: '10', text: 'StatMean.oct' },
  nov: { code: '11', text: 'StatMean.nov' },
  dec: { code: '12', text: 'StatMean.dec' },
}

export const years = Array.from({ length: 26 }, (v, i) => (i + 1993).toString())

export const longtermDepths = [0, 10, 20, 30, 50, 75, 100, 125, 150, 200, 250, 300, 400, 500]