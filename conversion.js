// Dimensions and margins
const margin2 = {top: 50, right: 60, bottom: 50, left:60},
    width2 = 550 - margin2.left - margin2.right,
    height2 = 400 - margin2.top - margin2.bottom;

// Append the svg object to the "xg-plot" div
const svg2 = d3.select("#conversion")
    .append("svg")
        .attr("width", "100%") // Set the width to 100% of the container
        .attr("height", "auto") // Set the height to auto
        .attr("viewBox", `0 0 ${width2 + margin2.left + margin2.right} ${height2 + margin2.top + margin2.bottom}`) // Add this line
    .append("g")
        .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");



            // Title for the chart
    svg2.append("text")
    .attr("x", width2 / 2)
    .attr("y", 0 - margin2.top / 2)
    .style("text-anchor", "middle")
    .style("font-size", "16px")
    .style('font-weight','bold')
    .text("Shot Conversion Rate, Shots/Goals");


// Parse the season
const parseTime2 = d3.timeParse("%Y/%Y");

d3.csv("avg_conversion_rate.csv").then(function(data) {
    // List of groups
    const leagues2 = data.columns.slice(1);

    // Mapping from CSV column names to desired names
    const leagueNames2 = {
        'bundesliga': 'Bundesliga',
        'laliga': 'La Liga',
        'premier-league': 'Premier League',
        'serie-a': 'Serie A'
    };

    // Add X axis
    const x2 = d3.scaleTime()
        .domain(d3.extent(data, d => parseTime2(d.season)))
        .range([0, width2]);
    svg2.append("g")
        .attr("transform", "translate(0," + height2 + ")")
        .call(
            d3.axisBottom(x2)
                .ticks(5)
                .tickFormat(function(d) {
                    let year = d3.timeFormat("%Y")(d);
                    let prevYear = (parseInt(year) - 1).toString();
                    let currYear = year.slice(-2);
                    return `${prevYear}/${currYear}`;
                })
        );

    // X Axis label
    svg2.append("text")
        .attr("transform", `translate(${width2 / 2}, ${height2 + margin2.bottom - 10})`)
        .style("text-anchor", "middle")
        .text("Season");

    // Add Y axis
    const y2 = d3.scaleLinear()
        .domain([0.07, 0.13]) // Adjusted for better representation
        .range([height2, 0]);
    svg2.append("g")
    .call(d3.axisLeft(y2)
    .tickFormat(function(d) { return Math.round(d * 100) + "%"; })  // Convert to percentage and round
);

    // Y Axis label
    svg2.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin2.left)
        .attr("x", 0 - (height2 / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Conversion Rate");  

    // Color palette
    const color2 = d3.scaleOrdinal()
        .domain(leagues2)
        .range(['#e41a1c','#377eb8','#4daf4a','#984ea3', '#ff7f00']);

    // Draw the line
    leagues2.forEach(function(item, index) {
        const line2 = d3.line()
            .x(function(d) { return x2(parseTime2(d.season)); })
            .y(function(d) { return y2(+d[item]); });

// Add the path
const path2 = svg2.append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", color2(item))
    .attr("stroke-width", 1.5)
    .attr("d", line2)
    .attr("class", `line line-${item}`)
    .style("opacity", 0.2)  // Initial opacity set to 0.2
    .on("mouseover", function(d) {
        d3.selectAll(".line")
            .style("opacity", .1)
        d3.selectAll(".line-" + item)
            .style("opacity", 1)
    })
    .on("mouseout", function(d) {
        d3.selectAll(".line")
            .style("opacity", 0.2) // Reset to initial opacity
    });

// Create legend line
const legendLine2 = svg2.append("line")
    .attr("x1", -margin2.left + 150)  // Move to the left
    .attr("y1", margin2.top + index * 20-45)
    .attr("x2", -margin2.left + 180)  // Move to the left
    .attr("y2", margin2.top + index * 20-45)
    .attr("stroke", color2(item))
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
            .style("opacity", 0.2) // Reset to initial opacity
    });

// Add legend text
const legendText2 = svg2.append("text")
    .attr("x", -margin2.left + 75)  // Move to the left
    .attr("y", margin2.top + index * 20 -45)
    .style("fill", color2(item))
    .attr("dy", ".35em")
    .attr("text-anchor", "start")
    .style("font", "10px sans-serif")
    .attr("class", `legend-text legend-text-${item}`)
    .style("opacity", 0.2)  // Initial opacity set to 0.2
    .text(leagueNames2[item])
    .on("mouseover", function(d) {
        d3.selectAll(".line, .legend-line, .legend-text")
            .style("opacity", .1)
        d3.selectAll(".line-" + item + ", .legend-line-" + item + ", .legend-text-" + item)
            .style("opacity", 1)
    })
    .on("mouseout", function(d) {
        d3.selectAll(".line, .legend-line, .legend-text")
            .style("opacity", 0.2) // Reset to initial opacity
    });


    });
});
