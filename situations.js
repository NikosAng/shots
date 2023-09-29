


// define a function to generate a chart
function generateChart(container, dataset, title) {
  // Set the dimensions and margins of the graph
  var margin4 = {top: 50, right: 10, bottom: 70, left: 30}, // Increase the top margin to make space for the title
      width4 = 600 - margin4.left - margin4.right,
      height4 = 600 - margin4.top - margin4.bottom;

      var svg4 = d3.select(container)
      .append("svg")
        .attr("width", "100%") // Change to 100% to fill container
        .attr("height", "auto") // Change to auto to maintain aspect ratio
        .attr("viewBox", `0 0 ${width4 + margin4.left + margin4.right} ${height4 + margin4.top + margin4.bottom}`) // Add viewBox
      .append("g")
        .attr("transform", "translate(" + margin4.left + "," + margin4.top + ")");


  // Parse the Data
  d3.csv(dataset).then(function(data) {
    // List of subgroups (i.e. OpenPlay, DirectFreekick, FromCorner, SetPiece, Penalty)
    var subgroups = data.columns.slice(1)

    // List of groups (i.e. Seasons)
    var groups4 = data.map(function(d){return(d.Season)}); // change from d3.map to standard array map

    // Add X axis
    var x4 = d3.scaleBand()
        .domain(groups4) // set the domain to use the array of seasons
        .range([0, width4])
        .padding([0.1])

    svg4.append("g")
      .attr("transform", "translate(0," + height4 + ")")
      .call(d3.axisBottom(x4).tickSizeOuter(0))
      .selectAll("text")
      .style("font-size", "16px")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end");

    // Add Y axis
    var y4 = d3.scaleLinear()
      .domain([0, 1])
      .range([ height4, 0 ]);
    svg4.append("g")
      .call(d3.axisLeft(y4))
      .style("font-size", "16px");

    // color palette = one color per subgroup
    var color4 = d3.scaleOrdinal()
      .domain(subgroups)
      .range(['#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00','#ffff33','#a65628','#f781bf'])

    // Normalize the data so that it can be used by d3.stack()
    data.forEach(function(d){
      subgroups.forEach(function(key) {
        d[key] = +d[key];
      });
    });

    // stack the data
    var stackedData4 = d3.stack()
      .keys(subgroups)
      (data)

    // Show the bars
    svg4.append("g")
      .selectAll("g")
      .data(stackedData4)
      .enter()
      .append("g")
        .attr("fill", function(d) { return color4(d.key); })
      .selectAll("rect")
      .data(function(d) { return d; })
      .enter()
      .append("rect")
          .attr("x", function(d) { 
              return x4(d.data.Season); })
          .attr("y", function(d) { return y4(d[1]); })
          .attr("height", function(d) { return y4(d[0]) - y4(d[1]); })
          .attr("width",x4.bandwidth())

      // Add title
      svg4.append("text")
          .attr("x", width4 / 2)
          .attr("y", -margin4.top / 2)
          .attr("text-anchor", "middle")
          .style("font-size", "26px")
          .style("font-weight",'bold')
          .text(title);
  })
}

function generateLegend(container, subgroups, colors) {
  var legendContainer = d3.select(container);

  var legend = legendContainer.selectAll('div')
    .data(subgroups)
    .enter()
    .append('div')
    .style('display', 'flex')
    .style('align-items', 'center')
    .style('margin', '0 2px');

  legend.append('div')
    .style('width', '10px')
    .style('height', '10px')
    .style('background-color', function(d, i) { return colors[i]; });

  legend.append('div')
    .style('margin-left', '5px')
    .text(function(d) { return d; });
}






// Get subgroups and colors for legend
var subgroups = ['OpenPlay', 'FromCorner', 'SetPiece', 'DirectFreekick', 'Penalty']; 
var colors = ['#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00','#ffff33','#a65628','#f781bf'];

// call the function for each league
generateChart("#bundesliga", "bundesliga_situation_percentage.csv", "Bundesliga");
generateChart("#la_liga", "la_liga_situation_percentage.csv", "La Liga");
generateChart("#serie_a", "serie_a_situation_percentage.csv", "Serie A");
generateChart("#premier_league", "premier_league_situation_percentage.csv", "Premier League");

// Generate legend
generateLegend("#legend", subgroups, colors);

