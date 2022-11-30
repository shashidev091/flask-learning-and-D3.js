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
  const xAccessor = (d) => d.currently.humidity;
  const yAccessor = (d) => d.length;

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

  const xScale = d3
    .scaleLinear()
    .domain(d3.extent(dataset, xAccessor))
    .range([0, dimensions.ctrWidth])
    .nice();

  const bin = d3.bin().domain(xScale.domain()).value(xAccessor).thresholds(10);
  const newDataset = bin(dataset);

  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(newDataset, yAccessor)])
    .range([dimensions.ctrHeight, 0])
    .nice();

  const padding = 1;

  // Draw Bars
  ctr
    .selectAll("rect")
    .data(newDataset)
    .join("rect")
    .attr("width", (d) => d3.max([0, xScale(d.x1) - xScale(d.x0) - padding]))
    .attr("height", (d) => dimensions.ctrHeight - yScale(yAccessor(d)))
    .attr("x", (d) => xScale(d.x0))
    .attr("y", (d) => yScale(yAccessor(d)))
    .attr("fill", "#01c5c4");

  ctr
    .append("g")
    .classed("bar-labels", true)
    .selectAll("text")
    .data(newDataset)
    .join("text")
    .attr("x", (d) => xScale(d.x0) + (xScale(d.x1) - xScale(d.x0)) / 2)
    .attr("y", (d) => yScale(yAccessor(d)) - 10)
    .text(yAccessor);

  // Draw axis
  const xAxis = d3.axisBottom(xScale);

  const xAxisGroup = ctr
    .append("g")
    .style("transform", `translateY(${dimensions.ctrHeight}px)`)
    .call(xAxis);
};

histogram();

const drawNewHistogram = async () => {
  // Data
  const dataset = await d3.json("static/files/data5.json");

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
    .select(".friday25-3")
    .append("svg")
    .attr("width", dimensions.width)
    .attr("height", dimensions.height);

  const ctr = svg
    .append("g")
    .attr(
      "transform",
      `translate(${dimensions.margine}, ${dimensions.margine})`
    );

  const group_label = ctr.append("g").classed("bar-labels", true);

  const xAxisGroup = ctr
    .append("g")
    .style("transform", `translateY(${dimensions.ctrHeight}px)`);

  const histogramReload = (metric) => {
    const xAccessor = (d) => d.currently[metric];
    const yAccessor = (d) => d.length;

    const xScale = d3
      .scaleLinear()
      .domain(d3.extent(dataset, xAccessor))
      .range([0, dimensions.ctrWidth])
      .nice();

    const bin = d3
      .bin()
      .domain(xScale.domain())
      .value(xAccessor)
      .thresholds(10);
    const newDataset = bin(dataset);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(newDataset, yAccessor)])
      .range([dimensions.ctrHeight, 0])
      .nice();

    const padding = 1;

    // Draw Bars
    ctr
      .selectAll("rect")
      .data(newDataset)
      .join("rect")
      .transition()
      .attr("width", (d) => d3.max([0, xScale(d.x1) - xScale(d.x0) - padding]))
      .attr("height", (d) => dimensions.ctrHeight - yScale(yAccessor(d)))
      .attr("x", (d) => xScale(d.x0))
      .attr("y", (d) => yScale(yAccessor(d)))
      .attr("fill", "#01c5c4");

    group_label
      .selectAll("text")
      .data(newDataset)
      .join("text")
      .transition()
      .attr("x", (d) => xScale(d.x0) + (xScale(d.x1) - xScale(d.x0)) / 2)
      .attr("y", (d) => yScale(yAccessor(d)) - 10)
      .text(yAccessor);

    // Draw axis
    const xAxis = d3.axisBottom(xScale);

    xAxisGroup.transition().call(xAxis);
  };

  d3.select("#metric").on("change", (e) => {
    e.preventDefault();
    histogramReload(e.target.value);
  });

  histogramReload("humidity");
};

drawNewHistogram();
