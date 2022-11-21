d3.select("h2").style("font-size: 50");
d3.select(".unordered")
  .selectAll("li")
  .data(heros)
  .enter()
  .append("li")
  .text((hero) => `${hero} 🍉`);

let numbers = [10, 33, 523, 33, 89, 390];
let barHeight = 40;

d3.select(".svgs")
  .attr("height", `${barHeight * numbers.length + barHeight}px`)
  .attr("width", `${Math.max(...numbers) + 10}px`)
  .selectAll("rect")
  .data(numbers)
  .enter()
  .append("rect")
  .attr("width", (d) => d)
  .attr("height", barHeight - 6)
  .attr("transform", (data, index) => "translate(100," + index * 40 + ")");

const container = d3.select(".svg-new");

container.selectAll("svg").data();

const countyData = {
  items: ["China", "India", "USA"],
  addItem(item) {
    if (!this.items.includes(item)) {
      this.items.push(item);
      return true;
    } else {
      return false;
    }
  },
  removeItem(index) {
    this.items.splice(index, 1);
  },
  updateItem(index, item) {
    this.items[index] = item;
  },
};

// const div_container = d3
//   .select(".chart-4")
//   .style("background-color", "")
//   .append("svg")
//   .attr("height", 400)
//   .attr("width", 400);
// .selectAll('rect')
// .data(countyData.items)
// .enter()
// .append('rect')
// .attr('width', 300)
// .attr('height', 300)
// .attr('fill', 'green')

const div_container = d3
  .select(".chart-4")
  .style("background-color", "")
  .append("ul")
  .classed("ul-container", true)
  .selectAll("div")
  .data(countyData.items, data => data)
  .enter()
  .append("div")
  .classed("alert alert-primary", true)
  .text((data) => data);

const addItem = (apple) => {
    console.log(apple)
  const item = document.querySelector(".inptext").value;
  if (countyData.addItem(item)) {
    console.log(countyData.items);
    d3.select(".ul-container")
      .selectAll("div")
      .data(countyData.items, data => data)
      .enter()
      .append("div")
      .classed("alert alert-primary", true)
      .text((data) => data);
  } else {
        const liveToast = document.getElementById('liveToast')
        const msg = document.querySelector('.toast-body').textContent = `${item} => Item already exists`
        const toast = new bootstrap.Toast(liveToast);
        toast.show();
  }
};

/*
   New Chart with scale D3 package 
*/
const MARGINS = {
    top: 20,
    bottom: 10
}
const CHART_WIDTH = 600;
const CHART_HEIGHT = 500 - MARGINS.top - MARGINS.bottom;

const x = d3.scaleBand()
    .rangeRound([0, CHART_WIDTH]).padding(0.1);
const y = d3.scaleLinear().range([CHART_WIDTH, 0]);


const chartContainer = d3.select('.chart-five')
    .append('svg')
    .classed('svg-five', true)
    .attr('width', CHART_WIDTH)
    .attr('height', (CHART_HEIGHT + MARGINS.top + MARGINS.bottom))

x.domain(DUMMY_DATA.map(item => item.name))
y.domain([0, d3.max(DUMMY_DATA, item => item.power) + 100])

// g stands for group elements in svg
const chart_actual = chartContainer.append('g')

// add lables to the bottom of the graph
chart_actual
    .append('g')
    .call(d3.axisBottom(x))
    .attr('transform', `translate(0, ${CHART_HEIGHT})`)

chart_actual
    .selectAll('.chart-bar')
    .data(DUMMY_DATA, data => data.id)
    .enter()
    .append('rect')
    .classed('.chart-bar', true)
    .attr('width', x.bandwidth())
    .attr('height', data => CHART_HEIGHT - y(data.power))
    .attr('x', data => x(data.name))
    .attr('y', data => y(data.power))


// add lables to the top of the bars
/*
chart_actual.selectAll('.label')
    .data(DUMMY_DATA)
    .enter()
    .append('text')
    .text(data => data.name)
    .attr('x', data => x(data.name) + x.bandwidth() / 2)
    .attr('y', data => y(data.power) - 20)
    .attr('text-anchor', 'middle')
    .classed('label', true)
*/