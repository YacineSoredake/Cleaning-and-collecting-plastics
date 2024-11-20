const userID = localStorage.getItem('userid');
const map = L.map('map').setView([51.505, -0.09], 13);

// Use high accuracy setting to improve initial position accuracy
map.locate({ setView: true, maxZoom: 13, watch: true, enableHighAccuracy: true });

// Define a variable to store the marker so it can be updated if needed
let userMarker;

// Listen for location found event
map.on('locationfound', (e) => {
    const { lat, lng } = e.latlng;

    // Set view to user's location after a slight delay to improve accuracy
    setTimeout(() => {
        map.setView([lat, lng], 13);

        // Add or update the marker at the user's location
        if (!userMarker) {
            userMarker = L.marker([lat, lng]).addTo(map)
                .bindPopup("You are here")
                .openPopup();
        } else {
            userMarker.setLatLng([lat, lng]); // Update marker position
        }
    }, 500); // Adjust delay if needed
});

// Handle location error
map.on('locationerror', () => {
    console.error("Unable to retrieve your location");
});


L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

let markerCoordinates;

// Show form when the map is clicked
map.on('click', function(e) {
    markerCoordinates = [e.latlng.lat, e.latlng.lng];
    document.getElementById("overlay").style.display = "flex";
});

// Function to save the marker to the database
async function saveMarker() {
    const quantity = document.getElementById('quantity').value;
    const price = document.getElementById('price').value;
    const imageUrl = document.getElementById('imageUrl').files[0];
    
    const markerData = new FormData();
    markerData.append('imageUrl', imageUrl); 
    markerData.append('coordinates', JSON.stringify(markerCoordinates));
    markerData.append('quantity', quantity); 
    markerData.append('price', price); 
    markerData.append('userID', userID); 
    
    try {
        const response = await fetch('/addMarker', {
            method: 'POST',
            body: markerData
        });
        if (!response.ok) throw new Error("Failed to add marker");
        const data = await response.json();
        console.log('Marker added successfully:', data);
    } catch (error) {
        console.error('Error saving marker:', error);
    } finally {
        closeForm();
    }
}


// Function to close the form
function closeForm() {
    document.getElementById("overlay").style.display = "none";
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
    const {id, coordinates, quantity, price, borrowedBy, addedAt, status, imageUrl } = marker;
    
    // Reformat GeoJSON coordinates from [longitude, latitude] to [latitude, longitude]
    const leafletCoordinates = [coordinates[1], coordinates[0]];

    // Choose icon color based on borrowedBy
    const markerIcon = borrowedBy ? redIcon : greenIcon;

    // Create marker with the chosen icon
    const markerInstance = L.marker(leafletCoordinates, { icon: markerIcon }).addTo(map);
    
    markerInstance.bindPopup(`
        <div class="p-4 max-w-md rounded-lg shadow-lg bg-white text-gray-900 border border-gray-300">
            <!-- Flex Row for Image and Details -->
            <div class="flex items-start gap-4">
                <!-- Image Section -->
                <div class="w-40 h-24 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                    <img src="${imageUrl}" alt="Spot Image" class="w-full h-full object-cover">
                </div>
    
                <!-- Details Section -->
                <div class="flex flex-col flex-1 gap-1">
                    <div class="flex justify-between">
                        <span class="text-sm font-semibold text-gray-700">Quantity:</span>
                        <span class="text-sm">${quantity}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-sm font-semibold text-gray-700">Price:</span>
                        <span class="text-sm text-green-600 font-bold">${price} DZ</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-sm font-semibold text-gray-700">State:</span>
                        <span class="text-sm capitalize">${status}</span>
                    </div>
                </div>
            </div>
    
            <!-- Action Button -->
            <a href="./spot.html?id=${id}" 
               class="block mt-4 text-center text-sm font-medium text-white py-2 rounded-lg hover:bg-green-500 hover:text-white transition-all">
                View Details
            </a>
        </div>
    `);
    
    
}




// Load all markers when the page loads
loadMarkers();
