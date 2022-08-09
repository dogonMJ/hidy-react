
import { Pane } from 'react-leaflet'
import { useDispatch, useSelector } from "react-redux";
import { coordInputSlice } from "store/slice/mapSlice";
import { RootState } from "store/store"
import AnimatedLayers from "layout/DataPanel/AnimatedCurrents/AnimatedLayers";
import { DataPanelRadioList } from 'components/DataPanelRadioList';
import { RenderIf } from 'components/RenderIf/RenderIf';
import { Divider } from "@mui/material";

const optionList = ["close", "madt", "msla"]
const AnimatedCurrents = () => {
  const dispatch = useDispatch()
  const identifier = useSelector((state: RootState) => state.coordInput.animateIdent);
  const datetime = useSelector((state: RootState) => state.coordInput.datetime);
  const handleToggle = (value: string) => () => {
    dispatch(coordInputSlice.actions.animateIdentifier(value))
  };

  return (
    <>
      <Divider variant="middle" />
      <DataPanelRadioList
        identifier={identifier}
        handelClick={handleToggle}
        group='Animated'
        optionList={optionList}
      />
      <Divider variant="middle" />
      <RenderIf isTrue={identifier !== 'close'}>
        <Pane name="canvas" style={{ zIndex: 400 }}>
          <AnimatedLayers
            indetifier={identifier}
            time={datetime}
          />
        </Pane>
      </RenderIf>
    </>
  )
}

export default AnimatedCurrents