const DATAS = [1, 23, 55, 64, 33, 34];
function firstFunction() {
  const basewidth = 30;
  d3.select(".d3-one")
    .append("svg")
    .attr("width", 500)
    .attr("height", 500)
    .style("background-color", "salmon")
    .selectAll("rect")
    .data(DUMMY_DATA)
    .enter()
    .append("rect")
    .attr("width", basewidth - 5)
    .attr("height", (data) => data.power / 10)
    .attr("x", (d, i) => basewidth * i)
    .attr("y", (data) => 500 - data.power / 10 - 20);

  d3.select("svg")
    .append("text")
    .attr("x", 5)
    .attr("y", 500 - 5)
    .text("Money is honey");
}

firstFunction();

console.log(
  d3.selectAll(".d3-clock").append("p").attr("name", "para").text("mango")
);

const joinDataToList = () => {
  const returned = d3
    .select("ul")
    .selectAll("li")
    .data(DATAS)
    .join("li")
    .text((d, i) => `item ${i + 1}`);
};

joinDataToList();

const removeElement = () => {
  const item = document.querySelector(".inp").value;
  const idx = DATAS.indexOf(parseInt(item));
  if (idx !== -1) {
    DATAS.splice(idx, 1);
  } else {
    console.log(`text ${item} not in the list`);
  }

  joinDataToList();
};

const addElement = () => {
  const item = document.querySelector(".inp").value;
  console.log(DATAS.indexOf(item));
  if (item && !isNaN(item) && DATAS.indexOf(parseInt(item)) === -1) {
    DATAS.push(parseInt(item));
  }

  console.log(DATAS);
  joinDataToList();
};

const fetching = async () => {
  const returned = await d3.json("/d3-fetch");
  //   console.log(returned);

  d3.select(".d3-fetch")
    .select("table")
    .select("tbody")
    .selectAll("tr")
    .data(returned)
    .join((enter) => enter.append("tr"))
    .html((d) => `<td>${d.name}</td><td> ${d.power} </td>`);
};

fetching();

const fetchJsonFile = async () => {
  const data = await d3.json("/static/files/data.json");
  return data;
};

// Excercise ===============>

const drawScatterplot = async () => {
  // data
  const dataset = await fetchJsonFile();

  const xAccessor = (d) => d.currently.humidity;
  const yAccessor = (d) => d.currently.apparentTemperature;

  const offsetWidth = document.querySelector("#chart").offsetWidth;
  console.log(offsetWidth);
  // Dimensions
  let dimensions = {
    width: offsetWidth,
    height: 500,
    margin: {
      top: 50,
      right: 50,
      bottom: 50,
      left: 50,
    },
    ctrWidth: 0,
    ctrHeight: 0,
  };

  dimensions.ctrWidth =
    dimensions.width - dimensions.margin.left - dimensions.margin.right;
  dimensions.ctrHeight =
    dimensions.height - dimensions.margin.top - dimensions.margin.bottom;

  console.log(dimensions);

  // Draw Image
  const svg = d3
    .select("#chart")
    .style("background", "#e9ecef")
    .append("svg")
    .attr("width", dimensions.width)
    .attr("height", dimensions.height);

  const group_container = svg
    .append("g")
    .attr(
      "transform",
      `translate(${dimensions.margin.left}, ${dimensions.margin.top})`
    );

  // Scales
  const xScale = d3
    .scaleLinear()
    .domain(d3.extent(dataset, xAccessor)) // takes data and the arrow function to iterate between the data, it returns array of [min, max]
    .rangeRound([0, dimensions.ctrWidth])
    .clamp(true);

  const yScale = d3
    .scaleLinear()
    .domain(d3.extent(dataset, yAccessor))
    .rangeRound([dimensions.ctrHeight, 0])
    .nice()
    .clamp(true);

  //   group_container.append("circle").attr("r", 15);
  // Draw Circle
  group_container
    .selectAll("circle")
    .data(dataset)
    .join("circle")
    .attr("cx", (d) => xScale(xAccessor(d)))
    .attr("cy", (d) => yScale(yAccessor(d)))
    .attr("r", 3)
    .attr("fill", "red")
    .attr("data-temp", yAccessor);

  // Axis
  const xAxis = d3
    .axisBottom(xScale)
    // .tickValues([0.4, 0.5, 0.8])
    .ticks(5)
    .tickFormat((d) => d * 100 + "%");

  const yAxis = d3.axisLeft(yScale);

  const xAxisGroup = group_container
    .append("g")
    .call(xAxis)
    .style("transform", `translateY(${dimensions.ctrHeight}px)`)
    .classed("axis", true);

  xAxisGroup
    .append("text")
    .attr("x", dimensions.ctrWidth / 2)
    .attr("y", dimensions.margin.bottom - 10)
    .attr("fill", "black")
    .text("Humidity");

  const yAxisGroup = group_container
    .append("g")
    .call(yAxis)
    .classed("axis", true);

  yAxisGroup
    .append("text")
    .attr("x", -dimensions.ctrHeight / 2)
    .attr("y", -dimensions.margin.left + 15)
    .attr("fill", "black")
    .html("Temperature &deg; F")
    .style("transform", "rotate(270deg)")
    .style("text-anchor", "middle");
};

drawScatterplot();

// Experimental
// window.onresize = () => {
//     const chart = d3.select('#chart').selectAll('svg').remove()
//     console.log(chart)
//     drawScatterplot();
// }

const heatmap = async (el, scale) => {
  const fetchedData = await d3.json("static/files/data2.json");
  const incomes = fetchedData.sort((a, b) => a - b)
  const offsetWidth = document.querySelector(el).offsetWidth

  // Dimensions
  const dimensions = {
    width: offsetWidth,
    height: 150,
  };

  const box = 30;

  // Draw Image
  const svg = d3
    .select(el)
    .append("svg")
    .attr("width", dimensions.width)
    .attr("height", dimensions.height);

  // Scale
  let colorScale;

  if (scale === 'linear') {
    colorScale = d3.scaleLinear()
      .domain(d3.extent(incomes))
      .range(['white', 'red'])
  } else if (scale === 'quantize') {
    colorScale = d3.scaleQuantize()
      .domain(d3.extent(incomes))
      .range(['white', 'pink', 'red'])
  } else if (scale === 'quantile') {
    colorScale = d3.scaleQuantile()
      .domain(incomes)
      .range(['white', 'pink', 'red'])
  } else if (scale === 'threshold') {
    colorScale = d3.scaleThreshold()
      .domain([45200, 135600])
      .range(['white', 'pink', 'red'])
  }

  // Rectangles
  svg
    .append("g")
    .attr("transform", `translate(2, 2)`)
    .selectAll("rect")
    .data(incomes)
    .join("rect")
    .attr("stroke", "black")
    .attr("fill", "#ddd")
    .attr("width", box - 3)
    .attr("height", box - 3)
    .attr("x", (d, i) => {
      return box * (i % 20);
    })
    .attr("y", (d, i) => box * ((i / 20) | 0))
    .attr("fill", colorScale);
};

heatmap(".heatmap", 'linear');
heatmap(".heatmap1", 'quantize');
heatmap(".heatmap2", 'quantile');
heatmap(".heatmap3", 'threshold');


const scatterPlot = async () => {
  const fetchedData = await d3.json('/static/files/data3.json')
  
  const dimensions = {
    width: 600,
    height: 400
  }

  const xAccessor = d => d.score
  const yAccessor = d => d.totalSub

  const svg = d3.select('.scatterplot')
    .append('svg')
    .attr('width', dimensions.width)
    .attr('height', dimensions.height)
    .attr(
      "transform",
      `translate(${20}, ${20})`
    );

  
  const group_container = svg.append('g')
  
  const xScale = d3.scaleLinear()
    .domain(d3.extent(fetchedData, xAccessor))
    .rangeRound([0, dimensions.width - 40])
    .nice()
    .clamp(true)

  const yScale = d3.scaleLinear()
    .domain(d3.extent(fetchedData, yAccessor))
    .rangeRound([dimensions.height - 40, 0])
    .clamp(true)


  group_container
    .selectAll('circle')
    .data(fetchedData)
    .join('circle')
    .attr('r', 3)
    .attr('cx', d => xScale(xAccessor(d)))
    .attr('cy', d => yScale(yAccessor(d)))
    .attr('fill', 'red')
    .attr('data-temp', yAccessor)


  const xAxis = d3
    .axisBottom(xScale)
  
  const yAxis = d3
    .axisLeft(yScale)

  const xAxisGroup = group_container
      .append('g')
      .call(xAxis)
      .style('transform', `translateY(${dimensions.height - 40}px)`)
    
  xAxis.append('text')
      .attr("x", (dimensions.width - 40 ) / 2)
      .attr('y', (dimensions.height - 40) - 10)
  
  }

scatterPlot()

