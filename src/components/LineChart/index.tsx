import Plot from 'react-plotly.js';
import Draggable from 'react-draggable';
import { useRef, forwardRef } from 'react';
import { Pane, useMap } from 'react-leaflet';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from '@mui/material';
import { PlotParams } from "react-plotly.js";

export const LineChart = forwardRef((
  props: {
    plotProps: PlotParams,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
    hover?: (data: Plotly.PlotHoverEvent) => void,
    unhover?: (data: Plotly.PlotMouseEvent) => void
  }
  , ref: any,) => {
  const nodeRef = useRef(null)
  const map = useMap()
  const { data, layout, config } = props.plotProps
  const layerCenterPoint = map.latLngToLayerPoint(map.getBounds().getCenter())

  const disableMapAction = () => {
    map.dragging.disable()
    map.scrollWheelZoom.disable()
  }
  const enableMapAction = () => {
    map.dragging.enable()
    map.scrollWheelZoom.enable()
  }
  const onClick = () => {
    enableMapAction()
    props.setOpen(false)
  }

  return (
    <Pane name='draggablePane' style={{ zIndex: 800 }}>
      <Draggable
        nodeRef={nodeRef}
        // defaultClassName={'DefaultDraggable'}
        defaultPosition={{ x: layerCenterPoint.x - 400, y: layerCenterPoint.y + 60 }}
      >
        <div ref={nodeRef} >
          <div
            onMouseEnter={disableMapAction}
            onMouseLeave={enableMapAction}
            style={{
              backgroundColor: '#e0e0e0',
              width: 800,
              height: 50,
            }}
          >
            <IconButton
              onClick={onClick}
              sx={{
                display: 'flex',
                marginLeft: 'auto',
                marginRight: 0
              }}>
              <CloseIcon />
            </IconButton>
            <Plot
              ref={ref}
              data={data}
              layout={layout}
              config={config}
              onHover={props.hover}
              onUnhover={props.unhover}
            />
          </div>
        </div>
      </Draggable >
    </Pane >
  )
})