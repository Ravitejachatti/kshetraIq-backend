/**
 * RICE_BLAST_V2 Strategy
 * 
 * Logic:
 * Weather (Potential) + Crop Stage (Host) + History (Inoculum)
 */

const { clamp01, aggregateWeather } = require("../common");

const evaluate = ({ weatherWindow, cropStage, pestObservations = [] }) => {
    if (!weatherWindow || !weatherWindow.dates.length) {
        return { score: 0, level: "GREEN", explanation: "Insufficient weather data" };
    }

    const agg = aggregateWeather(weatherWindow);

    // 1. Weather Potential (The "Guess")
    const { tMin7, rhM7, sr7, lw7 } = agg;

    const tMinScore = clamp01((25 - tMin7) / 7);
    const rhScore = clamp01((rhM7 - 80) / 15);
    const lwScore = clamp01(lw7 / 10);

    const weatherRisk = (tMinScore * 1.2 + rhScore * 1.0 + lwScore * 0.7) / 2.9;

    // 2. Ground Truth Adjustments (The "Robustness")

    // A. Crop Stage Vulnerability
    // Tillering/Heading are most susceptible
    let stageMultiplier = 1.0;
    if (["tillering", "heading", "flowering"].includes(cropStage?.toLowerCase())) {
        stageMultiplier = 1.2;
    } else if (cropStage === "maturity") {
        stageMultiplier = 0.5; // Resistant at maturity
    }

    // B. Local Observations (Pest/Disease reports)
    // If recent manual reports exist, FORCE risk up
    let observationRisk = 0;
    const hasConfirmedReport = pestObservations.some(obs => obs.disease === "PADDY_BLAST" && obs.severity > 0);
    if (hasConfirmedReport) {
        observationRisk = 0.8; // High baseline if already seen
    }

    // Final Weighted Score
    // If Observation exists, it dominates. Otherwise, Weather * Stage.
    let finalRisk01 = 0;

    if (hasConfirmedReport) {
        finalRisk01 = Math.max(weatherRisk, observationRisk);
    } else {
        finalRisk01 = weatherRisk * stageMultiplier;
    }

    finalRisk01 = clamp01(finalRisk01);
    const score = Math.round(finalRisk01 * 100);

    // Classification
    let level = "GREEN";
    if (score >= 75) level = "RED";
    else if (score >= 50) level = "ORANGE";
    else if (score >= 30) level = "YELLOW";

    return {
        score,
        level,
        explanation: `Weather Risk: ${(weatherRisk * 100).toFixed(0)}% | Stage: ${cropStage} | Observed: ${hasConfirmedReport ? "YES" : "NO"}`,
        drivers: { tMinScore, rhScore, lwScore }
    };
};

module.exports = { evaluate };
