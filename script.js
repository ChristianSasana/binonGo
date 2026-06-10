const binondoBounds = [
    [14.595, 120.965], // southwest corner
    [14.615, 120.985]  // northeast corner
    ];

const map = L.map('map', {
    center: [14.59967465612953, 120.98138741123535],
    zoom: 22,
    minZoom: 18,
    maxBounds: binondoBounds,
    maxBoundsViscosity: 1.0
}); 

L.tileLayer(
    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    {
        attribution: '&copy; OpenStreetMap contributors'
    }
).addTo(map);




// selectedAccordion = document.querySelectorAll(".accordionItem");
// function getCoords() {
//     
//     var selectedLocation = selectedAccordion;
//     const locationID = selectedLocation.id;
//     if(locationID == "EngBeeTin"){
//         var endLng = 120.9751;
//         var endLat = 14.6000;
//     } else if(locationID == "ChuanKee") {
//         var endLng = 120.9751;
//         var endLat = 14.6000;
//     }
//     
//     getRoute(endLng, endLat);

// }

//set coords based on the selected accordion
const locations = {
    EngBeeTin: { lng: 120.9751, lat: 14.6000 },
    ChuanKee: { lng: 120.9751, lat: 14.6000 }
};

document.querySelectorAll(".accordion-button").forEach(item => {
    //make event listener to get open accordion
    item.addEventListener("click", function () {
        console.log("clicked");
        //get coords from the ids of the accordion
        const coords = locations[this.id];

        if (coords) {
            //pass the selected coords to function
            getRoute(coords.lng, coords.lat);
        }
    });
});

function getRoute(endLng, endLat) {

    const startLng = 120.98138741123535;
    const startLat = 14.59967465612953;

    const url = "https://router.project-osrm.org/route/v1/driving/" +
    `${startLng},${startLat};${endLng},${endLat}?overview=full&geometries=geojson&steps=true`;

    fetch(url)
    .then(res => res.json())
    .then(data => {

        const route = data.routes[0];
        console.log(data.routes[0]); 
        const km = (route.distance / 1000).toFixed(2);
        //document.getElementById("distance").innerText = distanceMeters;

        // ===== TIME =====
        const minutes = Math.round(route.duration / 60);

        document.getElementById("eta").innerText =
        `ETA: ${minutes} mins`; 

        document.getElementById("distance").innerText = `${km} km`;

        // ===== STEPS =====
        // const steps = route.legs[0].steps;

        // const list = document.getElementById("steps");
        // //const li = document.createElement("li");
        // //
        // steps.forEach(step => {
        // const li = document.createElement("li");

        // li.textContent =
        //     `${step.maneuver.type} ${
        //     step.maneuver.modifier || ""
        //     } onto ${step.name}`;

        // list.appendChild(li);
        // });

        // ===== DRAW ROUTE =====
        const coords = route.geometry.coordinates;

        const latlngs = coords.map(c => [c[1], c[0]]);

        const routeLine = L.polyline(latlngs, {
        color: 'blue',
        weight: 5
        }).addTo(map);

        map.fitBounds(route.getBounds());
    });
}

// const url = "https://router.project-osrm.org/route/v1/driving/" +
//     `120.98138741123535,14.59967465612953;120.9751,14.6000?overview=full&geometries=geojson&steps=true`;

// fetch(url)
// .then(res => res.json())
// .then(data => {

//     const route = data.routes[0];
//     const km = (route.distance / 1000).toFixed(2);
//     //document.getElementById("distance").innerText = distanceMeters;

//     // ===== TIME =====
//     const minutes = Math.round(route.duration / 60);

//     document.getElementById("eta").innerText =
//     `ETA: ${minutes} mins`; 

//     document.getElementById("distance").innerText = `${km} km`;

//     // ===== STEPS =====
//     const steps = route.legs[0].steps;

//     const list = document.getElementById("steps");
//     //const li = document.createElement("li");
//     //
//     steps.forEach(step => {
//     const li = document.createElement("li");

//     li.textContent =
//         `${step.maneuver.type} ${
//         step.maneuver.modifier || ""
//         } onto ${step.name}`;

//     list.appendChild(li);
//     });

//     // ===== DRAW ROUTE =====
//     const coords = route.geometry.coordinates;

//     const latlngs = coords.map(c => [c[1], c[0]]);

//     const routeLine = L.polyline(latlngs, {
//     color: 'blue',
//     weight: 5
//     }).addTo(map);

//     map.fitBounds(routeLine.getBounds());
// });

// document.querySelectorAll('.accordionItem')
//     .forEach(item => {

//         item.addEventListener('click', function () {
//             const locationID = this.id;

//             let endlng, endlat;

//             if (locationID === "EngBeeTin") {
//                 endlng = 120.9751;
//                 endlat = 14.6000;
//             } 
//             else if (locationID === "ChuanKee") {
//                 endlng = 120.9751;
//                 endlat = 14.6000;
//             }

//             getRoute(endlng, endlat);
//         });

//     });

// function getRoute(endlng, endlat) {

//     const startLng = 120.98138741123535;
//     const startLat = 14.59967465612953;

//     const url = `https://router.project-osrm.org/route/v1/driving/${startLng},${startLat};${endlng},${endlat}?overview=full&geometries=geojson&steps=true`;

//     fetch(url)
//         .then(res => res.json())
//         .then(data => {

//             const route = data.routes[0];

//             const km = (route.distance / 1000).toFixed(2);
//             const minutes = Math.round(route.duration / 60);

//             document.getElementById("eta").innerText =
//                 `ETA: ${minutes} mins`;

//             document.getElementById("distance").innerText =
//                 `${km} km`;

//             const list = document.getElementById("steps");
//             list.innerHTML = ""; // clear previous steps

//             route.legs[0].steps.forEach(step => {
//                 const li = document.createElement("li");

//                 li.textContent =
//                     `${step.maneuver.type} ${
//                         step.maneuver.modifier || ""
//                     } onto ${step.name}`;

//                 list.appendChild(li);
//             });

//             const coords = route.geometry.coordinates;

//             const latlngs =
//                 coords.map(c => [c[1], c[0]]);

//             const routeLine = L.polyline(latlngs, {
//                 color: 'blue',
//                 weight: 5
//             }).addTo(map);

//             map.fitBounds(routeLine.getBounds());
//         });
// }

const myCollapsible = document.querySelectorAll('.accordion-item')

myCollapsible.forEach(item =>{
    item.addEventListener('hidden.bs.collapse', event => {
        console.log("Accordion closed!");
        document.getElementById("mapDetails").style.display = "none";
    });
});

myCollapsible.forEach(item => {
    item.addEventListener('shown.bs.collapse', event => {
        document.getElementById("mapDetails").style.display = "flex";
    });
});


