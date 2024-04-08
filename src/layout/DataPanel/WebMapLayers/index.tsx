import { DataPanelRadioList } from "components/DataPanelRadioList"
import { WMTSCustomPanel } from "./WMTSCustomPanel"
import { useState } from "react"
import { ProcCMEMS } from "./ProcCMEMS";
import CMEMSPalettes from "assets/jsons/CMEMS_cmap.json"
import { BrushOutlined, BrushRounded } from "@mui/icons-material";
import { RenderIf } from "components/RenderIf/RenderIf";
import { useAppSelector } from "hooks/reduxHooks";
import { ColorPaletteLegend } from "components/ColorPaletteLegend";
import { useTranslation } from "react-i18next";
import { cmemsList } from "./cmemsWMTSList";

const optionList = ['close', ...Object.keys(cmemsList)]

export const WebMapLayers = () => {
  const { t } = useTranslation()
  const [identifier, setIdentifier] = useState('close')
  const [openCustomPanel, setOpenCustomPanel] = useState(false)
  const wmProps = useAppSelector(state => state.wm.wmProps)
  const handleToggle = (value: any) => {
    setIdentifier(value)
  }
  const hadleBrushClick = (ev: any) => {
    const id = ev.currentTarget.id
    if (id === identifier) { setOpenCustomPanel(prev => !prev) }
  }
  return (
    <>
      <DataPanelRadioList
        identifier={identifier}
        optionList={optionList}
        handleClick={handleToggle}
        group="wm"
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
      <RenderIf isTrue={identifier !== 'close'}>
        <ProcCMEMS identifier={identifier} {...wmProps[identifier]} />
        <ColorPaletteLegend
          palette={CMEMSPalettes[wmProps[identifier]?.cmap as keyof typeof CMEMSPalettes]}
          interval={256}
          min={wmProps[identifier]?.range.min}
          max={wmProps[identifier]?.range.max}
          title={t(`wm.${identifier}`)}
        />
      </RenderIf>
    </>
  )
}