import { Typography } from '@mui/material';
import { useTranslation } from "react-i18next";
import { Download, Crop, PanTool } from '@mui/icons-material'

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
          {t('DataInfo.reference')}: <a target="_blank" href="https://doi.org/10.5067/GHGMR-4FJ04" rel="noreferrer">MUR-JPL-L4-GLOB-v4.1</a><br />
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
          {t('DataInfo.productID')}: <a target="_blank" href="https://nasa-gibs.github.io/gibs-api-docs/available-visualizations/#visualization-product-catalog" rel="noreferrer">GHRSST_L4_MUR_Sea_Surface_Temperature_Anomalies</a><br />
          {t('DataInfo.reference')}: <a target="_blank" href="https://doi.org/10.5067/GHGMR-4FJ04" rel="noreferrer">MUR-JPL-L4-GLOB-v4.1</a><br />
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
          {t('DataInfo.productID')}: <a target="_blank" href="https://nasa-gibs.github.io/gibs-api-docs/available-visualizations/#visualization-product-catalog" rel="noreferrer">GHRSST_L4_MUR_Sea_Surface_Temperature_Anomalies</a><br />
          {t('DataInfo.reference')}: <a target="_blank" href="https://doi.org/10.5067/MODIS/MYD02HKM.061" rel="noreferrer">MYD02HKM</a>&nbsp;&nbsp;
          <a target="_blank" href="https://doi.org/10.5067/MODIS/MYD021KM.061" rel="noreferrer">MYD021KM</a><br />
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
          {/* {t('DataInfo.productID')}: <a target="_blank" href="https://doi.org/10.48670/moi-00099" rel="noreferrer">OCEANCOLOUR_GLO_CHL_L4_NRT_OBSERVATIONS_009_033</a><br /> */}
          {t('DataInfo.productID')}: <a target="_blank" href="https://doi.org/10.48670/moi-00279" rel="noreferrer">OCEANCOLOUR_GLO_BGC_L4_NRT_009_102</a><br />
          {t('DataInfo.dataset')}:cmems_obs-oc_glo_bgc-plankton_nrt_l4-gapfree-multi-4km_P1D<br />
          {t('DataInfo.variable')}: mass_concentration_of_chlorophyll_a_in_sea_water (CHL)<br />
          {t('DataInfo.spatialRes')}: 4{t('DataInfo.km')} × 4{t('DataInfo.km')}<br />
          {t('DataInfo.temporalRange')}: 2022-08-22 ~ <br />
          {t('DataInfo.temporalRes')}: {t('DataInfo.daily')}<br />
          {t('DataInfo.updateFreq')}: {t('DataInfo.daily')}, 22:00 (UTC)<br />
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
          <i>Generated using E.U. Copernicus Marine Service Information:
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
          <i>Generated using E.U. Copernicus Marine Service Information:
            <a target="_blank" href="https://doi.org/10.48670/moi-00149" rel="noreferrer">https://doi.org/10.48670/moi-00149</a>
          </i><br />
        </Typography>
      )
    case 'sea':
      return (
        <Typography sx={{ p: 2 }}>
          <b>{t(`CWBsites.${props.dataId}`)}</b><br />
          {t('DataInfo.source')}:<a target="_blank" href="https://opendata.cwa.gov.tw/index" rel="noreferrer">{t('CWBsites.cwbopendata')}</a><br />
          {t('DataInfo.productID')}:<br />
          <span style={{ paddingLeft: '1rem' }}>
            資料:<a target="_blank" href="https://opendata.cwa.gov.tw/dataset/observation/O-B0075-001" rel="noreferrer">O-B0075-001</a>
          </span><br />
          <span style={{ paddingLeft: '1rem' }}>
            站位:<a target="_blank" href="https://opendata.cwa.gov.tw/dataset/observation/O-B0076-001" rel="noreferrer">O-B0076-001</a>
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
          {t('DataInfo.source')}:<a target="_blank" href="https://opendata.cwa.gov.tw/index" rel="noreferrer"> {t('CWBsites.cwbopendata')}</a><br />
          {t('DataInfo.productID')}: <a target="_blank" href="https://opendata.cwa.gov.tw/dataset/observation/O-A0001-001" rel="noreferrer">O-A0001-001</a><br />
          {t('DataInfo.temporalRes')}: {t('DataInfo.hourly')}<br />
          {t('DataInfo.updateFreq')}: {t('DataInfo.hourly')}<br />
          {t('DataInfo.timezone')}: UTC+8
        </Typography>
      )
    case 'radar':
      return (
        <Typography sx={{ p: 2 }}>
          <b>{t(`CWBsites.${props.dataId}`)}</b><br />
          {t('DataInfo.source')}: <a target="_blank" href={"https://www.cwa.gov.tw/V8/" + t('CWBsites.sitelang') + "/W/OBS_Radar.html"} rel="noreferrer">{t('CWBsites.cwb')}</a><br />
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
          {t('DataInfo.source')}: <a target="_blank" href="https://opendata.cwa.gov.tw/dataset/mathematics?page=1" rel="noreferrer">{t('CWBsites.cwbopendata')}</a><br />
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
          {t('DataInfo.source')}: <a target="_blank" href="https://opendata.cwa.gov.tw/dataset/mathematics?page=1" rel="noreferrer">{t('CWBsites.cwbopendata')}</a><br />
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
          {t('DataInfo.source')}: <a target="_blank" href="https://opendata.cwa.gov.tw/dataset/mathematics?page=1" rel="noreferrer">{t('CWBsites.cwbopendata')}</a><br />
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
          {t('DataInfo.source')}: <a target="_blank" href="https://opendata.cwa.gov.tw/dataset/mathematics?page=1" rel="noreferrer">{t('CWBsites.cwbopendata')}</a><br />
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
          {t('DataInfo.source')}: <a target="_blank" href="https://opendata.cwa.gov.tw/dataset/mathematics?page=1" rel="noreferrer">{t('CWBsites.cwbopendata')}</a><br />
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
          {t('DataInfo.source')}: <a target="_blank" href="https://opendata.cwa.gov.tw/dataset/mathematics?page=1" rel="noreferrer">{t('CWBsites.cwbopendata')}</a><br />
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
    case 'CPlanLayers':
      return (
        <Typography sx={{ p: 2, whiteSpace: 'pre-wrap' }}>
          <b>{t(`CPlanLayers.title`)}</b><br />
          <a target="_blank" href="https://odbwms.oc.ntu.edu.tw/odbintl/rasters/cplan/" rel="noreferrer">C-Plan</a><br />
          <span>{t('CPlanLayers.description')}</span><br />
          <span>{t('CPlanLayers.tip')}</span><br />
        </Typography >
      )
    case 'odbTopo':
      return (
        <Typography sx={{ p: 2, whiteSpace: 'pre-wrap' }}>
          <b>{t(`OdbData.${props.dataId}`)}</b><br />
          {t('OdbData.topo.description')}<br /><br />
          {t('DataInfo.source')}: <a target="_blank" href="https://www.odb.ntu.edu.tw/bathy/" rel="noreferrer">{t('OdbData.topo.source')}</a><br />
          {t('DataInfo.spatialRange')}: 2 ~ 35°N, 105 ~ 135°E (500m); 21 ~ 26°N, 119 ~ 123°E (200m)<br />
          {t('DataInfo.spatialRes')}: 200m, 500m <br />
          {t('DataInfo.temporalRange')}: 1989 ~ {t('DataInfo.3yr')}<br />
        </Typography >
      )
    case 'odbCtd':
      return (
        <Typography sx={{ p: 2, whiteSpace: 'pre-wrap' }}>
          <b>{t(`OdbData.${props.dataId}`)}</b><br />
          {t('OdbData.CTD.description')}<br /><br />
          {t('OdbData.CTD.description2')}<br />
          {t('OdbData.CTD.description3')}<br /><br />
          {t('OdbData.des_season')}<br /><br />
          {t('DataInfo.source')}: <a target="_blank" href="https://www.odb.ntu.edu.tw/ctd/" rel="noreferrer">{t('OdbData.CTD.source')}</a><br />
          {t('DataInfo.productID')}: ctd_grid15moa<br />
          {t('DataInfo.spatialRange')}: 18 ~ 27°N, 117 ~ 125°E<br />
          {t('DataInfo.spatialRes')}: 0.25° × 0.25° <br />
          {t('DataInfo.temporalRange')}: 1985 ~ {t('DataInfo.3yr')}<br />
          {t('DataInfo.others')}: <a target="_blank" href="https://ecodata.odb.ntu.edu.tw/api/" rel="noreferrer">ODB Open API</a>{t('OdbData.CTD.others')}
        </Typography >
      )
    case 'odbGravity':
      return (
        <Typography sx={{ p: 2, whiteSpace: 'pre-wrap' }}>
          <b>{t(`OdbData.${props.dataId}`)}</b><br />
          {t('OdbData.gravity.description')}<br /><br />
          {t('DataInfo.source')}: <a target="_blank" href="https://www.odb.ntu.edu.tw/gravity/" rel="noreferrer">{t('OdbData.gravity.source')}</a>
        </Typography >
      )
    case 'odbCurrent':
      return (
        <Typography sx={{ p: 2, whiteSpace: 'pre-wrap' }}>
          <b>{t(`OdbData.${props.dataId}`)}</b><br />
          {t('OdbData.current.description')}<br /><br />
          {t('OdbData.des_season')}<br /><br />
          {t('DataInfo.source')}: <a target="_blank" href="https://www.odb.ntu.edu.tw/adcp/" rel="noreferrer">{t('OdbData.current.source')}</a><br />
          {t('DataInfo.productID')}: sadcp_grid15moa<br />
          {t('DataInfo.spatialRange')}: 18 ~ 27°N, 117 ~ 125°E<br />
          {t('DataInfo.spatialRes')}: 0.25° × 0.25° × 10 m <br />
          {t('DataInfo.temporalRange')}: 1991 ~ 2021<br />
          {t('DataInfo.others')}: <a target="_blank" href="https://ecodata.odb.ntu.edu.tw/api/" rel="noreferrer">ODB Open API</a>{t('OdbData.current.others')}
        </Typography >
      )
    case 'odbSedCore':
      return (
        <Typography sx={{ p: 2, whiteSpace: 'pre-wrap' }}>
          <b>{t(`OdbData.odbSedCore`)}</b><br />
          {t('OdbData.sedCore.description')}<br /><br />
          <b>{t('DataInfo.source')}: </b><a target="_blank" href="https://www.odb.ntu.edu.tw/coresite/sample-page/" rel="noreferrer">{t('OdbData.sedCore.source')}</a><br />
        </Typography >
      )
    case 'odbMarineHeatwave':
      return (
        <Typography sx={{ p: 2, whiteSpace: 'pre-wrap' }}>
          <b>{t(`OdbData.odbMarineHeatwave`)}</b><br />
          {t('OdbData.mhw.description1')}<br />
          <img src='https://eco.odb.ntu.edu.tw/pub/MHW/assets/hobday_2018.jpg' alt="" loading="lazy" width={336} height={200} /><br />
          {t('OdbData.mhw.description2')}<br /><br />
          <b>{t('DataInfo.spatialRange')}: </b>{t('DataInfo.globe')}<br />
          <b>{t('DataInfo.spatialRes')}: </b>0.25° × 0.25°<br />
          <b>{t('DataInfo.temporalRange')}: </b>1982/01 ~ {t('DataInfo.lastMonth')} <br />
          <b>{t('DataInfo.temporalRes')}: </b>{t('DataInfo.monthly')} (P1M)<br />
          <b>{t('DataInfo.updateFreq')}: </b>{t('DataInfo.monthly')}<br />
          <b>{t('DataInfo.source')}: </b><a target="_blank" href="https://eco.odb.ntu.edu.tw/pub/MHW/" rel="noreferrer">{t('OdbData.mhw.source')}</a><br />
          <b>{t('DataInfo.others')}:</b><br />
          {t('OdbData.mhw.description3')}
        </Typography >
      )
    case 'odbChemistry':
      return (
        <Typography sx={{ p: 2, whiteSpace: 'pre-wrap' }}>
          <b>{t(`OdbData.odbChemistry`)}</b><br />
          {t('OdbData.chemistryList.description')}<br /><br />
          <b>{t('DataInfo.source')}:</b> <br />
          <a target="_blank" href={`${t('OdbData.chemistryList.siteUrl')}`} rel="noreferrer">{t('OdbData.chemistryList.siteName')}</a><br />
          <b>{t('DataInfo.others')}:</b> <br />
          {t('OdbData.chemistryList.others')}: <a target="_blank" href="https://chemview.odb.ntu.edu.tw/" rel="noreferrer">ODB Marine Chemistry Viewer</a><br />
        </Typography >
      )
    case 'odbBio':
      return (
        <Typography sx={{ p: 2, whiteSpace: 'pre-wrap' }}>
          <b>{t(`OdbData.odbBio`)}</b><br />
          {t('OdbData.Bio.description1')}<br /><br />
          {t('OdbData.Bio.description2')}<br /><br />
          <b>{t('DataInfo.source')}:</b> <br />
          <a target="_blank" href="https://www.odb.ntu.edu.tw/bio/bio-ocean-database/" rel="noreferrer">{t('OdbData.Bio.source')}</a>; {t('OdbData.Bio.source2')}<br />
          <b>{t('DataInfo.others')}:</b><br />
          {t('OdbData.Bio.description3')}<br />
          {t('OdbData.Bio.others')}: <a target="_blank" href="https://bio.odb.ntu.edu.tw/query/" rel="noreferrer">BioQuery and OpenAPI</a>
        </Typography >
      )
    case 'odbMicroPlastic':
      return (
        <Typography sx={{ p: 2, whiteSpace: 'pre-wrap' }}>
          <b>{t(`OdbData.odbMicroPlastic`)}</b><br />
          {t('OdbData.plastic.description1')}<br /><br />
          <b>{t('DataInfo.source')}:</b><br />
          <a target="_blank" href="https://www.ncei.noaa.gov/products/microplastics" rel="noreferrer">NCEI Marine Microplastics</a><br />
          {t('OdbData.plastic.description2')}<br />
          <a target="_blank" href="https://www.oca.gov.tw/ch/home.jsp?id=394&parentpath=0,299" rel="noreferrer">{t('OdbData.plastic.OCAfull')}</a><br />
          {t('OdbData.plastic.description3')}<br />
        </Typography >
      )
    case 'StatMeanLongterm':
      return (
        <Typography sx={{ p: 2, whiteSpace: 'pre-wrap' }}>
          {t('DataInfo.source')}: <a target="_blank" href="https://www.ncei.noaa.gov/products/world-ocean-atlas" rel="noreferrer">World Ocean Atlas 2018</a><br />
          {t('DataInfo.productType')}: WOA18 decav<br />
          {t('DataInfo.spatialRange')}: 2 ~ 35°N, 105 ~ 135°E<br />
          {t('DataInfo.spatialRes')}: 0.25° × 0.25°<br />
          {t('DataInfo.temporalRange')}: 1955-01-01 ~ 2017-12-31<br />
          {t('DataInfo.others')}: {t('StatMean.description.woa')}<br />
        </Typography >
      )
    case 'StatMeanMonthly':
      return (
        <Typography sx={{ p: 2, whiteSpace: 'pre-wrap' }}>
          {t('DataInfo.source')}: <a target="_blank" href="https://marine.copernicus.eu/" rel="noreferrer">E.U. Copernicus Marine Service Information</a><br />
          {t('DataInfo.productID')}: <a target="_blank" href="https://doi.org/10.48670/moi-00019" rel="noreferrer">GLOBAL_MULTIYEAR_BGC_001_029</a><br />
          {t('DataInfo.dataset')}:Monthly mean fields for product global reanalysis bio 001 029<br />
          {t('DataInfo.spatialRange')}: 2 ~ 35°N, 105 ~ 135°E<br />
          {t('DataInfo.spatialRes')}:  0.25° × 0.25°<br />
          {t('DataInfo.temporalRange')}: 1993-01 ~ 2018-12 <br />
          {t('DataInfo.others')}: {t('StatMean.description.cmems')}<br />
        </Typography >
      )
    case 'StatMeanProfile':
      return (
        <Typography sx={{ p: 2, whiteSpace: 'pre-wrap' }}>
          {t('StatMean.description.profile')}
        </Typography >
      )
    case 'StatMeanContour':
      return (
        <Typography sx={{ p: 2, whiteSpace: 'pre-wrap' }}>
          {t('StatMean.description.contour')}
        </Typography >
      )
    case 'ShipLocation':
      return (
        <Typography sx={{ p: 2, whiteSpace: 'pre-wrap' }}>
          {t('ShipTrack.description.location')}
        </Typography >
      )
    case 'HistTrack':
      return (
        <Typography sx={{ p: 2, whiteSpace: 'pre-wrap' }}>
          {t('ShipTrack.description.hist')}
        </Typography >
      )
    case 'addUrlOption':
      return (
        <Typography sx={{ p: 2, whiteSpace: 'pre-wrap' }}>
          {t('WMSSelector.description.addUrlOption')}
        </Typography >
      )
    case 'selectUrl':
      return (
        <Typography sx={{ p: 2, whiteSpace: 'pre-wrap' }}>
          {t('WMSSelector.description.selectUrl')}
        </Typography >
      )
    case 'serviceType':
      return (
        <Typography sx={{ p: 2, whiteSpace: 'pre-wrap' }}>
          {t('WMSSelector.description.serviceType')}
        </Typography >
      )
    case 'layerKeyword':
      return (
        <Typography sx={{ p: 2, whiteSpace: 'pre-wrap' }}>
          {t('WMSSelector.description.layerKeyword')}
        </Typography >
      )
    case 'directAddLayers':
      return (
        <Typography sx={{ p: 2, whiteSpace: 'pre-wrap' }}>
          {t('WMSSelector.description.directAddLayers')}
        </Typography >
      )
    case 'layerSelector':
      return (
        <Typography sx={{ p: 2, whiteSpace: 'pre-wrap' }}>
          {t('WMSSelector.description.layerSelector')}
        </Typography >
      )
    case 'urlType':
      return (
        <Typography sx={{ p: 2, whiteSpace: 'pre-wrap' }}>
          {t('WMSSelector.description.urlType')}
        </Typography >
      )
    case 'draw':
      return (
        <Typography sx={{ p: 2, whiteSpace: 'pre-wrap', width: '35vw' }}>
          {t('draw.source')}: <a target="_blank" href="https://doi.org/10.5285/e0f0bb80-ab44-2739-e053-6c86abc0289c" rel="noreferrer">GEBCO Compilation Group (2022) GEBCO_2022 Grid</a><br />
          {t('draw.info')}<br />
          {t('draw.polyline')}<br />
          {t('draw.polygon')}<br />
          {t('draw.circle')}<br />
          {t('draw.marker')}<br />
          {t('draw.edit')}<br />
          {t('draw.del')}
        </Typography >
      )
    case 'screenshot':
      return (
        <Typography sx={{ p: 2, whiteSpace: 'pre-wrap', width: '35vw' }}>
          {t('screenshot.info.selection')}<br />
          {t('screenshot.info.input')}<br />
          <Crop fontSize='small' />/<PanTool fontSize='small' /> : {t('screenshot.info.draw')}<br />
          <Download fontSize='small' /> : {t('screenshot.info.download')}
        </Typography >
      )
  }
  return <></>
}

export default InfoList