import { Control, DomUtil } from 'leaflet';
import { createControlComponent } from "@react-leaflet/core";

interface CustomScaleOptions extends Control.ScaleOptions {
  nautical?: boolean
}

const extendedScaleControl = Control.Scale.include({
  options: {
    position: 'bottomleft',
    maxWidth: 100,
    metric: true,
    imperial: false,
    nautical: false,
  },
  className: 'leaflet-control-scale',
  onAdd: function (map: any) {
    const className = this.className//'cusor-pointer leaflet-control-scale'
    const container = DomUtil.create('div', className)
    const options = this.options;
    this._addScales(options, className + '-line', container);
    // container.addEventListener('click', this._changeUnit.bind(this, className));
    map.on(options.updateWhenIdle ? 'moveend' : 'move', this._update, this);
    map.whenReady(this._update, this);
    return container;
  },
  setUnit: function (unit: 'metric' | 'imperial' | 'nautical') {
    const className = this.className
    const container = this.getContainer()
    if (this._mScale) { this._mScale.remove() }
    if (this._iScale) { this._iScale.remove() }
    if (this._nScale) { this._nScale.remove() }
    if (unit === 'metric') {
      this.options.metric = true
      this.options.nautical = false
      this.options.imperial = false
    } else if (unit === 'imperial') {
      this.options.metric = false
      this.options.nautical = false
      this.options.imperial = true
    } else if (unit === 'nautical') {
      this.options.metric = false
      this.options.nautical = true
      this.options.imperial = false
    }
    this._addScales(this.options, className + '-line', container);
    this._update()
  },
  // _changeUnit: function () {
  //   const className = this.className
  //   const container = this.getContainer()
  //   if (this.options.metric === true && this._mScale) {
  //     this._mScale.remove()
  //   }
  //   if (this.options.nautical === true && this._nScale) {
  //     this._nScale.remove()
  //   }
  //   if (this.options.imperial === true && this._iScale) {
  //     this._iScale.remove()
  //   }
  //   if (this.options.metric) {
  //     this.options.metric = false
  //     this.options.nautical = true
  //     this.options.imperial = false
  //   } else if (this.options.nautical) {
  //     this.options.metric = false
  //     this.options.nautical = false
  //     this.options.imperial = true
  //   } else if (this.options.imperial) {
  //     this.options.metric = true
  //     this.options.nautical = false
  //     this.options.imperial = false
  //   }
  //   this._addScales(this.options, className + '-line', container);
  //   this._update()
  // },
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
export const ExtendedScaleControl = createControlComponent(
  (props: CustomScaleOptions) => new extendedScaleControl(props)
);
