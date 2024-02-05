
import { createControlComponent } from "@react-leaflet/core";
import CPicon from 'assets/images/CP.svg'
import ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';
import { Control, DomUtil } from "leaflet";
import { Box, Button } from "@mui/material";

const CPlanButton = () => {
  return (
    <div className='leaflet-bar bg-white' tabIndex={-1}>
      <Button
        href="https://odbwms.oc.ntu.edu.tw/odbintl/rasters/cplan/"
        target="_blank"
        rel="noreferrer"
        sx={{
          maxWidth: 30,
          maxHeight: 30,
          minWidth: 30,
          minHeight: 30,
          borderRadius: 0,
          padding: "5px",
        }}
      >
        <Box
          component="img"
          sx={{
            height: 20,
            width: 20,
          }}
          src={CPicon}
          title="C-Plan"
        />
      </Button>
    </div>
  )
}

const Cplan = Control.extend({
  onAdd: function (map: any) {
    const div = DomUtil.create('div', '');
    const root = createRoot(div)
    const jsx = <CPlanButton />
    root.render(jsx)
    // ReactDOM.render(jsx, div); //react 17
    return div;
  },
  onRemove: function (map: any) { },
});

export const CPlanControl = createControlComponent(
  (props) => new Cplan(props)
);



// L.Control.Cplan = L.Control.extend({
//   _className: 'bg-white leaflet-bar',
//   onAdd: function (map: any) {
//     this._map = map
//     this._initLayout()
//     this._layer = L.layerGroup().addTo(map);
//     return this._container;
//   },
//   _initLayout: function () {
//     const className = this._className
//     const container = (this._container = L.DomUtil.create('div', className));
//     container.innerHTML = `
//     <div>
//       <a role="button" aria-label="C-Plan" href="https://odbwms.oc.ntu.edu.tw/odbintl/rasters/cplan/" target="_blank" rel="noreferrer">
//         <img src=${CPicon} style="padding:5px" alt='C-Plan' title="C-Plan"/>
//       </a>
//     </div>`
//   },
// }
// )
// export const CPlanControll = createControlComponent((props) => new L.Control.Cplan(props))