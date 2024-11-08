const Marker = require('../models/Marler');

// Route to save a new marker
exports.addMarker = async (req, res) => {
    const { coordinates, quantity, price, imageUrl, userID } = req.body;
    const status = "uncollected"; 
    const borrowedBy = false; 
    const addedAt = new Date(); 

    try {
        const marker = new Marker({
            coordinates: { type: 'Point', coordinates },
            quantity,
            price,
            status,
            addedBy: userID,
            borrowedBy,
            addedAt,
            imageUrl
        });
        
        await marker.save();
        res.status(201).json(marker);
    } catch (error) {
        res.status(500).json({ message: 'Error saving marker', error });
    }
};


// Route to get all markers
exports.markers = async (req, res) => {
    try {
        const markers = await Marker.find();
        // Convert GeoJSON coordinates to [latitude, longitude]
        const formattedMarkers = markers.map(marker => ({
            coordinates: [marker.coordinates.coordinates[1], marker.coordinates.coordinates[0]], // [latitude, longitude]
            details: marker.details,
            quantity: marker.quantity,
            price: marker.price,
            status:marker.status,
            addedBy: marker.addedBy,
            borrowedBy: marker.borrowedBy,
            addedAt: marker.addedAt,
            imageUrl: marker.imageUrl
        }));
        res.status(200).json(formattedMarkers);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching markers', error });
    }
};
