import React, { useState, useEffect, SetStateAction, Dispatch, useMemo } from "react";
import Draggable from 'react-draggable';
import { useTranslation } from "react-i18next";
import { Pane, CircleMarker } from 'react-leaflet';
import { Box, FormControl, InputLabel, IconButton, MenuItem, Select, Stack, Typography, SelectChangeEvent } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CircularProgress from '@mui/material/CircularProgress';
import Plot from 'react-plotly.js';
import { PlotParams } from "react-plotly.js";
import { useMapDragScroll } from "hooks/useMapDragScroll";


interface MarineHeatwaveTimeSeriseProps {
  coords: { lat: number, lng: number };
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  plotPosition: { x: number, y: number };
  setPlotPosition: Dispatch<SetStateAction<{
    x: number;
    y: number;
  }>>
}
interface ApiDataItem {
  lon: number;
  lat: number;
  date: string;
  level: number;
  sst_anomaly: number | null;
}

type Data = Plotly.Data;


const MarineHeatwaveTimeSerise = ({ coords, setOpen, plotPosition, setPlotPosition }: MarineHeatwaveTimeSeriseProps) => {
  const { t } = useTranslation();
  const { setDragNScroll } = useMapDragScroll()
  const [disableDrag, setDisableDrag] = useState(false);
  const [apidata, setApidata] = useState<{ lon: number; lat: number; sst_anomaly: number | null; date: string, level: number }[] | undefined | null>(undefined);

  const today = new Date().getFullYear();
  const twoYearsBefore = today - 2;

  const [startYear, setStartYear] = useState<number>(twoYearsBefore);
  const [endYear, setEndYear] = useState<number>(today);
  const years: number[] = [];
  for (let year: number = 1982; year <= today; year++) {
    years.push(year);
  };
  const [plotProps, setPlotProps] = useState<PlotParams>({
    data: [] as Data[],
    layout: {
      width: 800,
      height: 400,
      dragmode: 'pan',
      hovermode: 'x',
      xaxis: {
        tickformat: "%Y-%m"
      },
      yaxis: {
        title: t('OdbData.mhw.sstan'),
      },
      margin: {
        t: 65, b: 60, r: 40, l: 80
      },
      modebar: {
        remove: ["select2d", "lasso2d"]
      },
    },
    config: {
      scrollZoom: true,
      displayModeBar: true,
    }
  })
  //Time Serise Data Fetching
  useEffect(() => {
    setApidata(undefined);
    (async () => {
      if (coords) {
        try {
          const response = await fetch(`https://eco.odb.ntu.edu.tw/api/mhw?lon0=${coords.lng}&lat0=${coords.lat}&start=${startYear}-01-01&end=${endYear}-12-01&append=sst_anomaly,level`);
          if (response.ok) {
            const result: ApiDataItem[] = await response.json();
            const allAnomaliesNull = result.every((item: ApiDataItem) => item.sst_anomaly === null);
            if (allAnomaliesNull) {
              setApidata(null); // No valid data available
            } else {
              setApidata(result);
            }

          } else {
            setApidata(null);
          }
        } catch (error) {
          console.error('Error:', error);
          setApidata(null);
        }
      }
    })();

  }, [coords, startYear, endYear])

  useEffect(() => {
    if (apidata) {

      setPlotProps((prevPlotProps: PlotParams) => ({
        ...prevPlotProps,
        data: [
          {
            x: apidata?.map((item) => item.date),
            y: apidata?.map((item) => item.sst_anomaly),
            type: 'scatter',
            mode: 'lines+markers',
            name: 'MHW level',
            marker: {
              size: 12,
              color: apidata.map((item) => {
                if (item.level === 4) return '#7f1416';
                else if (item.level === 3) return '#cb3827';
                else if (item.level === 2) return '#ec6b1a';
                else if (item.level === 1) return '#f5c268';
                else return '#ffffff';
              }),
              line: {
                color: '#616161',
                width: 1
              }
            },
            line: {
              color: '#616161',
              width: 1.5
            },
            hoverinfo: 'text',
            text: apidata.map(item => {
              const date = new Date(item.date);
              const formattedDate = `${date.getFullYear()}/${(date.getMonth() + 1).toString().padStart(2, '0')}`;
              const formattedAnomaly = item.sst_anomaly !== null ? item.sst_anomaly.toFixed(2) : "N/A";
              const levelText = item.level === 0 ? t('OdbData.mhw.none') : item.level === 1 ? t('OdbData.mhw.moderate') : item.level === 2 ? t('OdbData.mhw.strong') : item.level === 3 ? t('OdbData.mhw.severe') : item.level === 4 ? t('OdbData.mhw.extreme') : item.level;
              return `${t('OdbData.mhw.time')}: ${formattedDate}<br>${t('OdbData.mhw.sstan')}: ${formattedAnomaly}<br>${t('OdbData.mhw.mhwlevel')}: ${levelText}`;
            })
          }
        ],
        layout: {
          ...prevPlotProps.layout,
          title: {
            text: `${apidata[0].lat}, ${apidata[0].lon}`,
          },
        }
      }))
    }
  }, [apidata])

  const disableMapAction = () => {
    setDragNScroll(false)
  }

  const enableMapAction = () => {
    setDragNScroll(true)
  }

  const onClose = () => {
    enableMapAction()
    setOpen(false);
  }

  const handleChangeStart = (event: SelectChangeEvent<number>) => {
    const newStartYear = parseInt(event.target.value as string, 10);
    setStartYear(newStartYear);
    if (newStartYear > endYear) {
      setEndYear(newStartYear);
    }
  }
  const handleChangeEnd = (event: SelectChangeEvent<number>) => {
    const newEndYear = parseInt(event.target.value as string, 10);
    if (newEndYear >= startYear) {
      setEndYear(newEndYear);
    }
  }

  const footPrint = useMemo(() => {
    return (
      <Box sx={{ px: 5, pb: 2, mt: -5, zIndex: 999 }}>
        <p style={{ fontSize: '13px', color: '#424242', padding: 0 }}><b>{t('OdbData.mhw.mhwlevel')}:</b></p>
        <Stack direction="row" spacing={2}>
          <Stack direction="row" alignItems="center"><span style={{ height: '10px', width: '10px', borderRadius: '50%', backgroundColor: '#ffffff', border: '1px solid #616161' }}></span><p style={{ paddingLeft: '8px', margin: 0, color: '#424242' }}>{t('OdbData.mhw.none')}</p></Stack>
          <Stack direction="row" alignItems="center"><span style={{ height: '10px', width: '10px', borderRadius: '50%', backgroundColor: '#f5c268', border: '1px solid #616161' }}></span><p style={{ paddingLeft: '8px', margin: 0, color: '#424242' }}>{t('OdbData.mhw.moderate')}</p></Stack>
          <Stack direction="row" alignItems="center"><span style={{ height: '10px', width: '10px', borderRadius: '50%', backgroundColor: '#ec6b1a', border: '1px solid #616161' }}></span><p style={{ paddingLeft: '8px', margin: 0, color: '#424242' }}>{t('OdbData.mhw.strong')}</p></Stack>
          <Stack direction="row" alignItems="center"><span style={{ height: '10px', width: '10px', borderRadius: '50%', backgroundColor: '#cb3827', border: '1px solid #616161' }}></span><p style={{ paddingLeft: '8px', margin: 0, color: '#424242' }}>{t('OdbData.mhw.severe')}</p></Stack>
          <Stack direction="row" alignItems="center"><span style={{ height: '10px', width: '10px', borderRadius: '50%', backgroundColor: '#7f1416', border: '1px solid #616161' }}></span><p style={{ paddingLeft: '8px', margin: 0, color: '#424242' }}>{t('OdbData.mhw.extreme')}</p></Stack>
        </Stack>
      </Box>
    )
  }, [t])

  return (
    <>
      <CircleMarker
        center={coords}
        radius={6}
        fillColor="white"
        color="white"
        weight={2}
        opacity={1}
        fillOpacity={0.5}
      />
      <Pane
        name='mhwts'
        style={{ zIndex: 800 }}
      >
        <Draggable
          position={plotPosition}
          onStop={(event, dragElement) => setPlotPosition({ x: dragElement.x, y: dragElement.y })}
          disabled={disableDrag}
        >
          <Box
            id='mhwts'
            onClick={(e) => e.stopPropagation()}
          >
            <Box
              onMouseLeave={enableMapAction}
              onMouseEnter={disableMapAction}
              style={{
                backgroundColor: '#e0e0e0',
                width: 800,
                height: 40,
              }}
            >
              <IconButton
                onClick={onClose}
                sx={{
                  display: 'flex',
                  marginLeft: 'auto',
                  marginRight: 0
                }}
              >
                <CloseIcon />
              </IconButton>
            </Box>
            <Box
              style={{ backgroundColor: 'rgb(255,255,255)' }}
              onMouseEnter={() => {
                setDisableDrag(true)
                disableMapAction()
              }}
              onMouseLeave={() => {
                setDisableDrag(false)
                enableMapAction()
              }}
            >
              <Box
                sx={{
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}>
                <Box
                  id='mhwtDateSelection'
                  sx={{
                    display: "flex",
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: "100%",
                    pt: 3,
                    gap: 2,
                  }}>
                  <FormControl sx={{ minWidth: 100 }} size="small">
                    <InputLabel id="mhwts-start-year">{t('OdbData.mhw.startyear')}</InputLabel>
                    <Select
                      labelId="mhwts-start-year"
                      label="Start Year"
                      value={startYear}
                      onChange={handleChangeStart}
                    >
                      {years.map(year => (
                        <MenuItem key={year} value={year} sx={{ justifyItems: 'center' }}>{year}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <Typography variant="subtitle1"> ~ </Typography>
                  <FormControl sx={{ minWidth: 100 }} size="small">
                    <InputLabel id="mhwts-end-year">{t('OdbData.mhw.endyear')}</InputLabel>
                    <Select
                      labelId="mhwts-end-year"
                      label="End Year"
                      value={endYear}
                      onChange={handleChangeEnd}
                    >
                      {years
                        .filter(year => year >= startYear)
                        .map(year => (
                          <MenuItem key={year} value={year}>{year}</MenuItem>
                        ))}

                    </Select>
                  </FormControl>
                </Box>
                {apidata ?
                  <Plot divId="mhwtPlot" data={plotProps.data} layout={plotProps.layout} config={plotProps.config} />
                  :
                  <Box sx={{
                    display: 'flex',
                    py: 0,
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '400px'
                  }}>
                    {
                      apidata === null ?
                        <Typography sx={{ py: 3, textAlign: 'center' }}>{t('OdbData.mhw.nodata')}</Typography>
                        :
                        <CircularProgress />
                    }
                  </Box>
                }
                {footPrint}
              </Box>
            </Box>
          </Box>
        </Draggable>
      </Pane >
    </>
  )
};

export default React.memo(MarineHeatwaveTimeSerise);