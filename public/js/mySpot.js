const userId = localStorage.getItem('userid');

if (!userId) {
    alert("Please log in first.");
    window.location.href = './login.html';  // Redirect to login page if user is not logged in
}

// Function to get spots from the API and display them
const fetchSpots = async () => {
    try {
        const response = await fetch(`/myspots?id=${userId}`, {
            method: 'GET'
        }); 
        const data = await response.json();
        
        console.log(data);

        
        // Display the spots on the page
        const spotContainer = document.getElementById('spot-content');
        spotContainer.innerHTML = '';  // Clear any existing content

        spots.forEach(spot => {
            // Create spot details section
            const spotDetails = document.createElement('div');
            spotDetails.classList.add('spot-item');
            spotDetails.innerHTML = `
                <h3 class="text-xl text-green-600 font-semibold">${spot.name}</h3>
                <p>${spot.description}</p>
            `;
            document.getElementById('spot-details').appendChild(spotDetails);

            // Set spot image
            const spotImage = document.getElementById('spot-image');
            spotImage.src = spot.image || 'default-image.jpg';  // Use a default image if not available

            // Initialize map with Leaflet.js for each spot
            const map = L.map('map').setView([spot.latitude, spot.longitude], 13);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);

            // Add a marker for the spot
            L.marker([spot.latitude, spot.longitude]).addTo(map)
                .bindPopup(`<b>${spot.name}</b><br>${spot.description}`)
                .openPopup();
        });

    } catch (error) {
        console.error('Error fetching spots:', error);
    }
};

// Call fetchSpots to display the spots when the page loads
fetchSpots();