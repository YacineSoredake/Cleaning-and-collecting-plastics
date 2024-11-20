const userId = localStorage.getItem('userid');
document.getElementById('response-msg').display="none"

function filterSpots() {
    const selectedStatus = document.getElementById('status-filter').value;  // Get selected status
    fetchSpots(selectedStatus); 
}

async function fetchSpots(status = '') {
    try {
        const userId = localStorage.getItem('userid');
        const url = `/booked?id=${userId}${status ? `&status=${status}` : ''}`;  // Build URL with status filter if selected
        
        console.log("Request URL:", url);  // Log URL to debug
        
        const response = await fetch(url, { method: 'GET' });

        if (!response.ok) {
            const errorMessage = await response.json();
            const loadingElement = document.getElementById('loading');
            loadingElement.innerHTML = errorMessage.message;
            console.error('Error:', errorMessage.message);
            return;
        }

        const spots = await response.json();
        console.log("Fetched spots:", spots);  // Log fetched spots

        populateSpots(spots);  // Populate the spots after clearing previous ones
    } catch (error) {
        console.error('Fetch error:', error);
    }
}


// Function to dynamically populate spots
function populateSpots(spots) {
    const spotContent = document.getElementById('spot-content');
    const loadingElement = document.getElementById('loading');

    // Clear previous spot content before adding new spots
    spotContent.innerHTML = '';  // This line clears the spot content

    // Clear loading text
    loadingElement.textContent = '';

    if (!spots.length) {
        spotContent.innerHTML = `<p class="text-center text-gray-500">No spots available.</p>`;
        return;
    }

    spots.forEach((spot) => {
        const { imageUrl, price, quantity, status, coordinates, addedAt, _id } = spot;

        // Create spot card HTML
        const spotCard = `
            <div class="spot-card">
                <div class="spot-image">
                    <img src="${imageUrl}" alt="Spot Image">
                </div>
                <div class="spot-details">
                    <div class="flex justify-between">
                        <span class="font-semibold">Quantity:</span>
                        <span>${quantity}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="font-semibold">Price:</span>
                        <span class="text-green-600 font-bold">${price} DZ</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="font-semibold">Status:</span>
                        <span class="capitalize">${status}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="font-semibold">Added On:</span>
                        <span>${new Date(addedAt).toLocaleDateString()}</span>
                    </div>
                </div>
                <div class="spot-actions flex justify-between mt-3 gap-3">
                    <button onclick="handleFinish('${_id}')" class="btn-finished bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition">Claimed</button>
                    <button onclick="handleCancel('${_id}')" class="btn-canceled bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition">Canceled</button>
                </div>
                <div class="spot-map"></div>
            </div>
        `;

        const div = document.createElement('div');
        div.innerHTML = spotCard.trim();
        spotContent.appendChild(div);

        if (coordinates && coordinates.coordinates) {
            const mapDiv = div.querySelector('.spot-map');
            const map = L.map(mapDiv, {
                center: coordinates.coordinates,
                zoom: 13,
                scrollWheelZoom: false,
            });
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            }).addTo(map);

            L.marker(coordinates.coordinates).addTo(map);
        }
    });
}


async function handleCancel(spotId) {
    try {
        const response = await fetch(`/cancel?id=${spotId}`, {
            method: 'PUT', 
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            const errorMessage = await response.json();
            console.error('Error:', errorMessage.message);
            
            return;
        }
        document.getElementById('response-msg').innerHTML="Spot successfully canceled."
        document.getElementById('response-msg').display="block"
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    } catch (error) {
        console.error('Error:', error);
        
    }
}

// Handle finish action
async function handleFinish(spotId) {
    try {
        const response = await fetch(`/claim?id=${spotId}`, {
            method: 'put',
        });

        if (!response.ok) {
            const errorMessage = await response.json();
            console.error('Error:', errorMessage.message);
           
            return;
        }
        document.getElementById('response-msg').innerHTML="Spot claimed."
        document.getElementById('response-msg').display="block"
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    } catch (error) {
        console.error('Error:', error);
       
    }
}

fetchSpots();
