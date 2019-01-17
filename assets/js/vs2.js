var data = [{      // 1 April 2016 
    "name": "US",
    "value": 72580613,
    "domainname": "com"
  }, {
    "name": "US",
    "value": 161645,
    "domainname": "nl"
}]; 

var data1 = [{     // 1 Juli 2016
    "name": "US",
    "value": 73129243,
    "domainname": "com"
  }, {
    "name": "US",
    "value": 166152,
    "domainname": "nl"
}];

var data2 = [{    // 1 Oktober 2016
    "name": "US",
    "value": 74320572,
    "domain": "com"
}, {
    "name": "US",
    "value": 173396,
    "domain": "nl"
}]

d3.select("#opts")
  .on('change', function() {
    var data = eval(d3.select(this).property('value'));
    update(data);
});

// SET UP CHART
var svg = d3.select("svg"),
  margin = {
    top: 20,
    right: 20,
    bottom: 30,
    left: 50
  },
  width = +svg.attr("width") - margin.left - margin.right,
  height = +svg.attr("height") - margin.top - margin.bottom;

var tooltip = d3.select("body").append("div").attr("class", "toolTip");

var x = d3.scaleBand().rangeRound([0, width]).padding(0.1),
    y = d3.scaleLinear().rangeRound([height, 0]);

var colours = d3.scaleOrdinal()
  .range(["#228B22", "#FFFF00"]);

var g = svg.append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// FUNCTION UPDATE
function update(data) {

  x.domain(data.map(function(d) { return d.domainname; }));
  y.domain([0, d3.max(data, function(d) { return d.value; })]);

  var bars = g.selectAll(".bar")
    .remove()
    .exit()
    .data(data)

  bars.enter()
    .append("rect")
    .attr("x", function(d) { return x(d.domainname); })
    .attr("y", function(d) { return y(d.value); })
    .attr("width", x.bandwidth())
    .attr("height", function(d) { return height - y(d.value); })
    .attr("fill", function(d) { return colours(d.domainname); })
    .on("mouseover", function(d) {
      tooltip
        .style("left", d3.event.pageX - 50 + "px")
        .style("top", d3.event.pageY - 70 + "px")
        .style("display", "inline-block")
        .html((d.domainname) + "<br>" + (d.value)); })
    .on("mouseout", function(d){ tooltip.style("display", "none");});

  g.select(".axis--x")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
    .selectAll("text")
      .attr("text-anchor", "end")
      .attr("y", -6)
      .attr("x", -6)
      .attr("dy", "0.71em")
      .attr("transform", "rotate(-90)")

  g.select(".axis--y")
      .call(d3.axisLeft(y).ticks(10).tickFormat(function(d) { return parseInt(d / 1000) + "K"; }).tickSizeInner([-width]))
}

// SET UP AXEX
g.append("g")
    .attr("class", "axis axis--x")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
    .selectAll("text")
      .attr("text-anchor", "end")
      .attr("y", -6)
      .attr("dy", "0.71em")
      .attr("transform", "rotate(-90)")

g.append("g")
    .attr("class", "axis axis--y")
    .call(d3.axisLeft(y).ticks(10).tickFormat(function(d) { return parseInt(d / 1000) + "K"; }).tickSizeInner([-width]))


// ADD TEXT
g
  .append("text")
  .text("Aantal domeinen")
  .attr("fill", "#ffffff")
  .attr("transform", "translate(15," +  (height+margin.bottom)/2 + ") rotate(-90)")

update(data);