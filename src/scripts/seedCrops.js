const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const { Crop } = require("../models/crop");
const { connectDB } = require("../config/db"); // Assuming you have a db config

const SEED_FILE = path.join(
    process.env.HOME,
    "Documents/Projects/Weather_farmer/Documents/location_data/crop.json"
);

const seedCrops = async () => {
    try {
        await connectDB();
        console.log("🌱 Connected to database for Crop seeding...");

        if (!fs.existsSync(SEED_FILE)) {
            console.error(`❌ Seed file not found at: ${SEED_FILE}`);
            process.exit(1);
        }

        const rawData = fs.readFileSync(SEED_FILE, "utf-8");
        const crops = JSON.parse(rawData);

        console.log(`📦 Found ${crops.length} crops to seed.`);

        for (const cropData of crops) {
            // Upsert based on crop value (unique identifier)
            await Crop.findOneAndUpdate(
                { value: cropData.value },
                cropData,
                { upsert: true, new: true, setDefaultsOnInsert: true }
            );
            console.log(`✅ Seeded/Updated: ${cropData.name}`);
        }

        console.log("🏁 Crop seeding completed successfully.");
        process.exit(0);
    } catch (error) {
        console.error("❌ Error seeding crops:", error);
        process.exit(1);
    }
};

seedCrops();
