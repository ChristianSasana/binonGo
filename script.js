let activeMap = null;
let userMarker = null;
let routeLine = null;
let watchID = null;

const locations = {
    EngBeeTin: {lng: 120.97549015149116, lat: 14.600099176352767},
    ChuanKee: {lng: 120.97552624754503, lat:14.600343025690094},
    YingYing: {lng: 120.97671296490923, lat: 14.597969310833896},
    Sincerity: {lng: 120.97521744366803, lat: 14.599087193844603},
    DongBei: {lng: 120.97511276336105, lat: 14.601231658991594},
    ShanghaiSiopao: {lng: 120.97783475071029, lat: 14.601486003068887},
    WanNan: {lng: 120.97939893328267, lat: 14.600918043880585}, 
    QuickSnack: {lng: 120.97699221794997, lat: 14.599914152598268},
    WaiYing: {lng: 120.97614043960844, lat: 14.602082078087003},
    FourSeason: {lng: 120.97256760562247, lat: 14.598993795923958}
};

const accordionCollapse = document.querySelectorAll('.accordion-collapse');
//look through all accordion with the class name
accordionCollapse.forEach(collapseEvent => {
    collapseEvent.addEventListener('shown.bs.collapse', function (event) {
        const accordionItem = this.closest(".accordion-item");
        const button = accordionItem.querySelector(".accordion-button"); 
        console.log("Accordion:", button.id);
        //get the coords based on name of ID
        const coords = locations[button.id];
        //find the map Id
        const map = accordionItem.querySelector('.map');
        map.id = 'map';
        //const mapID = `map-${button.id}`;
        //map.id = mapID;
        //const mapID = accordionItem.querySelector("[id^='map']");
        map.scrollIntoView({behavior: "instant", block: "center"});
        //check if coords and mapId exists
        if (coords) {
            getRoute(coords.lng, coords.lat, accordionItem);
        }
        const details = accordionItem.querySelector(".routeDetails");
        if (details) details.style.display = "flex";
    });
    collapseEvent.addEventListener('hidden.bs.collapse', function (event) {
        const accordionItem = this.closest(".accordion-item");
        const map = accordionItem.querySelector('.map');
        map.removeAttribute('id');

        const details = accordionItem.querySelector(".routeDetails");
        if (details) details.style.display = "none";

        if (activeMap) {
            activeMap.remove();
            activeMap = null;
        }

        if (watchID) {
            navigator.geolocation.clearWatch(watchID);
            watchID = null;
        }

    });
});

function getRoute(endLng, endLat, accordionItem) {
    console.log("getRoute started", endLng, endLat);
    getLocation(endLng, endLat, accordionItem);
}

function getLocation(endLng, endLat, accordionItem) {
    console.log("getLocation started", endLng, endLat);

    if (watchID) {
    navigator.geolocation.clearWatch(watchID);
    watchID = null;
    }
    if (userMarker) {
    userMarker = null; 
    }
    if (routeLine && activeMap) {
        activeMap.removeLayer(routeLine);
        routeLine = null;
    }
    if (navigator.geolocation) {
    watchID = navigator.geolocation.watchPosition(
        position => success(position, endLng, endLat, accordionItem), 
        error,
        {
            enableHighAccuracy: false
        }
    );
    } else {
    alert("Geolocation is not supported by this browser.");
    }
} 

function success(position, endLng, endLat, accordionItem) {
    startLat = position.coords.latitude;
    startLng = position.coords.longitude;
    console.log("success started", endLng, endLat);
    if (!activeMap) {
    generateMap(startLng, startLat);
    }

    if (userMarker) {
    userMarker.setLatLng([startLat, startLng]);
    } else {
    userMarker = L.marker([startLat, startLng])
        .addTo (activeMap)
        .bindPopup ("Your Location");
    }
    updateRoute(startLng, startLat, endLng, endLat, accordionItem);
}

function error() {
  alert("Sorry, no position available.");
}

function updateRoute(startLng, startLat, endLng, endLat, accordionItem) {
    console.log("updateRoute started");
    const url ="http://localhost:5000/route/v1/foot/" +
    `${startLng},${startLat};${endLng},${endLat}?overview=full&geometries=geojson&steps=true`;

    fetch(url).then(res => res.json()).then(data => {
        console.log("Fetching route for:", endLng, endLat);

        if (!data || data.routes.length === 0) return;

        const route = data.routes[0];

        const km = (route.distance / 1000).toFixed(2);
        const minutes = Math.round(route.duration / 60);

        accordionItem.querySelector(".distance").innerText = `${km} km`;
        accordionItem.querySelector(".eta").innerText = `ETA: ${minutes} mins`;
        //accordionItem.querySelector(".coords").innerText = `Longitude: ${startLng} Lat: ${startLat}`;

        const coords = route.geometry.coordinates;
        const latlngs = coords.map(c => [c[1], c[0]]);

        if (routeLine) {
            activeMap.removeLayer(routeLine);
        }

        routeLine = L.polyline(latlngs, {
            color: 'blue',
            weight: 5,
        }).addTo(activeMap);

        activeMap.fitBounds(routeLine.getBounds(), {padding: [20, 20]});
    })

    if(startLng.toFixed(10) === endLng.toFixed(10) &&
    startLat.toFixed(10) === endLat.toFixed(10)) {
        navigator.geolocation.clearWatch(watchID);
        watchID = null;
    }
}

function generateMap(startLng, startLat){
    console.log("Map Generated");
    if(activeMap) activeMap.remove();

    const binondoBounds = [
        [14.595, 120.965],
        [14.615, 120.985]
    ];

    activeMap = L.map('map', {
        center: [startLng, startLat],
        zoom: 19,
        minZoom: 18,
        maxZoom: 20,
        maxBounds: binondoBounds,
        maxBoundsViscosity: 1.0
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
    maxNativeZoom: 19,
    maxZoom: 22
    }).addTo(activeMap);
}

// function getRoute(endLng, endLat, mapContainer, accordionItem) {
//     const startLng = 120.98138741123535;
//     const startLat = 14.59967465612953;

//     generateMap(startLat, startLng, mapContainer);

//     const url = "https://router.project-osrm.org/route/v1/driving/" +
//     `${startLng},${startLat};${endLng},${endLat}?overview=full&geometries=geojson&steps=true`;

//     fetch(url)
//     .then(res => res.json())
//     .then(data => {

//         const route = data.routes[0];
//         console.log(data.routes[0]); 
//         const km = (route.distance / 1000).toFixed(2);
//         //document.getElementById("distance").innerText = distanceMeters;

//         // ===== TIME =====
//         const minutes = Math.round(route.duration / 60);
//         accordionItem.querySelector(".eta").innerText =
//         `ETA: ${minutes} mins`; 

//         accordionItem.querySelector(".distance").innerText = `${km} km`;

//         // ===== STEPS =====
//         // const steps = route.legs[0].steps;

//         // const list = document.getElementById("steps");
//         // //const li = document.createElement("li");
//         // //
//         // steps.forEach(step => {
//         // const li = document.createElement("li");

//         // li.textContent =
//         //     `${step.maneuver.type} ${
//         //     step.maneuver.modifier || ""
//         //     } onto ${step.name}`;

//         // list.appendChild(li);
//         // });

//         // ===== DRAW ROUTE =====
//         const coords = route.geometry.coordinates;

//         const latlngs = coords.map(c => [c[1], c[0]]);

//         const routeLine = L.polyline(latlngs, {
//         color: 'blue',
//         weight: 5
//         }).addTo(activeMap);

//         //map.fitBounds(route.getBounds());
//     });
// }


