const Marker = require('../models/Marler');

exports.getSpot = async (request, response) => {
    const spotID = request.query.id;
    try {
        const spot = await Marker.findById(spotID).exec();
        response.status(201).json(spot);
    } catch (error) {
        console.error('Error retrieving marker:', error);
        response.status(500).json({ message: 'Error retrieving marker', error });
    }
};