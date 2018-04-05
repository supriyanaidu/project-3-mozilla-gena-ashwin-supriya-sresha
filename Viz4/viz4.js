// First, we will create some constants to define non-data-related parts of the visualization
var w = 700; // Width of our visualization
var h = 500; // Height of our visualization
var xOffset = 40; // Space for x-axis labels
var yOffset = 100; // Space for y-axis labels
var margin = 10; // Margin around visualization
var vals = ['Nerdlevel Number', 'Nerdlevel Name', 'Count']; // List of data attributes
var xVal = vals[1]; // Value to plot on x-axis
var yVal = vals[2]; // Value to plot on y-axis


// set the dimensions and margins of the graph
var margin = {top: 20, right: 20, bottom: 30, left: 50};
var width = 960 - margin.left - margin.right
var height = 500 - margin.top - margin.bottom;

// set the ranges
var x = d3.scaleLinear().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

// append the svg obgect to the body of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg4 = d3.select("#Viz4").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate("+margin.left + "," + margin.top + ")");



// Get the data
d3.csv("Viz4-1.csv", function(error, data){
  if (error) throw error;

  // Scale the range of the data
x.domain(d3.extent(data, function(d) {return d[xVal];}));
y.domain([0, d3.max(data, function(d) {return d[yVal];})]);

  // Add the scatterplot points
  svg.selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("r", 5)
      .attr("cx", function(d){return x(d[xVal]);})
      .attr("cy", function(d){return y(d[yVal]);});
