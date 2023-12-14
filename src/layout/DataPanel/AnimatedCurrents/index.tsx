
import { Pane } from 'react-leaflet'
import AnimatedLayers from "layout/DataPanel/AnimatedCurrents/AnimatedLayers";
import { DataPanelRadioList } from 'components/DataPanelRadioList';
import { RenderIf } from 'components/RenderIf/RenderIf';
import { Divider } from "@mui/material";
import { useAppDispatch, useAppSelector } from 'hooks/reduxHooks';
import { onoffsSlice } from 'store/slice/onoffsSlice';
import { OptionsAnimation, optionListAnimation as optionList } from 'types';
// import { mapSlice } from 'store/slice/mapSlice';



const AnimatedCurrents = () => {
  const dispatch = useAppDispatch()
  const identifier = useAppSelector(state => state.switches.aniCur);
  const datetime = useAppSelector(state => state.map.datetime);
  const handleToggle = (value: string) => () => {
    dispatch(onoffsSlice.actions.setAniCur(value as OptionsAnimation))
  };

  return (
    <>
      <Divider variant="middle" />
      <DataPanelRadioList
        identifier={identifier}
        handleClick={handleToggle}
        group='Animated'
        optionList={optionList as unknown as string[]}
      />
      <Divider variant="middle" />
      <RenderIf isTrue={identifier !== 'close'}>
        <Pane name="canvas" style={{ zIndex: 400 }}>
          <AnimatedLayers
            identifier={identifier}
            time={datetime}
          />
        </Pane>
      </RenderIf>
    </>
  )
}

export default AnimatedCurrents