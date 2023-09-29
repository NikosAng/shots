// Dimensions and margins
const margin5 = {top: 50, right: 60, bottom: 50, left:60},
    width5 = 550 - margin5.left - margin5.right,
    height5 = 400 - margin5.top - margin5.bottom;

// Append the svg object to the "xg-plot" div
const svg5 = d3.select("#passes")
    .append("svg")
        .attr("width", "100%") // Set the width to 100% of the container
        .attr("height", "auto") // Set the height to auto
        .attr("viewBox", `0 0 ${width5 + margin5.left + margin5.right} ${height5 + margin5.top + margin5.bottom}`) // Add this line
    .append("g")
        .attr("transform", "translate(" + margin5.left + "," + margin5.top + ")");


// Parse the season
const parseTime5 = d3.timeParse("%Y/%Y");

d3.csv("pass_layoff_cross_percentage.csv").then(function(data) {

    // List of groups
    const leagues5 = data.columns.slice(1);

    // Mapping from CSV column names to desired names
    const leagueNames5 = {
        'bundesliga': 'Bundesliga',
        'laliga': 'La Liga',
        'premier-league': 'Premier League',
        'serie-a': 'Serie A'
    };

    // Add X axis
    const x5 = d3.scaleTime()
        .domain(d3.extent(data, d => parseTime5(d.season)))
        .range([0, width5]);

    svg5.append("g")
        .attr("transform", "translate(0," + height5 + ")")
        .call(
            d3.axisBottom(x5)
                .ticks(5)
                .tickFormat(function(d) {
                    let year = d3.timeFormat("%Y")(d);
                    let prevYear = (parseInt(year) - 1).toString();
                    let currYear = year.slice(-2);
                    return `${prevYear}/${currYear}`;
                })
        );


    // Title for the chart
    svg5.append("text")
        .attr("x", width5 / 2)
        .attr("y", 0 - margin5.top / 2)
        .style("text-anchor", "middle")
        .style("font-size", "16px")
        .style('font-weight','bold')
        .text("% of Shots Arising From Open Play Passes");



    // X Axis label
    svg5.append("text")
        .attr("transform", `translate(${width5 / 2}, ${height5 + margin5.bottom - 10})`)
        .style("text-anchor", "middle")
        .text("Season");

    // Add Y axis
    const y5 = d3.scaleLinear()
        .domain([0.45, 0.7]) // Adjusted for better representation
        .range([height5, 0]);
        svg5.append("g")
        .call(d3.axisLeft(y5)
            .tickFormat(function(d) { return Math.round(d * 100) + "%"; })  // Convert to percentage and round
        );
    

    // Y Axis label
    svg5.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin5.left ) // Adjusted a bit further to the left
        .attr("x", 0 - (height5 / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Percentage");

    // Color palette
    const color5 = d3.scaleOrdinal()
        .domain(leagues5)
        .range(['#e41a1c','#377eb8','#4daf4a','#984ea3', '#ff7f00']);



        

    // Draw the line
    leagues5.forEach(function(item, index) {
        const line5 = d3.line()
            .x(function(d) { return x5(parseTime5(d.season)); })
            .y(function(d) { return y5(+d[item]); });

        // Add the path
        svg5.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", color5(item))
            .attr("stroke-width", 1.5)
            .attr("d", line5)
            .attr("class", `line line-${item}`)
            .style("opacity", 0.2);  // Initial opacity set to 0.2

        // Create legend line
        svg5.append("line")
            .attr("x1", -margin5.left + 150)  // Move to the left
            .attr("y1", margin5.top + index * 20-45)
            .attr("x2", -margin5.left + 180)  // Move to the left
            .attr("y2", margin5.top + index * 20-45)
            .attr("stroke", color5(item))
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
        svg5.append("text")
            .attr("x", -margin5.left + 75)  // Move to the left
            .attr("y", margin5.top + index * 20 -45)
            .style("fill", color5(item))
            .attr("dy", ".35em")
            .attr("text-anchor", "start")
            .style("font", "10px sans-serif")
            .attr("class", `legend-text legend-text-${item}`)
            .style("opacity", 0.2)  // Initial opacity set to 0.2
            .text(leagueNames5[item])
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
