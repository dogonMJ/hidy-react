import { WmProps } from "store/slice/webmapSlice"
import { StringObject } from "types"

interface WMListEntry {
  [key: string]: WMListObject
}
interface WMListObject {
  type: string
  urlbase: string
  params: StringObject
  colorbar?: string
  defaults?: WmProps
  unit?: string
  elevations?: number[]
}

const cmemsBase = "https://wmts.marine.copernicus.eu/teroWmts?service=WMTS&request=GetTile&version=1.0.0&tilematrix={z}&tilerow={y}&tilecol={x}&"
const gibsBase = "https://gibs.earthdata.nasa.gov/wms/epsg3857/best/wms.cgi?"

export const gibsList: WMListEntry = {
  sst: {
    type: 'wms',
    urlbase: gibsBase,
    unit: '\u00B0C',
    colorbar: 'seaSurfTempColor',
    params: {
      layers: "GHRSST_L4_MUR_Sea_Surface_Temperature",
      format: 'image/png',
      transparent: 'true',
    },
  },
  ssta: {
    type: 'wms',
    urlbase: gibsBase,
    unit: '\u00B0C',
    colorbar: 'seaSurfTempAnoColor',
    params: {
      layers: "GHRSST_L4_MUR_Sea_Surface_Temperature_Anomalies",
      format: 'image/png',
      transparent: 'true',
    },
  },
  TrueColor: {
    type: 'wms',
    urlbase: gibsBase,
    unit: '\u00B0C',
    params: {
      layers: "MODIS_Aqua_CorrectedReflectance_TrueColor",
      format: 'image/png',
      transparent: 'true',
    },
  },
}
export const cmemsList: WMListEntry = {
  sla: {
    type: 'wmts',
    urlbase: cmemsBase,
    unit: 'm',
    params: {
      tilematrixset: "EPSG:3857",
      layer: "SEALEVEL_GLO_PHY_L4_NRT_008_046/cmems_obs-sl_glo_phy-ssh_nrt_allsat-l4-duacs-0.25deg_P1D_202311/sla",
    },
    defaults: {
      cmap: 'plasma',
      min: -0.0837,
      max: 0.3389,
    }
  },
  adt: {
    type: 'wmts',
    urlbase: cmemsBase,
    unit: 'm',
    params: {
      tilematrixset: "EPSG:3857",
      layer: "SEALEVEL_GLO_PHY_L4_NRT_008_046/cmems_obs-sl_glo_phy-ssh_nrt_allsat-l4-duacs-0.25deg_P1D_202311/adt",
    },
    defaults: {
      cmap: 'viridis',
      min: -1.2441,
      max: 1.3454,
    }
  },
  CHL: {
    type: 'wmts',
    urlbase: cmemsBase,
    unit: 'mg/m\u00B2',
    params: {
      tilematrixset: "EPSG:3857",
      layer: "OCEANCOLOUR_GLO_BGC_L4_NRT_009_102/cmems_obs-oc_glo_bgc-plankton_nrt_l4-gapfree-multi-4km_P1D_202311/CHL",
    },
    defaults: {
      cmap: 'algae',
      min: 0.0270,
      max: 1.8127,
    }
  },
  "3dinst_thetao": {
    type: 'wmts',
    urlbase: cmemsBase,
    unit: '\u00B0C',
    params: {
      tilematrixset: "EPSG:3857",
      layer: "GLOBAL_ANALYSISFORECAST_PHY_001_024/cmems_mod_glo_phy-thetao_anfc_0.083deg_PT6H-i_202211/thetao",
    },
    defaults: {
      cmap: 'thermal',
      min: -1.7552,
      max: 29.4585,
    },
  },
  "3dinst_so": {
    type: 'wmts',
    urlbase: cmemsBase,
    unit: 'psu',
    params: {
      tilematrixset: "EPSG:3857",
      layer: "GLOBAL_ANALYSISFORECAST_PHY_001_024/cmems_mod_glo_phy-so_anfc_0.083deg_PT6H-i_202211/so",
    },
    defaults: {
      cmap: 'haline',
      min: 30.2895,
      max: 36.8200,
    }
  },
  mlotst: {
    type: 'wmts',
    urlbase: cmemsBase,
    unit: 'm',
    params: {
      tilematrixset: "EPSG:3857",
      layer: "GLOBAL_ANALYSISFORECAST_PHY_001_024/cmems_mod_glo_phy_anfc_0.083deg_P1D-m_202211/mlotst",
    },
    defaults: {
      cmap: 'plasma',
      min: 10.4629,
      max: 158.0471,
    }
  },
  bottomT: {
    type: 'wmts',
    urlbase: cmemsBase,
    unit: '\u00B0C',
    params: {
      tilematrixset: "EPSG:3857",
      layer: "GLOBAL_ANALYSISFORECAST_PHY_001_024/cmems_mod_glo_phy_anfc_0.083deg_P1D-m_202211/tob",
    },
    defaults: {
      cmap: 'viridis',
      min: 1.4362,
      max: 20.0475,
    }
  },
  zos: {
    type: 'wmts',
    urlbase: cmemsBase,
    unit: 'm',
    params: {
      tilematrixset: "EPSG:3857",
      layer: "GLOBAL_ANALYSISFORECAST_PHY_001_024/cmems_mod_glo_phy_anfc_0.083deg_P1D-m_202211/zos",
    },
    defaults: {
      cmap: 'viridis',
      min: -1.7412,
      max: 0.8387,
    }
  },
}