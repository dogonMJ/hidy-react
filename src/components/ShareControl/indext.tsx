import { PortalControlButton } from "components/PortalControlButton";
import { IconButton } from "@mui/material";
import ShareIcon from '@mui/icons-material/Share';
import { useMap } from "react-leaflet";
import { useSelector } from "react-redux";
import { RootState, store } from "store/store";
import { odbBioSlice } from "store/slice/odbBioSlice";
import { memo } from "react";

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

const findModified = (originalObject: any, modifiedObject: any) => {
  const modifiedElements: any = {};
  for (const key in modifiedObject) {
    if (originalObject[key] !== modifiedObject[key]) {
      modifiedElements[key] = {};
      for (const k in modifiedObject[key]) {
        if (originalObject[key][k] !== modifiedObject[key][k] && k !== 'userInfo') {
          modifiedElements[key][k] = modifiedObject[key][k]
        }
      }
    }
  }
  return modifiedElements;
}

export const ShareControl = memo(() => {
  const map = useMap()
  const defaultStates = store.getState()
  console.log(defaultStates)
  const handleClick = () => {
    const states = store.getState();
    const modified = findModified(defaultStates, states)
    modified.map = { ...modified.map, z: map.getZoom(), c: [map.getCenter().lat, map.getCenter().lng], }

    const res = flattenObject(modified)
    console.log(modified, res)
    console.log(defaultStates, store.getState())
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
})