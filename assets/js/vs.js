var data = [{
  "date": "1459468800000", // 1 April 2016 
  "values": [{
    "name": "US",
    "value": 72580613,
    "domainname": "com"
  }, {
    "name": "US",
    "value": 161645,
    "domainname": "nl"
  }]
}, {
  "date": "1467331200000", // 1 Juli 2016
  "values": [{
    "name": "US",
    "value": 73129243,
    "domainname": "com"
  }, {
    "name": "US",
    "value": 166152,
    "domainname": "nl"
  }]
}];

var filteredData = data[0].values;

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
  .range(["#6F257F", "#CA0D59"]);

var g = svg.append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

x.domain(filteredData.map(function(d) {
  return d.domainname;
}));
y.domain([0, d3.max(filteredData, function(d) {
  return d.value;
})]);

g.append("g")
  .attr("class", "axis axis--x")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(x));

g.append("g")
  .attr("class", "axis axis--y")
  .call(d3.axisLeft(y).ticks(10).tickFormat(function(d) {
    return parseInt(d / 1000) + "K";
  }).tickSizeInner([-width]))
  .append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 6)
  .attr("dy", "0.71em")
  .attr("text-anchor", "end")
  .attr("fill", "#ffffff")
  .text("Aantal domeinen");

g.selectAll(".bar")
  .data(filteredData)
  .enter().append("rect")
  .attr("x", function(d) {
    return x(d.domainname);
  })
  .attr("y", function(d) {
    return y(d.value);
  })
  .attr("width", x.bandwidth())
  .attr("height", function(d) {
    return height - y(d.value);
  })
  .attr("fill", function(d) {
    return colours(d.domainname);
  })
  .on("mouseover", function(d){
    tooltip
      .style("left", d3.event.pageX - 50 + "px")
      .style("top", d3.event.pageY - 70 + "px")
      .style("display", "inline-block")
      .html((d.domainname) + "<br>" + (d.value));
})
  .on("mouseout", function(d){ tooltip.style("display", "none");});
