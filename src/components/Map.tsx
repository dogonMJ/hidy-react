import React, { useEffect, useState, useRef, useMemo } from "react";
import "flatpickr/dist/themes/dark.css";
import Flatpickr from "react-flatpickr";
import "leaflet/dist/leaflet.css";
import "leaflet";
import './Leaflet.Coordinates-0.1.5.mod.js' //manually replace _ordinateLabel to _createCoordinateLabel
import 'leaflet.coordinates/dist/Leaflet.Coordinates-0.1.5.css'
import './Map.css'
// import Urls from './Urlchange'
import { MapContainer, TileLayer, LayersControl, ZoomControl, useMap, ScaleControl } from 'react-leaflet'
// @ts-ignore
import { BingLayer } from 'react-leaflet-bing-v2'

//not yet ts version
const { BaseLayer, Overlay } = LayersControl;
declare const L: any;
// L.Control.Coordinates = L.Control.extend({
//   options: {
//     position: 'bottomright',
//     //decimals used if not using DMS or labelFormatter functions
//     decimals: 4,
//     //decimalseperator used if not using DMS or labelFormatter functions
//     decimalSeperator: ".",
//     //label templates for usage if no labelFormatter function is defined
//     labelTemplateLat: "Lat: {y}",
//     labelTemplateLng: "Lng: {x}",
//     //label formatter functions
//     labelFormatterLat: undefined,
//     labelFormatterLng: undefined,
//     labelFormatterBoth: undefined,
//     //switch on/off input fields on click
//     enableUserInput: true,
//     //use Degree-Minute-Second
//     useDMS: false,
//     useDM: false,
//     //if true lat-lng instead of lng-lat label ordering is used
//     useLatLngOrder: false,
//     //if true user given coordinates are centered directly
//     centerUserCoordinates: false,
//     //leaflet marker type
//     markerType: L.marker,
//     //leaflet marker properties
//     markerProps: {}
//   },

//   onAdd: function (map: any) {
//     this._map = map;

//     var className = 'leaflet-control-coordinates',
//       container = this._container = L.DomUtil.create('div', className),
//       options = this.options;

//     //label containers
//     this._labelcontainer = L.DomUtil.create("div", "uiElement label", container);
//     this._label = L.DomUtil.create("span", "labelFirst", this._labelcontainer);


//     //input containers
//     this._inputcontainer = L.DomUtil.create("div", "uiElement input uiHidden", container);
//     var xSpan, ySpan;
//     if (options.useLatLngOrder) {
//       ySpan = L.DomUtil.create("span", "", this._inputcontainer);
//       this._inputY = this._createInput("inputY", this._inputcontainer);
//       xSpan = L.DomUtil.create("span", "", this._inputcontainer);
//       this._inputX = this._createInput("inputX", this._inputcontainer);
//     } else {
//       xSpan = L.DomUtil.create("span", "", this._inputcontainer);
//       this._inputX = this._createInput("inputX", this._inputcontainer);
//       ySpan = L.DomUtil.create("span", "", this._inputcontainer);
//       this._inputY = this._createInput("inputY", this._inputcontainer);
//     }
//     xSpan.innerHTML = options.labelTemplateLng.replace("{x}", "");
//     ySpan.innerHTML = options.labelTemplateLat.replace("{y}", "");

//     L.DomEvent.on(this._inputX, 'keyup', this._handleKeypress, this);
//     L.DomEvent.on(this._inputY, 'keyup', this._handleKeypress, this);

//     //connect to mouseevents
//     map.on("mousemove", this._update, this);
//     map.on('dragstart', this.collapse, this);

//     map.whenReady(this._update, this);

//     this._showsCoordinates = true;
//     //wether or not to show inputs on click
//     if (options.enableUserInput) {
//       L.DomEvent.addListener(this._container, "click", this._switchUI, this);
//     }

//     return container;
//   },

//   /**
//    *	Creates an input HTML element in given container with given classname
//    */
//   _createInput: function (classname: string, container: any) {
//     var input = L.DomUtil.create("input", classname, container);
//     input.type = "text";
//     L.DomEvent.disableClickPropagation(input);
//     return input;
//   },

//   _clearMarker: function () {
//     this._map.removeLayer(this._marker);
//   },

//   /**
//    *	Called onkeyup of input fields
//    */
//   _handleKeypress: function (e: any) {
//     switch (e.keyCode) {
//       case 27: //Esc
//         this.collapse();
//         break;
//       case 13: //Enter
//         this._handleSubmit();
//         this.collapse();
//         break;
//       default: //All keys
//         this._handleSubmit();
//         break;
//     }
//   },

//   /**
//    *	Called on each keyup except ESC
//    */
//   _handleSubmit: function () {
//     var x = L.NumberFormatter.createValidNumber(this._inputX.value, this.options.decimalSeperator);
//     var y = L.NumberFormatter.createValidNumber(this._inputY.value, this.options.decimalSeperator);
//     if (x !== undefined && y !== undefined) {
//       var marker = this._marker;
//       if (!marker) {
//         marker = this._marker = this._createNewMarker();
//         marker.on("click", this._clearMarker, this);
//       }
//       var ll = new L.LatLng(y, x);
//       marker.setLatLng(ll);
//       marker.addTo(this._map);
//       if (this.options.centerUserCoordinates) {
//         this._map.setView(ll, this._map.getZoom());
//       }
//     }
//   },

//   /**
//    *	Shows inputs fields
//    */
//   expand: function () {
//     this._showsCoordinates = false;

//     this._map.off("mousemove", this._update, this);

//     L.DomEvent.addListener(this._container, "mousemove", L.DomEvent.stop);
//     L.DomEvent.removeListener(this._container, "click", this._switchUI, this);

//     L.DomUtil.addClass(this._labelcontainer, "uiHidden");
//     L.DomUtil.removeClass(this._inputcontainer, "uiHidden");
//   },

//   /**
//    *	Creates the label according to given options and formatters
//    */
//   _createCoordinateLabel: function (ll: any) {
//     var opts = this.options,
//       x, y;
//     if (opts.customLabelFcn) {
//       return opts.customLabelFcn(ll, opts);
//     }
//     if (opts.labelFormatterLng) { // labelFormatterLng replaced by MJ
//       x = opts.labelFormatterLng(ll.lng);
//     } else {
//       x = L.Util.template(opts.labelTemplateLng, {
//         x: this._getNumber(ll.lng, opts)
//       });
//     }
//     if (opts.labelFormatterLat) {
//       y = opts.labelFormatterLat(ll.lat);
//     } else {
//       y = L.Util.template(opts.labelTemplateLat, {
//         y: this._getNumber(ll.lat, opts)
//       });
//     }
//     if (opts.labelFormatterBoth) {
//       const res = opts.labelFormatterBoth(ll.lat, ll.lng);
//       return res
//     }
//     if (opts.useLatLngOrder) {
//       return y + " " + x;
//     }
//     return x + " " + y;
//   },

//   /**
//    *	Returns a Number according to options (DMS or decimal)
//    */
//   _getNumber: function (n: number, opts: any) {
//     var res;
//     if (opts.useDMS) {
//       res = L.NumberFormatter.toDMS(n);
//     } else if (opts.useDM) {
//       res = L.NumberFormatter.toDM(n);
//     }
//     else {
//       res = L.NumberFormatter.round(n, opts.decimals, opts.decimalSeperator);
//     }
//     return res;
//   },

//   /**
//    *	Shows coordinate labels after user input has ended. Also
//    *	displays a marker with popup at the last input position.
//    */
//   collapse: function () {
//     if (!this._showsCoordinates) {
//       this._map.on("mousemove", this._update, this);
//       this._showsCoordinates = true;
//       var opts = this.options;
//       L.DomEvent.addListener(this._container, "click", this._switchUI, this);
//       L.DomEvent.removeListener(this._container, "mousemove", L.DomEvent.stop);

//       L.DomUtil.addClass(this._inputcontainer, "uiHidden");
//       L.DomUtil.removeClass(this._labelcontainer, "uiHidden");

//       if (this._marker) {
//         var m = this._createNewMarker(),
//           ll = this._marker.getLatLng();
//         m.setLatLng(ll);

//         var container = L.DomUtil.create("div", "");
//         var label = L.DomUtil.create("div", "", container);
//         label.innerHTML = this._createCoordinateLabel(ll); //replace _createCoordinateLabel by MJ

//         var close = L.DomUtil.create("a", "", container);
//         close.innerHTML = "Remove";
//         close.href = "#";
//         var stop = L.DomEvent.stopPropagation;

//         L.DomEvent
//           .on(close, 'click', stop)
//           .on(close, 'mousedown', stop)
//           .on(close, 'dblclick', stop)
//           .on(close, 'click', L.DomEvent.preventDefault)
//           .on(close, 'click', function (this: any) {
//             this._map.removeLayer(m);
//           }, this);

//         m.bindPopup(container);
//         m.addTo(this._map);
//         this._map.removeLayer(this._marker);
//         this._marker = null;
//       }
//     }
//   },

//   /**
//    *	Click callback for UI
//    */
//   _switchUI: function (evt: any) {
//     L.DomEvent.stop(evt);
//     L.DomEvent.stopPropagation(evt);
//     L.DomEvent.preventDefault(evt);
//     if (this._showsCoordinates) {
//       //show textfields
//       this.expand();
//     } else {
//       //show coordinates
//       this.collapse();
//     }
//   },

//   onRemove: function (map: any) {
//     map.off("mousemove", this._update, this);
//   },

//   /**
//    *	Mousemove callback function updating labels and input elements
//    */
//   _update: function (evt: any) {
//     var pos = evt.latlng,
//       opts = this.options;
//     if (pos) {
//       pos = pos.wrap();
//       this._currentPos = pos;
//       this._inputY.value = L.NumberFormatter.round(pos.lat, opts.decimals, opts.decimalSeperator);
//       this._inputX.value = L.NumberFormatter.round(pos.lng, opts.decimals, opts.decimalSeperator);
//       this._label.innerHTML = this._createCoordinateLabel(pos);
//     }
//   },

//   _createNewMarker: function () {
//     return this.options.markerType(null, this.options.markerProps);
//   }

// });

//constructor registration
// L.control.coordinates = function (options: any) {
//   return new L.Control.Coordinates(options);
// };

// //map init hook
// L.Map.mergeOptions({
//   coordinateControl: false
// });

// L.Map.addInitHook(function (this: any) {
//   if (this.options.coordinateControl) {
//     this.coordinateControl = new L.Control.Coordinates();
//     this.addControl(this.coordinateControl);
//   }
// });
// L.NumberFormatter = {
//   round: function (num: number | string, dec: any, sep: any) {
//     var res = L.Util.formatNum(num, dec) + "",
//       numbers = res.split(".");
//     if (numbers[1]) {
//       var d = dec - numbers[1].length;
//       for (; d > 0; d--) {
//         numbers[1] += "0";
//       }
//       res = numbers.join(sep || ".");
//     }
//     return res;
//   },

//   toDMS: function (deg: number) {
//     var d = Math.floor(Math.abs(deg));
//     var minfloat = (Math.abs(deg) - d) * 60;
//     var m: number | string = Math.floor(minfloat);
//     var secfloat = (minfloat - m) * 60;
//     var s: number | string = Math.round(secfloat);
//     if (s == 60) {
//       m++;
//       s = "00";
//     }
//     if (m == 60) {
//       d++;
//       m = "00";
//     }
//     if (s < 10) {
//       s = "0" + s;
//     }
//     if (m < 10) {
//       m = "0" + m;
//     }
//     var dir = "";
//     if (deg < 0) {
//       dir = "-";
//     }
//     return ("" + dir + d + "&deg; " + m + "' " + s + "''");
//   },

//   toDM: function (deg: number) {
//     var d = Math.floor(Math.abs(deg));
//     var m: number | string = Math.round((Math.abs(deg) - d) * 60 * 100) / 100;
//     if (m == 60) {
//       d++;
//       m = "00";
//     }
//     if (m < 10) {
//       m = "0" + m;
//     }
//     var dir = "";
//     if (deg < 0) {
//       dir = "-";
//     }
//     return ("" + dir + d + "&deg; " + m + "' ");
//   },

//   createValidNumber: function (num: any, sep: string) {
//     if (num && num.length > 0) {
//       var numbers = num.split(sep || ".");
//       try {
//         var numRes = Number(numbers.join("."));
//         if (isNaN(numRes)) {
//           return undefined;
//         }
//         return numRes;
//       } catch (e) {
//         return undefined;
//       }
//     }
//     return undefined;
//   }
// };

const mouseCoordinates = (map: object) => {
  var greenIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
  L.control.coordinates({
    enableUserInput: true,
    useLatLngOrder: true,
    markerProps: { icon: greenIcon },
    labelFormatterBoth: function (lat: number, lon: number) {
      const DMS = L.NumberFormatter.toDMS(lat) + ", " + L.NumberFormatter.toDMS(lon)
      const DM = L.NumberFormatter.toDM(lat) + ", " + L.NumberFormatter.toDM(lon)
      const D4 = lat.toFixed(4) + ", " + lon.toFixed(4)
      return `latitude, longitude<br/>${D4}<br/>${DM}<br/>${DMS}`
    },
  }).addTo(map)
}
interface Urls {
  urlRoot: string
  urlDate: Date
  urlEnd: string
}
const ProcUrls = (props: Urls) => {
  const ref = useRef<any>(null)
  const newDate = props.urlDate.toISOString().split('T')[0]
  const url = props.urlRoot + newDate + props.urlEnd
  useEffect(() => {
    // 3. 觸發side effect，TileLayer執行setUrl method，重繪
    // setUrl: Updates the layer's URL template and redraws it
    ref.current.setUrl(url)
  });
  // 1.更改url

  return (
    <>
      {/* 2.渲染DOM */}
      <TileLayer ref={ref} url={url} />
    </>
  )
}

const LeafletMap = () => {
  const d = new Date()
  const utc = Math.floor((d.getTime() + d.getTimezoneOffset() * 60 * 1000) / (60 * 1000 * 10)) * (60 * 1000 * 10)
  const [datetime, setDatetime] = useState(new Date(utc));
  const center: [number, number] = [23.5, 121];
  const zoom: number = 7
  const bing_key = 'AtxhFL61gkrGg34Rd6hUnrZbAYu3s_fpbocD79mi7w3YEWzY0SoK2wD0HJJlgg4I'
  const baseMaps = useMemo(
    () => (
      // 避免重複渲染
      <>
        <LayersControl position='topright'>
          <BaseLayer name='Open Street Map'>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </BaseLayer>
          <BaseLayer name='Bing Map' checked>
            <BingLayer
              bingkey={bing_key}
              type="Aerial"
            />
          </BaseLayer>
        </LayersControl>
      </>
    )
    , []
  )
  return (
    <>
      <Flatpickr
        className='dateTimePicker'
        data-enable-time
        value={datetime}
        onChange={([datetime]) => setDatetime(datetime)}
        options={{
          maxDate: new Date(utc),
          time_24hr: true,
          allowInput: true,
          minuteIncrement: 10,
          weekNumbers: true,
        }}
      />
      <MapContainer
        className='mapContainer'
        center={center}
        zoom={zoom}
        zoomControl={false}
        maxBounds={[[90, -239], [-90, 481]]} //121+-360為中心設定邊界減少載入
        whenCreated={mouseCoordinates}
      >
        <ScaleControl imperial={false} />
        {baseMaps}
        <LayersControl>
          <BaseLayer name='Close'>
            <TileLayer url='' />
          </BaseLayer>
          <BaseLayer name='Sea Surface Temperature'>
            <ProcUrls
              urlRoot="https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/GHRSST_L4_MUR_Sea_Surface_Temperature/default/"
              urlDate={datetime}
              urlEnd="/GoogleMapsCompatible_Level7/{z}/{y}/{x}.png"
            />
          </BaseLayer>
          <BaseLayer name='Sea Surface Temperature Anomalies'>
            <ProcUrls
              urlRoot="https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/GHRSST_L4_MUR_Sea_Surface_Temperature_Anomalies/default/"
              urlDate={datetime}
              urlEnd="/GoogleMapsCompatible_Level7/{z}/{y}/{x}.png"
            />
          </BaseLayer>
        </LayersControl>
        <ZoomControl position="topright" />
      </MapContainer>
    </>
  )
}

export default LeafletMap;