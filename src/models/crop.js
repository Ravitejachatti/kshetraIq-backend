// models/crop.model.js
const mongoose = require("mongoose");
const {
  CROP_VALUES,
  DISEASE_VALUES,
  SEASONS,
} = require("../constants/crop.constants");

// Disease Schema
const DiseaseSchema = new mongoose.Schema(
  {
    diseaseId: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    value: {
      type: String,
      required: true,
      enum: Object.values(DISEASE_VALUES),
    },
    strategyKey: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    symptoms: {
      type: String,
      required: true,
    },
    seasonAffected: {
      type: [String],
      enum: Object.values(SEASONS),
      required: true,
    },
    prevalentDistricts: {
      type: [String],
      required: true,
    },
    naturalRemedies: {
      type: [String],
      required: true,
    },
    chemicalRemedies: {
      type: [String],
      required: true,
    },
    preventionMeasures: {
      type: [String],
      required: true,
    },
    yieldLoss: {
      type: String,
      required: true,
    },
  },
  { _id: false } // diseases embedded; no separate _id needed unless you want it
);

// Crop Schema
const CropSchema = new mongoose.Schema(
  {
    cropId: {
      type: Number,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    value: {
      type: String,
      required: true,
      unique: true,
      enum: Object.values(CROP_VALUES),
    },
    diseases: [DiseaseSchema],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Indexes
CropSchema.index({ cropId: 1 });
CropSchema.index({ value: 1 });
CropSchema.index({ "diseases.value": 1 });

const Crop = mongoose.model("Crop", CropSchema);

module.exports = {
  Crop,
  CropSchema,
  DiseaseSchema,
};
