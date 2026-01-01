const { Location } = require("../models/Location");

/**
 * @desc    Get all districts (and optionally mandals)
 * @route   GET /api/locations
 * @access  Public
 */
const getLocations = async (req, res) => {
    try {
        const locations = await Location.find({}).sort({ name: 1 });
        res.json(locations);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

/**
 * @desc    Get mandals by district ID
 * @route   GET /api/locations/:districtId/mandals
 * @access  Public
 */
const getMandals = async (req, res) => {
    try {
        const { districtId } = req.params;
        const district = await Location.findOne({ districtId: Number(districtId) });

        if (!district) {
            return res.status(404).json({ message: "District not found" });
        }

        res.json(district.mandals);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

/**
 * @desc   Search Locations/Mandals (Utility)
 * @route  GET /api/locations/search
 */
const searchLocations = async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) return res.json([]);

        // Find districts matching
        const districts = await Location.find({ name: { $regex: q, $options: "i" } });

        // Find mandals matching (this is a bit heavier, optimizing for simple implementation)
        const mandalMatches = await Location.find({ "mandals.name": { $regex: q, $options: "i" } });

        // Combine results logic could go here, but for now just returning districts
        res.json(districts);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}

module.exports = { getLocations, getMandals, searchLocations };
