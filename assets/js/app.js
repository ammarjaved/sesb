var map, featureList, boroughSearch = [], theaterSearch = [], museumSearch = [];

$(window).resize(function() {
  sizeLayerControl();
});

$(document).on("click", ".feature-row", function(e) {
  $(document).off("mouseout", ".feature-row", clearHighlight);
  sidebarClick(parseInt($(this).attr("id"), 10));
});

if ( !("ontouchstart" in window) ) {
  $(document).on("mouseover", ".feature-row", function(e) {
    highlight.clearLayers().addLayer(L.circleMarker([$(this).attr("lat"), $(this).attr("lng")], highlightStyle));
  });
}

$(document).on("mouseout", ".feature-row", clearHighlight);

$("#about-btn").click(function() {
  $("#aboutModal").modal("show");
  $(".navbar-collapse.in").collapse("hide");
  return false;
});

$("#full-extent-btn").click(function() {
  map.fitBounds(boroughs.getBounds());
  $(".navbar-collapse.in").collapse("hide");
  return false;
});

$("#legend-btn").click(function() {
  $("#legendModal").modal("show");
  $(".navbar-collapse.in").collapse("hide");
  return false;
});

$("#login-btn").click(function() {
  $("#loginModal").modal("show");
  $(".navbar-collapse.in").collapse("hide");
  return false;
});

$("#list-btn").click(function() {
  animateSidebar();
  return false;
});

$("#nav-btn").click(function() {
  $(".navbar-collapse").collapse("toggle");
  return false;
});

$("#sidebar-toggle-btn").click(function() {
  animateSidebar();
  return false;
});

$("#sidebar-hide-btn").click(function() {
  animateSidebar();
  return false;
});

function animateSidebar() {
  $("#sidebar").animate({
    width: "toggle"
  }, 350, function() {
    map.invalidateSize();
  });
}

function sizeLayerControl() {
  $(".leaflet-control-layers").css("max-height", $("#map").height() - 50);
}

function clearHighlight() {
  highlight.clearLayers();
}

function sidebarClick(id) {
  var layer = markerClusters.getLayer(id);
  map.setView([layer.getLatLng().lat, layer.getLatLng().lng], 17);
  layer.fire("click");
  /* Hide sidebar and go to the map on small screens */
  if (document.body.clientWidth <= 767) {
    $("#sidebar").hide();
    map.invalidateSize();
  }
}



/* Basemap Layers */
var cartoLight = L.tileLayer("https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://cartodb.com/attributions">CartoDB</a>'
});
var usgsImagery = L.layerGroup([L.tileLayer("http://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryOnly/MapServer/tile/{z}/{y}/{x}", {
  maxZoom: 15,
}), L.tileLayer.wms("http://raster.nationalmap.gov/arcgis/services/Orthoimagery/USGS_EROS_Ortho_SCALE/ImageServer/WMSServer?", {
  minZoom: 16,
  maxZoom: 19,
  layers: "0",
  format: 'image/jpeg',
  transparent: true,
  attribution: "Aerial Imagery courtesy USGS"
})]);
var googleSat = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',{
  maxZoom: 20,
  subdomains:['mt0','mt1','mt2','mt3']
});

/* Overlay Layers */
var highlight = L.geoJson(null);
var highlightStyle = {
  stroke: false,
  fillColor: "#00FFFF",
  fillOpacity: 0.7,
  radius: 10
};

var boroughs = L.geoJson(null, {
  style: function (feature) {
    return {
      color: "black",
      fill: false,
      opacity: 1,
      clickable: false
    };
  },
  onEachFeature: function (feature, layer) {
    boroughSearch.push({
      name: layer.feature.properties.BoroName,
      source: "Boroughs",
      id: L.stamp(layer),
      bounds: layer.getBounds()
    });
  }
});
$.getJSON("data/states.geojson", function (data) {
  boroughs.addData(data);
});

//Create a color dictionary based off of subway route_id
// var subwayColors = {"1":"#ff3135", "2":"#ff3135", "3":"ff3135", "4":"#009b2e",
//     "5":"#009b2e", "6":"#009b2e", "7":"#ce06cb", "A":"#fd9a00", "C":"#fd9a00",
//     "E":"#fd9a00", "SI":"#fd9a00","H":"#fd9a00", "Air":"#ffff00", "B":"#ffff00",
//     "D":"#ffff00", "F":"#ffff00", "M":"#ffff00", "G":"#9ace00", "FS":"#6e6e6e",
//     "GS":"#6e6e6e", "J":"#976900", "Z":"#976900", "L":"#969696", "N":"#ffff00",
//     "Q":"#ffff00", "R":"#ffff00" };
//
// var subwayLines = L.geoJson(null, {
//   style: function (feature) {
//       return {
//         color: subwayColors[feature.properties.route_id],
//         weight: 3,
//         opacity: 1
//       };
//   },
//   onEachFeature: function (feature, layer) {
//     if (feature.properties) {
//       var content = "<table class='table table-striped table-bordered table-condensed'>" + "<tr><th>Division</th><td>" + feature.properties.Division + "</td></tr>" + "<tr><th>Line</th><td>" + feature.properties.Line + "</td></tr>" + "<table>";
//       layer.on({
//         click: function (e) {
//           $("#feature-title").html(feature.properties.Line);
//           $("#feature-info").html(content);
//           $("#featureModal").modal("show");
//
//         }
//       });
//     }
//     layer.on({
//       mouseover: function (e) {
//         var layer = e.target;
//         layer.setStyle({
//           weight: 3,
//           color: "#00FFFF",
//           opacity: 1
//         });
//         if (!L.Browser.ie && !L.Browser.opera) {
//           layer.bringToFront();
//         }
//       },
//       mouseout: function (e) {
//         subwayLines.resetStyle(e.target);
//       }
//     });
//   }
// });
// $.getJSON("data/subways.geojson", function (data) {
//   subwayLines.addData(data);
// });

/* Single marker cluster layer to hold all clusters */
var markerClusters = new L.MarkerClusterGroup({
  spiderfyOnMaxZoom: true,
  showCoverageOnHover: false,
  zoomToBoundsOnClick: true,
  disableClusteringAtZoom: 16
});
var myStyle = { // Define your style object
  "color": "#ff0000"
};
/* Empty layer placeholder to add to layer control for listening when to add/remove theaters to markerClusters layer */
var theaterLayer = L.geoJson(null);

var theaters = L.geoJson(null, {
style:myStyle,
  onEachFeature: function (feature, layer) {
    if (feature.properties) {
      var content = "<table class='table table-striped table-bordered table-condensed'>" + "<tr><th>Name</th><td>" + feature.properties.NAME + "</td></tr>" + "<tr><th>Phone</th><td>" + feature.properties.TEL + "</td></tr>" + "<tr><th>Address</th><td>" + feature.properties.ADDRESS1 + "</td></tr>" + "<tr><th>Website</th><td><a class='url-break' href='" + feature.properties.URL + "' target='_blank'>" + feature.properties.URL + "</a></td></tr>" + "<table>";
      layer.on({
        click: function (e) {
// console.log(feature.properties);
         
        }
          // $("#feature-title").html(feature.properties.NAME);
          // $("#feature-info").html(content);
          // $("#featureModal").modal("show");
          // highlight.clearLayers().addLayer(L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], highlightStyle));
        });
     

    }
  }
});
$.getJSON("Services/transmission_line.php", function (data) {
  theaters.addData(JSON.parse(data[0].geojson));
  map.addLayer(theaterLayer);
});

/* Empty layer placeholder to add to layer control for listening when to add/remove museums to markerClusters layer */
var museumLayer = L.geoJson(null);
var museums = L.geoJson(null, {
  onEachFeature: function (feature, layer) {
    if (feature.properties) {
      var content = "<table class='table table-striped table-bordered table-condensed'>" + "<tr><th>Name</th><td>" + feature.properties.NAME + "</td></tr>" + "<tr><th>Phone</th><td>" + feature.properties.TEL + "</td></tr>" + "<tr><th>Address</th><td>" + feature.properties.ADRESS1 + "</td></tr>" + "<tr><th>Website</th><td><a class='url-break' href='" + feature.properties.URL + "' target='_blank'>" + feature.properties.URL + "</a></td></tr>" + "<table>";
      layer.on({
        click: function (e) {
          $("#feature-title").html(feature.properties.NAME);
          $("#feature-info").html(content);
          $("#featureModal").modal("show");
          highlight.clearLayers().addLayer(L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], highlightStyle));
        }
      });
    }
  }
});
$.getJSON("Services/buffer.php", function (data) {
  museums.addData(JSON.parse(data[0].geojson));
});


var polesLayer = L.geoJson(null);
var geojsonMarkerOptions = {
  radius: 4,
  fillColor: "#ff7800",
  color: "#000",
  weight: 1,
  opacity: 1,
  fillOpacity: 0.8
};
var poles = L.geoJson(null, {
  pointToLayer: function (feature, latlng) {
    return L.circleMarker(latlng, geojsonMarkerOptions);
  },
  onEachFeature: function (feature, layer) {

    if (feature.properties) {
      var content = "<table class='table table-striped table-bordered table-condensed'>" + "<tr><th>gid</th><td>" + feature.properties.gid+ "</td></tr>"+"<tr><th>Name</th><td>" + feature.properties.name+ "</td></tr>" + "<tr><th>Tower no</th><td>" + feature.properties.tower_no + "</td></tr>" + "<tr><th>Type</th><td>" + feature.properties.type + "</td></tr>" + "<table>";
      layer.on({
        click: function (e) {
           console.log(feature);
          $("#feature-title").html(feature.properties.NAME);
          $("#feature-info").html(content);
          $("#featureModal").modal("show");
          highlight.clearLayers().addLayer(L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], highlightStyle));
        }
      });
    }
  }
});
$.getJSON("Services/get_transmission_poles.php", function (data) {
  poles.addData(JSON.parse(data[0].geojson));
});

var  cell1,cell2,row;
var pmu_ppu = L.geoJson(null, {
  pointToLayer: function (feature, latlng) {
    // var LeafIcon = L.Icon.extend({
    //   options: {
    //     iconSize:     [19, 46],
    //     className: 'my-icon-green'
    //   }
    // });
    // var greenIcon = new LeafIcon({
    //   iconUrl: 'http://localhost/sesb/assets/img/imagettw.png'
    // })

    var myIcon = L.divIcon({className: 'my-div-icon'});
    var geojsonMarkerOptions = {
      radius: 6,
      fillColor: "#00F700",
      color: "#000",
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8,
    };
    return L.circleMarker(latlng,geojsonMarkerOptions);
  },
  onEachFeature: function (feature, layer) {
    if (feature.properties) {
    var content =
      "<table class='table table-striped table-bordered table-condensed'>" +
      "<tbody >"+
      "<tr><th>Id</th><td>" + feature.properties.gid + "</td></tr>"+
      "<tr><th>Name</th><td>" + feature.properties.name + "</td></tr>"+
      // "</tr>" + "<tr><th>Type</th><td>" + feature.properties.type + "</td></tr>"  +
      // "<tr><th>Submission</th><td> "+feature.properties.submission+"</td></tr>"+
      // "<tr><th>Transformer</th><td> "+feature.properties.transformer+"</td></tr>"+
      // "<tr><th>Sub Grid</th><td> "+feature.properties.sub_grid+"</td></tr>"+
      // "<tr><th>CB</th><td> "+feature.properties.cb+"</td></tr>"+
      // "<tr><th>RMU</th><td> "+feature.properties.rmu+"</td></tr>"+
      // "<tr><th>NER</th><td> "+feature.properties.ner+"</td></tr>"+
      // "<tr><th>LVDB</th><td> "+feature.properties.lvdb+"</td></tr>"+
      // "<tr><th>FP</th><td> "+feature.properties.fp+"</td></tr>"+
      "</tbody>"+
       "<table>";
      layer.on({
        click: function (e) {
          let main = document.getElementById('sidebar-table');
          if (main.style.display === "none") {
            main.style.display="block";
          }

           $.ajax({
                type: "GET",
                url: `Services/getConnectedLayer.php?id=${feature.properties.gid }`,
                success: function(data) {
                  console.log(data.geojson);
                  var  tkk =  JSON.parse(data);
                  // console.log(tkk[0].geojson);
                  var tkk_j = JSON.parse(tkk[0].geojson)
                  var table = document.getElementById("Connectivity");
                  $('#Connectivity').find('tr').remove().end();
                  for (var i = 0; i < (tkk_j.features).length ; i++) {
                  $val = `<tr><td id="line${tkk_j.features[i].properties.gid}" onclick="getLine('${tkk_j.features[i].properties.gid}')" style="cursor:pointer">${tkk_j.features[i].properties.name}</td></tr>`;
                  $("#Connectivity").append($val);
                 }
                }
              });

            $("#pmu").html(content);
            $('#Rentis').html("");
          highlight.clearLayers().addLayer(L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], highlightStyle));

            rentis_name = '' ;
            pre_llayer=false;
            if (pre_llaye) {
              map.removeLayer(pre_llaye);
            }
        
         


        }
      });
    }
  }
});

var rentisMarkerOptions = {
  radius: 4,
  fillColor: "blue",
  color: "#000",
  weight: 1,
  opacity: 1,
  fillOpacity: 0.8
};
var rentis_l = L.geoJson(null, {
  pointToLayer: function (feature, latlng) {
    return L.circleMarker(latlng, rentisMarkerOptions);
  },
  onEachFeature: function (feature, layer) {
    if (feature.properties) {
      layer.on({
        click: function (e) {
          var prop = feature.properties;
          

          var content = `<table class='table table-striped table-bordered table-condensed'>
          <tbody>
                    <tr>
                    <th>Segment</th>
                    <td>${prop.segment}</td>
                  </tr>
                  <tr>
                    <th>Cycle</th>
                    <td>${prop.cycle}</td>
                  </tr>
                  <tr>
                    <th>Vendor</th>
                    <td>${prop.vendor}</td>
                  </tr>
                  <tr>
                    <th>Already Cleaned</th>
                    <td>${prop.already_cleaned}</td>
                  </tr>
                  <tr>
                    <th>Toatl Distance</th>
                    <td>${parseInt(prop.lenght)}</td>
                  </tr>
                  <tr>
                    <th class="text-center">Before pic </th>
                    <th class="text-center" >After pic</th>
                  </tr>
                  <tr>
                    <td class="text-center"><a class='example-image-link text-center' href="${prop.before_pic1}" data-lightbox='example-set' data-title='Pic'><img src="${prop.before_pic1}" height="50" alt="no image uploaded" width="50"></a></td>
                    <td class="text-center"><a class='example-image-link text-center' href="${prop.after_pic1}"  data-lightbox='example-set' data-title='Pic'><img src="${prop.after_pic1}" alt="no image uploaded" height="50" width="50"></a></td>
                  </tr>

                  <tr>
                    <td class="text-center"><a class='example-image-link text-center' href="${prop.before_pic2}" data-lightbox='example-set' data-title='Pic'><img src="${prop.before_pic2}" height="50" alt="no image uploaded" width="50"></a></td>
                    <td class="text-center"><a class='example-image-link text-center' href="${prop.after_pic2}"  data-lightbox='example-set' data-title='Pic'><img src="${prop.after_pic2}" alt="no image uploaded" height="50" width="50"></a></td>
                  </tr>


                  <tr>
                    
                    <td class="text-center col-md-6"><a class='example-image-link text-center' href="${prop.before_pic3}" data-lightbox='example-set' data-title='Pic'><img src="${prop.before_pic3}" height="50" alt="no image uploaded" width="50"></a></td>
                    <td class="text-center col-md-6"><a class='example-image-link text-center' href="${prop.after_pic3}"  data-lightbox='example-set' data-title='Pic'><img src="${prop.after_pic3}" height="50" alt="no image uploaded" width="50"></a></td>

                  </tr>
                 
                  </tbody></table>`;
                  $("#feature-title").html("Rentis Detail");
        $("#feature-info").html(content);
        $("#featureModal").modal("show");
           
// highlight.clearLayers().addLayer(L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], highlightStyle));
         

        }
      });
    }
  }
});

$.getJSON("Services/rentis.php", function (data) {
  console.log(data);

  rentis_l.addData(JSON.parse(data[0].geojson));
});



$.getJSON("Services/get_all_pmu.php", function (data) {
  // console.log(data);

  pmu_ppu.addData(JSON.parse(data[0].geojson));
});


map = L.map("map", {
  zoom: 7,
  center: [5.35424165019849,117.129598340844],
  layers: [googleSat, boroughs, markerClusters, highlight],
  zoomControl: false,
  attributionControl: false
});

/* Layer control listeners that allow for a single markerClusters layer */
map.on("overlayadd", function(e) {
  if (e.layer === theaterLayer) {
    markerClusters.addLayer(theaters);
    //syncSidebar();
  }
  if (e.layer === museumLayer) {
    markerClusters.addLayer(museums);
  //  syncSidebar();
  }
});

map.on("overlayremove", function(e) {
  if (e.layer === theaterLayer) {
    markerClusters.removeLayer(theaters);
    //syncSidebar();
  }
  if (e.layer === museumLayer) {
    markerClusters.removeLayer(museums);
  //  syncSidebar();
  }
});

/* Filter sidebar feature list to only show features in current map bounds */
// map.on("moveend", function (e) {
//   syncSidebar();
// });

/* Clear feature highlight when map is clicked */
map.on("click", function(e) {
  highlight.clearLayers();
});

/* Attribution control */
function updateAttribution(e) {
  $.each(map._layers, function(index, layer) {
    if (layer.getAttribution) {
      $("#attribution").html((layer.getAttribution()));
    }
  });
}
map.on("layeradd", updateAttribution);
map.on("layerremove", updateAttribution);

// var attributionControl = L.control({
//   position: "bottomright"
// });
// attributionControl.onAdd = function (map) {
//   var div = L.DomUtil.create("div", "leaflet-control-attribution");
//   div.innerHTML = "<span class='hidden-xs'>Developed by <a href='http://bryanmcbride.com'>bryanmcbride.com</a> | </span><a href='#' onclick='$(\"#attributionModal\").modal(\"show\"); return false;'>Attribution</a>";
//   return div;
// };
// map.addControl(attributionControl);

var zoomControl = L.control.zoom({
  position: "bottomright"
}).addTo(map);

/* GPS enabled geolocation control set to follow the user's location */
var locateControl = L.control.locate({
  position: "bottomright",
  drawCircle: true,
  follow: true,
  setView: true,
  keepCurrentZoomLevel: true,
  markerStyle: {
    weight: 1,
    opacity: 0.8,
    fillOpacity: 0.8
  },
  circleStyle: {
    weight: 1,
    clickable: false
  },
  icon: "fa fa-location-arrow",
  metric: false,
  strings: {
    title: "My location",
    popup: "You are within {distance} {unit} from this point",
    outsideMapBoundsMsg: "You seem located outside the boundaries of the map"
  },
  locateOptions: {
    maxZoom: 18,
    watch: true,
    enableHighAccuracy: true,
    maximumAge: 10000,
    timeout: 10000
  }
}).addTo(map);

/* Larger screens get expanded layer control and visible sidebar */
if (document.body.clientWidth <= 767) {
  var isCollapsed = true;
} else {
  var isCollapsed = false;
}

var baseLayers = {
  "Street Map": cartoLight,
  "Aerial Imagery": usgsImagery
};

var groupedOverlays = {
  "Points of Interest": {
    "Transmission Line": theaterLayer,
    "transmission_20m_buffer": museumLayer,
    "Poles": poles,
    "PMU&PPU":pmu_ppu,
    "Rentis":rentis_l
  },
  "Reference": {
    "Sabah": boroughs
  }
};

var layerControl = L.control.groupedLayers(baseLayers, groupedOverlays, {
  collapsed: isCollapsed
}).addTo(map);

/* Highlight search box text on click */
$("#searchbox").click(function () {
  $(this).select();
});

/* Prevent hitting enter from refreshing the page */
$("#searchbox").keypress(function (e) {
  if (e.which == 13) {
    e.preventDefault();
  }
});

$("#featureModal").on("hidden.bs.modal", function (e) {
  $(document).on("mouseout", ".feature-row", clearHighlight);
});

/* Typeahead search functionality */
 $(document).one("ajaxStop", function () {
   $("#loading").hide();
//   sizeLayerControl();
//   /* Fit map to boroughs bounds */
//   map.fitBounds(boroughs.getBounds());
//   featureList = new List("features", {valueNames: ["feature-name"]});
//   featureList.sort("feature-name", {order:"asc"});
//
//   var boroughsBH = new Bloodhound({
//     name: "Boroughs",
//     datumTokenizer: function (d) {
//       return Bloodhound.tokenizers.whitespace(d.name);
//     },
//     queryTokenizer: Bloodhound.tokenizers.whitespace,
//     local: boroughSearch,
//     limit: 10
//   });
//
//   var theatersBH = new Bloodhound({
//     name: "Theaters",
//     datumTokenizer: function (d) {
//       return Bloodhound.tokenizers.whitespace(d.name);
//     },
//     queryTokenizer: Bloodhound.tokenizers.whitespace,
//     local: theaterSearch,
//     limit: 10
//   });
//
//   var museumsBH = new Bloodhound({
//     name: "Museums",
//     datumTokenizer: function (d) {
//       return Bloodhound.tokenizers.whitespace(d.name);
//     },
//     queryTokenizer: Bloodhound.tokenizers.whitespace,
//     local: museumSearch,
//     limit: 10
//   });
//
//   var geonamesBH = new Bloodhound({
//     name: "GeoNames",
//     datumTokenizer: function (d) {
//       return Bloodhound.tokenizers.whitespace(d.name);
//     },
//     queryTokenizer: Bloodhound.tokenizers.whitespace,
//     remote: {
//       url: "http://api.geonames.org/searchJSON?username=bootleaf&featureClass=P&maxRows=5&countryCode=US&name_startsWith=%QUERY",
//       filter: function (data) {
//         return $.map(data.geonames, function (result) {
//           return {
//             name: result.name + ", " + result.adminCode1,
//             lat: result.lat,
//             lng: result.lng,
//             source: "GeoNames"
//           };
//         });
//       },
//       ajax: {
//         beforeSend: function (jqXhr, settings) {
//           settings.url += "&east=" + map.getBounds().getEast() + "&west=" + map.getBounds().getWest() + "&north=" + map.getBounds().getNorth() + "&south=" + map.getBounds().getSouth();
//           $("#searchicon").removeClass("fa-search").addClass("fa-refresh fa-spin");
//         },
//         complete: function (jqXHR, status) {
//           $('#searchicon').removeClass("fa-refresh fa-spin").addClass("fa-search");
//         }
//       }
//     },
//     limit: 10
//   });
//   boroughsBH.initialize();
//   theatersBH.initialize();
//   museumsBH.initialize();
//   geonamesBH.initialize();
//
//   /* instantiate the typeahead UI */
//   $("#searchbox").typeahead({
//     minLength: 3,
//     highlight: true,
//     hint: false
//   }, {
//     name: "Boroughs",
//     displayKey: "name",
//     source: boroughsBH.ttAdapter(),
//     templates: {
//       header: "<h4 class='typeahead-header'>Boroughs</h4>"
//     }
//   }, {
//     name: "Theaters",
//     displayKey: "name",
//     source: theatersBH.ttAdapter(),
//     templates: {
//       header: "<h4 class='typeahead-header'><img src='assets/img/theater.png' width='24' height='28'>&nbsp;Theaters</h4>",
//       suggestion: Handlebars.compile(["{{name}}<br>&nbsp;<small>{{address}}</small>"].join(""))
//     }
//   }, {
//     name: "Museums",
//     displayKey: "name",
//     source: museumsBH.ttAdapter(),
//     templates: {
//       header: "<h4 class='typeahead-header'><img src='assets/img/museum.png' width='24' height='28'>&nbsp;Museums</h4>",
//       suggestion: Handlebars.compile(["{{name}}<br>&nbsp;<small>{{address}}</small>"].join(""))
//     }
//   }, {
//     name: "GeoNames",
//     displayKey: "name",
//     source: geonamesBH.ttAdapter(),
//     templates: {
//       header: "<h4 class='typeahead-header'><img src='assets/img/globe.png' width='25' height='25'>&nbsp;GeoNames</h4>"
//     }
//   }).on("typeahead:selected", function (obj, datum) {
//     if (datum.source === "Boroughs") {
//       map.fitBounds(datum.bounds);
//     }
//     if (datum.source === "Theaters") {
//       if (!map.hasLayer(theaterLayer)) {
//         map.addLayer(theaterLayer);
//       }
//       map.setView([datum.lat, datum.lng], 17);
//       if (map._layers[datum.id]) {
//         map._layers[datum.id].fire("click");
//       }
//     }
//     if (datum.source === "Museums") {
//       if (!map.hasLayer(museumLayer)) {
//         map.addLayer(museumLayer);
//       }
//       map.setView([datum.lat, datum.lng], 17);
//       if (map._layers[datum.id]) {
//         map._layers[datum.id].fire("click");
//       }
//     }
//     if (datum.source === "GeoNames") {
//       map.setView([datum.lat, datum.lng], 14);
//     }
//     if ($(".navbar-collapse").height() > 50) {
//       $(".navbar-collapse").collapse("hide");
//     }
//   }).on("typeahead:opened", function () {
//     $(".navbar-collapse.in").css("max-height", $(document).height() - $(".navbar-header").height());
//     $(".navbar-collapse.in").css("height", $(document).height() - $(".navbar-header").height());
//   }).on("typeahead:closed", function () {
//     $(".navbar-collapse.in").css("max-height", "");
//     $(".navbar-collapse.in").css("height", "");
//   });
//   $(".twitter-typeahead").css("position", "static");
//   $(".twitter-typeahead").css("display", "block");
 });

// Leaflet patch to make layer control scrollable on touch browsers
var container = $(".leaflet-control-layers")[0];
if (!L.Browser.touch) {
  L.DomEvent
  .disableClickPropagation(container)
  .disableScrollPropagation(container);
} else {
  L.DomEvent.disableClickPropagation(container);
}


var nest ="" ,nest_i="", ddiv="",ddiv_i="";

function toggleDivp(id){


 var content = document.getElementById(id);
 var icon = document.getElementById(id+"_i");

  if (content.style.display === "none") {
    if (nest !== "") {
      nest.style.display = "none";
      nest_i.classList.add('fa-plus');
      nest_i.classList.remove('fa-minus');
    }
      content.style.display = "block";
       icon.classList.remove('fa-plus');
      icon.classList.add('fa-minus');
      nest = content;
      nest_i = icon;

    } else {
      content.style.display = "none";
      icon.classList.add('fa-plus');
      icon.classList.remove('fa-minus');
      nest = "";
    }

    
}


function toggleDiv(id){

 var content =document.getElementById(id) ;
 var icon = document.getElementById(id+"_i");

  if (content.style.display === "none") {
// if (ddiv !== "") {
//       ddiv.style.display = "none";
//       ddiv_i.classList.add('fa-plus');
//       ddiv_i.classList.remove('fa-minus');
//     }

      content.style.display = "block";
      icon.classList.remove('fa-plus');
      icon.classList.add('fa-minus');
      ddiv = content;
      ddiv_i = icon;
    } else {
      content.style.display = "none";
      icon.classList.remove('fa-minus');
      icon.classList.add('fa-plus');
      ddiv = "";
  
    }
    
}


function DownloadPDF() {
   window.location.href = 'assets/PMU BUKIT RAMBAI-Model.pdf';
}

// var pre_llayer =[];
 var pre_id =null;
var pre_llayer=false;
var pre_llaye;
function getLine(id){
    $.ajax({
      type: "GET",
      url: `Services/get_line_ByID.php?id=${id}`,
      success: function(data) {
        // console.log(data);
         let  parse_data =  JSON.parse(data);
         let parse_p = JSON.parse(parse_data[0].geojson);
         
         var style={ color:"#00FFFF"}
         if(pre_llayer==false) {
           pre_llaye = L.geoJson(parse_p, style)
           map.addLayer(pre_llaye);
           $("#line" + id).addClass('bg-ch');
           pre_id = id;
           pre_llayer=true
           sideRentis(parse_p.features[0].properties.name);
         }else if(pre_llayer==true){
           map.removeLayer(pre_llaye);
           $("#line"+pre_id).removeClass('bg-ch');
           $("#Rentis").html("");
           
           pre_llayer=false;
           if(id!=pre_id){
             pre_llaye= L.geoJson(JSON.parse(parse_data[0].geojson), style).addTo(map);
             $("#line" + id).addClass('bg-ch');
             pre_id = id;
             pre_llayer=true
             sideRentis(parse_p.features[0].properties.name);

            
           }
         }
          // getRentis(parse_p.features[0].properties.name);
         
          rentis_name = '' ;
        }
      });
}

var g_dat='';

function sideRentis(name){
  var side_name = name;
  g_dat ='';
  $.ajax({
    type:'GET',
    url:`Services/cycle.php?name=${name}`,
    success:function(data){
      console.log(data);
     
      var dat = JSON.parse(data);
      g_dat = dat;

      $("#Rentis").html(`<select name="select_cycle" id="select_cycle" onchange="getRentis('${side_name}')" class="form-control">
                      <option value="" hidden>Select cycle</option>
                     
                      </select>`);
      
      for(var i = 0 ; i<dat.length ;i++){
        
      $("#select_cycle").append(`<option value=${dat[i].cycle}>${dat[i].cycle}</option>`);


    }

  }
})
 
}

var rentis = '';
var rentis_name = '';
var cycle = '';
function getRentis(name) {
  // if (rentis_name === name) {
  //   return false;
  // } 

  cycle = $('#select_cycle').val();
  // console.log(cycle);
  // console.log(cycle);
  // alert(cycle);
  $.ajax({
    type:'GET',
    url:`Services/rentis.php?name=${name}&cycle=${cycle}`,
    success:function(data){
      
      rentis_name = name;
      var rentis =  JSON.parse(data);
      // console.log(rentis);
      // var rentis = JSON.parse(rentis_pars[0].geojson);

      if (rentis) {

      // let prop = rentis.features[0].properties; 
        var prop = rentis.data[0];
       
      

      var res_con = `
      <select name="select_cycle" id="select_cycle" onchange="getRentis('${name }')" class="form-control">
                      <option value="" hidden>${cycle}</option>
                      
                      </select>
       <table class="table table-striped table-bordered table-condensed custom-table-css" >
      <tbody>
                      <tr>
                        <th>Segment</th>
                        <td>${prop.segment}</td>
                      </tr>
                      <tr>
                        <th>No of Cycle</th>
                        <td>${prop.cycle}</td>
                      </tr>
                      <tr>
                        <th>Vendor</th>
                        <td>${prop.vendor}</td>
                      </tr>
                      <tr>
                        <th>Total distance</th>
                        <td> ${parseInt(prop.lenght)} KM</td>
                      </tr>
                      <tr>
                        <th>Distance covered</th>
                        <td> ${parseInt(JSON.parse(data).complete)} KM</td>
                      </tr>
                      <tr>
                      <th>Detail</th>
                      <td class="text-center"><button type="button" class="btn btn-sm btn-primary" onclick="detail(${parseInt(prop.lenght)},${parseInt(JSON.parse(data).complete)})">Detail</button></td>
                      </tr>
                    </tbod>
                    </table>`;
                    console.log(prop);
                  $('#Rentis').html(res_con);

// console.log(g_dat);
      for(var i = 0 ; i<g_dat.length ;i++){
        
      $("#select_cycle").append(`<option value=${g_dat[i].cycle}>${g_dat[i].cycle}</option>`);


    }
                  

                   
      }else{
        $('#Rentis').html("<tr><td>No Record Found</td></tr>");
      }

    }

  })
  
}



function detail(lenght ,comp){

var remain = (100*comp)/lenght;

   $("#feature-info").html(`
      <div class="row">
        <div class='col-md-4'>
          <div class="card">
          <div class="card-title"><h4>Total Distance</h4></div>
            <h6>${lenght} KM</h6>
          </div>
        </div>
        <div class='col-md-4'>
          <div class="card">
          <div class="card-title"><h4>Total Remaining</h4></div>
            <h6>${parseInt(lenght-comp)} KM</h6>
          </div>
        </div>
        <div class='col-md-4'>
          <div class="card">
          <div class="card-title"><h4>Total Covered</h4></div>
            <h6>${comp} KM</h6>
          </div>
        </div>
      </div>
      <div class="mt-4">
    <div id="container4"></div>
    </div>`);
   pieChart(100-remain,remain);
 $("#feature-title").html("Rentis Detail");
        $("#featureModal").modal("show");

}

function pieChart(a,b){
    Highcharts.chart('container4', {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie'
        },

        credits:false,
        title: {
            text: 'Total covered / uncovered'
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        accessibility: {
            point: {
                valueSuffix: '%'
            }
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.percentage:.1f} %'
                }
            }
        },
        series: [{
            name: 'Brands',
            colorByPoint: true,
            data: [{
                name: 'Total Remaining',
                y: a,
                sliced: true,
                selected: true,
                color:'orange'
            }, {
                name: 'Total Covered ',
                y: b,
                color:'green'
            }]
        }]
    });
}

function teast(){
  alert("asdasd");
}


function typeaheadsearch(){

    $('.typeahead').unbind('typeahead');
    var tblname;
       

        $('#search_input1').typeahead({
            name: 'hce1',
            remote:'Services/search.php?key=%QUERY',
            limit: 5
        });



       
    }

// var substringMatcher = function(strs) {
//   return function findMatches(q, cb) {
//     var matches, substringRegex;

//     // an array that will be populated with substring matches
//     matches = [];

//     // regex used to determine if a string contains the substring `q`
//     substrRegex = new RegExp(q, 'i');

//     // iterate through the pool of strings and for any string that
//     // contains the substring `q`, add it to the `matches` array
//     $.each(strs, function(i, str) {
//       if (substrRegex.test(str)) {
//         matches.push(str);
//       }
//     });

//     cb(matches);
//   };
// };

// var states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California',
//   'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii',
//   'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana',
//   'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota',
//   'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
//   'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota',
//   'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island',
//   'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
//   'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
// ];

// $('#the-basics .typeahead').typeahead({
//   hint: true,
//   highlight: true,
//   minLength: 1
// },
// {
//   name: 'states',
//   source: substringMatcher(states)
// });



// var substringMatcher = function(strs) {
//   console.log('strs', strs);
//   return function findMatches(q, cb) {
//     console.log('q', q);
//     var matches, substringRegex;

//     // an array that will be populated with substring matches
//     matches = [];
//     console.log('matches', matches);

//     // regex used to determine if a string contains the substring `q`
//     substrRegex = new RegExp(q, 'i');

//     // iterate through the pool of strings and for any string that
//     // contains the substring `q`, add it to the `matches` array
//     $.each(strs, function(i, str) {
//       if (substrRegex.test(str)) {
//         matches.push(str);
//       }
//     });
    
//     console.log('matches', matches);

//     cb(matches);
//   };
// };

// var states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California',
//   'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii',
//   'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana',
//   'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota',
//   'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
//   'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota',
//   'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island',
//   'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
//   'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
// ];

// $('#the-basics .typeahead').typeahead({
//   hint: true,
//   highlight: true,
//   minLength: 1
// },
// {
//   name: 'states',
//   source: substringMatcher(states)
// });



// $(document).ready(function(){
//     // Defining the local dataset
//     var cars = ['Audi', 'BMW', 'Bugatti', 'Ferrari', 'Ford', 'Lamborghini', 'Mercedes Benz', 'Porsche', 'Rolls-Royce', 'Volkswagen'];
    
//     // Constructing the suggestion engine
//     var cars = new Bloodhound({
//         datumTokenizer: Bloodhound.tokenizers.whitespace,
//         queryTokenizer: Bloodhound.tokenizers.whitespace,
//         local: cars
//     });
    
//     // Initializing the typeahead
//     $('.typeahead').typeahead({
//         hint: true,
//         highlight: true, /* Enable substring highlighting */
//         minLength: 1 /* Specify minimum characters required for showing result */
//     },
//     {
//         name: 'cars',
//         source: cars
//     });
// });  


$(document).ready(function(){

  $('#search_input1').typeahead({
                name: 'hce1',
                remote:'services/search.php?key=%QUERY',
                limit: 5
            }); 
})


function searchButton(){
  var sName = '';
  sName = $("#search_input1").val();
  $.ajax({
                url: "services/returnXY.php?name="+ sName,
                type: "GET",
                async: false,
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                success: function callback(response) {
                   console.log(response);
                   var latlng=[response[0].y, response[0].x]
                    map.setView(latlng,19);
                    // L.marker(latlng).addTo(map);
                              highlight.clearLayers().addLayer(L.circleMarker(latlng, highlightStyle));

                }
            });
}