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
    .join((enter) => enter.append("tr").append("td"))
    .text((d) => `${d.name} ${d.power}`);
};

fetching();

const fetchJsonFile = async () => {
  const data = await d3.json("/static/files/data.json");
  return data
};

// Excercise ===============>

const drawScatterplot = async () => {
  // data
  const dataset = await fetchJsonFile();
  
  const xAccessor = d => d.currently.humidity
  const yAccessor = d => d.currently.apparentTemperature


  const offsetwidth = document.querySelector('#chart').offsetWidth
  console.log(offsetwidth)
  // Dimensions
  let dimensions = {
    width: offsetwidth,
    height: 500,
    margin: {
      top: 50,
      right: 50,
      bottom: 50,
      left: 50,
    },
    ctrWidth: 0,
    ctrHeight: 0
  };

  dimensions.ctrWidth = dimensions.width - dimensions.margin.left - dimensions.margin.right;
  dimensions.ctrHeight = dimensions.height - dimensions.margin.top - dimensions.margin.bottom;

  console.log(dimensions)

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
    const xScale = d3.scaleLinear()
        .domain(d3.extent(dataset, xAccessor)) // takes data and the arrow function to iterate between the data, it returns array of [min, max]
        .rangeRound([0, dimensions.ctrWidth])
        .clamp(true)

    const yScale = d3.scaleLinear()
        .domain(d3.extent(dataset, yAccessor))
        .rangeRound([0, dimensions.ctrHeight])
        .nice()
        .clamp(true)

//   group_container.append("circle").attr("r", 15);
// Draw Circle
    group_container.selectAll('circle')
        .data(dataset)
        .join('circle')
        .attr('cx', d => xScale(xAccessor(d)))
        .attr('cy', d => yScale(yAccessor(d)))
        .attr('r', 3)
        .attr('fill', 'red')
};

drawScatterplot();
 
window.onresize = () => {
    const chart = d3.select('#chart').selectAll('svg').remove()
    console.log(chart)
    drawScatterplot();
}