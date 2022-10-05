
import { createControlComponent } from "@react-leaflet/core";
import CPicon from 'assets/images/CP.svg'

declare const L: any;

L.Control.Cplan = L.Control.extend({
  _className: 'bg-white leaflet-bar',
  onAdd: function (map: any) {
    this._map = map
    this._initLayout()
    this._layer = L.layerGroup().addTo(map);
    return this._container;
  },
  _initLayout: function () {
    const className = this._className
    const container = (this._container = L.DomUtil.create('div', className));
    container.innerHTML = `
    <div>
      <a role="button" aria-label="C-Plan" href="https://odbwms.oc.ntu.edu.tw/odbintl/rasters/cplan/" target="_blank" rel="noreferrer">
        <img src=${CPicon} style="padding:5px" alt='C-Plan' title="To C-Plan"/>
      </a>
    </div>`
  },
}
)

export const CPlanControll = createControlComponent((props) => new L.Control.Cplan(props))