import { Box, Button, Input, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useMap } from "react-leaflet";
import { getLeafletLayer } from "Utils/UtilsImportFiles";
import { useAlert } from "hooks/useAlert";
import { AlertSlide } from "components/AlertSlide/AlertSlide";
import { LayerControlPanel } from "./LayerControlPanel";
import { useAppDispatch, useAppSelector } from "hooks/reduxHooks";
import { addFileSlice } from "store/slice/addFileSlice";

export const AddFile = () => {
  const map = useMap()
  const dispatch = useAppDispatch()
  const { t } = useTranslation()
  const { openAlert, setOpenAlert, alertMessage, setMessage, severity, setSeverity } = useAlert()
  const latlonformat = useAppSelector(state => state.map.latlonformat)
  const [fileNames, setFileNames] = useState<string[]>([])
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([])
  const [dataList, setDataList] = useState<any[]>([])
  // const dataList = useAppSelector(state => state.addFile.fileList)

  const handleFileChange = async (event: any) => {
    const files = [...event.target.files]
    if (files) {
      const initColorIndex = dataList.length ?? 0
      const layers = await getLeafletLayer(files, initColorIndex, latlonformat)
      let availableList: any = []
      layers.forEach((layer, index) => {
        if (typeof layer === 'string') {
          if (layer === 'CustomLayer.alert.dbfAdd') {
            setMessage(t(layer))
            setSeverity('success')
          } else {
            setSeverity('error')
            setMessage(t(layer))
          }
        } else {
          try {
            layer.addTo(map)
            availableList.push(layer)
            if (index + 1 === layers.length) {
              map.fitBounds(layer.getBounds())
            }
          } catch (e) {
            setMessage(t('CustomLayer.alert.error'))
          }
        }
      })
      setDataList([...dataList, ...availableList])
      // dispatch(addFileSlice.actions.setFileList([...dataList, ...availableList]))
    }
  };

  useEffect(() => {
    dataList.forEach((layer: any) => {
      if (layer) {
        layer.addTo(map)
      }
    })
    return () => {
      dataList.forEach((layer: any) => map.removeLayer(layer))
    }
  }, [dataList, map])

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          // gap: 2,
          // padding: 3,
          // border: '1px dashed grey',
          // borderRadius: 1,
        }}
      >
        <Input
          style={{ display: 'none' }}
          id="raised-button-file"
          type="file"
          inputProps={{
            multiple: true,
            accept: ["application/json", '.kml', '.shp', '.dbf', '.gpx', '.zip']
          }}
          onChange={handleFileChange}
        />
        <label htmlFor="raised-button-file">
          <Button variant="contained" component="span">
            {t(`CustomLayer.selectFile`)}
          </Button>
        </label>
        {/* {fileNames && <Typography variant="body1" whiteSpace={'pre-wrap'}>{fileNames}</Typography>} */}
      </Box>
      {/* <Button variant="contained" color="primary" onClick={handleUpload}>
        {t(`CustomLayer.upload`)}
      </Button> */}
      {dataList && dataList.length > 0 && <LayerControlPanel layerList={dataList} setLayerList={setDataList} isAddFile={true} />}
      <AlertSlide open={openAlert} setOpen={setOpenAlert} severity={severity} >{alertMessage}</AlertSlide>
    </>
  );
}