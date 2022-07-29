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
          {t('APIlayers.allOthers')}<br />
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
          {t('APIlayers.allOthers')}<br />
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
          {t('APIlayers.allOthers')}<br />
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
          {t('DataInfo.dataset')}:dataset-duacs-nrt-global-merged-allsat-phy-l4<br />
          {t('DataInfo.variable')}:sea_surface_height_above_sea_level (sla)<br />
          {t('DataInfo.spatialRes')}: 0.25° × 0.25°<br />
          {t('DataInfo.temporalRange')}: 2019-12-01 ~ <br />
          {t('DataInfo.temporalRes')}: {t('DataInfo.daily')} (12:00 ~ 12:00(+1) UTC)<br />
          {t('DataInfo.updateFreq')}: {t('DataInfo.daily')}, 11:30 (UTC+8)<br />
          {t('DataInfo.others')}: <br />
          {t('APIlayers.allOthers')}<br />
          <span style={{ whiteSpace: 'pre-wrap' }}>{t('APIlayers.slaOthers')}</span>
        </Typography >
      )
    case 'adt':
      return (
        <Typography sx={{ p: 2 }}>
          <b>{t(`APIlayers.${props.dataId}`)}</b><br />
          {t('DataInfo.source')}: <a target="_blank" href="https://marine.copernicus.eu/" rel="noreferrer">E.U. Copernicus Marine Service Information</a><br />
          {t('DataInfo.productID')}: <a target="_blank" href="https://doi.org/10.48670/moi-00149" rel="noreferrer">SEALEVEL_GLO_PHY_L4_NRT_OBSERVATIONS_008_046</a><br />
          {t('DataInfo.dataset')}:dataset-duacs-nrt-global-merged-allsat-phy-l4<br />
          {t('DataInfo.variable')}:sea_surface_height_above_geoid (adt)<br />
          {t('DataInfo.spatialRes')}: 0.25° × 0.25°<br />
          {t('DataInfo.temporalRange')}: 2019-12-01 ~ <br />
          {t('DataInfo.temporalRes')}: {t('DataInfo.daily')} (12:00 ~ 12:00(+1) UTC)<br />
          {t('DataInfo.updateFreq')}: {t('DataInfo.daily')}, 11:30 (UTC+8)<br />
          {t('DataInfo.others')}: <br />
          {t('APIlayers.allOthers')}<br />
          <span style={{ whiteSpace: 'pre-wrap' }}>{t('APIlayers.adtOthers')}</span>
        </Typography>
      )
    case 'CHL':
      return (
        <Typography sx={{ p: 2 }}>
          <b>{t(`APIlayers.${props.dataId}`)}</b><br />
          {t('DataInfo.source')}: <a target="_blank" href="https://marine.copernicus.eu/" rel="noreferrer">E.U. Copernicus Marine Service Information</a><br />
          {t('DataInfo.productID')}: <a target="_blank" href="https://doi.org/10.48670/moi-00099" rel="noreferrer">OCEANCOLOUR_GLO_CHL_L4_NRT_OBSERVATIONS_009_033</a><br />
          {t('DataInfo.dataset')}:dataset-oc-glo-bio-multi-l4-chl_interpolated_4km_daily-rt<br />
          {t('DataInfo.variable')}:mass_concentration_of_chlorophyll_a_in_sea_water (CHL)<br />
          {t('DataInfo.spatialRes')}: 4{t('DataInfo.km')} × 4{t('DataInfo.km')}<br />
          {t('DataInfo.temporalRange')}: 2021-07-01 ~ <br />
          {t('DataInfo.temporalRes')}: {t('DataInfo.daily')}<br />
          {t('DataInfo.updateFreq')}: {t('DataInfo.daily')}, 20:00 (UTC+8)<br />
          {t('DataInfo.others')}: <br />
          {t('APIlayers.allOthers')}<br />
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
          {t('DataInfo.dataset')}:dataset-duacs-nrt-global-merged-allsat-phy-l4<br />
          {t('DataInfo.variable')}:surface_geostrophic_eastward_sea_water_velocity (ugos)<br />
          surface_geostrophic_northward_sea_water_velocity (vgos)<br />
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
          {t('DataInfo.dataset')}:dataset-duacs-nrt-global-merged-allsat-phy-l4<br />
          {t('DataInfo.variable')}:surface_geostrophic_eastward_sea_water_velocity_assuming_sea_level_for_geoid (ugosa)<br />
          surface_geostrophic_northward_sea_water_velocity_assuming_sea_level_for_geoid (vgosa)<br />
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
    case '3dinst_thetao':
      return (
        <Typography sx={{ p: 2 }}>
          <b>{t(`APIlayers.${props.dataId}`)}</b><br />
          {t('DataInfo.source')}: <a target="_blank" href="https://marine.copernicus.eu/" rel="noreferrer">E.U. Copernicus Marine Service Information</a><br />
          {t('DataInfo.productID')}: <a target="_blank" href="https://doi.org/10.48670/moi-00016" rel="noreferrer">GLOBAL_ANALYSIS_FORECAST_PHY_001_024</a><br />
          {t('DataInfo.dataset')}:global-analysis-forecast-phy-001-024-3dinst-thetao<br />
          {t('DataInfo.variable')}:sea_water_potential_temperature (thetao)<br />
          {t('DataInfo.spatialRes')}: 0.083° × 0.083°<br />
          {t('DataInfo.temporalRange')}: 2019-01-01 ~ <br />
          {t('DataInfo.temporalRes')}: 6{t('DataInfo.hr')} {t('DataInfo.instant')}<br />
          {t('DataInfo.updateFreq')}: {t('DataInfo.daily')}, 12:00 (UTC)<br />
          {t('DataInfo.others')}: <br />
          {t('APIlayers.allOthers')}<br />
          {t('APIlayers.instOthers')}<br />
        </Typography >
      )
    case '3dinst_so':
      return (
        <Typography sx={{ p: 2 }}>
          <b>{t(`APIlayers.${props.dataId}`)}</b><br />
          {t('DataInfo.source')}: <a target="_blank" href="https://marine.copernicus.eu/" rel="noreferrer">E.U. Copernicus Marine Service Information</a><br />
          {t('DataInfo.productID')}: <a target="_blank" href="https://doi.org/10.48670/moi-00016" rel="noreferrer">GLOBAL_ANALYSIS_FORECAST_PHY_001_024</a><br />
          {t('DataInfo.dataset')}:global-analysis-forecast-phy-001-024-3dinst-so<br />
          {t('DataInfo.variable')}:sea_water_salinity (so)<br />
          {t('DataInfo.spatialRes')}: 0.083° × 0.083°<br />
          {t('DataInfo.temporalRange')}: 2019-01-01 ~ <br />
          {t('DataInfo.temporalRes')}: 6{t('DataInfo.hr')} {t('DataInfo.instant')}<br />
          {t('DataInfo.updateFreq')}: {t('DataInfo.daily')}, 12:00 (UTC)<br />
          {t('DataInfo.others')}: <br />
          {t('APIlayers.allOthers')}<br />
          {t('APIlayers.instOthers')}<br />
        </Typography >
      )
    case '3dsea_water_velocity':
      return (
        <Typography sx={{ p: 2, whiteSpace: 'pre-wrap' }}>
          <b>{t(`APIlayers.${props.dataId}`)}</b><br />
          {t('DataInfo.source')}: <a target="_blank" href="https://marine.copernicus.eu/" rel="noreferrer">E.U. Copernicus Marine Service Information</a><br />
          {t('DataInfo.productID')}: <a target="_blank" href="https://doi.org/10.48670/moi-00016" rel="noreferrer">GLOBAL_ANALYSIS_FORECAST_PHY_001_024</a><br />
          {t('DataInfo.dataset')}:global-analysis-forecast-phy-001-024<br />
          {t('DataInfo.variable')}:sea_water_velocity<br />
          {t('DataInfo.spatialRes')}: 0.083° × 0.083°<br />
          {t('DataInfo.temporalRange')}: 2019-01-01 ~ <br />
          {t('DataInfo.temporalRes')}: {t('DataInfo.daily')}<br />
          {t('DataInfo.updateFreq')}: {t('DataInfo.daily')}, 12:00 (UTC)<br />
          {t('DataInfo.others')}: <br />
          {t('APIlayers.allOthers')}<br />
          {t('APIlayers.dailyOthers')}<br />
        </Typography >
      )
    case 'bottomT':
      return (
        <Typography sx={{ p: 2, whiteSpace: 'pre-wrap' }}>
          <b>{t(`APIlayers.${props.dataId}`)}</b><br />
          {t('DataInfo.source')}: <a target="_blank" href="https://marine.copernicus.eu/" rel="noreferrer">E.U. Copernicus Marine Service Information</a><br />
          {t('DataInfo.productID')}: <a target="_blank" href="https://doi.org/10.48670/moi-00016" rel="noreferrer">GLOBAL_ANALYSIS_FORECAST_PHY_001_024</a><br />
          {t('DataInfo.dataset')}:global-analysis-forecast-phy-001-024<br />
          {t('DataInfo.variable')}:sea_water_potential_temperature_at_sea_floor (bottomT)<br />
          {t('DataInfo.spatialRes')}: 0.083° × 0.083°<br />
          {t('DataInfo.temporalRange')}: 2019-01-01 ~ <br />
          {t('DataInfo.temporalRes')}: {t('DataInfo.daily')}<br />
          {t('DataInfo.updateFreq')}: {t('DataInfo.daily')}, 12:00 (UTC)<br />
          {t('DataInfo.others')}: <br />
          {t('APIlayers.allOthers')}<br />
          {t('APIlayers.dailyOthers')}<br />
        </Typography >
      )
    case 'mlotst':
      return (
        <Typography sx={{ p: 2, whiteSpace: 'pre-wrap' }}>
          <b>{t(`APIlayers.${props.dataId}`)}</b><br />
          {t('DataInfo.source')}: <a target="_blank" href="https://marine.copernicus.eu/" rel="noreferrer">E.U. Copernicus Marine Service Information</a><br />
          {t('DataInfo.productID')}: <a target="_blank" href="https://doi.org/10.48670/moi-00016" rel="noreferrer">GLOBAL_ANALYSIS_FORECAST_PHY_001_024</a><br />
          {t('DataInfo.dataset')}:global-analysis-forecast-phy-001-024<br />
          {t('DataInfo.variable')}:mlotst<br />
          {t('DataInfo.spatialRes')}: 0.083° × 0.083°<br />
          {t('DataInfo.temporalRange')}: 2019-01-01 ~ <br />
          {t('DataInfo.temporalRes')}: {t('DataInfo.daily')}<br />
          {t('DataInfo.updateFreq')}: {t('DataInfo.daily')}, 12:00 (UTC)<br />
          {t('DataInfo.others')}: <br />
          {t('APIlayers.allOthers')}<br />
          {t('APIlayers.dailyOthers')}<br />
        </Typography >
      )
    case 'zos':
      return (
        <Typography sx={{ p: 2, whiteSpace: 'pre-wrap' }}>
          <b>{t(`APIlayers.${props.dataId}`)}</b><br />
          {t('DataInfo.source')}: <a target="_blank" href="https://marine.copernicus.eu/" rel="noreferrer">E.U. Copernicus Marine Service Information</a><br />
          {t('DataInfo.productID')}: <a target="_blank" href="https://doi.org/10.48670/moi-00016" rel="noreferrer">GLOBAL_ANALYSIS_FORECAST_PHY_001_024</a><br />
          {t('DataInfo.dataset')}:global-analysis-forecast-phy-001-024-hourly-t-u-v-ssh<br />
          {t('DataInfo.variable')}:zos<br />
          {t('DataInfo.spatialRes')}: 0.083° × 0.083°<br />
          {t('DataInfo.temporalRange')}: 2019-01-01 ~ <br />
          {t('DataInfo.temporalRes')}: {t('DataInfo.hr')} {t('DataInfo.mean')}<br />
          {t('DataInfo.updateFreq')}: {t('DataInfo.daily')}, 12:00 (UTC)<br />
          {t('DataInfo.others')}: <br />
          {t('APIlayers.allOthers')}<br />
          {t('APIlayers.dailyOthers')}<br />
        </Typography >
      )
    case 'cwbcur':
      return (
        <Typography sx={{ p: 2, whiteSpace: 'pre-wrap' }}>
          <b>{t(`CwbSeaForecast.${props.dataId}`)}</b><br />
          {t('DataInfo.source')}: <a target="_blank" href="https://opendata.cwb.gov.tw/dataset/mathematics?page=1" rel="noreferrer">中央氣象局開放資料CWB Open Data</a><br />
          {t('DataInfo.productID')}: <span>M-B0071</span><br />
          {t('DataInfo.variable')}:橫向流速、直向流速<br />
          {t('DataInfo.spatialRange')}: 7 ~ 36°N, 110 ~ 126°E<br />
          {t('DataInfo.spatialRes')}: 0.1° × 0.1°<br />
          {t('DataInfo.temporalRange')}: 73 hours<br />
          {t('DataInfo.temporalRes')}: {t('DataInfo.hr')}<br />
          {t('DataInfo.updateFreq')}: {t('DataInfo.daily')}, 14:00 (+08:00)<br />
          {t('DataInfo.others')}: {t('CwbSeaForecast.others')}<br />
        </Typography >
      )
    case 'cwbdir':
      return (
        <Typography sx={{ p: 2, whiteSpace: 'pre-wrap' }}>
          <b>{t(`CwbSeaForecast.${props.dataId}`)}</b><br />
          {t('DataInfo.source')}: <a target="_blank" href="https://opendata.cwb.gov.tw/dataset/mathematics?page=1" rel="noreferrer">中央氣象局開放資料CWB Open Data</a><br />
          {t('DataInfo.productID')}: <span>M-B0071</span><br />
          {t('DataInfo.variable')}:橫向流速、直向流速<br />
          {t('DataInfo.spatialRange')}: 7 ~ 36°N, 110 ~ 126°E<br />
          {t('DataInfo.spatialRes')}: 0.1° × 0.1°<br />
          {t('DataInfo.temporalRange')}: 73 hours<br />
          {t('DataInfo.temporalRes')}: {t('DataInfo.hr')}<br />
          {t('DataInfo.updateFreq')}: {t('DataInfo.daily')}, 14:00 (+08:00)<br />
          {t('DataInfo.others')}: {t('CwbSeaForecast.others')}<br />
        </Typography >
      )
    case 'cwbsst':
      return (
        <Typography sx={{ p: 2, whiteSpace: 'pre-wrap' }}>
          <b>{t(`CwbSeaForecast.${props.dataId}`)}</b><br />
          {t('DataInfo.source')}: <a target="_blank" href="https://opendata.cwb.gov.tw/dataset/mathematics?page=1" rel="noreferrer">中央氣象局開放資料CWB Open Data</a><br />
          {t('DataInfo.productID')}: <span>M-B0071海流模式-臺灣海域海流預報數值模式資料</span><br />
          {t('DataInfo.variable')}:海表溫度<br />
          {t('DataInfo.spatialRange')}: 7 ~ 36°N, 110 ~ 126°E<br />
          {t('DataInfo.spatialRes')}: 0.1° × 0.1°<br />
          {t('DataInfo.temporalRange')}: 73 hours<br />
          {t('DataInfo.temporalRes')}: {t('DataInfo.hr')}<br />
          {t('DataInfo.updateFreq')}: {t('DataInfo.daily')}, 14:00 (+08:00)<br />
          {t('DataInfo.others')}: {t('CwbSeaForecast.others')}<br />
        </Typography >
      )
    case 'cwbpsu':
      return (
        <Typography sx={{ p: 2, whiteSpace: 'pre-wrap' }}>
          <b>{t(`CwbSeaForecast.${props.dataId}`)}</b><br />
          {t('DataInfo.source')}: <a target="_blank" href="https://opendata.cwb.gov.tw/dataset/mathematics?page=1" rel="noreferrer">中央氣象局開放資料CWB Open Data</a><br />
          {t('DataInfo.productID')}: <span>M-B0071 海流模式-臺灣海域海流預報數值模式資料</span><br />
          {t('DataInfo.variable')}:海表鹽度<br />
          {t('DataInfo.spatialRange')}: 7 ~ 36°N, 110 ~ 126°E<br />
          {t('DataInfo.spatialRes')}: 0.1° × 0.1°<br />
          {t('DataInfo.temporalRange')}: 73 hours<br />
          {t('DataInfo.temporalRes')}: {t('DataInfo.hr')}<br />
          {t('DataInfo.updateFreq')}: {t('DataInfo.daily')}, 14:00 (+08:00)<br />
          {t('DataInfo.others')}: {t('CwbSeaForecast.others')}<br />
        </Typography >
      )
    case 'cwbspd':
      return (
        <Typography sx={{ p: 2, whiteSpace: 'pre-wrap' }}>
          <b>{t(`CwbSeaForecast.${props.dataId}`)}</b><br />
          {t('DataInfo.source')}: <a target="_blank" href="https://opendata.cwb.gov.tw/dataset/mathematics?page=1" rel="noreferrer">中央氣象局開放資料CWB Open Data</a><br />
          {t('DataInfo.productID')}: <span>M-B0071 海流模式-臺灣海域海流預報數值模式資料</span><br />
          {t('DataInfo.variable')}:流速<br />
          {t('DataInfo.spatialRange')}: 7 ~ 36°N, 110 ~ 126°E<br />
          {t('DataInfo.spatialRes')}: 0.1° × 0.1°<br />
          {t('DataInfo.temporalRange')}: 73 hours<br />
          {t('DataInfo.temporalRes')}: {t('DataInfo.hr')}<br />
          {t('DataInfo.updateFreq')}: {t('DataInfo.daily')}, 14:00 (+08:00)<br />
          {t('DataInfo.others')}: {t('CwbSeaForecast.others')}<br />
        </Typography >
      )
    case 'cwbsla':
      return (
        <Typography sx={{ p: 2, whiteSpace: 'pre-wrap' }}>
          <b>{t(`CwbSeaForecast.${props.dataId}`)}</b><br />
          {t('DataInfo.source')}: <a target="_blank" href="https://opendata.cwb.gov.tw/dataset/mathematics?page=1" rel="noreferrer">中央氣象局開放資料CWB Open Data</a><br />
          {t('DataInfo.productID')}: <span>M-B0071 海流模式-臺灣海域海流預報數值模式資料</span><br />
          {t('DataInfo.variable')}:海高<br />
          {t('DataInfo.spatialRange')}: 7 ~ 36°N, 110 ~ 126°E<br />
          {t('DataInfo.spatialRes')}: 0.1° × 0.1°<br />
          {t('DataInfo.temporalRange')}: 73 hours<br />
          {t('DataInfo.temporalRes')}: {t('DataInfo.hr')}<br />
          {t('DataInfo.updateFreq')}: {t('DataInfo.daily')}, 14:00 19:00 (+08:00)<br />
          {t('DataInfo.others')}: {t('CwbSeaForecast.others')}<br />
        </Typography >
      )
  }
  return <></>
}

export default InfoList