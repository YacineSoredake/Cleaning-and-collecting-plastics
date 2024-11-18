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
    const {userId} = request.body;
    try {
        const spot = await Marker.findOneAndUpdate(
            { _id: spotID },
            { borrowedBy: userId },
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

exports.MySpots = async (request, response) => {
    const userId = request.query.id; 
    if (!userId) {
        return response.status(400).json({ message: 'User ID is required' });  
    }
    try {
        const spots = await Marker.find({ addedBy: userId });


        if (spots.length === 0) {
            return response.status(404).json({ message: 'No spots found for this user' }); 
        }

        response.status(200).json(spots);  
    } catch (error) {
        console.error('Error retrieving spots:', error);
        response.status(500).json({ message: 'Error retrieving spots', error: error.message });
    }
};

exports.bookedSpt = async (request, response) => {
    const userId = request.query.id; 
    if (!userId) {
        return response.status(400).json({ message: 'User ID is required' }); 
    }
    try {
        const spots = await Marker.find({ borrowedBy: userId });


        if (spots.length === 0) {
            return response.status(404).json({ message: 'No spots found for this user' }); 
        }

        response.status(200).json(spots); 
    } catch (error) {
        console.error('Error retrieving spots:', error);
        response.status(500).json({ message: 'Error retrieving spots', error: error.message });
    }
};
