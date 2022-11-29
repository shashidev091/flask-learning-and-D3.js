async function logScaleExample() {
  // Data
  const dataset = await d3.json("static/files/data4.json");

  const sizeAccessor = (d) => d.size;
  const nameAccessor = (d) => d.name;

  // Dimensions
  let dimensions = {
    width: 200,
    height: 500,
    margin: 50,
  };

  // Draw Image
  const svg = d3
    .select(".friday-25")
    .append("svg")
    .attr("width", dimensions.width)
    .attr("height", dimensions.height);

  const universeScale = d3
    .scaleLog()
    .domain(d3.extent(dataset, sizeAccessor))
    .range([dimensions.height - dimensions.margin, dimensions.margin]);

  const circlesGroup = svg
    .append("g")
    .style("font-size", "16px")
    .style("dominant-baseline", "middle");

  circlesGroup
    .selectAll("circle")
    .data(dataset)
    .join("circle")
    .attr("cx", dimensions.margin)
    .attr("cy", (d) => universeScale(sizeAccessor(d)))
    .attr("r", 6);

  circlesGroup
    .selectAll("text")
    .data(dataset)
    .join("text")
    .attr("x", dimensions.margin + 15)
    .attr("y", (d) => universeScale(sizeAccessor(d)))
    .text(nameAccessor);

  const axis = d3.axisLeft(universeScale);
  svg
    .append("g")
    .attr("transform", `translate(${dimensions.margin}, 0)`)
    .call(axis);
}

logScaleExample();

const histogram = async () => {
  // Data
  const dataset = await d3.json("static/files/data5.json");
  const xAccessor = d => d.currently.humidity
  const yAccessor = d => d.currently 

  // Dimensions
  const dimensions = {
    width: 800,
    height: 400,
    margine: 50,
  };

  dimensions.ctrWidth = dimensions.width - dimensions.margine * 2;
  dimensions.ctrHeight = dimensions.height - dimensions.margine * 2;

  // Draw Image
  const svg = d3
    .select(".friday25-1")
    .append("svg")
    .attr("width", dimensions.width)
    .attr("height", dimensions.height);

  const ctr = svg
    .append("g")
    .attr(
      "transform",
      `translate(${dimensions.margine}, ${dimensions.margine})`
    );

  const xScale = d3.scaleLinear()
        .domain(d3.extent(dataset, xAccessor))
        .range([0, dimensions.ctrWidth])
        .nice()

    const bin = d3.bin()
        .domain(xScale.domain())
        .value(xAccessor)
        .thresholds(10)
    
    const newDataset = bin(dataset)
    console.log(newDataset)
    const padding = 1

    // Draw Bars
    ctr.selectAll('rect')
        .data(newDataset)
        .join('rect')
        .attr('width', d => d3.max([0, xScale(d.x0) - padding]))
        .attr('height', 100)
        .attr('x', d => xScale(d.x0))
        .attr('y', 0)
    
};

histogram();