var data = 'data/taxes.csv';
var lowValue = 10;
var highValue = 35;
var lowColor = '#f0f9e8';
var highColor = '#0868ac';
var year = 2016;

var width = 800;
var height = 400;

var color = d3.scale.linear().domain([lowValue, highValue])
  .interpolate(d3.interpolateHsl)
  .range([d3.rgb(lowColor), d3.rgb(highColor)]);

var svg = d3.select('#container').append('svg')
  .attr('width', width).attr('height', height);

var projection = d3.geo.equirectangular()
  .scale(width * .15)
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

  data.filter(function (d) {
    return d.Year == year;
  }).filter(function (d) {
    return d.Rate != '';
  })
  .forEach(function (e, i, a) {
    d3.selectAll('#c' + e['UN Country Code'])
      .attr('fill', selectFill(e.Rate));
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

function selectFill(value) {
  if (value <= lowValue) {
    return lowColor;
  } else if (value >= highValue) {
    return highColor;
  } else {
    return color(value);
  }
}
