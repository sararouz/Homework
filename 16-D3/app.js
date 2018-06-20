// Chart Params
var svgWidth = 960;
var svgHeight = 500;

var margin = { top: 20, right: 40, bottom: 60, left: 50 };

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;
// Step 2: Create an SVG wrapper,
var svg = d3.select("body")
.append("svg")
.attr("width", svgWidth)
.attr("height", svgHeight);

var chartGroup = svg.append("g")
.attr("transform", `translate(${margin.left}, ${margin.top})`);
// Step 3:
// Import data from the mojoData.csv file

// add the tooltip area to the webpage
var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);


d3.csv("FinalData.csv", function (error, FinalData) {
  if (error) throw error;
  console.log(FinalData);

  // Format the data?

  FinalData.forEach(function (data) {
    data.Income = +data.Income;
    data.Poverty = +data.Poverty;
  });


  console.log();

  // setup x
  var xValue = function(d) { return d.Income;}, // data -> value
      // xScale = d3.scale.linear().range([0, width]), // value -> display
      xScale = d3.scaleLinear()
        .domain([d3.min(FinalData, data => data.Income)-5000,d3.max(FinalData, data => data.Income)])
        // .domain([0,90000])
        .range([0, width]),
      xMap = function(d) { return xScale(xValue(d));}; // data -> display
      // xAxis = d3.svg.axis().scale(xScale).orient("bottom");

  // setup y
  var yValue = function(d) { return d.Poverty;}, // data -> value
      // yScale = d3.scale.linear().range([height, 0]), // value -> display
      yScale = d3.scaleLinear()
        .domain([d3.min(FinalData, data => data.Poverty), d3.max(FinalData, data => data.Poverty)+5])
        .range([height, 0]);
      yMap = function(d) { return yScale(yValue(d));}; // data -> display
      // yAxis = d3.svg.axis().scale(yScale).orient("left");

  // setup fill color
  // var cValue = function(d) { return d.Poverty;},
  //     color = d3.scale.category10();


  // don't want dots overlapping axis, so add in buffer to data domain
  // xScale.domain([d3.min(FinalData, xValue)-1, d3.max(FinalData, xValue)+1]);
  // yScale.domain([d3.min(FinalData, yValue)-1, d3.max(FinalData, yValue)+1]);

  // Step 5: Create Scales
  // var xIncomeScale1 = d3.scaleLinear()
  // .domain(d3.extent(FinalData, data => data.Income))
  // .range([0, width]);
  // //
  // var yPovertyScale1 = d3.scaleLinear()
  // .domain([0, d3.max(FinalData, data => data.Poverty)])
  // .range([height, 0]);

  // var yLinearScale2 = d3.scaleLinear()
  //   .domain([0, d3.max(FinalData, d => d.evening)])
  //   .range([height, 0]);

  // Step 6: Create Axes
  // =============================================
  var XAxis = d3.axisBottom(xScale);
  var YAxis = d3.axisLeft(yScale);



  var gDots = svg.selectAll("g.dot")
      .data(FinalData)
      .enter().append('g');

    gDots.append("circle")
      .attr("class", "dot")
      .attr("r", 10.5)
      .attr("cx", xMap)
      .attr("cy", yMap)
      // .style("fill", function(d) { return color(cValue(d));});
      .style("fill", '#71BB94')
      .on("mouseover", function(d) {
          tooltip.transition()
               .duration(500)
               .style("opacity", 1);
          tooltip.html("State: "+d.Abbr
            + "<br/>Asthma: "+d.Asthma
            + "<br/>Heart: " + d.Heart
            + "<br/>Smoker: " + d.Smoker
            + "<br/>Income: " + d.Income
            + "<br/>Poverty: " + d.Poverty)
	        // + ", " + yValue(d) + ")")
               .style("left", (d3.event.pageX + 5) + "px")
               .style("top", (d3.event.pageY - 28) + "px");
      })
      .on("mouseout", function(d) {
          tooltip.transition()
               .duration(500)
               .style("opacity", 0);
      });
      gDots.append("text")
      .attr("font-size",10)
	    .attr("dx", function(d){return xScale(xValue(d))-8;})
      .attr("dy", function(d){return yScale(yValue(d))+4;})
	    .text(function(d){return d.Abbr});
      // gDots.append("text").text(function(d){
      //              return d.State;
      //          });
               // .attr("x", function (d) {
               //     return x(d.x);
               // })
               // .attr("y", function (d) {
               //     return y(d.y);
               // });




  // Configure a line function which will plot the x and y coordinates using our scales
  // var drawLine = d3.arc()
  // .x(data => xIncomeScale1(data.Income))
  // .y(data => yPovertyScale1(data.Poverty));
  //
  // // Append an SVG path and plot its points using the line function
  // chartGroup.append("path")
  // // The drawLine function returns the instructions for creating the line for forceData
  // .attr("d", drawLine(FinalData))
  // .classed("line", true);
  //
  // // Append an SVG group element to the chartGroup, create the left axis inside of it
  chartGroup.append("g")
  .classed("axis", true)
  .call(YAxis);
  chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x",0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Below Poverty Line");


  // // Append an SVG group element to the chartGroup, create the bottom axis inside of it
  // // Translate the bottom axis to the bottom of the page
  chartGroup.append("g")
  .classed("axis", true)
  .attr("transform", `translate(0, ${height})`)
  .call(XAxis);
  chartGroup.append("text")
      .attr("transform",
            "translate(" + (width/2) + " ," +
                           (height + margin.top + 20) + ")")
      .style("text-anchor", "middle")
      .text("Income");
  // .append("text")
  //     .attr("class", "label")
  //     .attr("x", 100)
  //     .attr("y", 10)
  //     .style("text-anchor", "end")
  //     .text("Income");
});



    // Step 7: Append the axes to the chartGroup - ADD STYLING
    // ==============================================
//     Add bottomAxis
//     chartGroup.append("g")
//       .attr("transform", `translate(0, ${height})`)
//       .call(XAxis);
//
//     // // CHANGE THE TEXT TO THE CORRECT COLOR
//     // chartGroup.append("g")
//     //   .attr("stroke", "green") // NEW!
//     //   .call(leftAxis);
//     //
//     // // CHANGE THE TEXT TO THE CORRECT COLOR
//     // chartGroup.append("g")
//     //   .attr("transform", `translate(${width}, 0)`)
//     //   .attr("stroke", "orange") // NEW!
//     //   .call(rightAxis);
//
//     chartGroup.append("text")
//       // Position the text
//       // Center the text:
//       // (https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/text-anchor)
//       .attr("transform",`translate(${width / 2}, ${height + margin.top + 20})`)
//       .attr("text-anchor", "middle")
//       .attr("font-size", "16px")
//       .attr("fill", "green")
//       .text("Morning Mojo Level");
// });
