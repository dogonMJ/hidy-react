import { PortalControlButton } from "components/PortalControlButton";
import { Button, Card, CardActions, CardContent, CardHeader, CardMedia, IconButton, Box, Slide, Stack, TextField, Typography } from "@mui/material";
import ShareIcon from '@mui/icons-material/Share';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import RefreshIcon from '@mui/icons-material/Refresh';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import { useMap } from "react-leaflet";
import { useSelector } from "react-redux";
import { RootState, store } from "store/store";
import { memo, useCallback, useState } from "react";
import { readUrlQuery, findModified, flattenObject } from "Utils/UtilsStates";
import { Close } from "@mui/icons-material";
import { useMapDragScroll } from "hooks/useMapDragScroll";
import { useTranslation } from "react-i18next";
import { QRCodeCanvas } from 'qrcode.react';

const defaultStates: any = store.getState()

export const ShareControl = memo(() => {
  const map = useMap()
  const { setDragNScroll } = useMapDragScroll()
  const { t } = useTranslation()
  const [showBanner, setShowBanner] = useState(false)
  const [newUrl, setNewUrl] = useState('')
  const [newQRUrl, setNewQRUrl] = useState(newUrl)
  const datetime = useSelector((state: RootState) => state.map.datetime)
  const { i18n } = useTranslation()

  const getShareUrl = useCallback(() => {
    const states: any = store.getState();
    const switches = states.switches.checked //已開選項
    const modified = findModified(defaultStates, states, switches) //和預設不同選項

    //單選選項
    const modKeys = Object.keys(modified)
    const singleOptions = switches.filter((x: string) => !modKeys.includes(x))
    singleOptions.forEach((key: string) => { modified[key] = {} })
    //地圖選項
    modified.map = {
      lang: i18n.language,
      z: map.getZoom(),
      c: [map.getCenter().lat.toFixed(4), map.getCenter().lng.toFixed(4)],
      datetime: datetime,
      ...modified.map,
    }
    //網址原有選項
    const queryString = window.location.search
    const urlParams = new URLSearchParams(queryString);
    urlParams.forEach((value, key) => {
      if (modified[key]) { //網址原有選項被改變
        const original = readUrlQuery(key)
        Object.entries(original).forEach(([k, v]) => {
          if (modified[key][k] === undefined) {
            modified[key][k] = v
          }
        })
      } else { //網址原有選項未改變，直接拉到新網址
        if (switches.includes(key)) {
          modified[key] = readUrlQuery(key)
        }
      }
    })
    return flattenObject(modified)
  }, [datetime, map])

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
  const handleCopy = () => navigator.clipboard.writeText(newUrl)
  const handleClear = () => window.history.replaceState({}, '', `${window.location.origin}${window.location.pathname}`)
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
                // defaultValue={newUrl}
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
              <Button size="small" onClick={handleClear} startIcon={<ClearAllIcon fontSize="small" />}>
                <Typography fontSize='small'>{t('share.clear')}</Typography>
              </Button>
            </CardActions>
          </Card>
        </Slide>
      </Box>
    </>
  )
})