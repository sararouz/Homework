

var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

var URLPlates = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"

function getColor(d) {
    return d > 5 ? '#EC2727' :
           d > 4  ? '#EC6027' :
           d > 3  ? '#EC7B27' :
           d > 2  ? '#ECA227' :
           d > 1   ? '#ECCE27' :
                    '#71BB94' ;
}

d3.json(URLPlates, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures2(data.features);
});

var myFaultLineLayer;

function createFeatures2(plateData) {
  myFaultLineLayer = L.geoJSON();
  myFaultLineLayer.addData(plateData);
  // var myLines = [{
  //     "type": "LineString",
  //     "coordinates": [[-100, 40], [-105, 45], [-110, 55]]
  // }, {
  //     "type": "LineString",
  //     "coordinates": [[-105, 40], [-110, 45], [-115, 55]]
  // }];

  // var myStyle = {
  //     "color": "#ff7800",
  //     "weight": 5,
  //     "opacity": 0.65
  // };

  // L.geoJSON(myLines, {
  //     style: myStyle
  // }).addTo(map);
  //
  // };
}

var myData;





d3.json(queryUrl, function(data) {
  createFeatures(data.features);

});


function createFeatures(earthquakeData) {
  myData = earthquakeData;
  console.log(myData);

  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {
    layer.bindPopup(
      "<h3>" +
      feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time)
       + "</p>");
       // layer.circle(feature.geometry.coordinates, {
       // fillOpacity: 0.75,
       // color: 'white',
       // fillColor: 'purple',
       // // Setting our circle's radius equal to the output of our markerSize function
       // // This will make our marker's size proportionate to its population
       // radius: feature.properties.mag});
  }



  // console.log(earthquakeData);
  // var Mag = earthquakeData[0].properties.mag;
  // var coordinates = earthquakeData[0].geometry.coordinates;
  // console.log(Mag);
  // console.log(coordinates);









  // function markerSize(mag) {
  //   return mag * 40;
  // }





  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, {
          radius: feature.properties.mag*5,
          fillColor: getColor(feature.properties.mag),
          color: getColor(feature.properties.mag),
          weight: 1,
          opacity: 1,
          fillOpacity: 0.8
      });
    }
  });
  createMap(earthquakes);
}

function createMap(earthquakes) {

  // Define streetmap and darkmap layers
  var satellite = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v9/tiles/256/{z}/{x}/{y}?" +
    "access_token=pk.eyJ1Ijoic2FyYXJvdXoiLCJhIjoiY2ppcXpnY3VuMDVyMzNwcnJqeWNscGQzZiJ9.GCR8S9Zonf0oHT_7CTIFCQ");

  var grayscale = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?" +
    "access_token=pk.eyJ1Ijoic2FyYXJvdXoiLCJhIjoiY2ppcXpnY3VuMDVyMzNwcnJqeWNscGQzZiJ9.GCR8S9Zonf0oHT_7CTIFCQ");

    var outdoors= L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v9/tiles/256/{z}/{x}/{y}?" +
      "access_token=pk.eyJ1Ijoic2FyYXJvdXoiLCJhIjoiY2ppcXpnY3VuMDVyMzNwcnJqeWNscGQzZiJ9.GCR8S9Zonf0oHT_7CTIFCQ");

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "satellite": satellite,
    "GrayScale": grayscale,
    "Outdoors": outdoors
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    // Earthquakes: earthquakes,
    FaultLines: myFaultLineLayer
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -105.71
    ],
    zoom: 5,
    layers: [outdoors,myFaultLineLayer],//, earthquakes, myFaultLineLayer]
    timeDimension: true,
    timeDimensionOptions: {
        timeInterval: "2018-06-19/2018-06-24",
        period: "PT2H"
    },
    timeDimensionControl: true,
    timeDimensionControlOptions: {
      playerOptions: {
        loop: true
      },
      loopButton: true,
      autoPlay: true
    }
  });

  var legend = L.control({position: 'bottomright'});

  legend.onAdd = function (myMap) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 1, 2, 3, 4, 5],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(myMap);


var options = {
  duration: "PT6H"
};

L.timeDimension.layer.geoJson(earthquakes,options).addTo(myMap);


  // console.log([myData[1].geometry.coordinates[0],myData[1].geometry.coordinates[1]]);
  //
  // for (var i = 0; i < myData.length; i++) {
  //   var circle = L.circle([myData[i].geometry.coordinates[0],myData[i].geometry.coordinates[1]], {
  //     fillOpacity: 0.75,
  //     color: 'white',
  //     fillColor: 'purple',
  //     // Setting our circle's radius equal to the output of our markerSize function
  //     // This will make our marker's size proportionate to its population
  //     radius: myData[i].properties.mag*100
  //   }).addTo(myMap);
  // }

  // Playback options
    // var playbackOptions = {
    //     playControl: true,
    //     dateControl: true,
    //     sliderControl: true
    // };






    // var myCoordinates = [];
    // var myTimeStamps = [];
    // var myMags = [];
    // for (var i=0; i<myData.length; i++){
    //   myCoordinates.push([myData[i].geometry.coordinates[0],myData[i].geometry.coordinates[1]]);
    //   myTimeStamps.push(myData[i].properties.time);
    //   myMags.push(myData[i].properties.mag);
    // }
    // // console.log(myCoordinates);
    // // console.log(myTimeStamps);
    //
    // var myTimeSeriesData = {
    //   "type": "Feature",
    //   "geometry": {
    //     "type": "MultiPoint",
    //     "coordinates": myCoordinates.reverse()
    //   },
    //     "properties": {
    //       "time": myTimeStamps.reverse(),
    //       "mag":myMags.reverse()
    //     }
    //   };


  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
  // L.control.layers(baseMaps, {
    collapsed: false
  }).addTo(myMap);
}
