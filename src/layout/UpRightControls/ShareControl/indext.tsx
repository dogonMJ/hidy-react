import { PortalControlButton } from "components/PortalControlButton";
import { Button, Card, CardActions, CardContent, CardHeader, CardMedia, IconButton, Box, Slide, TextField, Typography } from "@mui/material";
import ShareIcon from '@mui/icons-material/Share';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import RefreshIcon from '@mui/icons-material/Refresh';
import UndoIcon from '@mui/icons-material/Undo';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import { useMap } from "react-leaflet";
import { store } from "store/store";
import { memo, useCallback, useState } from "react";
import { readUrlQuery, findModified, flattenObject, toIETF } from "Utils/UtilsStates";
import { Close } from "@mui/icons-material";
import { useMapDragScroll } from "hooks/useMapDragScroll";
import { useTranslation } from "react-i18next";
import { QRCodeCanvas } from 'qrcode.react';
import { is3D } from "Utils/UtilsApi";
import { useAppSelector } from "hooks/reduxHooks";

const defaultStates: any = store.getState()

export const ShareControl = memo(() => {
  const map = useMap()
  const { setDragNScroll } = useMapDragScroll()
  const { t } = useTranslation()
  const [showBanner, setShowBanner] = useState(false)
  const [newUrl, setNewUrl] = useState('')
  const [newQRUrl, setNewQRUrl] = useState(newUrl)
  const datetime = useAppSelector(state => state.map.datetime)
  const { i18n } = useTranslation()
  // const getShareUrl = useCallback(() => {
  const getShareUrl = () => {
    const states: any = store.getState();
    const { checked, ...radios } = states.switches//已開選項和radio選項
    const modified = findModified(defaultStates, states, checked) //和預設不同選項

    //單選選項
    const modKeys = Object.keys(modified)
    const singleOptions = checked.filter((x: string) => !modKeys.includes(x))
    singleOptions.forEach((key: string) => { modified[key] = {} })
    //單選 radio
    Object.keys(radios).forEach((key: string) => {
      if (radios[key] !== 'close') {
        modified[key] = radios[key]
      }
    });
    //網址原有選項
    const queryString = window.location.search
    const urlParams = new URLSearchParams(queryString);
    urlParams.forEach((value, key) => {
      if (modified[key]) {
        //網址原有選項被改變
        const original = readUrlQuery(key)
        Object.entries(original).forEach(([k, v]) => {
          if (original[k] && modified[key][k] && original[k].includes('{')) {
            const urlObj = JSON.parse(original[k])
            const modObj = modified[key][k]
            for (const key in urlObj) {
              if (modObj.hasOwnProperty(key) && urlObj.hasOwnProperty(key)) {
                if (modObj[key] === undefined) {
                  modObj[key] = urlObj[key];
                }
              }
            }
          }
          if (modified[key][k] === undefined && typeof modified[key] !== 'string') {
            //typeof modified[key] !== 'string'避免radio選項被取代，radio選項為 modified[key]=string
            modified[key][k] = v
          }
        })
      } else {
        //網址原有選項未改變，直接拉到新網址
        if (checked.includes(key)) {
          modified[key] = readUrlQuery(key)
        }
      }
    })
    //地圖選項
    modified.map = {
      z: map.getZoom(),
      c: [Number(map.getCenter().lat.toFixed(4)), Number(map.getCenter().lng.toFixed(4))],
      datetime: datetime,
      lang: toIETF(i18n.language) === 'en' ? 'en' : undefined,
      scaleUnit: (states.map.scaleUnit !== 'metric') ? states.map.scaleUnit : undefined,
      baseLayer: (states.map.baseLayer !== 'bingmap') ? states.map.baseLayer : undefined,
      latlonformat: (states.map.latlonformat !== 'dd') ? states.map.latlonformat : undefined,
      wmsDepthIndex: modified.wmsLayer && is3D(modified.wmsLayer) ? states.map.wmsDepthIndex : undefined,
    }
    return flattenObject(modified)
  }
  // }, [datetime, map])

  const handleClick = () => {
    const res = getShareUrl()
    setNewUrl(`${window.location.origin}${window.location.pathname}?${res.slice(1)}`)
    setNewQRUrl(`${window.location.origin}${window.location.pathname}?${res.slice(1)}`)
    // window.history.replaceState({}, '', `${window.location.origin}${window.location.pathname}`)
    setShowBanner(!showBanner)
  }
  const handleRefresh = () => {
    const res = getShareUrl()
    setNewUrl(`${window.location.origin}${window.location.pathname}?${res.slice(1)}`)
    setNewQRUrl(`${window.location.origin}${window.location.pathname}?${res.slice(1)}`)
  }
  const handleDefault = () => {
    setNewUrl(`${window.location.origin}${window.location.pathname}`)
    setNewQRUrl(`${window.location.origin}${window.location.pathname}`)
  }
  const handleCopy = () => navigator.clipboard.writeText(newUrl)
  // const handleClear = () => window.history.replaceState({}, '', `${window.location.origin}${window.location.pathname}`)
  const handleMouseEnter = () => setDragNScroll(false)
  const handleMouseOut = () => setDragNScroll(true)
  const handleQRBlur = () => setNewQRUrl(newUrl)

  return (
    <>
      <PortalControlButton position="topright" className='leaflet-control' order="unshift">
        <div className='leaflet-bar bg-white' tabIndex={-1} style={{ height: 30, overflow: 'hidden' }} >
          <IconButton
            title={t('share.title')}
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
      <Box
        id="box"
        sx={{ position: 'absolute', width: 450, height: 325, top: 52, right: 40, overflow: 'hidden' }}
      >
        <Slide in={showBanner} direction='left' mountOnEnter unmountOnExit>
          <Card
            sx={{ position: 'absolute', zIndex: 1000, width: 440, height: 325, right: 10 }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseOut}
          >
            <CardHeader
              title={t('share.title')}
              titleTypographyProps={{ fontSize: 'small' }}
              sx={{ paddingY: 0.5 }}
              action={
                <IconButton onClick={() => setShowBanner(false)}>
                  <Close />
                </IconButton>
              }
            />
            <CardMedia sx={{ display: 'flex', justifyContent: 'center', padding: 1 }}>
              <QRCodeCanvas value={newQRUrl} size={93} />
            </CardMedia>
            <CardContent sx={{ paddingBottom: 0, paddingTop: 0 }}>
              <TextField
                multiline
                size="small"
                sx={{ width: 400 }}
                rows={5}
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                onBlur={handleQRBlur}
              />
            </CardContent>
            <CardActions sx={{ paddingY: 0.7, paddingLeft: 2 }} >
              <Button size="small" onClick={handleCopy} startIcon={<ContentCopyIcon fontSize="small" />}>
                <Typography fontSize='small'>{t('share.copy')}</Typography>
              </Button>
              <Button size="small" onClick={handleRefresh} startIcon={<RefreshIcon fontSize="small" />}>
                <Typography fontSize='small'>{t('share.refresh')}</Typography>
              </Button>
              <Button size="small" onClick={handleDefault} startIcon={<UndoIcon fontSize="small" />}>
                <Typography fontSize='small'>{t('share.toDefault')}</Typography>
              </Button>
              {/* <Button size="small" onClick={handleClear} startIcon={<ClearAllIcon fontSize="small" />}>
                <Typography fontSize='small'>{t('share.clear')}</Typography>
              </Button> */}
            </CardActions>
          </Card>
        </Slide>
      </Box>
    </>
  )
})