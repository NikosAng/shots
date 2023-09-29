// Dimensions and margins
const margin = {top: 50, right: 60, bottom: 50, left:60},
    width = 550 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;



    
// Modify this line
const svg = d3.select("#xg-plot")
    .append("svg")
        .attr("width", "100%") // make the SVG fill its container in width
        .attr("height", "auto") // make the SVG's height adjust automatically
        .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`) // Add this line
        .attr("preserveAspectRatio", "xMidYMid meet") // ensure uniform scaling
    .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


// Parse the season
const parseTime = d3.timeParse("%Y/%Y");

// Load the data
d3.csv("median_xG.csv").then(function(data) {
    // List of groups
    const leagues = data.columns.slice(1);

    // Mapping from CSV column names to desired names
    const leagueNames = {
        'bundesliga': 'Bundesliga',
        'laliga': 'La Liga',
        'premier-league': 'Premier League',
        'serie-a': 'Serie A'
    };

    // Add X axis
    const x = d3.scaleTime()
        .domain(d3.extent(data, d => parseTime(d.season)))
        .range([0, width]);
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).ticks(5)
                .tickFormat(function(d) {
                    let year = d3.timeFormat("%Y")(d);
                    let prevYear = (parseInt(year) - 1).toString();
                    let currYear = year.slice(-2);
                    return `${prevYear}/${currYear}`;
                }));


    // X Axis label
    svg.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.bottom - 10})`) 
        .style("text-anchor", "middle")
        .text("Season");

    // Add Y axis
    const y = d3.scaleLinear()
        .domain([0.04, 0.06]) // Adjusted for better representation
        .range([height, 0]);
    svg.append("g")
        .call(d3.axisLeft(y));



    // Title for the chart
    svg.append("text")
    .attr("x", width5 / 2)
    .attr("y", 0 - margin5.top / 2)
    .style("text-anchor", "middle")
    .style("font-size", "16px")
    .style('font-weight','bold')
    .text("Median xGoals in Each League");


    // Y Axis label
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Median xGoals");  

    // Color palette
    const color = d3.scaleOrdinal()
        .domain(leagues)
        .range(['#e41a1c','#377eb8','#4daf4a','#984ea3', '#ff7f00']);

// ... Keep the existing code until the point of drawing the lines ...






// Draw the line
leagues.forEach(function(item, index) {
    const line = d3.line()
        .x(function(d) { return x(parseTime(d.season)); })
        .y(function(d) { return y(+d[item]); });

    // Add the path
    const path = svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", color(item))
        .attr("stroke-width", 1.5)
        .attr("d", line)
        .attr("class", `line line-${item}`)
        .attr("opacity", 0.2); // Change opacity to 0.2

        // Create legend line
        svg.append("line")
            .attr("x1", -margin.left + 150)  // Move to the left
            .attr("y1", margin.top + index * 20-45)
            .attr("x2", -margin.left + 180)  // Move to the left
            .attr("y2", margin.top + index * 20-45)
            .attr("stroke", color(item))
            .style("stroke-width", 2)
            .attr("class", `legend-line legend-line-${item}`)
            .style("opacity", 0.2)  // Initial opacity set to 0.2
            .on("mouseover", function(d) {
                d3.selectAll(".line, .legend-line")
                    .style("opacity", .1)
                d3.selectAll(".line-" + item + ", .legend-line-" + item)
                    .style("opacity", 1)
            })
            .on("mouseout", function(d) {
                d3.selectAll(".line, .legend-line")
                    .style("opacity", 0.1) // Reset to initial opacity
            });

        // Add legend text
        svg.append("text")
            .attr("x", -margin.left + 75)  // Move to the left
            .attr("y", margin.top + index * 20 -45)
            .style("fill", color(item))
            .attr("dy", ".35em")
            .attr("text-anchor", "start")
            .style("font", "10px sans-serif")
            .attr("class", `legend-text legend-text-${item}`)
            .style("opacity", 0.2)  // Initial opacity set to 0.2
            .text(leagueNames[item])
            .on("mouseover", function(d) {
                d3.selectAll(".line, .legend-line, .legend-text")
                    .style("opacity", .1)
                d3.selectAll(".line-" + item + ", .legend-line-" + item + ", .legend-text-" + item)
                    .style("opacity", 1)
            })
            .on("mouseout", function(d) {
                d3.selectAll(".line, .legend-line, .legend-text")
                    .style("opacity", 0.1) // Reset to initial opacity
            });
    });
});
