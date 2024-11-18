const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');
const spotContainer = document.getElementById('spot-details');
const spotImage = document.getElementById('spot-image');
const userId = localStorage.getItem('userid');

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

            const addedDate = new Date(addedAt).toLocaleString();

            const collectButtonHTML = borrowedBy
                ? ''
                : `<button id="collect-button" class="mt-4 px-4 py-2 bg-green-600 text-white font-bold rounded">Collect</button>`;

            const successMessageHTML = `<div id="success-message" class="mt-4 text-green-600 font-semibold hidden"></div>`;

            spotContainer.innerHTML = `
                <div class="bg-gray-50 p-6 rounded-lg shadow-lg space-y-4">
                    <h3 class="text-xl font-bold text-indigo-700 border-b pb-2">Spot Details</h3>
                    <div class="grid grid-cols-2 gap-4">
                        <!-- Price -->
                        <div class="flex items-center">
                            <span class="font-bold text-gray-600 mr-2">Price:</span>
                            <span class="text-gray-800">${price} DZ</span>
                        </div>

                        <!-- Quantity -->
                        <div class="flex items-center">
                            <span class="font-bold text-gray-600 mr-2">Quantity:</span>
                            <span class="text-gray-800">${quantity}</span>
                        </div>

                        <!-- Status -->
                        <div class="flex items-center">
                            <span class="font-bold text-gray-600 mr-2">Status:</span>
                            <span class="text-gray-800">${status}</span>
                        </div>

                        <!-- Borrowed By -->
                        <div class="flex items-center">
                            <span class="font-bold text-gray-600 mr-2">Booking:</span>
                            <span class="text-gray-800">${borrowedBy ? 'Already Booked' : 'Not Booked'}</span>
                        </div>

                        <!-- Added Date -->
                        <div class="flex items-center col-span-2">
                            <span class="font-bold text-gray-600 mr-2">Added Date:</span>
                            <span class="text-gray-800">${addedDate}</span>
                        </div>
                    </div>

                    <!-- Collect Button -->
                    <div class="mt-4 flex justify-start">
                        ${collectButtonHTML}
                    </div>

                    <!-- Success Message -->
                    ${successMessageHTML}
                </div>
            `;

            spotImage.src = imageUrl;

           
            initializeMap(coordinates.coordinates);

           
            const collectButton = document.getElementById('collect-button');
            if (collectButton) {
                collectButton.addEventListener('click', async () => {
                    console.log('Collect button clicked');
                    const response = await fetch(`/spot?id=${id}`, {
                        method: 'PUT',
                        body:JSON.stringify({ userId}),
                        headers: {
                            'Content-Type': 'application/json'
                        },
                    });
                    const data = await response.json();
                    const successMessage = document.getElementById('success-message');
                    
                    if (response.ok) {
                        successMessage.textContent = 'Spot successfully Booked!';
                        successMessage.classList.remove('hidden');
                        collectButton.classList.add('hidden');
                    } else {
                        successMessage.textContent = `Error: ${data.message}`;
                        successMessage.classList.remove('hidden');
                        successMessage.classList.add('text-red-500');
                    }
                });
            }
        } else {
            spotContainer.innerHTML = `<p class="text-red-500">Error: ${data.message}</p>`;
        }
    } catch (error) {
        console.error('Error fetching spot details:', error);
        spotContainer.innerHTML = `<p class="text-red-500">Error loading spot details.</p>`;
    }
}

function initializeMap([latitude, longitude]) {
    const map = L.map('map').setView([latitude, longitude], 14);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    L.marker([latitude, longitude]).addTo(map)
        .bindPopup(`<b>Spot Location</b>`)
        .openPopup();
}

fetchSpotDetails();
