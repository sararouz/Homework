//Data

var counter = 0;





//update pie plot







// // Gauge
// // Enter a speed between 0 and 180
// var level = 175;
//
// // Trig to calc meter point
// var degrees = 180 - level,
// radius = .5;
// var radians = degrees * Math.PI / 180;
// var x = radius * Math.cos(radians);
// var y = radius * Math.sin(radians);
//
// // Path: may have to change to create a better triangle
// var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
// pathX = String(x),
// space = ' ',
// pathY = String(y),
// pathEnd = ' Z';
// var path = mainPath.concat(pathX,space,pathY,pathEnd);
//
// var data = [{ type: 'scatter',
// x: [0], y:[0],
// marker: {size: 28, color:'850000'},
// showlegend: false,
// name: 'speed',
// text: level,
// hoverinfo: 'text+name'},
// { values: [50/6, 50/6, 50/6, 50/6, 50/6, 50/6, 50],
//   rotation: 90,
//   text: ['TOO FAST!', 'Pretty Fast', 'Fast', 'Average',
//   'Slow', 'Super Slow', ''],
//   textinfo: 'text',
//   textposition:'inside',
//   marker: {colors:['rgba(14, 127, 0, .5)', 'rgba(110, 154, 22, .5)',
//   'rgba(170, 202, 42, .5)', 'rgba(202, 209, 95, .5)',
//   'rgba(210, 206, 145, .5)', 'rgba(232, 226, 202, .5)',
//   'rgba(255, 255, 255, 0)']},
//   labels: ['151-180', '121-150', '91-120', '61-90', '31-60', '0-30', ''],
//   hoverinfo: 'label',
//   hole: .5,
//   type: 'pie',
//   showlegend: false
// }];
//
// var layout = {
//   shapes:[{
//     type: 'path',
//     path: path,
//     fillcolor: '850000',
//     line: {
//       color: '850000'
//     }
//   }],
//   title: '<b>Gauge</b> <br> Speed 0-100',
//   height: 500,
//   width: 500,
//   xaxis: {zeroline:false, showticklabels:false,
//     showgrid: false, range: [-1, 1]},
//     yaxis: {zeroline:false, showticklabels:false,
//       showgrid: false, range: [-1, 1]}
//     };
//
//     Plotly.newPlot('myDiv', data, layout);


    //call names

    function names() {
      var xhttp = new XMLHttpRequest();
      xhttp.open("GET", "/names", true);
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          myObj = JSON.parse(xhttp.responseText)
          var myDrop = document.getElementById('selDataset');
          for (var i = 0; i < myObj.length; i++) {
            var myOption = document.createElement("option");
            myOption.value = myObj[i];
            myOption.text = myObj[i];
            myDrop.appendChild(myOption);
          }
          // myDrop.append(<option value="dataset1">United States</option>)
          // console.log(JSON.parse(xhttp.responseText));
        }
      };
      xhttp.setRequestHeader("Content-type", "application/json");
      xhttp.send();

      // var response = JSON.parse(xhttp.responseText);
      // console.log(response);
    }


// Update the drop down list
function updateList(myValue) {
      // console.log(myValue);
      var xhttp = new XMLHttpRequest();
      var myURL = "/metadata/"+myValue
      xhttp.open("GET", myURL, true);
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {

          myObj = JSON.parse(xhttp.responseText);
          // console.log(myObj);
          var myList =document.getElementById('sampleList');
          while (myList.hasChildNodes()) {
            myList.removeChild(myList.firstChild);
          }

          for (var k in myObj){
            var listEl = document.createElement("li");
            var str = "";
            str = str.concat(k);
            str = str.concat(": ");
            str = str.concat(myObj[k]);
            listEl.appendChild(document.createTextNode(str));

            myList.appendChild(listEl)
          }

        }
      };
      xhttp.setRequestHeader("Content-type", "application/json");
      xhttp.send();
}



// Pie Plot
function myPie(myObj,myObj2) {

      var myPieVals = [];
      var myHoverInfo = [];
      var myLabels = [];
      for (var i =0; i<10; i++){
        var label = myObj[0][0]['otu_ids'][i];
        // console.log(label);
        myPieVals.push(myObj[0][0]['sample_values'][i])
        myLabels.push(label);
        myHoverInfo.push(myObj2[0][label]);
      }
      // console.log(myHoverInfo);
      var data = [{
        values: myPieVals,//[19, 26, 55, 88],
        labels: myLabels,//["Spotify", "Soundcloud", "Pandora", "Itunes"],
        text: myHoverInfo,
        hoverinfo: 'text',
        type: "pie"

      }];
      var layout = {
        height: 500,
        width: 1200
      };
      var PIE = document.getElementById("pie");
      Plotly.purge(PIE);
      Plotly.plot(PIE, data, layout);

}
// Use the OTU IDs for the x values
// Use the Sample Values for the y values
// Use the Sample Values for the marker size
// Use the OTU IDs for the marker colors
// Use the OTU Description Data for the text values

// Bubble Chart
function myBubble(myObj,myObj2) {
  // console.log(myObj[0][0]['otu_ids']);
  // console.log(myObj[0][0]['sample_values']);
  var myText = [];
  for(var i=0; i<myObj[0][0]['otu_ids'].length; i++) {
    var temp = myObj[0][0]['otu_ids'][i];
    myText.push(myObj2[0][temp]);
  }
  var trace1 = {
    x: myObj[0][0]['otu_ids'],
    y: myObj[0][0]['sample_values'],
    type: 'scatter',
    text: myText,
    mode: 'markers',
    hoverinfo: 'text',
    marker: { size: myObj[0][0]['sample_values'],
    sizemode: 'area',
    color: myObj[0][0]['otu_ids']
    }
    // name: 'Team A',
    // textposition: 'top center',
    // textfont: {
    //   family:  'Raleway, sans-serif'
    // },

  };
  data = [trace1];
  var layout = {

    xaxis: {
      range: [ Math.min(trace1.x), Math.max(trace1.x)]
    },
    yaxis: {
      range: [Math.min(trace1.y), Math.max(trace1.y)]
    }//,
    // legend: {
      // y: 0.5,
      // yref: 'paper',
      // font: {
      //   family: 'Arial, sans-serif',
      //   size: 20,
      //   color: 'grey',
      // }
    };
    // title:'Data Labels on the Plot'

    var BUBBLE = document.getElementById("bubble");
  Plotly.plot(BUBBLE, data, layout)

}



function charts(myValue) {
      // Get Data
      var xhttp = new XMLHttpRequest();
      var myURL = "/samples/"+myValue
      var myObj = [];
      var myObj2 = []
      xhttp.open("GET", myURL, true);
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          myObj[0] = JSON.parse(xhttp.responseText);
          // console.log(myObj[0]);
        }
      };
      // console.log('Here is after callback:');
      // console.log(myObj);

      //send the request to the website
      xhttp.setRequestHeader("Content-type", "application/json");
      xhttp.send();

      //get data from otu
      var xhttp2 = new XMLHttpRequest();
      var myURL2 = "/otu"
      xhttp2.open("GET", myURL2, true);
      xhttp2.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          myObj2[0] = JSON.parse(xhttp2.responseText);
          // console.log('Here is after the second callback:');
          // console.log(myObj2);
          // console.log(myObj);
          myPie(myObj,myObj2);
          myBubble(myObj,myObj2);
        }
      };
      xhttp2.setRequestHeader("Content-type", "application/json");
      xhttp2.send();
}




function optionChanged(myValue){
  updateList(myValue);
  charts(myValue);
}

names();
