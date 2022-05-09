//modified from https://github.com/klinden/L.TileLayer.WMS.Canvas2D/blob/master/TileLayer.WMS.Canvas2D.js

(function () {
  var L = window.L;

  L.TileLayer.WMS.Canvas2D = L.TileLayer.WMS.extend({
    createTile: function (coords, done) {
      var tileUrl = this.getTileUrl(coords);

      // create canvas
      var canvas = L.DomUtil.create('canvas', 'leaflet-tile');

      // setup tile width and height according to the options
      var size = this.getTileSize();
      canvas.width = size.x;
      canvas.height = size.y;

      // get the canvas context and draw image on it
      var context = canvas.getContext('2d');

      var img = new Image();
      img.src = tileUrl;
      var crossOrigin = this.options.crossOrigin
      if (crossOrigin) {
        img.crossOrigin = crossOrigin
      }
      img.onload = function () {
        context.drawImage(img, 0, 0);
      };

      L.DomEvent.on(img, 'load', L.Util.bind(this._tileOnLoad, this, done, img));
      L.DomEvent.on(img, 'error', L.Util.bind(this._tileOnError, this, done, img));

      return canvas;
    }
  });

  L.tileLayer.wms.canvas2D = function (url, options) {
    return new L.TileLayer.WMS.Canvas2D(url, options);
  };
})();