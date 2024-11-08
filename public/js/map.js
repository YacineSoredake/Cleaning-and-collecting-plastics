const userID = localStorage.getItem('userid')
const map = L.map('map').setView([51.505, -0.09], 13);

if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            map.setView([latitude, longitude], 13); // Center map on user's location

            // Optionally, add a marker for the user's location
            L.marker([latitude, longitude]).addTo(map)
                .bindPopup("You are here")
                .openPopup();
        },
        () => {
            console.error("Unable to retrieve your location");
        }
    );
} else {
    console.error("Geolocation is not supported by this browser.");
}

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

let markerCoordinates;

// Show form when the map is clicked
map.on('click', function(e) {
    markerCoordinates = [e.latlng.lat, e.latlng.lng];
    document.getElementById('marker-form').style.display = 'block';
});

// Function to save the marker to the database
async function saveMarker() {
    const quantity = document.getElementById('quantity').value;
    const price = document.getElementById('price').value;
    const imageUrl = document.getElementById('imageUrl').value;

    const markerData = {
        coordinates: markerCoordinates,
        quantity,
        price,
        userID,
        imageUrl
    };

    try {
        await fetch('/addMarker', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(markerData)
        });
        console.log('added succces');
        setTimeout(() => {
            window.location.reload();
        }, 200);
        
    } catch (error) {
        console.error('Error saving marker:', error);
    } finally {
        closeForm();
    }
}

// Function to close the form
function closeForm() {
    document.getElementById('marker-form').style.display = 'none';
}

// Add markers from the database to the map
async function loadMarkers() {
    try {
        const response = await fetch('/markers');
        const markers = await response.json();
        console.log(markers);
        markers.forEach(addMarkerToMap);
    } catch (error) {
        console.error('Error loading markers:', error);
    }
}

// Helper function to add a marker to the map with a popup
// Define custom icons
const redIcon = L.icon({
    iconUrl: '../icons/marker-svgrepo-com.svg', // Replace with the path to a red marker icon
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const greenIcon = L.icon({
    iconUrl: '../icons/marker-svgrepo-com (1).svg', // Replace with the path to a green marker icon
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// Function to add marker with conditional color
function addMarkerToMap(marker) {
    const { coordinates, quantity, price, addedBy, borrowedBy, addedAt, status, imageUrl } = marker;

    // Reformat GeoJSON coordinates from [longitude, latitude] to [latitude, longitude]
    const leafletCoordinates = [coordinates[1], coordinates[0]];

    // Choose icon color based on borrowedBy
    const markerIcon = borrowedBy ? redIcon : greenIcon;

    // Create marker with the chosen icon
    const markerInstance = L.marker(leafletCoordinates, { icon: markerIcon }).addTo(map);
    markerInstance.bindPopup(`
        <b>Added By:</b> ${addedBy}<br>
        <b>Quantity:</b> ${quantity}<br>
        <b>Price:</b> $${price}<br>
        <b>Status:</b> ${status}<br>
        <b>Borrowed:</b> ${borrowedBy}<br>
        <b>Date:</b> ${addedAt}<br>
        <img src="${imageUrl}" alt="Image" width="100px" height="100px">
        <br><button>Open Site</button>
    `);
}




// Load all markers when the page loads
loadMarkers();
