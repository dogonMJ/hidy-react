//modified from https://github.com/klinden/L.TileLayer.WMS.Canvas2D/blob/master/TileLayer.WMS.Canvas2D.js

(function () {
  var L = window.L;

  L.TileLayer.WMS.Canvas2D = L.TileLayer.WMS.extend({
    createTile: function (coords, done) {
      // create canvas
      const canvas = L.DomUtil.create('canvas', 'leaflet-tile');

      // setup tile width and height according to the options
      const size = this.getTileSize();
      canvas.width = size.x;
      canvas.height = size.y;

      // get the canvas context and draw image on it
      const context = canvas.getContext('2d', { willReadFrequently: true });

      const img = new Image();
      img.onload = function () {
        context.drawImage(img, 0, 0);
      };
      // var img = document.createElement('img');
      L.DomEvent.on(img, 'load', L.Util.bind(this._tileOnLoad, this, done, img));
      L.DomEvent.on(img, 'error', L.Util.bind(this._tileOnError, this, done, img));

      if (this.options.crossOrigin || this.options.crossOrigin === '') {
        img.crossOrigin = this.options.crossOrigin === true ? '' : this.options.crossOrigin;
      }

      const tileUrl = this.getTileUrl(coords);
      img.src = tileUrl;
      return canvas;
    }
  });

  L.tileLayer.wms.canvas2D = function (url, options) {
    return new L.TileLayer.WMS.Canvas2D(url, options);
  };
})();