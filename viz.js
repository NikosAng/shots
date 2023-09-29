

const leagueUrlFormat = {
  "bundesliga": "bundesliga",
  "laliga": "la-liga",
  "ligue1": "ligue-1",
  "premier_league": "premier-league",
  "rfpl": "rfpl",
  "serie_a": "serie-a"
};

async function fetchData(season, league) {
  const url = `https://raw.githubusercontent.com/eddwebster/football_analytics/master/data/understat/shots/${leagueUrlFormat[league]}/shots_${league}_${season}.csv`;
  const response = await fetch(url);
  const csvData = await response.text();
  const data = d3.csvParse(csvData);
  return data;
}

function filterAndProcessData(data) {
  return data.filter(d => d.situation === "OpenPlay" && !d.shotType.includes("Head"))
             .map(d => [parseFloat(d.X) * 100, parseFloat(d.Y) * 100]);
}





function drawFootballPitch(containerId) {
  const margin = { top: 30, right: 30, bottom: 30, left: 30 },
        width = 600 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

  const x = d3.scaleLinear()
              .domain([0, 100])
              .range([0, width]);

  const y = d3.scaleLinear()
              .domain([0, 100])
              .range([height, 0]);

  const svg = d3.select(containerId)
                .append("svg")
                .attr("width", "100%") // set the width to 100% of the container
                .attr("height", "auto") // set the height to auto
                .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`) // Add viewBox
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  
    // Add the football pitch lines and shapes here
        

  
      // field outline    
      svg.append("rect")
      .attr("id","outline")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", width)
      .attr("height", height)
      .attr("fill", "none")
      .attr("stroke", "black");  
      // right penalty area 
      svg.append("rect")
      .attr("id","six")
      .attr("x", x(83))
      .attr("y", y(78.9))
      .attr("width", x(100) - x(83))
      .attr("height", y(21.1) - y(78.9))
      .attr("fill", "none")
      .attr("stroke", "black");
      // right six yard box
      svg.append("rect")
      .attr("id","penarea")
      .attr("x", x(94.2))
      .attr("y", y(63.2))
      .attr("width", x(100) - x(94.2))
      .attr("height", y(36.8) - y(63.2))
      .attr("fill", "none")
      .attr("stroke", "black");
      // right goal
      svg.append("rect")
      .attr("id","penarea")
      .attr("x", x(100))
      .attr("y", y(54.8))
      .attr("width", margin.right - 1)
      .attr("height", y(45.2) - y(54.8))
      .attr("fill", "none")
      .attr("stroke", "black");   
  
      // left penalty area 
      svg.append("rect")
      .attr("id","six")
      .attr("x", x(0))
      .attr("y", y(78.9))
      .attr("width", x(100) - x(83))
      .attr("height", y(21.1) - y(78.9))
      .attr("fill", "none")
      .attr("stroke", "black");
      // six yard box
      svg.append("rect")
      .attr("id","penarea")
      .attr("x", x(0))
      .attr("y", y(63.2))
      .attr("width", x(100) - x(94.2))
      .attr("height", y(36.8) - y(63.2))
      .attr("fill", "none")
      .attr("stroke", "black");
  
      // right goal
      svg.append("rect")
      .attr("id","penarea")
      .attr("x", x(0) - margin.right+1)
      .attr("y", y(54.8))
      .attr("width", margin.right - 1)
      .attr("height", y(45.2) - y(54.8))
      .attr("fill", "none")
      .attr("stroke", "black");  
  
      // 50 yd line
      svg.append("line")
      .attr("id","half")
      .attr("x1", x(50))
      .attr("x2", x(50))
      .attr("y1", y(0))
      .attr("y2", y(100))
      .attr("stroke", "black");  
      // center circle
      svg.append("circle")
      .attr("cx", x(50))
      .attr("cy", y(50))
      .attr("r", x(10))
      .attr("fill", "none")
      .attr("stroke", "black");

      

      return { x, y };


      }
  

const pitch = drawFootballPitch("#heatmap");

function createHeatmap(data, containerId) {
  const { x, y } = pitch;

  const width = 600 - 30 * 2;
  const height = 400 - 30 * 2;

  // Prepare a color palette
  const color = d3.scaleLinear()
      .domain([0,0.35])  // Points per square pixel.
      .range(["#EBEBEB","#103070"])

  // compute the density data
  const densityData = d3.contourDensity()
    .x(d => x(d[0]))
    .y(d => y(d[1]))
    .size([width, height])
    .bandwidth(5)
    (data);

  // Select the existing SVG element created in the drawFootballPitch function
  const svg = d3.select(containerId)
    .select("svg")
    .select("g");

      // Clear old contours before creating new ones
  svg.selectAll(".contour").remove();

  // Draw contours
  svg.selectAll(".contour")
    .data(densityData)
    .join("path")
    .attr("class", "contour")
    .attr("fill", d => color(d.value))
    .attr("fill-opacity", 0.5)
    .attr("d", d3.geoPath());
}

    
const color = d3.scaleLinear()
    .domain([0, 0.1])  // Points per square pixel.
    .range(["#EBEBEB","#103070"])

// Create color bar
const svgColorbar = d3.select("#colorbar").append("svg")
    .attr("width", 300)
    .attr("height", 100);  // Increased height to 100 to accommodate the labels





const gradient = svgColorbar.append("defs")
    .append("linearGradient")
    .attr("id", "gradient")
    .attr("x1", "0%")
    .attr("y1", "0%")
    .attr("x2", "100%")
    .attr("y2", "0%")
    .attr("spreadMethod", "pad");

gradient.append("stop")
    .attr("offset", "0%")
    .attr("stop-color", "#EBEBEB")
    .attr("stop-opacity", 1);

gradient.append("stop")
    .attr("offset", "100%")
    .attr("stop-color", "#103070")
    .attr("stop-opacity", 1);

svgColorbar.append("rect")
    .attr("width", 280)
    .attr("height", 20)
    .style("fill", "url(#gradient)")
    .attr("transform", "translate(10,10)");

// Draw the arrow and label for the less shots end of the color bar
svgColorbar.append("text")
    .attr("class", "colorbar-arrow")
    .attr("y", 50)
    .attr("x", 10)
    .style("text-anchor", "start")
    .text("←");

svgColorbar.append("text")
    .attr("class", "colorbar-label")
    .attr("y", 70)
    .attr("x", 10)
    .style("text-anchor", "start")
    .text("Less Shots");

// Draw the arrow and label for the more shots end of the color bar
svgColorbar.append("text")
    .attr("class", "colorbar-arrow")
    .attr("y", 50)
    .attr("x", 290)
    .style("text-anchor", "end")
    .text("→");

svgColorbar.append("text")
    .attr("class", "colorbar-label")
    .attr("y", 70)
    .attr("x", 290)
    .style("text-anchor", "end")
    .text("More Shots");

// Draw the text label for the color bar
svgColorbar.append("text")
    .attr("class", "colorbar-main-label")
    .attr("y", 90)
    .attr("x", 150)
    .style("text-anchor", "middle")
    .text("Frequency of Shots");





      

(async () => {
  const seasonSelect = document.getElementById("season");
  const leagueSelect = document.getElementById("league");

  const updateHeatmap = async () => {
    const season = seasonSelect.value;
    const league = leagueSelect.value;
    const rawData = await fetchData(season, league);
    const processedData = filterAndProcessData(rawData);
    console.log(processedData)
    createHeatmap(processedData, "#heatmap");
  };

  seasonSelect.addEventListener("change", updateHeatmap);
  leagueSelect.addEventListener("change", updateHeatmap);

  // Load initial data
  updateHeatmap();
})();
    


