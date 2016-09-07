var data = 'data/taxes.csv';
var lowValue = 0;
var highValue = 55;
var lowColor = '#ff0000';
var highColor = '#00ff00';

var width = 1600;
var height = 800;

var addFill = d3.scale.linear().domain([lowValue, highValue])
  .interpolate(d3.interpolateHcl)
  .range([d3.rgb(lowcolor), d3.rgb(highColor)]);

var svg = d3.select('#container').append('svg')
  .attr('width', width).attr('height', height);

var projection = d3.geo.mercator()
  .scale(width * 0.1)
  .translate([width / 2, height / 2]);

var path = d3.geo.path()
  .projection(projection);

queue()
    .defer(d3.json, 'data/world-50m.json')
    .defer(d3.csv, data)
    .await(ready);

function ready(error, world, data) {
  if (error) { console.log(error); }

  svg.selectAll('path')
    .data(topojson.feature(world, world.objects.countries).features)
  .enter()
    .append('path')
    .attr('d', path)
    .attr('fill', '#eeeeee')
    .attr('id', function (d) { return 'c' + d.id; });

  data.forEach(function (e, i, a) {
    d3.selectAll('#c' + e.id)
      .attr('fill', color(e.tax));
  });
}

// function addFill(value) {
//   switch (value) {
//     case 'worldwide':
//       return '#F44336';
//     case 'territorial':
//       return '#4CAF50';
//     default:
//       return '#eeeeee';
//   }
// }
