const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');
const spotContainer = document.getElementById('spot-details');

// Wrap the code in an async function
async function fetchSpotDetails() {
    try {
        const response = await fetch(`/spot?id=${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });

        const data = await response.json();

        if (response.ok) {
            const {
                addedAt,
                addedBy,
                borrowedBy,
                coordinates,
                imageUrl,
                price,
                quantity,
                status,
                _id
            } = data;

            // Format the added date
            const addedDate = new Date(addedAt).toLocaleString();

            // Populate HTML with data
            spotContainer.innerHTML = `
                <div class="flex flex-col items-start justify-between">
                    <p><b>Added By:</b> ${addedBy}</p>
                    <p><b>Price:</b> ${price} DZ</p>
                    <p><b>Quantity:</b> ${quantity}</p>
                    <p><b>Status:</b> ${status}</p>
                    <p>${borrowedBy ? borrowedBy : 'Not borrowed'}</p>
                </div>
                <div class="my-4">
                    <img src="${imageUrl}" alt="Spot Image" class="w-full h-48 object-cover rounded-md">
                    <p><b>At:</b> ${addedDate}</p>
                </div>
            `;

            // Initialize the map using the coordinates
            initializeMap(coordinates.coordinates);
        } else {
            spotContainer.innerHTML = `<p class="text-red-500">Error: ${data.message}</p>`;
        }
    } catch (error) {
        console.error('Error fetching spot details:', error);
        spotContainer.innerHTML = `<p class="text-red-500">Error loading spot details.</p>`;
    }
}

// Function to initialize the map and set a marker
function initializeMap([latitude, longitude]) {
    const map = L.map('map').setView([latitude, longitude], 14);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Add a marker to the map
    L.marker([latitude, longitude]).addTo(map)
        .bindPopup(`<b>Spot Location</b>`)
        .openPopup();
}

// Call the async function
fetchSpotDetails();
