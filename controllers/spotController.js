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
exports.BorrowSpot = async (request, response) => {
    const spotID = request.query.id;

    try {
        const spot = await Marker.findOneAndUpdate(
            { _id: spotID },
            { borrowedBy: true },
            { new: true }
        );
        if (!spot) {
            return response.status(404).json({ message: 'Spot not found' });
        }
        response.status(201).json({message:"Spot borrowed successfully",spot});
    } catch (error) {
        console.error('Error updating marker:', error);
        response.status(500).json({ message: 'Error updating marker', error });
    }
};
