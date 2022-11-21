const addItem = () => {
  let count = countItems();
  const container = d3.select(".d3-container");
  const size = container
    .select(".ul-ctr")
    .append("li")
    .text(`item  ${++count}`);
};

const countItems = () => {
  const container = d3.select(".d3-container");
  const size = container.selectAll(".ul-ctr").selectAll("li").size();
  console.log(size);
  return size;
};

const removeAllItems = () => {
  const element = d3.select(".ul-ctr").selectAll("li").remove();
};

const removeLast = () => {
  console.log("removing last item");
  const element = d3.select(".ul-ctr").select("li:last-child").remove();
};

const changeAnimal = () => {
  const image1 =
    "https://images.pexels.com/photos/45201/kitty-cat-kitten-pet-45201.jpeg?auto=compress&cs=tinysrgb&w=800";
  const image2 =
    "https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=800";
  const src = d3.select("img").attr("src");
  if (src === image2) {
    d3.selectAll(".para").remove();
    d3.select("img").attr("src", image1);
    d3.select(".d3-container1")
      .insert("p", "div")
      .text("Cat")
      .classed("para", true);
  } else {
    d3.selectAll(".para").remove();
    d3.select("img").attr("src", image2);
    d3.select(".d3-container1")
      .insert("p", "div")
      .text("Dog")
      .classed("para", true)
      .style("color", "red");
  }
};

const changeColor = () => {
  d3.csv("static/data.csv").then((responseData) => {
    const data = responseData.sort((a, b) => b.score - a.score);
    data.map((person, index) => {
      setTimeout(() => {
        console.log(person);
        d3.select(".ul-ctr")
          .append("li")
          .text(`${person.name}: ${person.score}`);
      }, 1000 * index);
    });
  });
};

const understand_reduce = () => {
  let list_items = [1, 2, 43, 65, 0, 66, 4343, 454, 5];

  const result = list_items.reduce((a, b, index) => {
    console.log(a, b)
    return a * b
  }, list_items[0])

  console.log(result)
};
