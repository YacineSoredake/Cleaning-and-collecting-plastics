const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');
const spotContainer = document.getElementById('spot-details');
const spotImage = document.getElementById('spot-image');

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

            // Check if the spot is unborrowed and should show the "Collect" button
            const collectButtonHTML = borrowedBy
                ? ''
                : `<button id="collect-button" class="mt-4 px-4 py-2 bg-green-600 text-white font-bold rounded">Collect</button>`;

            // Additional advice or informational section
            const adviceSectionHTML = `
                <div class="mt-6 p-4 bg-gray-100 rounded-lg shadow-md">
                    <h3 class="text-xl font-semibold text-indigo-700">Helpful Tips</h3>
                    <p class="text-lg text-gray-700 mt-2">Remember to bring appropriate tools for collecting plastic waste, like gloves and bags. Please be respectful of the environment and only collect items that are safe to handle.</p>
                </div>
            `;

            // Success message container
            const successMessageHTML = `<div id="success-message" class="mt-4 text-green-600 font-semibold hidden"></div>`;

            // Populate HTML with data
            spotContainer.innerHTML = `
                <div class="space-y-2">
                    <h2 class="text-2xl text-red-600 font-bold underline">Spot Information :</h2>
                    <p class="text-lg"><span class="font-bold text-indigo-700 underline">Price:</span> ${price} DZ</p>
                    <p class="text-lg"><span class="font-bold text-indigo-700 underline">Quantity:</span> ${quantity}</p>
                    <p class="text-lg"><span class="font-bold text-indigo-700 underline">Status:</span> ${status}</p>
                    <p class="text-lg"><span class="font-bold text-indigo-700 underline">Borrowed By:</span> ${borrowedBy ? borrowedBy : 'Not borrowed'}</p>
                    <p class="text-lg"><span class="font-bold text-indigo-700 underline">Added Date:</span> ${addedDate}</p>
                    ${collectButtonHTML}
                    ${successMessageHTML}
                </div>
                ${adviceSectionHTML}
            `;

            // Set the image
            spotImage.src = imageUrl;

            // Initialize the map using the coordinates
            initializeMap(coordinates.coordinates);

            // Add event listener to the "Collect" button if it exists
            const collectButton = document.getElementById('collect-button');
            if (collectButton) {
                collectButton.addEventListener('click', async () => {
                    console.log('Collect button clicked');
                    const response = await fetch(`/spot?id=${id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                    });
                    const data = await response.json();
                    const successMessage = document.getElementById('success-message');
                    
                    if (response.ok) {
                        successMessage.textContent = 'Spot successfully borrowed!';
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
