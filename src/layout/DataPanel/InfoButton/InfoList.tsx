import { Typography } from '@mui/material';
import { useTranslation } from "react-i18next";

const InfoList = (props: { dataId: string }) => {
  const { t } = useTranslation()
  switch (props.dataId) {
    case 'close':
      return (
        <Typography sx={{ p: 2 }}>
          {t('DataInfo.close')}
        </Typography>
      )
    case 'GHRSST_L4_MUR_Sea_Surface_Temperature':
      return (
        <Typography sx={{ p: 2 }}>
          <b>{t(`APIlayers.${props.dataId}`)}</b><br />
          {t('DataInfo.source')}: <a target="_blank" href="https://earthdata.nasa.gov/eosdis/science-system-description/eosdis-components/gibs" rel="noreferrer">Global Imagery Browse Services (GIBS)</a><br />
          {t('DataInfo.productID')}: <a target="_blank" href="https://nasa-gibs.github.io/gibs-api-docs/available-visualizations/#visualization-product-catalog" rel="noreferrer">GHRSST_L4_MUR_Sea_Surface_Temperature</a><br />
          {t('DataInfo.spatialRes')}: 1 {t('DataInfo.km')}<br />
          {t('DataInfo.temporalRes')}: {t('DataInfo.daily')}<br />
          {t('DataInfo.temporalRange')}: 2002-06-01 ~ <br />
          {t('DataInfo.updateFreq')}: {t('DataInfo.daily')}<br />
          {t('DataInfo.others')}: <br />
          <i>We acknowledge the use of imagery provided by services from NASA's Global Imagery Browse Services (GIBS),</i><br />
          <i>part of NASA's Earth Observing System Data and Information System (EOSDIS).</i>
        </Typography>
      )
    case 'GHRSST_L4_MUR_Sea_Surface_Temperature_Anomalies':
      return (
        <Typography sx={{ p: 2 }}>
          <b>{t(`APIlayers.${props.dataId}`)}</b><br />
          {t('DataInfo.source')}: <a target="_blank" href="https://earthdata.nasa.gov/eosdis/science-system-description/eosdis-components/gibs" rel="noreferrer">Global Imagery Browse Services (GIBS)</a><br />
          {t('DataInfo.productID')}: <a target="_blank" href="https://nasa-gibs.github.io/gibs-api-docs/available-visualizations/#visualization-product-catalog" rel="noreferrer">GHRSST_L4_MUR_Sea_Surface_Temperature</a><br />
          {t('DataInfo.spatialRes')}: 1 {t('DataInfo.km')}<br />
          {t('DataInfo.temporalRes')}: {t('DataInfo.daily')}<br />
          {t('DataInfo.temporalRange')}: 2002-07-23 ~ <br />
          {t('DataInfo.updateFreq')}: {t('DataInfo.daily')}<br />
          {t('DataInfo.others')}: <br />
          <i>We acknowledge the use of imagery provided by services from NASA's Global Imagery Browse Services (GIBS),</i><br />
          <i>part of NASA's Earth Observing System Data and Information System (EOSDIS).</i>
        </Typography>
      )
    case 'MODIS_Aqua_CorrectedReflectance_TrueColor':
      return (
        <Typography sx={{ p: 2 }}>
          <b>{t(`APIlayers.${props.dataId}`)}</b><br />
          {t('DataInfo.source')}: <a target="_blank" href="https://earthdata.nasa.gov/eosdis/science-system-description/eosdis-components/gibs" rel="noreferrer">Global Imagery Browse Services (GIBS)</a><br />
          {t('DataInfo.productID')}: <a target="_blank" href="https://nasa-gibs.github.io/gibs-api-docs/available-visualizations/#visualization-product-catalog" rel="noreferrer">GHRSST_L4_MUR_Sea_Surface_Temperature</a><br />
          {t('DataInfo.spatialRes')}: 250 {t('DataInfo.m')}<br />
          {t('DataInfo.temporalRes')}: {t('DataInfo.daily')}<br />
          {t('DataInfo.temporalRange')}: 2002-07-03 ~ <br />
          {t('DataInfo.updateFreq')}: {t('DataInfo.daily')}<br />
          {t('DataInfo.others')}: <br />
          <i>We acknowledge the use of imagery provided by services from NASA's Global Imagery Browse Services (GIBS),</i><br />
          <i>part of NASA's Earth Observing System Data and Information System (EOSDIS).</i>
        </Typography>
      )
    case 'sla':
      return (
        <Typography sx={{ p: 2 }}>
          <b>{t(`APIlayers.${props.dataId}`)}</b><br />
          {t('DataInfo.source')}: <a target="_blank" href="https://marine.copernicus.eu/" rel="noreferrer">E.U. Copernicus Marine Service Information</a><br />
          {t('DataInfo.productID')}: <a target="_blank" href="https://doi.org/10.48670/moi-00149" rel="noreferrer">SEALEVEL_GLO_PHY_L4_NRT_OBSERVATIONS_008_046</a><br />
          {t('DataInfo.spatialRes')}: 0.25° × 0.25°<br />
          {t('DataInfo.temporalRange')}: 2019-12-01 ~ <br />
          {t('DataInfo.temporalRes')}: {t('DataInfo.daily')} (12:00 ~ 12:00(+1) UTC)<br />
          {t('DataInfo.updateFreq')}: {t('DataInfo.daily')}, 11:30 (UTC+8)<br />
          {t('DataInfo.others')}: <br />
          <span style={{ whiteSpace: 'pre-wrap' }}>{t('APIlayers.slaOthers')}</span>
        </Typography >
      )
    case 'adt':
      return (
        <Typography sx={{ p: 2 }}>
          <b>{t(`APIlayers.${props.dataId}`)}</b><br />
          {t('DataInfo.source')}: <a target="_blank" href="https://marine.copernicus.eu/" rel="noreferrer">E.U. Copernicus Marine Service Information</a><br />
          {t('DataInfo.productID')}: <a target="_blank" href="https://doi.org/10.48670/moi-00149" rel="noreferrer">SEALEVEL_GLO_PHY_L4_NRT_OBSERVATIONS_008_046</a><br />
          {t('DataInfo.spatialRes')}: 0.25° × 0.25°<br />
          {t('DataInfo.temporalRange')}: 2019-12-01 ~ <br />
          {t('DataInfo.temporalRes')}: {t('DataInfo.daily')} (12:00 ~ 12:00(+1) UTC)<br />
          {t('DataInfo.updateFreq')}: {t('DataInfo.daily')}, 11:30 (UTC+8)<br />
          {t('DataInfo.others')}: <br />
          <span style={{ whiteSpace: 'pre-wrap' }}>{t('APIlayers.adtOthers')}</span>
        </Typography>
      )
    case 'chl':
      return (
        <Typography sx={{ p: 2 }}>
          <b>{t(`APIlayers.${props.dataId}`)}</b><br />
          {t('DataInfo.source')}: <a target="_blank" href="https://marine.copernicus.eu/" rel="noreferrer">E.U. Copernicus Marine Service Information</a><br />
          {t('DataInfo.productID')}: <a target="_blank" href="https://doi.org/10.48670/moi-00099" rel="noreferrer">OCEANCOLOUR_GLO_CHL_L4_NRT_OBSERVATIONS_009_033</a><br />
          {t('DataInfo.spatialRes')}: 4{t('DataInfo.km')} × 4{t('DataInfo.km')}<br />
          {t('DataInfo.temporalRange')}: 2021-07-01 ~ <br />
          {t('DataInfo.temporalRes')}: {t('DataInfo.daily')}<br />
          {t('DataInfo.updateFreq')}: {t('DataInfo.daily')}, 20:00 (UTC+8)<br />
          {t('DataInfo.others')}: <br />
          <span style={{ whiteSpace: 'pre-wrap' }}>{t('APIlayers.chlOthers')}</span>
        </Typography>
      )
    case 'Himawari_AHI_Band3_Red_Visible_1km':
      return (
        <Typography sx={{ p: 2 }}>
          <b>{t(`APIlayers.${props.dataId}`)}</b><br />
          {t('DataInfo.source')}: <a target="_blank" href="https://earthdata.nasa.gov/eosdis/science-system-description/eosdis-components/gibs" rel="noreferrer">Global Imagery Browse Services (GIBS)</a><br />
          {t('DataInfo.productID')}: Himawari_AHI_Band3_Red_Visible_1km<br />
          {t('DataInfo.spatialRes')}: 1 {t('DataInfo.km')}<br />
          {t('DataInfo.temporalRes')}: 10 {t('DataInfo.min')}<br />
          {t('DataInfo.updateFreq')}: ~10 {t('DataInfo.min')}<br />
          {t('DataInfo.others')}: <br />
          <i>We acknowledge the use of imagery provided by services from NASA's Global Imagery Browse Services (GIBS),</i><br />
          <i>part of NASA's Earth Observing System Data and Information System (EOSDIS).</i>
        </Typography>
      )
    case 'madt':
      return (
        <Typography sx={{ p: 2 }}>
          <b>{t(`Animated.${props.dataId}`)} (m/s)</b><br />
          {t('DataInfo.source')}: <a target="_blank" href="https://marine.copernicus.eu/" rel="noreferrer">E.U. Copernicus Marine Service Information</a><br />
          {t('DataInfo.productID')}: <a target="_blank" href="https://doi.org/10.48670/moi-00149" rel="noreferrer">SEALEVEL_GLO_PHY_L4_NRT_OBSERVATIONS_008_046</a><br />
          {t('DataInfo.spatialRes')}: 0.25° × 0.25°<br />
          {t('DataInfo.temporalRes')}: {t('DataInfo.daily')} (12:00 ~ 12:00(+1) UTC)<br />
          {t('DataInfo.updateFreq')}: {t('DataInfo.daily')}, 10:00 (UTC+8)<br />
          {t('DataInfo.others')}: <br />
          <a target="_blank" href="https://catalogue.marine.copernicus.eu/documents/PUM/CMEMS-SL-PUM-008-032-068.pdf" rel="noreferrer">{t('Animated.info')}</a><br />
          <i>Generated using E.U. Copernicus Marine Service Information;
            <a target="_blank" href="https://doi.org/10.48670/moi-00149" rel="noreferrer">https://doi.org/10.48670/moi-00149</a>
          </i><br />
        </Typography>
      )
    case 'msla':
      return (
        <Typography sx={{ p: 2 }}>
          <b>{t(`Animated.${props.dataId}`)} (m/s)</b><br />
          {t('DataInfo.source')}: <a target="_blank" href="https://marine.copernicus.eu/" rel="noreferrer">E.U. Copernicus Marine Service Information</a><br />
          {t('DataInfo.productID')}: <a target="_blank" href="https://doi.org/10.48670/moi-00149" rel="noreferrer">SEALEVEL_GLO_PHY_L4_NRT_OBSERVATIONS_008_046</a><br />
          {t('DataInfo.spatialRes')}: 0.25° × 0.25°<br />
          {t('DataInfo.temporalRes')}: {t('DataInfo.daily')} (12:00 ~ 12:00(+1) UTC)<br />
          {t('DataInfo.updateFreq')}: {t('DataInfo.daily')}, 10:00 (UTC+8)<br />
          {t('DataInfo.others')}: <br />
          <a target="_blank" href="https://catalogue.marine.copernicus.eu/documents/PUM/CMEMS-SL-PUM-008-032-068.pdf" rel="noreferrer">{t('Animated.info')}</a><br />
          <i>Generated using E.U. Copernicus Marine Service Information;
            <a target="_blank" href="https://doi.org/10.48670/moi-00149" rel="noreferrer">https://doi.org/10.48670/moi-00149</a>
          </i><br />
        </Typography>
      )
    case 'sea':
      return (
        <Typography sx={{ p: 2 }}>
          <b>{t(`CWBsites.${props.dataId}`)}</b><br />
          {t('DataInfo.source')}:<a target="_blank" href="https://opendata.cwb.gov.tw/index" rel="noreferrer">{t('CWBsites.cwbopendata')}</a><br />
          {t('DataInfo.productID')}:<br />
          <span style={{ paddingLeft: '1rem' }}>
            資料:<a target="_blank" href="https://opendata.cwb.gov.tw/dataset/observation/O-B0075-001" rel="noreferrer">O-B0075-001</a>
          </span><br />
          <span style={{ paddingLeft: '1rem' }}>
            站位:<a target="_blank" href="https://opendata.cwb.gov.tw/dataset/observation/O-B0076-001" rel="noreferrer">O-B0076-001</a>
          </span><br />
          {t('DataInfo.temporalRes')}: {t('DataInfo.hourly')}<br />
          {t('DataInfo.updateFreq')}: 4/{t('DataInfo.hr')}<br />
          {t('DataInfo.timezone')}: UTC+8
        </Typography>
      )
    case 'weather':
      return (
        <Typography sx={{ p: 2 }}>
          <b>{t(`CWBsites.${props.dataId}`)}</b><br />
          {t('DataInfo.source')}:<a target="_blank" href="https://opendata.cwb.gov.tw/index" rel="noreferrer"> {t('CWBsites.cwbopendata')}</a><br />
          {t('DataInfo.productID')}: <a target="_blank" href="https://opendata.cwb.gov.tw/dataset/observation/O-A0001-001" rel="noreferrer">O-A0001-001</a><br />
          {t('DataInfo.temporalRes')}: {t('DataInfo.hourly')}<br />
          {t('DataInfo.updateFreq')}: {t('DataInfo.hourly')}<br />
          {t('DataInfo.timezone')}: UTC+8
        </Typography>
      )
    case 'radar':
      return (
        <Typography sx={{ p: 2 }}>
          <b>{t(`CWBsites.${props.dataId}`)}</b><br />
          {t('DataInfo.source')}: <a target="_blank" href={"https://www.cwb.gov.tw/V8/" + t('CWBsites.sitelang') + "/W/OBS_Radar.html"} rel="noreferrer">{t('CWBsites.cwb')}</a><br />
          {t('DataInfo.spatialRes')}: 1 {t('DataInfo.km')}<br />
          {t('DataInfo.temporalRes')}: 10 {t('DataInfo.min')}<br />
          {t('DataInfo.updateFreq')}: ~15 {t('DataInfo.min')}<br />
          {t('DataInfo.timezone')}: UTC+8
        </Typography>
      )
  }
  return <></>
}

export default InfoList