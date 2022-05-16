
import { Pane } from 'react-leaflet'
import { useDispatch, useSelector } from "react-redux";
import { coordInputSlice } from "store/slice/mapSlice";
import { RootState } from "store/store"
import AnimatedLayers from "layout/DataPanel/AnimatedCurrents/AnimatedLayers";
import { DataPanelRadioList } from 'components/DataPanelRadioList';
import { RenderIf } from 'components/RenderIf/RenderIf';

const optionList = ["close", "madt", "msla"]
const AnimatedCurrents = () => {
  const dispatch = useDispatch()
  const identifier = useSelector((state: RootState) => state.coordInput.animateIdent);
  const handleToggle = (value: string) => () => {
    dispatch(coordInputSlice.actions.animateIdentifier(value))
  };

  return (
    <>
      <DataPanelRadioList
        identifier={identifier}
        handelClick={handleToggle}
        group='Animated'
        optionList={optionList}
      />
      <RenderIf isTrue={identifier !== 'close'}>
        <Pane name="canvas" style={{ zIndex: 400 }}>
          <AnimatedLayers indetifier={identifier} />
        </Pane>
      </RenderIf>
    </>
  )
}

export default AnimatedCurrents