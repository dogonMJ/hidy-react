//@ts-ignore
import 'leaflet.minichart'

(function () {
  const L = window.L;
  const d3 = require("d3");
  const minicharts = require("minicharts");
  const utils = require("./utils.js");

  L.minichart.charts = L.Minichart.extend({
    options: {
      type: "bar",
      data: [1],
      maxValues: "auto",
      colors: d3.schemeCategory10,
      width: 60,
      height: 60,
      opacity: 1,
      labels: "none",
      labelMinSize: 8,
      labelMaxSize: 24,
      labelPadding: 2,
      labelColor: "auto",
      labelStyle: "font-family:sans-serif",
      transitionTime: 750,
      paneName: 'markerPane',
      sizeFactor: undefined, // portion to zoom level. If exist, width and height won't work
    },
    initialize: function (center, options) {
      this._center = center;
      this._zoom = 0;
      L.setOptions(this, options)
      // this.options = utils.mergeOptions(options, this.options);
      this._setMaxValue();
      L.CircleMarker.prototype.initialize.call(
        this,
        center,
        { radius: this.options.width / 2, stroke: false, fill: false }
      );
    },
    onAdd: function (map) {
      L.CircleMarker.prototype.onAdd.call(this, map);
      // Change class of container so that the element hides when zooming
      const pane = map.getPane(this.options.paneName)
      const container = L.DomUtil.create('div', "leaflet-zoom-hide", pane)
      // create the svg element that holds the chart
      this._chart = d3.select(container).append("g");
      if (L.version >= "1.0") this.addInteractiveTarget(this._chart.node());

      map.on('moveend', this._onMoveend, this);

      this._redraw(true);
    },
    onRemove: function (map) {
      // remove layer's DOM elements and listeners
      L.CircleMarker.prototype.onRemove.call(this, map);
      this._chart.selectAll("*").remove();
      map.off('moveend', this._onMoveend, this);
    },

    _onMoveend: function () {
      // Redraw chart only if zoom has changed
      const oldZoom = this._zoom;
      this._zoom = this._map.getZoom();
      if (oldZoom !== this._zoom) this._redraw();
    },

    setOptions: function (options) {
      const newChart = options.type && options.type !== this.options.type;
      this.options = utils.mergeOptions(options, this.options);
      this._setMaxValue();
      this._redraw(newChart);
    },

    _setMaxValue: function () {
      // Max absolute value for each variable
      let max = this.options.maxValues;
      const data = utils.toArray(this.options.data);
      if (max === "auto") {
        max = Math.max(
          d3.max(data),
          Math.abs(d3.min(data))
        )
        if (max === 0) max = 1;
      }

      max = utils.toArray(max);

      if (max.length !== 1 && max.length !== data.length) {
        throw new Error("'maxValues' should be a single number or have same length as 'data'");
      }

      for (var i = 0; i < data.length; i++) {
        if (Math.abs(data[i]) > max[i % max.length]) {
          console.warn("Some data values are greater than 'maxValues'." +
            " Chart will be truncated. You should set option 'maxValues'" +
            " to avoid this problem.");
          break;
        }
      }

      this.options.maxValues = max;
    },
    _redraw: function (newChart) {
      // Move container on the map
      const c = this._map.latLngToLayerPoint(this._center);
      const zoom = this._map.getZoom()
      let size;
      let height;
      let width;
      if (this.options.sizeFactor) {
        size = zoom * this.options.sizeFactor
        width = size
        height = this.options.type === "bar" ? size * 2 : size
      } else {
        width = this.options.width
        height = this.options.type === "bar" ? this.options.height * 2 : this.options.height
      }

      this._chart
        .transition()
        .duration(this.options.transitionTime)
        .attr('style', `transform: translate3d(${c.x - width / 2}px,${c.y - height / 2}px, 0px)`)
        .attr('class', "leaflet-marker-icon leaflet-zoom-animated leaflet-interactive")

      // prepare data
      let data = this.options.data;
      data = utils.toArray(data);
      for (var i = 0; i < data.length; i++) {
        if (isNaN(data[i]) || !isFinite(data[i])) data[i] = 0;
      }
      var max = this.options.maxValues;
      // Scale data. This step is essential to have different scales for each
      // variable. Only relevant if chart is not a pie/
      var dataScaled = [];
      if (this.options.type === "pie") {
        dataScaled = data;
      } else {
        for (let i = 0; i < data.length; i++) {
          dataScaled.push(data[i] / max[i % max.length]);
        }
      }

      // Prepare labels
      let labels = this.options.labels;
      if (labels === "auto") {
        labels = utils.prettyNumbers(data);
      }

      // Generator function
      let generator, type;
      switch (this.options.type) {
        case "bar":
          generator = minicharts.Barchart;
          break;
        case "pie":
          generator = minicharts.Piechart;
          break;
        case "polar-radius":
          generator = minicharts.Polarchart;
          type = "radius";
          break;
        case "polar-area":
          generator = minicharts.Polarchart;
          type = "area";
          break;
        default:
          generator = minicharts.Barchart;
          break;
      }

      // Graphical options for the generator function
      const chartOpts = {
        // width: this.options.width,
        width: this.options.sizeFactor ? zoom * this.options.sizeFactor : this.options.width,
        height: this.options.height * 2, // Used only if type = "bar"
        colors: this.options.colors,
        type: type,
        transitionTime: this.options.transitionTime,
        minValue: -1,
        maxValue: 1,
        labels: labels,
        labelColors: this.options.labelColor,
        labelMinSize: this.options.labelMinSize,
        labelMaxSize: this.options.labelMaxSize,
        labelPadding: this.options.labelPadding,
        labelClass: "leaflet-clickable leaflet-interactive",
        shapeClass: "leaflet-clickable leaflet-interactive"
      };

      // Create of update chart

      if (newChart === true) {
        this._chart.selectAll("*").remove();
        this._chartObject = new generator(this._chart.node(), dataScaled, chartOpts);
      } else {
        this._chartObject.update(dataScaled, chartOpts);
      }
    }
  })

  L.minichart.Charts = function (coord, options) {
    return new L.minichart.charts(coord, options);
  };

})();