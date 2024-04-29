import { DataPanelRadioList } from "components/DataPanelRadioList"
import { WMTSCustomPanel } from "./CMEMSCustomPanel"
import { useEffect, useState } from "react"
import { ProcCMEMS } from "./ProcCMEMS";
import CMEMSPalettes from "assets/jsons/CMEMS_cmap.json"
import { BrushOutlined, BrushRounded } from "@mui/icons-material";
import { RenderIf } from "components/RenderIf/RenderIf";
import { useAppDispatch, useAppSelector } from "hooks/reduxHooks";
import { ColorPaletteLegend } from "components/ColorPaletteLegend";
import { useTranslation } from "react-i18next";
import { getMarks, is3D } from "Utils/UtilsApi";
import { DepthMeter } from "components/DepthlMeter";
import { WmProps, webmapSlice } from "store/slice/webmapSlice";
import { useFetchData } from "hooks/useFetchData";
import { Divider, ListSubheader } from "@mui/material";
import { ProcGibs } from "./ProcGibs";
import { GibsCustomPanel } from "./GibsCustomPanel";
import { onoffsSlice } from "store/slice/onoffsSlice";
import { reversePalette } from "../ODB/OdbCTD"
import { Pane } from "react-leaflet";


const optionGibs = ["sst", "ssta", "TrueColor"]
const optionCmems = ['sla', 'adt', 'CHL']
const optionCmemsForecast = ['3dinst_thetao', '3dinst_so', 'mlotst', 'bottomT', 'zos']
// const depths = [-5727.9169921875, -5274.7841796875, -4833.291015625, -4405.22412109375, -3992.48388671875, -3597.031982421875, -3220.820068359375, -2865.702880859375, -2533.3359375, -2225.077880859375, -1941.8929443359375, -1684.2840576171875, -1452.2509765625, -1245.291015625, -1062.43994140625, -902.3392944335938, -763.3331298828125, -643.5667724609375, -541.0889282226562, -453.9377136230469, -380.2130126953125, -318.1274108886719, -266.0403137207031, -222.47520446777344, -186.12559509277344, -155.85069274902344, -130.66600036621094, -109.72930145263672, -92.3260726928711, -77.85385131835938, -65.80726623535156, -55.76428985595703, -47.37369155883789, -40.344051361083984, -34.43415069580078, -29.444730758666992, -25.211410522460938, -21.598819732666016, -18.495559692382812, -15.810070037841797, -13.467140197753906, -11.404999732971191, -9.572997093200684, -7.92956018447876, -6.440614223480225, -5.078224182128906, -3.8194949626922607, -2.6456689834594727, -1.5413750410079956, -0.49402499198913574]
export const WebMapLayers = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const [openCustomPanel, setOpenCustomPanel] = useState(false)
  const checked = useAppSelector(state => state.switches.checked)
  const identifier = useAppSelector(state => state.switches.wmsLayer)
  const wmProps = useAppSelector(state => state.webmap[identifier])
  const depthMeterValue = useAppSelector(state => state.map.depthMeterValue['cmems'])
  const capabilities = useFetchData('https://api.odb.ntu.edu.tw/ogcquery/capability?type=WMTS&url=https://wmts.marine.copernicus.eu/teroWmts/GLOBAL_ANALYSISFORECAST_PHY_001_024/cmems_mod_glo_phy-thetao_anfc_0.083deg_PT6H-i_202211?request=GetCapabilities&service=WMS')
  const depths = capabilities.data ? [...capabilities.data.capability[0].dimension.elevation.value] : [-0.49402499198913574]
  const depth = depthMeterValue ? (depths[depthMeterValue] && is3D(identifier)) ? depths[depthMeterValue] : -0.49402499198913574 : -0.49402499198913574

  const handleToggle = (value: any) => {
    dispatch(onoffsSlice.actions.setWmsLayer(value))
    // id由radios控制(圖層開關);自訂選項(webmap)加入checked中比對變化
    const currentIndex = checked.indexOf('webmap');
    const newChecked = [...checked];
    if (value === 'close') {
      newChecked.splice(currentIndex, 1);
    } else if (currentIndex === -1) {
      newChecked.push('webmap');
    }
    dispatch(onoffsSlice.actions.setChecked(newChecked))
  }
  const hadleBrushClick = async (ev: any) => {
    const id = ev.currentTarget.id
    if (id === identifier) { setOpenCustomPanel(prev => !prev) }
  }
  useEffect(() => {
    if (identifier.substring(0, 2) === '3d') {
      const newWmProps: WmProps = Object.assign({}, { ...wmProps, elevation: depth })
      dispatch(webmapSlice.actions.setWmProps({ identifier, newWmProps }))
    }
  }, [depth])

  return (
    <>
      <DataPanelRadioList
        group="WebMapLayers"
        identifier={identifier}
        optionList={['close']}
        handleClick={handleToggle}
      />
      <Divider variant="middle" />
      <ListSubheader component="div" id="nested-list-subheader" sx={{ lineHeight: '25px', marginTop: '10px' }}>
        {t('APIlayers.subheader1')}
      </ListSubheader>
      <DataPanelRadioList
        group="WebMapLayers"
        identifier={identifier}
        optionList={optionGibs}
        handleClick={handleToggle}
        sx={{ paddingBottom: 0 }}
        customButtonProps={{
          handleClick: hadleBrushClick,
          Icon: <BrushOutlined />,
          closeIcon: <BrushRounded />,
          open: openCustomPanel
        }}
        customPanel={
          <RenderIf isTrue={openCustomPanel}>
            <GibsCustomPanel identifier={identifier} />
          </RenderIf>
        }
      />
      <DataPanelRadioList
        group="WebMapLayers"
        identifier={identifier}
        optionList={optionCmems}
        handleClick={handleToggle}
        sx={{ paddingTop: 0 }}
        customButtonProps={{
          handleClick: hadleBrushClick,
          Icon: <BrushOutlined />,
          closeIcon: <BrushRounded />,
          open: openCustomPanel
        }}
        customPanel={
          <RenderIf isTrue={openCustomPanel}>
            <WMTSCustomPanel identifier={identifier} />
          </RenderIf>
        }
      />
      <Divider variant="middle" />
      <ListSubheader component="div" id="nested-list-subheader" sx={{ lineHeight: '25px', marginTop: '10px' }}>
        {t('APIlayers.subheader2')}
      </ListSubheader>
      <DataPanelRadioList
        group="WebMapLayers"
        identifier={identifier}
        optionList={optionCmemsForecast}
        handleClick={handleToggle}
        customButtonProps={{
          handleClick: hadleBrushClick,
          Icon: <BrushOutlined />,
          closeIcon: <BrushRounded />,
          open: openCustomPanel
        }}
        customPanel={
          <RenderIf isTrue={openCustomPanel}>
            <WMTSCustomPanel identifier={identifier} />
          </RenderIf>
        }
      />
      <RenderIf isTrue={optionGibs.includes(identifier)}>
        <ProcGibs identifier={identifier} {...wmProps} />
      </RenderIf>
      <RenderIf isTrue={identifier !== 'close' && !optionGibs.includes(identifier)}>
        <ProcCMEMS identifier={identifier} {...wmProps} />
        <ColorPaletteLegend
          palette={reversePalette(CMEMSPalettes[wmProps?.cmap as keyof typeof CMEMSPalettes], wmProps?.inverse ?? false)}
          interval={256}
          min={wmProps?.min}
          max={wmProps?.max}
          title={t(`WebMapLayers.legend.${identifier}`)}
        />
        <RenderIf isTrue={is3D(identifier)}>
          <DepthMeter values={depths} marks={getMarks('', depths)} user={'cmems'} />
        </RenderIf>
      </RenderIf>
    </>
  )
}