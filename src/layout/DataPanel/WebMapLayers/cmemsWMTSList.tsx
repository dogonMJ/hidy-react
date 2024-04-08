import { WmProps } from "store/slice/webmapSlice"
import { StringObject } from "types"

interface WMListEntry {
  [key: string]: WMListObject
}
interface WMListObject {
  type: string
  urlbase: string
  params: StringObject
  unit?: string
  defaults: WmProps
}

const cmemsBase = "https://wmts.marine.copernicus.eu/teroWmts?service=WMTS&request=GetTile&version=1.0.0&tilematrix={z}&tilerow={y}&tilecol={x}&"
// const gibsBase = "https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/wmts.cgi?Service=WMTS&Request=GetTile&version=1.0.0&tilematrix={z}&tilerow={y}&tilecol={x}&"
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
      range: { min: -0.0837, max: 0.3389 },
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
      range: { min: -1.2441, max: 1.3454 },
    }
  },
  CHL: {
    type: 'wmts',
    urlbase: cmemsBase,
    unit: 'm',
    params: {
      tilematrixset: "EPSG:3857",
      layer: "OCEANCOLOUR_GLO_BGC_L4_NRT_009_102/cmems_obs-oc_glo_bgc-plankton_nrt_l4-gapfree-multi-4km_P1D_202311/CHL",
    },
    defaults: {
      cmap: 'algae',
      range: { min: 0.0270, max: 1.8127 },
    }
  },
  thetao: {
    type: 'wmts',
    urlbase: cmemsBase,
    unit: 'm',
    params: {
      tilematrixset: "EPSG:3857",
      layer: "GLOBAL_ANALYSISFORECAST_PHY_001_024/cmems_mod_glo_phy-thetao_anfc_0.083deg_PT6H-i_202211/thetao",
    },
    defaults: {
      cmap: 'thermal',
      range: { min: -1.7552, max: 29.4585 },
    }
  }
}