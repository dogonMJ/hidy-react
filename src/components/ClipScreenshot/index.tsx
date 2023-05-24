import { MouseEvent, useRef, useState } from "react";
import { LatLngBounds, LatLngBoundsLiteral, LatLng } from "leaflet";
import { useMapEvents, Rectangle, useMap, Pane } from "react-leaflet";
import { RootState } from "store/store";
import { useSelector } from "react-redux";
import 'leaflet'
import { screenshot } from "Utils/UtilsScreenshot";
import { Box, Grid, IconButton, Paper, TextField } from "@mui/material";
import CropIcon from '@mui/icons-material/Crop';
import DownloadIcon from '@mui/icons-material/Download';
import PanToolIcon from '@mui/icons-material/PanTool';

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
    backgroundColor: 'red'
  },
  input: {
    fontFamily: 'Monospace',
    fontSize: '10px',
    maxHeight: '1.5rem',
    backgroundColor: 'yellow',
    padding: 0
  },
  inputLabel: {
    fontSize: '15px',
    backgroundColor: 'green'
  },
};
export const ClipScreenshot = () => {
  const map = useMap()
  const rectRef = useRef<any>()
  const enterPanel = useSelector((state: RootState) => state.coordInput.enterPanel);
  const [clippingMode, setClippingMode] = useState(false)
  const [inputCoords, setInputCoords] = useState<(string | number)[]>(['', '', '', ''])
  const [selection, setSelection] = useState<Selections>({
    startPoint: null,
    bounds: null,
    isDragging: false,
  });

  useMapEvents({
    "mousedown": (e) => {
      if (!map || !clippingMode || enterPanel) return;
      map.dragging.disable()
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
    const bounds = new LatLngBounds([[inputCoords[0], inputCoords[1]], [inputCoords[2], inputCoords[3]]] as LatLngBoundsLiteral)
    bounds?.isValid() ? screenshot(map, bounds) : screenshot(map, map.getBounds())
  }

  const handleMode = () => {
    if (clippingMode) {
      setClippingMode(false)
      map.dragging.enable()
      map.getContainer().style.cursor = ''
      setSelection({
        isDragging: false,
        bounds: null,
        startPoint: null
      })
    } else {
      setClippingMode(true)
      map.dragging.disable()
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
    if (newBounds) {
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
  return (
    <>
      <Box sx={{ backgroundColor: 'blue' }}>
        <Grid container spacing={1} sx={{ width: 185, height: 130, padding: '5px' }}>
          <Grid item sm={12}>
            <Paper sx={{ backgroundColor: 'red' }}>
              <IconButton
                onClick={handleMode}
                size="small"
                sx={{
                  borderRadius: 0,
                  height: 30
                }}
              >
                {clippingMode ? <PanToolIcon fontSize="small" /> : <CropIcon />}
              </IconButton>
              <IconButton
                onClick={handleCapture}
                size="small"
                sx={{
                  borderRadius: 0,
                  height: 30
                }}
              >
                <DownloadIcon />
              </IconButton>
            </Paper>
          </Grid>
          <Grid item sm={6}>
            <TextField
              id="minlat"
              type="number"
              style={styles.textField}
              InputProps={{
                style: styles.input,
                inputProps: {
                  max: 90,
                  min: -90
                }
              }}
              InputLabelProps={{
                shrink: true,
                style: styles.inputLabel
              }}
              label={'South'}
              value={inputCoords[0]}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
            />
          </Grid>
          <Grid item sm={6}>
            <TextField
              id="minlng"
              type="number"
              style={styles.textField}
              InputProps={{
                style: styles.input,
                inputProps: {
                  max: 481,
                  min: -239
                }
              }}
              InputLabelProps={{
                shrink: true,
                style: styles.inputLabel
              }}
              label={'West'}
              value={inputCoords[1]}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
            />
          </Grid>
          <Grid item sm={6}>
            <TextField
              id="maxlat"
              type="number"
              style={styles.textField}
              InputProps={{
                style: styles.input,
                inputProps: {
                  max: 90,
                  min: -90
                }
              }}
              InputLabelProps={{
                shrink: true,
                style: styles.inputLabel
              }}
              label={'North'}
              value={inputCoords[2]}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
            />
          </Grid>
          <Grid item sm={6}>
            <TextField
              id="maxlng"
              type="number"
              style={styles.textField}
              InputProps={{
                style: styles.input,
                inputProps: {
                  max: 180,
                  min: 150
                }
              }}
              InputLabelProps={{
                shrink: true,
                style: styles.inputLabel
              }}
              label={'East'}
              value={inputCoords[3]}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
            />
          </Grid>
        </Grid>
      </Box>
      {selection.bounds?.isValid() &&
        <Pane name='clip' >
          <Rectangle ref={rectRef} bounds={selection.bounds} />
        </Pane>
      }
    </>
  );
};
