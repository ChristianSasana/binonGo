let activeMap = null;
let userMarker = null;
let routeLine = null;
let watchID = null;

const searchBar = document.querySelector(".location");
const searchAnimation = document.getElementById("searchAnimation");

const locations = {
    EngBeeTin: {lng: 120.97516234196503, lat: 14.600126331277705},
    ChuanKee: {lng: 120.97552624754503, lat:14.600343025690094},
    YingYing: {lng: 120.97671296490923, lat: 14.597969310833896},
    Sincerity: {lng: 120.97521744366803, lat: 14.599087193844603},
    DongBei: {lng: 120.97511276336105, lat: 14.601231658991594},
    ShanghaiSiopao: {lng: 120.97783475071029, lat: 14.601486003068887},
    WanNan: {lng: 120.97939893328267, lat: 14.600918043880585}, 
    QuickSnack: {lng: 120.97699221794997, lat: 14.599914152598268},
    WaiYing: {lng: 120.97614043960844, lat: 14.602082078087003},
    FourSeason: {lng: 120.97256760562247, lat: 14.598993795923958},
    LamDynasty: {lng: 120.97583195569408, lat: 14.598601751082287},
    Delicious: {lng: 120.98047748007227, lat: 14.601059014472984},
    NewEastern: {lng: 120.97936291522743, lat: 14.601306320962209},
    DavidTeaHouse: {lng: 120.97914608045039, lat: 14.6007859021519},
    Masuki: {lng: 120.9765237013056, lat: 14.60305812888516},
    LGAFastfood: {lng: 120.97695047515849, lat: 14.601399371884453},
    LordStow: {lng: 120.97564792427477, lat: 14.60091046888936},
    NewPoHeng: {lng: 120.9754535671045, lat: 14.59960627611711},
    GrandCafe: {lng: 120.97545894523562, lat: 14.59654064055826},
    Polland: {lng: 120.97716640255882, lat: 14.597049350656311},
    OldSaigon: {lng: 120.97642383662884, lat: 14.603450057797586},
    Salazar: {lng: 120.97699034900829, lat: 14.60193136979033},
    GoldenFortune: {lng: 120.97817292959901, lat: 14.603829025965332},
    Oishiekun: {lng: 120.9779185802752, lat: 14.6015577104187},
    CafeMezzanine: {lng: 120.97563033704158, lat: 14.600413102230661},
    HoLand: {lng: 120.97507912267544, lat: 14.601266005891725}
};

const restaurants = {
    EngBeeTin: ["Eng Bee Tin Flagship Store"],
    ChuanKee: ["Chuan Kee Chinese Fast Food"],
    YingYing: ["Ying Ying Tea House"],
    Sincerity:["Sincerity Restaurant"],
    DongBei: ["Dong Bei Dumplings"],
    ShanghaiSiopao: ["Shanghai Fried Siopao"],
    WanNan: ["Wan Nan Eatery"],
    QuickSnack: ["Quick Snack"],
    WaiYing: ["Wai Ying Fast Food"],
    FourSeason: ["Four Season Noodle House"],
    LamDynasty: ["Lam Dynasty"],
    Delicious: ["Delicious Restaurant"],
    NewEastern: ["New Eastern Garden Restaurant"],
    DavidTeaHouse: ["David's Tea House"],
    Masuki: ["Masuki"],
    LGAFastfood: ["LGA Fastfood"],
    LordStow: ["Lord Stow's Bakery"],
    NewPoHeng: ["New Po Heng Lumpia House"],
    GrandCafe: ["1919 Grand Cafe"],
    Polland: ["Polland Hopia"],
    OldSaigon: ["Old Saigon Vietnamese Restaurant"],
    Salazar: ["Salazar Bakery"],
    GoldenFortune: ["Golden Fortune Seafood Restaurant"],
    Oishiekun: ["Oishiekun Chinese Bites"],
    CafeMezzanine: ["Café Mezzanine"],
    HoLand: ["Ho-land Hopia & Asian Deli Inc"]
}
let collapseCounter = 1;
for (const accordionElem in restaurants) {
    const restaurantName = restaurants[accordionElem][0];
    //first div accordion-item
    const newDiv = document.createElement("div");
    newDiv.classList.add('accordion-item');
    document.getElementById("accordionExample").appendChild(newDiv);
    //h2 accordion-header
    const newH2 = document.createElement("h2");
    newH2.classList.add("accordion-header");
    newDiv.appendChild(newH2);
    //button accordion-button
    const accordionButton = document.createElement("button");
    accordionButton.classList.add("accordion-button", "collapsed");
    accordionButton.id = accordionElem;
    accordionButton.setAttribute("data-bs-toggle", "collapse");
    accordionButton.setAttribute("data-bs-target", "#collapse"  + collapseCounter);
    accordionButton.setAttribute("aria-expanded", "true");
    accordionButton.setAttribute("aria-controls", "collapse"  + collapseCounter);
    newH2.appendChild(accordionButton);
    
    const newDiv2 = document.createElement("div");
    accordionButton.appendChild(newDiv2);
    
    const newSpan = document.createElement("span");
    newSpan.innerText = restaurantName;
    newDiv2.appendChild(newSpan);

    const newDiv3 = document.createElement("div");
    newDiv3.classList.add("routeDetails");
    newDiv3.id = 'routeDetails';
    newDiv2.appendChild(newDiv3);

    const newP1 = document.createElement("p");
    const newP2 = document.createElement("p");
    const newP3 = document.createElement("p");
    newP1.classList.add("distance");
    newP2.classList.add("eta");
    newP3.classList.add("coords");
    newDiv3.appendChild(newP1);
    newDiv3.appendChild(newP2);
    newDiv3.appendChild(newP3);

    const newDiv4 = document.createElement("div");
    newDiv4.id = 'collapse' + collapseCounter;
    newDiv4.classList.add("accordion-collapse", "collapse");
    newDiv4.setAttribute("data-bs-parent", "#accordionExample");
    newDiv.appendChild(newDiv4);

    const newDiv5 = document.createElement("div");
    newDiv5.classList.add("accordion-body");
    newDiv4.appendChild(newDiv5);

    const newDiv6 = document.createElement("div");
    newDiv6.classList.add("map");
    newDiv5.appendChild(newDiv6);

    collapseCounter++;
    console.log(collapseCounter);
}

//create an object with properties consisting of resturant details
//for each the object to generate elements based on the array's data


const accordionCollapse = document.querySelectorAll('.accordion-collapse');
//look through all accordion with the class name
accordionCollapse.forEach(collapseEvent => {
    collapseEvent.addEventListener('shown.bs.collapse', function (event) {
        searchBar.style.display = 'none';
        searchAnimation.style.display = 'block';
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
        console.log("closed")
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
    console.log(
    `Route update:
    Start: ${startLat}, ${startLng}
    End: ${endLat}, ${endLng}`
    );
    const url ="https://sasanaserver.tail3f239f.ts.net/route/v1/foot/" +
    `${startLng},${startLat};${endLng},${endLat}?overview=full&geometries=geojson&steps=true`;

    fetch(url).then(res => res.json()).then(data => {
        console.log("Fetching route for:", endLng, endLat);

        if (!data || data.routes.length === 0) return;

        const route = data.routes[0];

        const km = (route.distance / 1000).toFixed(2);
        const minutes = Math.round(route.duration / 60);

        accordionItem.querySelector(".distance").innerText = `${km} km`;
        accordionItem.querySelector(".eta").innerText = `ETA: ${minutes} min/s`;
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

        console.log(
            `Distance: ${(route.distance / 1000).toFixed(3)} km`
        );

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
        center: [startLat, startLng],
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

function showSearch() {
    console.log("clicked");
    searchBar.style.display = 'block';

    searchAnimation.style.display = 'none';

    const accordionElement = document.querySelector(".accordion-collapse.show");
    if (accordionElement) {
    const bootstrapCollapse = bootstrap.Collapse.getOrCreateInstance(accordionElement);
    
    bootstrapCollapse.hide();
    }
}

const foodGroups = {
    Hopia: ["Eng Bee Tin", "Polland Hopia", "Ho-land Hopia & Asian Deli Inc"],
    Bakery: ["Eng Bee Tin", "Polland Hopia", "Ho-land Hopia & Asian Deli Inc", "Salazar Bakery", "Lord Stow's Bakery"],
    TakeOuts: ["Wan Nan Eatery", "Lord Stow's Bakery", "Eng Bee Tin", "Polland Hopia", "Ho-land Hopia & Asian Deli Inc", "Salazar Bakery", "Shanghai Fried Siopao", "Oishiekun Chinese Bites"],
    Noodles: ["Four Season Noodle House", "Masuki","Wai Ying Fast Food", "Delicious Restaurant"],
    Dimsum: ["Dong Bei Dumplings", "Wai Ying Fast Food", "Ying Ying Tea House", "David's Tea House"],
    FastFood: ["Shanghai Fried Siopao", "New Pong Hei Lumpia House", "Wan Nan Eatery"],
    Exotic: ["Four Season Noodle House", "Wan Nan Eatery", "LGA Fastfood"],
    Cafe: ["1919 Grand Cafe", "Café Mezzanine"],
    Dining: ["Sincerity Restaurant", "Quick Snack", "Ying Ying Tea House", "Golden Fortune Seafood Restaurant", "Lam Dynasty", "New Eastern Garden Restaurant"]
};

function search() {
    let input, filter, accordionLocation, button, i, span, txtValue;

    input = document.getElementById("location");
    filter = input.value.toUpperCase();
    accordionLocation = document.getElementById("accordionExample");
    button = accordionLocation.getElementsByTagName("button");

    for (i = 0; i < button.length; i++) {

    span = button[i].getElementsByTagName("span")[0];
    txtValue = span.textContent.trim();

    let show = txtValue.toUpperCase().includes(filter);
        //gets each property of foodgroups
    for (const category in foodGroups) {
        //get the values in the property of foodgroups
        const restaurants = Object.values(foodGroups[category]);
        console.log(restaurants);   
        if (
            //check if each property of foodgroups matches the value from user
            category.toUpperCase().includes(filter) &&
            //check if values from the properties matches the span text content
            restaurants.includes(txtValue)
        ) {
            show = true;
        }
    }

    button[i].style.display = show ? "" : "none";
    }
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


