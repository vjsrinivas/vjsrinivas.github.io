var gColorPicker = d3
  .select('div#slider-color-picker')
  .append('svg')
  .attr('width', 375)
  .attr('height', 200)
  .append('g')
  .attr('transform', 'translate(30,30)');

d3.csv("https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/1_OneNum.csv", function(data) {
  console.log(data);
});
