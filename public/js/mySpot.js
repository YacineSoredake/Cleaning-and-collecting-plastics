const userId = localStorage.getItem('userid');

// Function to get spots from the API and display them
const fetchSpots = async () => {
    try {
        const response = await fetch(`/myspots?id=${userId}`, {
            method: 'GET',
        });

        if (!response.ok) {
            const errorMessage = await response.json();
            console.error('Error:', errorMessage.message);
            document.getElementById('loading').innerHTML="Failed to load spots."
            return;
        }

        const spots = await response.json();

        // Display the spots on the page
        const spotContainer = document.getElementById('spot-content');
        spotContainer.innerHTML = ''; // Clear previous content

        spots.forEach((spot) => {
            // Extract latitude and longitude from `coordinates`
            const [latitude, longitude] = spot.coordinates.coordinates;

            // Create a container for the spot
            const spotCard = document.createElement('div');
            spotCard.classList.add(
                'spot-card',
                'bg-white',
                'rounded-lg',
                'shadow-md',
                'p-4',
                'flex',
                'flex-col',
                'gap-4',
                'transition-all',
                'hover:scale-105',
                'hover:shadow-xl',
                'border',
                'border-transparent',
                'hover:border-green-500'
            );

            // Create Spot Details Section (Compact and minimal)
            const spotDetails = document.createElement('div');
            spotDetails.classList.add('spot-details', 'text-sm', 'text-gray-700', 'space-y-2');

            // Dynamically generate each spot information line
            const details = [
                { label: 'Quantity', value: spot.quantity || 'N/A' },
                { label: 'Price', value: `${spot.price || 'N/A'} DZ` },
                { label: 'Status', value: spot.status || 'N/A' },
                { label: 'Borrowed', value: spot.borrowedBy ? 'Yes' : 'No' }
            ];

            details.forEach(detail => {
                const detailDiv = document.createElement('div');
                detailDiv.classList.add('flex', 'justify-between');
                detailDiv.innerHTML = `
                    <span class="text-green-600 font-medium">${detail.label}:</span>
                    <span>${detail.value}</span>
                `;
                spotDetails.appendChild(detailDiv);
            });

            // Spot Image Section (Minimal, clean, and adaptive)
            const spotImage = document.createElement('img');
            spotImage.src = spot.imageUrl || '../assets/default-image.jpg'; // Use default if not provided
            spotImage.alt = `Spot Image ${spot._id}`;
            spotImage.classList.add('w-full', 'h-48', 'object-cover', 'rounded-lg', 'shadow-sm');

            // Spot Map Section (Simple map layout)
            const mapContainer = document.createElement('div');
            mapContainer.classList.add('w-full', 'h-40', 'rounded-lg', 'shadow-sm', 'mt-2');
            mapContainer.id = `map-${spot._id}`; // Unique ID for each map

            // Append elements to the card
            spotCard.appendChild(spotImage);
            spotCard.appendChild(spotDetails);
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
