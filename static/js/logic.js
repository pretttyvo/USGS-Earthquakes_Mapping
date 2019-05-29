
// Create function for legend color
function getColor(d) {
    return d > 5  ? '#8B0000':
           d > 4  ? '#FF4500':
           d > 3  ? '#FF8C00':
           d > 2  ? '#F4A460':
           d > 1  ? '#FFD700':
           '#FFFFE0';
};

// Create map function
function createMap(earthquakes) {

    // Create the tile layer that will be the background of our map
    const lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.light",
        accessToken: API_KEY
    });
    const satellite = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.dark",
        accessToken: API_KEY
    });

    // Create a baseMaps object to hold the lightmap layer
    const baseMaps = {
        "Light Map": lightmap,
        "Satellite Map": satellite
    };

    // Create an overlayMaps object to hold the bikeStations layer
    var overlayMaps = {
        "Earthquakes": earthquakes
    };

    // Create the map object with options
    var map = L.map("map-id", {
        center: [39.8283, -98.5795],
        zoom: 4.5,
        layers: [lightmap, earthquakes]
    });

    // Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(map);

    // create legend to show magnitude of earthquake
    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
    breaks = [0,1,2,3,4,5],
    labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < breaks.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(breaks[i] + 1) + '"></i> ' +
            breaks[i] + (breaks[i + 1] ? '&ndash;' + breaks[i + 1] + '<br>' : '+');
    }

    return div;
    };

    legend.addTo(map);

};

// Marker size
function markerSize(unit) {
    return unit*10000
};

// Marker Color
function setColor(unit) {
    if(unit > 0 && unit < 1) {
        return "#FFFFE0"
    } 
    else if (unit<1 && unit <2) {
        return "#FFD700"
    }
    else if (unit<2 && unit <3) {
        return "#F4A460"
    }
    else if (unit<3 && unit <4) {
        return "#FFA500"
    }
    else if (unit< 4 && unit <5) {
        return "#FF4500"
    }
    else if (unit < 5){
        return "#8B0000"
    }
};

// Opacity
function setOpacity(unit) {
    opacity = unit/6.25
    if (unit < 1){
        return 0.2
    }
    else if (unit > 1 && unit < 5) {
        return opacity
    }
    else if (unit > 5) {
        return 0.8
    }
};

// markers for earthquakes
function createMarkers(response) {
    
    // Loop through the stations array
    let marker = response.map(earthquake => {
        // For each station, create a marker and bind a popup with the station's name
        let coord = [earthquake.geometry.coordinates[1], earthquake.geometry.coordinates[0]];
        
        let mag = earthquake.properties.mag;
        // console.log(Math.max(mag))
        let popupMsg = '<h1>USGS Earthquakes </h1><h2>' + earthquake.properties.place + '<hr>Magnitude: ' + mag + '</h2><h3>Date:' + new Date(earthquake.properties.time) + '</h3>';
        // let color = '';
        // color = setColor(mag);
        let earthMarkers = L.circle(coord,{
            // fillColor: color,
            fillOpacity: setOpacity(mag),
            color: setColor(mag),
            weight: 0.8,
            // radius: 10000
            radius: markerSize(mag)
        }).bindPopup(popupMsg);
        // Add the marker to the bikeMarkers array
        return earthMarkers;
    })

    // Create a layer group made from the bike markers array, pass it into the createMap function
    createMap(L.layerGroup(marker));
};


// fault_lines = "";
// // markers for fault lines
// function createLines(response) {
    
//     // Loop through the stations array
//     let marker = response.map(fault => {
//         let lines = fault.geometry.coordinates
//         // For each station, create a marker and bind a popup with the station's name
//         // let coord = lines.geometry.coordinates;
//         let line = lines.map( data =>{
//             let coordinates = [data[1],data[0]];
//             console.log(coordinates)
//         let faults = L.circle(coordinates,{
//             // fillColor: color,
//             fillOpacity: 0.55,
//             color: "orange",
//             weight: 0.8,

//         })
//         })
//         })
// };

// function for earthquakes
(async function(){
    const response = await d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson");
    // const response2 = await d3.json("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_plates.json");
    console.log(response);
    console.log(response2);
    createMarkers(response.features)
    // createLines(response2.features)
})()


