/* Vienna Sightseeing Beispiel */

// Stephansdom Objekt
let stephansdom = {
    lat: 48.208493,
    lng: 16.373118,
    title: "Stephansdom"
};

// Karte initialisieren
let map = L.map("map").setView([
    stephansdom.lat, stephansdom.lng
], 15);

//thematische Layer
let themaLayer = {
    stops: L.featureGroup(),
    lines: L.featureGroup(),
    zones: L.featureGroup(),
    sites: L.featureGroup().addTo(map),
    hotels: L.markerClusterGroup({
        disableClusteringAtZoom: 17
    }),
}

// Hintergrundlayer
let layerControl = L.control.layers({
    "BasemapAT Grau": L.tileLayer.provider("BasemapAT.grau").addTo(map),
    "BasemapAT Standard": L.tileLayer.provider("BasemapAT.basemap"),
    "BasemapAT High-DPI": L.tileLayer.provider("BasemapAT.highdpi"),
    "BasemapAT Gelände": L.tileLayer.provider("BasemapAT.terrain"),
    "BasemapAT Oberfläche": L.tileLayer.provider("BasemapAT.surface"),
    "BasemapAT Orthofoto": L.tileLayer.provider("BasemapAT.orthofoto"),
    "BasemapAT Beschriftung": L.tileLayer.provider("BasemapAT.overlay")
}, {
    "Vienna Sightseeing Haltestellen": themaLayer.stops,
    "Vienna Sightseeing Linien": themaLayer.lines,
    "Fußgängerzonen": themaLayer.zones,
    "Sehenswürdigkeiten": themaLayer.sites,
    "Hotels": themaLayer.hotels.addTo(map)

}).addTo(map);

// Fullscreen Plug-In
map.addControl(new L.Control.Fullscreen());


// Maßstab
L.control.scale({
    imperial: false,
}).addTo(map);

// Vienna Sightseeing Haltestellen, Linien, Sehenswürdigkeiten und Fußgängerzonen
async function showStops(url) {
    let response = await fetch(url);
    let jsondata = await response.json();
    L.geoJSON(jsondata, {
        pointToLayer: function (feature, latlng) {
            return L.marker(latlng, {
                icon: L.icon({
                    iconUrl: `icons/busstop_${feature.properties.LINE_ID}.png`,
                    //iconSize: [32, 37],
                    iconAnchor: [16, 37],
                    popupAnchor: [0, -37],
                })
            });
        },
        onEachFeature: function (feature, layer) {
            let prop = feature.properties;
            layer.bindPopup(`
        <h4> <i class = "fa-solid fa-bus"></i> ${prop.LINE_NAME}</h4>
        <p> ${prop.STAT_ID} ${prop.STAT_NAME} </p>
            `);
            // console.log(prop)
        }
    }).addTo(themaLayer.stops);
    //console.log(response, jsondata)
}

async function showLines(url) {
    let response = await fetch(url);
    let jsondata = await response.json();
    let lineNames = {};
    let lineColors = {

        "1": "#FF4136", // Red Line
        "2": "#FFDC00", // Yellow Line
        "3": "#0074D9", // Blue Line
        "4": "#2ECC40", //Green Line
        "5": "#AAAAAA", // Grey Line
        "6": "#FF851B" // Orange Line

    }
    L.geoJSON(jsondata, {
        style: function (feature) {
            return {
                color: lineColors[feature.properties.LINE_ID],
                weight: 4,
                dashArray: [10, 6]
            };
        },
        onEachFeature: function (feature, layer) {
            let prop = feature.properties;
            layer.bindPopup(`
        <h4> <i class = "fa-solid fa-bus"></i> ${prop.LINE_NAME}</h4>
        <p> <i class = "fa-regular fa-circle-stop"></i> ${prop.FROM_NAME} <br>
        <i class="fa-sharp fa-solid fa-down-long"></i> <br>
        <i class = "fa-regular fa-circle-stop"></i> ${prop.TO_NAME} </p>
            `);
            lineNames[prop.LINE_ID] = prop.LINE_NAME;
            //console.log(lineNames)
        }
    }).addTo(themaLayer.lines);

    // console.log(response, jsondata)
}

async function showSites(url) {
    let response = await fetch(url);
    let jsondata = await response.json();
    L.geoJSON(jsondata, {
        pointToLayer: function (feature, latlng) {
            return L.marker(latlng, {
                icon: L.icon({
                    iconUrl: 'icons/ICON.png',
                    //iconSize: [32, 37],
                    iconAnchor: [16, 37],
                    popupAnchor: [0, -37],
                })
            });
        },
        onEachFeature: function (feature, layer) {
            let prop = feature.properties;
            layer.bindPopup(`
            <img src ="${prop.THUMBNAIL}" alt= "*" >
                <h4> <a href ="${prop.WEITERE_INF}">${prop.NAME} </a></h4>
<address> ${prop.ADRESSE} </adress>
                `);
             //console.log(feature.properties);
        }
    }).addTo(themaLayer.sites);
    // console.log(response, jsondata)
}

async function showHotels(url) {
    let response = await fetch(url);
    let jsondata = await response.json();
    L.geoJSON(jsondata, {
        pointToLayer: function (feature, latlng) {
            if (feature.properties.KATEGORIE_TXT === "nicht kategorisiert") {
            return L.marker(latlng, {
                icon: L.icon({
                    iconUrl: 'icons/hotel_0star.png',
                    //iconSize: [32, 37],
                    iconAnchor: [16, 37],
                    popupAnchor: [0, -37],
                })
            })
            }
            else if (feature.properties.KATEGORIE_TXT === '1*') {
                return L.marker(latlng, {
                    icon: L.icon({
                        iconUrl: "icons/hotel_1star.png",
                        iconAnchor: [16, 37],
                        popupAnchor: [0, -37]
                    })
                })
                } else if (feature.properties.KATEGORIE_TXT === '2*') {
                return L.marker(latlng, {
                    icon: L.icon({
                        iconUrl: "icons/hotel_2stars.png",
                        iconAnchor: [16, 37],
                        popupAnchor: [0, -37]
                    })
                })
                } else if (feature.properties.KATEGORIE_TXT === '3*') {
                return L.marker(latlng, {
                    icon: L.icon({
                        iconUrl: "icons/hotel_3stars.png",
                        iconAnchor: [16, 37],
                        popupAnchor: [0, -37]
                    })
                })
                } else if (feature.properties.KATEGORIE_TXT === '4*') {
                return L.marker(latlng, {
                    icon: L.icon({
                        iconUrl: "icons/hotel_4stars.png",
                        iconAnchor: [16, 37],
                        popupAnchor: [0, -37]
                    })
                })
                } else {
                return L.marker(latlng, {
                    icon: L.icon({
                        iconUrl: "icons/hotel_5stars.png",
                        iconAnchor: [16, 37],
                        popupAnchor: [0, -37]
                    })
                })
                };
                
        },
        onEachFeature: function (feature, layer) {
        let prop = feature.properties;
        layer.bindPopup(`
                <h3> ${prop.BETRIEB}</h3>
                <h4> ${prop.BETRIEBSART_TXT} und ${prop.KATEGORIE_TXT} </h4>
                <hr>
                Addr.:${prop.ADRESSE} <br>
                Tel.: <a href ="tel:${prop.KONTAKT_TEL}" >${prop.KONTAKT_TEL} </a> <br>
                <a href="mailto:${prop.KONTAKT_EMAIL}"> ${prop.KONTAKT_EMAIL} </a> <br>
                <a href="${prop.WEBLINK1}"> ${prop.WEBLINK1}</a>
                `);
        }
    }).addTo(themaLayer.hotels);

}

async function showZones(url) {
    let response = await fetch(url);
    let jsondata = await response.json();
    L.geoJSON(jsondata, {
        style: function (feature) {
            return {
                color: "#F012BE",
                weight: 1,
                opacity: 0.4,
                fillOpacity: 0.1
            };
        },

        onEachFeature: function (feature, layer) {
            let prop = feature.properties;
            layer.bindPopup(`
            <h4><b> Fußgängerzone ${prop.ADRESSE} </b></h4>
            <p> <i class="fa-sharp fa-regular fa-clock"></i> ${prop.ZEITRAUM || "dauerhaft"} <br> <br>
            <i class="fa-solid fa-circle-info"></i> ${prop.AUSN_TEXT || "keine Ausnahmen"}</p>
                `);
            // console.log(prop);
        }
    }).addTo(themaLayer.zones);
    // console.log(response, jsondata)
}


showStops("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:TOURISTIKHTSVSLOGD&srsName=EPSG:4326&outputFormat=json ");
showLines("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:TOURISTIKLINIEVSLOGD&srsName=EPSG:4326&outputFormat=json");
showSites("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:SEHENSWUERDIGOGD&srsName=EPSG:4326&outputFormat=json");
showZones("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:FUSSGEHERZONEOGD&srsName=EPSG:4326&outputFormat=json");
showHotels("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:UNTERKUNFTOGD&srsName=EPSG:4326&outputFormat=json");
