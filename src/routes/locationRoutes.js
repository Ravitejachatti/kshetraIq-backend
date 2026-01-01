const express = require("express");
const router = express.Router();
const { getLocations, getMandals, searchLocations } = require("../controllers/locationController");

router.get("/", getLocations);
router.get("/:districtId/mandals", getMandals);
router.get("/search", searchLocations);

module.exports = router;
