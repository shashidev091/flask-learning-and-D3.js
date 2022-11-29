async function logScaleExample() {
    // Data
    const dataset = await d3.json('static/files/data4.json')
  
    const sizeAccessor = (d) => d.size
    const nameAccessor = (d) => d.name
  
    // Dimensions
    let dimensions = {
      width: 200,
      height: 500,
      margin: 50
    };
  
    // Draw Image
    const svg = d3.select('.friday-25')
      .append("svg")
      .attr("width", dimensions.width)
      .attr("height", dimensions.height)

    
  }
  
  logScaleExample()