import { PortalControlButton } from "components/PortalControlButton";
import { IconButton } from "@mui/material";
import ShareIcon from '@mui/icons-material/Share';
import { useMap } from "react-leaflet";
import { useSelector } from "react-redux";
import { RootState } from "store/store";

const flattenObject = (obj: any, parentKey = "") => {
  let queryArr: any = [];
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      let currentKey = parentKey ? `${parentKey}.${key}` : key;
      if (typeof obj[key] === "object" && !Array.isArray(obj[key])) {
        queryArr.push(`&${key}=${flattenObject(obj[key], currentKey)}`);
      } else if (Array.isArray(obj[key])) {
        parentKey ?
          queryArr.push(`${key}:[${obj[key].join(",")}]`) :
          queryArr.push(`&${key}=[${obj[key].join(",")}]`)
      } else {
        if (obj[key]) {
          parentKey ?
            queryArr.push(`${key}:${obj[key]}`) :
            queryArr.push(`&${key}=${obj[key]}`)
        }
      }
    }
  }

  return queryArr.join(";");
}
const queryObject: { [key: string]: any } = {}
const defaultObject: { [key: string]: any } = {
  map: {
    z: 7,
    c: [23.5, 121],
    d: new Date()
  },
  odbTopo: false,
  odbGravity: false,
  odbCtd: {
    par: 'temperature',
    par2: 'salinity',
    p: 'plasma',
    m: false,
    r: false,
    f: false,
    i: 20,
    o: 100,
    max: 30,
  }
}
export const ShareControl = () => {
  const map = useMap()
  const date = useSelector((state: RootState) => state.coordInput.datetime)
  const handleClick = () => {
    queryObject.map.z = map.getZoom()
    queryObject.map.c = [map.getCenter().lat, map.getCenter().lng]
    queryObject.map.d = new Date(date).toISOString()
    const res = flattenObject(queryObject)
    console.log(queryObject, res)
  }
  return (
    <PortalControlButton position="topright" className='leaflet-control' order="unshift">
      <div className='leaflet-bar bg-white' tabIndex={-1}>
        <IconButton
          onClick={handleClick}
          sx={{
            width: 30,
            height: 30,
            borderRadius: 0,
          }}
        >
          <ShareIcon />
        </IconButton>
      </div>
    </PortalControlButton>
  )
}