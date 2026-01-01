const mongoose = require("mongoose");

const MandalSchema = new mongoose.Schema({
    mandalId: { type: Number, required: true },
    name: { type: String, required: true },
});

const LocationSchema = new mongoose.Schema(
    {
        districtId: { type: Number, required: true, unique: true },
        name: { type: String, required: true },
        mandals: [MandalSchema],
    },
    { timestamps: true }
);

const Location = mongoose.model("Location", LocationSchema);
module.exports = { Location };
