import Plot from 'react-plotly.js';
import Draggable from 'react-draggable';
import { useRef, forwardRef, useState } from 'react';
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
  const [disabled, setDisabled] = useState(false)
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
  const onClose = () => {
    enableMapAction()
    props.setOpen(false)
  }

  return (
    <Pane name='draggablePane' style={{ zIndex: 800 }}>
      <Draggable
        nodeRef={nodeRef}
        // defaultClassName={'DefaultDraggable'}
        defaultPosition={{ x: layerCenterPoint.x - 400, y: layerCenterPoint.y + 60 }}
        disabled={disabled}
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
              onClick={onClose}
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
              onHover={(evt) => {
                if (props.hover) {
                  props.hover(evt)
                }
                setDisabled(true)
              }}
              onUnhover={(evt) => {
                if (props.unhover) {
                  props.unhover(evt)
                }
                setDisabled(false)
              }}
              onClick={() => setDisabled(true)}
            />
          </div>
        </div>
      </Draggable >
    </Pane >
  )
})