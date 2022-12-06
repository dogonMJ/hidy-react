import { Typography, Box } from "@mui/material"
import { GeoJsonTooltip } from "components/GeoJsonTooltip"
import { Marker, useMap } from "react-leaflet"
import { useEffect, useState } from "react"
import L from 'leaflet'
import { RenderIf } from "components/RenderIf/RenderIf"
import { useTranslation } from "react-i18next"

interface ShipInfo {
  longitude: number
  latitude: number
  ctime: string
  updtime: string
}
interface Ships {
  [index: string]: ShipInfo
}

const toLocalDate = (utcString: string) => {
  const d = new Date(utcString)
  return `${new Intl.DateTimeFormat(undefined, { dateStyle: 'short', timeStyle: 'long', hourCycle: 'h23' }).format(d)}`
}

const shipicons = [1, 2, 3].map((shipNum) =>
  new L.Icon({
    iconUrl: require(`assets/images/ship${shipNum}.png`),
    iconAnchor: [19, 22],
    popupAnchor: [0, 0],
    iconSize: [38, 22],
  })
)

export const ShipTrack = () => {
  const { t } = useTranslation()
  const map = useMap()
  const [shipInfo, setShipInfo] = useState<Ships | undefined>(undefined)

  const fetchShipInfo = async () => {
    const baseUrl = 'https://api.odb.ntu.edu.tw/cruise/ship/'
    await Promise.all([fetch(`${baseUrl}NOR1`), fetch(`${baseUrl}NOR2`), fetch(`${baseUrl}NOR3`)])
      .then(async ([NOR1, NOR2, NOR3]) => {
        const nor1 = await NOR1.json()
        const nor2 = await NOR2.json()
        const nor3 = await NOR3.json()
        return { NOR1: nor1[0], NOR2: nor2[0], NOR3: nor3[0] }
      })
      .then(res => {
        setShipInfo(res)
      })
  }

  const fly = (ev: any) => {
    if (shipInfo) {
      const name = ev.target.innerHTML.split(':')[0]
      const coord = { lat: shipInfo[name].latitude, lng: shipInfo[name].longitude }
      map.flyTo(coord)
    }
  }

  useEffect(() => {
    fetchShipInfo()
  }, [])

  return (
    <>
      <Box sx={{ py: 1, pl: 2 }}>
        <Typography variant="subtitle2">
          {t('ShipTrack.latest')}
        </Typography>
        <Typography variant="subtitle1" sx={{ color: '#FFC800' }} onClick={fly} style={{ cursor: 'pointer' }}>
          NOR1: {shipInfo ? toLocalDate(shipInfo.NOR1.ctime) : 'No Data'} <br />
        </Typography>
        <Typography variant="subtitle1" sx={{ color: '#00C824' }} onClick={fly} style={{ cursor: 'pointer' }}>
          NOR2: {shipInfo ? toLocalDate(shipInfo.NOR2.ctime) : 'No Data'} <br />
        </Typography>
        <Typography variant="subtitle1" sx={{ color: '#FF0000' }} onClick={fly} style={{ cursor: 'pointer' }}>
          NOR3: {shipInfo ? toLocalDate(shipInfo.NOR3.ctime) : 'No Data'}
        </Typography>
      </Box>
      {shipInfo
        && Object.keys(shipInfo).map((ship, i) => {
          const info = shipInfo[ship]
          return (
            <Marker key={ship} position={[info.latitude, info.longitude]} icon={shipicons[i]}>
              <GeoJsonTooltip
                position={{ lat: info.latitude, lng: info.longitude }}
                content={`${ship}\n${toLocalDate(info.ctime)}`} />
            </Marker>
          )
        })
      }
    </>
  )
}