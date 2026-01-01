const fs = require('fs');
const path = require('path');
require("dotenv").config({ path: "../../.env" });
const mongoose = require("mongoose");
const { Location } = require("../models/Location");

const connectDB = async () => {
    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/agri-guard");
        console.log("MongoDB Connected");
    }
};

const seedLocations = async () => {
    await connectDB();
    console.log("📍 Seeding Locations...");

    try {
        const dataPath = path.resolve(__dirname, "../../../Documents/location_data/location.json");
        if (!fs.existsSync(dataPath)) {
            console.error(`❌ Data file not found at: ${dataPath}`);
            process.exit(1);
        }

        const rawData = fs.readFileSync(dataPath, 'utf-8');
        const LOCATION_DATA = JSON.parse(rawData);

        for (const loc of LOCATION_DATA) {
            await Location.findOneAndUpdate(
                { districtId: loc.districtId },
                loc,
                { upsert: true, new: true, setDefaultsOnInsert: true }
            );
            console.log(`✅ Seeded District: ${loc.name}`);
        }

        console.log("🏁 Location Seeding Complete.");
        process.exit(0);
    } catch (error) {
        console.error("❌ Error seeding locations:", error);
        process.exit(1);
    }
};

if (require.main === module) {
    seedLocations().catch((err) => {
        console.error(err);
        process.exit(1);
    });
}

module.exports = { seedLocations };
