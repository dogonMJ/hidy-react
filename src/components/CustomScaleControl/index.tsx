import { Control, DomUtil, DomEvent } from 'leaflet';
import { createControlComponent } from "@react-leaflet/core";

interface CustomScaleOptions extends Control.ScaleOptions {
  nautical?: boolean
  onClick?: () => void,
}

const scaleControl = Control.Scale.include({
  options: {
    position: 'bottomleft',
    maxWidth: 100,
    metric: true,
    imperial: false,
    nautical: false,
  },
  onAdd: function (map: any) {
    const className = 'cusor-pointer leaflet-control-scale'
    const container = DomUtil.create('div', className)
    const options = this.options;
    this._addScales(options, className + '-line', container);
    DomEvent.on(container, 'click', function () {
      if (options.onClick) {
        options.onClick();
      }
    }, this);
    map.on(options.updateWhenIdle ? 'moveend' : 'move', this._update, this);
    map.whenReady(this._update, this);
    return container;
  },
  _updateScales: function (maxMeters: number) {
    if (this.options.metric && maxMeters) {
      this._updateMetric(maxMeters);
    }
    if (this.options.imperial && maxMeters) {
      this._updateImperial(maxMeters);
    }
    if (this.options.nautical && maxMeters) {
      this._updateNautical(maxMeters);
    }
  },
  _addScales: function (options: any, className: string, container: any) {
    if (options.metric) {
      this._mScale = DomUtil.create('div', className, container);
    }
    if (options.imperial) {
      this._iScale = DomUtil.create('div', className, container);
    }
    if (options.nautical) {
      this._nScale = DomUtil.create('div', className, container);
    }
  },
  _updateNautical: function (maxMeters: number) {
    if (maxMeters > 1852) {
      const maxNauticalMiles = maxMeters / 1852
      const nauticalMiles = this._getRoundNum(maxNauticalMiles);
      this._updateScale(this._nScale, nauticalMiles + ' nm', nauticalMiles / maxNauticalMiles);
    } else {
      const meters = this._getRoundNum(maxMeters)
      const label = meters + ' m'
      this._updateScale(this._nScale, label, meters / maxMeters);
    }
  },
});
export const CustomScaleControl = createControlComponent(
  (props: CustomScaleOptions) => new scaleControl(props)
);
