const {DeckGL, ScatterplotLayer, TextLayer} = deck;

const hex2rgba = (hex, alpha = 1) => {
  return hex.match(/\w\w/g).map(x => parseInt(x, 16));
};

const COLORS = {
  'TADEJ POGACAR': '#E58606',
  'THOMAS PIDCOCK': '#5D69B1',
  'WOUT VAN AERT': '#52BCA3',
  'FILIPPO GANNA': '#99C945'
}

URL= 'https://api.tinybird.co/v0/pipes/XXXX'

function newLayer(positions) {
  var pointLayer = new ScatterplotLayer({
        id: 'scatter-plot',
        //data: 'https://raw.githubusercontent.com/uber-common/deck.gl-data/master/examples/scatterplot/manhattan.json',
        data: positions,
        //radiusScale: 30,
        radiusMinPixels: 3,
        getPosition: d => [d.coordinates[0], d.coordinates[1], d.elevation],
        getColor: d => hex2rgba(COLORS[d.name]),
        getRadius: d => 10 //Math.min(d.speed_ms*0.1, 10)
      })

   var textLayer = new TextLayer({
    id: 'text-layer',
    data: positions,
    pickable: true,
    getPosition: d => d.coordinates,
    //getText: d => `${d.name} ${d.distance_seconds.toFixed(0)}'`,
    getText: d => `${d.name}`,
    getSize: 10,
    getAngle: 0,
    getTextAnchor: 'end',
    getAlignmentBaseline: 'center',
    getPixelOffset: [-10, 0]
  });
  return [pointLayer, textLayer]

}

map = null

var layer = null;
fetch(URL)
.then(res => res.json())
.then(data => {

  layer = newLayer(data.data)

  map = new DeckGL({
    mapStyle: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
    initialViewState: {
      longitude: data.data[0].coordinates[0],
      latitude: data.data[0].coordinates[1],
      zoom: 7,
      maxZoom: 16
    },
    controller: true,
    layers: layer
  });
  setInterval(() =>
    fetch(URL).then(res => res.json()).then(data => { 
      layer = newLayer(data.data)
      map.setProps({layers: layer})

    }),
  1000);

});
