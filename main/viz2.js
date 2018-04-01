var format = d3.format(",");

// Set tooltips
var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([100, 0])
  .html(function(d) {
    return "<strong>Country: </strong><span class='details'>" + d.properties.name + "<br></span>" + "<strong>Score: </strong><span class='details'>" + format(d.population) + "</span>";
  })

var margin = {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  },
  width = 1260 - margin.left - margin.right,
  height = 600 - margin.top - margin.bottom;



var color = d3.scaleThreshold()
  .domain([10000, 100000, 500000, 1000000, 5000000, 10000000, 50000000, 100000000, 500000000, 1500000000])
  .range(["rgb(247,251,255)", "rgb(222,235,247)", "rgb(198,219,239)", "rgb(158,202,225)", "rgb(107,174,214)", "rgb(66,146,198)", "rgb(33,113,181)", "rgb(8,81,156)", "rgb(8,48,107)", "rgb(3,19,43)"]);

var path = d3.geoPath();

var svg1 = d3.select("#plot2")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .append('g')
  .attr('class', 'map');

var projection = d3.geoMercator()
  .scale(130)
  .translate([width / 2, height / 1.5]);

var path = d3.geoPath().projection(projection);

svg1.call(tip);

queue()
  .defer(d3.json, "world_countries.json")
  .defer(d3.csv, "viz2.csv")
  .await(ready);

function ready(error, data, population) {

  var populationById = {};

  population.forEach(function(d) {
    if (d.nerd == "Technically Savvy" && d.params == "User Reviews") populationById[d.country] = d.score;
  });
  data.features.forEach(function(d) {
    d.population = +populationById[d.properties.name]
  });
  console.log(data.features);
  var colors = ["#deebf7", "#9ecae1","#3182bd"];


  var extent = d3.extent(data.features, function(d) { return d.population; });
  var max = extent[1];
  var min = extent[0];
  var mid = ( max + min ) / 2;

  console.log("extent" + extent);
  var max = d3.max(data.features, function(d) {
    return d.population;
  });
  console.log(max);

  var buckets = 10;
  var colorScale = d3.scaleLinear()
    .domain([0,mid,max])
    .range(colors);

  // colorScale = d3.scaleOrdinal(d3.schemePastel1);

  console.log(colorScale(3830));

  svg1.append("g")
    .attr("class", "countries")
    .selectAll("path")
    .data(data.features)
    .enter().append("path")
    .attr("d", path)
    .style("fill", function(d) {
      return colorScale(d.population);
    })
    .style('stroke', 'white')
    .style('stroke-width', 1.5)
    .style("opacity", 0.8)
    // tooltips
    .style("stroke", "white")
    .style('stroke-width', 0.3)
    .on('mouseover', function(d) {
      tip.show(d);

      d3.select(this)
        .style("opacity", 1)
        .style("stroke", "white")
        .style("stroke-width", 3);
    })
    .on('mouseout', function(d) {
      tip.hide(d);

      d3.select(this)
        .style("opacity", 0.8)
        .style("stroke", "white")
        .style("stroke-width", 0.3);
    });

  svg1.append("path")
    .datum(topojson.mesh(data.features, function(a, b) {
      return a.id !== b.id;
    }))
    // .datum(topojson.mesh(data.features, function(a, b) { return a !== b; }))
    .attr("class", "names")
    .attr("d", path);
}
