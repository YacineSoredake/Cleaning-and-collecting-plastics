const userId = localStorage.getItem('userid');

if (!userId) {
    alert("Please log in first.");
    window.location.href = './login.html'; // Redirect to login page
}

// Function to get spots from the API and display them
const fetchSpots = async () => {
    try {
        const response = await fetch(`/myspots?id=${userId}`, {
            method: 'GET',
        });

        if (!response.ok) {
            const errorMessage = await response.json();
            console.error('Error:', errorMessage.message);
            alert(errorMessage.message || 'Failed to load spots.');
            return;
        }

        const spots = await response.json();
        console.log(spots);

        // Display the spots on the page
        const spotContainer = document.getElementById('spot-content');
        spotContainer.innerHTML = ''; // Clear previous content

        spots.forEach((spot) => {
            // Extract latitude and longitude from `coordinates`
            const [latitude,longitude] = spot.coordinates.coordinates;

            // Create a container for the spot
            const spotCard = document.createElement('div');
            spotCard.classList.add(
                'p-4',
                'rounded-lg',
                'shadow-md',
                'bg-white',
                'mb-6',
                'flex',
                'flex-col',
                'lg:flex-row',
                'gap-6',
            );

        const spotDetails = document.createElement('div');
        spotDetails.classList.add('flex-1', 'space-y-4', 'text-gray-700'); // Added 'space-y-4' for vertical spacing
        spotDetails.innerHTML = `
            <h3 class="text-lg text-green-600 font-semibold">
                Quantity: <span class="text-gray-800">${spot.quantity || 'N/A'}</span>
            </h3>
            <h3 class="text-lg text-green-600 font-semibold">
                Price: <span class="text-gray-800">${spot.price || 'N/A'} DZ</span>
            </h3>
            <h3 class="text-lg text-green-600 font-semibold">
                Status: <span class="text-gray-800">${spot.status || 'N/A'}</span>
            </h3>
            <h3 class="text-lg text-green-600 font-semibold">
                Borrowed: <span class="text-gray-800">${spot.borrowedBy ? 'Yes' : 'No'}</span>
            </h3>
        `;

        

            // Spot Image Section
            const spotImage = document.createElement('img');
            spotImage.src = spot.imageUrl || '../assets/default-image.jpg'; // Use default if not provided
            spotImage.alt = `Spot Image ${spot._id}`;
            spotImage.classList.add('w-full', 'h-64', 'object-cover', 'rounded-lg', 'shadow-md');

            // Spot Map Section
            const mapContainer = document.createElement('div');
            mapContainer.classList.add('w-full', 'h-64', 'rounded-lg', 'shadow-md');
            mapContainer.id = `map-${spot._id}`; // Unique ID for each map

            // Append elements to the card
            spotCard.appendChild(spotDetails);
            spotCard.appendChild(spotImage);
            spotCard.appendChild(mapContainer);

            // Append the card to the container
            spotContainer.appendChild(spotCard);

            // Initialize a map for this spot
            const map = L.map(`map-${spot._id}`).setView([latitude, longitude], 15);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution:
                    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            }).addTo(map);

            L.marker([latitude, longitude])
                .addTo(map)
                .openPopup();
        });
    } catch (error) {
        console.error('Error fetching spots:', error);
    }
};

// Call fetchSpots to display the spots when the page loads
fetchSpots();
