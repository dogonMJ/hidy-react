import { useEffect, useRef, useState } from "react";
import { LatLngBounds, LatLngBoundsLiteral, LatLng } from "leaflet";
import { useMapEvents, Rectangle, useMap, LayerGroup, Pane } from "react-leaflet";
import 'leaflet'
import { useTranslation } from "react-i18next";
import { screenshot } from "Utils/UtilsScreenshot";
import { Box, ButtonGroup, Grid, IconButton, Stack, TextField } from "@mui/material";
import { Download, Crop, PanTool } from '@mui/icons-material'
import { useMapDragScroll } from "hooks/useMapDragScroll";

interface Selections {
  bounds: LatLngBounds | null;
  isDragging: boolean;
  startPoint: LatLng | null
}
const coordsOrder: { [key: string]: number } = {
  minlat: 0,
  minlng: 1,
  maxlat: 2,
  maxlng: 3
}
const styles = {
  textField: {
    width: 80,
    maxHeight: 5,
  },
  input: {
    fontFamily: 'Monospace',
    fontSize: '15px',
    height: "1.7rem",
    padding: "0px 5px 0px 5px",
  },
  inputLabel: {
    fontSize: '15px',
  },
};

export const ClipScreenshot = () => {
  const map = useMap()
  const { t } = useTranslation()
  const rectRef = useRef<any>()
  const { setDrag } = useMapDragScroll()
  const [clippingMode, setClippingMode] = useState(false)
  const [inputCoords, setInputCoords] = useState<(string | number)[]>(['', '', '', ''])
  const [selection, setSelection] = useState<Selections>({
    startPoint: null,
    bounds: null,
    isDragging: false,
  });

  useMapEvents({
    "mousedown": (e) => {
      // if (!map || !clippingMode || enterPanel) return;
      if (!map || !clippingMode) return;
      setDrag(false)
      const startPoint = map.mouseEventToLatLng(e.originalEvent);
      setSelection({
        startPoint: startPoint,
        bounds: null,
        isDragging: true,
      })
    }
    ,
    "mousemove": (e) => {
      if (!selection.isDragging || !map || !clippingMode) return;
      const endPoint = map.mouseEventToLatLng(e.originalEvent);
      setSelection((prevSelection) => ({
        ...prevSelection,
        bounds: new LatLngBounds(
          prevSelection.startPoint!,
          endPoint
        ),
      })
      );
      if (selection.bounds) {
        setInputCoords([selection.bounds!.getSouth(), selection.bounds!.getWest(), selection.bounds!.getNorth(), selection.bounds!.getEast()])
      }
    },
    "mouseup": () => {
      if (!map || !clippingMode) return;
      setSelection((prevSelection) => ({
        ...prevSelection,
        isDragging: false
      }))
      handleInputBlur()
    },
    "movestart": () => {
      if (!selection.isDragging) {
        setSelection((prevSelection) => ({
          ...prevSelection,
          bounds: null
        }))
      }
    },
  })

  const handleCapture = async () => {
    if (!map) return;
    const bounds = new LatLngBounds([[inputCoords[0], inputCoords[1]], [inputCoords[2], inputCoords[3]]] as LatLngBoundsLiteral);
    const isEmpty = inputCoords.some((value) => value === '');
    (bounds?.isValid() && !isEmpty) ? screenshot(map, bounds) : screenshot(map, map.getBounds())
  }

  const handleMode = () => {
    if (clippingMode) {
      setClippingMode(false)
      setDrag(true)
      map.getContainer().style.cursor = ''
      setSelection({
        isDragging: false,
        bounds: null,
        startPoint: null
      })
    } else {
      setClippingMode(true)
      setDrag(false)
      map.getContainer().style.cursor = 'crosshair'
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const i = coordsOrder[e.target.id]
    setInputCoords((prev) => {
      const coords = [...prev]
      coords[i] = e.target.value === '' ? '' : Number(e.target.value)
      return coords
    })
  }
  const handleInputBlur = () => {
    const isempty = inputCoords.some((value) => value === '')
    const newBounds = isempty ? null : new LatLngBounds([[inputCoords[0], inputCoords[1]], [inputCoords[2], inputCoords[3]]] as LatLngBoundsLiteral)
    if (inputCoords[3] < inputCoords[1]) {
      const temp = inputCoords[3]
      inputCoords[3] = inputCoords[1]
      inputCoords[1] = temp
    }
    if (inputCoords[2] < inputCoords[0]) {
      const temp = inputCoords[2]
      inputCoords[2] = inputCoords[0]
      inputCoords[0] = temp
    }
    if (newBounds) {
      setClippingMode(true)
      setDrag(false)
      map.getContainer().style.cursor = 'crosshair'
      map.fitBounds(newBounds)
    }
    setTimeout(() => {
      setSelection({
        isDragging: false,
        bounds: newBounds,
        startPoint: null
      })
    }, 10)
  }
  useEffect(() => {
    return () => {
      setDrag(true)
      setClippingMode(false)
    }
  }, [])
  return (
    <>
      <Stack direction="row-reverse" >
        <ButtonGroup orientation="vertical" >
          <IconButton
            title={t('screenshot.draw')}
            onClick={handleMode}
            size="small"
            sx={{
              borderRadius: 0,
              height: 46,
              width: 30,
            }}
          >
            {clippingMode ? <PanTool fontSize="small" /> : <Crop />}
          </IconButton>
          <IconButton
            title={t('screenshot.download')}
            onClick={handleCapture}
            size="small"
            sx={{
              borderRadius: 0,
              height: 46,
              width: 30
            }}
          >
            <Download />
          </IconButton>
        </ButtonGroup>
        <Box title={t('screenshot.coord')} sx={{ height: 86, padding: "6px 0px 0px 5px" }}>
          <Grid container spacing={0} sx={{ width: 185 }}>
            <Grid item sm={6} sx={{ padding: "10px 5px" }}>
              <TextField
                id="maxlat"
                type="number"
                style={styles.textField}
                InputProps={{
                  inputProps: {
                    max: 90,
                    min: -90,
                    style: styles.input,
                  }
                }}
                InputLabelProps={{
                  shrink: true,
                  style: styles.inputLabel
                }}
                label={t('screenshot.north')}
                value={inputCoords[2]}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
              />
            </Grid>
            <Grid item sm={6} sx={{ padding: "10px 5px" }}>
              <TextField
                id="maxlng"
                type="number"
                style={styles.textField}
                InputProps={{
                  inputProps: {
                    max: 180,
                    min: 150,
                    style: styles.input,
                  }
                }}
                InputLabelProps={{
                  shrink: true,
                  style: styles.inputLabel
                }}
                label={t('screenshot.east')}
                value={inputCoords[3]}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
              />
            </Grid>
            <Grid item sm={6} sx={{ padding: "10px 5px" }}>
              <TextField
                id="minlat"
                type="number"
                style={styles.textField}
                InputProps={{
                  inputProps: {
                    max: 90,
                    min: -90,
                    style: styles.input,
                  }
                }}
                InputLabelProps={{
                  shrink: true,
                  style: styles.inputLabel
                }}
                label={t('screenshot.south')}
                value={inputCoords[0]}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
              />
            </Grid>
            <Grid item sm={6} sx={{ padding: "10px 5px" }}>
              <TextField
                id="minlng"
                type="number"
                style={styles.textField}
                InputProps={{
                  inputProps: {
                    max: 481,
                    min: -239,
                    style: styles.input,
                  }
                }}
                InputLabelProps={{
                  shrink: true,
                  style: styles.inputLabel
                }}
                label={t('screenshot.west')}
                value={inputCoords[1]}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
              />
            </Grid>
          </Grid>
        </Box>
      </Stack >
      {
        <Pane name='clip'>
          {selection.bounds?.isValid() && <Rectangle ref={rectRef} bounds={selection.bounds} />}
        </Pane>
      }
    </>
  );
};
