import { useMap } from 'react-leaflet';
import { useEffect } from 'react';
import CPicon from 'assets/images/CP.svg'

declare const L: any;

L.Control.Cplan = L.Control.extend({
  _className: 'leaflet-control-measure',
  onAdd: function (map: any) {
    this._map = map
    this._initLayout()
    this._layer = L.layerGroup().addTo(map);
    return this._container;
  },
  _initLayout: function () {
    const className = this._className
    const container = (this._container = L.DomUtil.create('div', `${className} leaflet-bar`));
    container.innerHTML = `
    <div>
      <a role="button" aria-label="C-Plan" href="https://odbwms.oc.ntu.edu.tw/odbintl/rasters/cplan/" target="_blank" rel="noreferrer">
        <img src=${CPicon} style="padding:5px" alt='C-Plan' title="To C-Plan"/>
      </a>
    </div>`
  },
}
)

export const CPlan = () => {
  const map = useMap()

  useEffect(() => {
    const CplanControl = new L.Control.Cplan();
    CplanControl.addTo(map);
  }, [map])
  return null;
}