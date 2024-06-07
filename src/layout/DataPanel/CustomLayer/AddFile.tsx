import { Box, Button, Input, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useMap } from "react-leaflet";
import { getLeafletLayer } from "Utils/UtilsImportFiles";
import { useAlert } from "hooks/useAlert";
import { AlertSlide } from "components/AlertSlide/AlertSlide";
import { LayerControlPanel } from "./LayerControlPanel";

export const AddFile = () => {
  const map = useMap()
  const { t } = useTranslation()
  const { openAlert, setOpenAlert, alertMessage, setMessage } = useAlert()
  const [fileNames, setFileNames] = useState<string[]>([])
  const [uploadedFiles, setUploadedFiles] = useState<any>()
  const [dataList, setDataList] = useState<any>([])

  const handleFileChange = (event: any) => {
    const files = [...event.target.files]
    const names = files.map(file => `${file.name}\n`)
    setUploadedFiles(files)
    setFileNames(names)
  };

  const handleUpload = async () => {
    if (uploadedFiles) {
      const layers = await getLeafletLayer(uploadedFiles, 0)
      let availableList: any = []
      layers.forEach((layer, index) => {
        if (layer) {
          layer.addTo(map)
          availableList.push(layer)
          if (index + 1 === layers.length) {
            map.fitBounds(layer.getBounds())
          }
        } else {
          setMessage(t('CustomLayer.alert.noLayer'))
        }
      })
      setDataList([...dataList, ...availableList])
    }
    setFileNames([])
  }

  useEffect(() => {
    return () => {
      dataList.forEach((layer: any) => map.removeLayer(layer))
    }
  })
  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
          padding: 3,
          border: '1px dashed grey',
          borderRadius: 1,
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
        {fileNames && <Typography variant="body1" whiteSpace={'pre-wrap'}>{fileNames}</Typography>}
      </Box>
      <Button variant="contained" color="primary" onClick={handleUpload}>
        {t(`CustomLayer.upload`)}
      </Button>
      {dataList && dataList.length > 0 && <LayerControlPanel layerList={dataList} setLayerList={setDataList} isAddFile={true} />}
      <AlertSlide open={openAlert} setOpen={setOpenAlert} severity="error" >{alertMessage}</AlertSlide>
    </>
  );
}