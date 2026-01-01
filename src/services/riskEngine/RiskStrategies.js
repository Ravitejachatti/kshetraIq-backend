/**
 * Risk Strategy Registry
 *
 * This registry maps dynamic `strategyKey`s (from the Database) to executable Strategy Modules.
 * This allows the Risk Service to be generic: it simply asks "Do you have a strategy for 'RICE_BLAST_V2'?"
 * and executes it, regardless of the underlying logic (Weather-only, Hybrid, or AI-based).
 */

const riceBlastV2 = require("./strategies/riceBlastV2");
// Import other strategies here as they are migrated...
// const chilliAnthracnoseV1 = require("./strategies/chilliAnthracnoseV1");

const STRATEGIES = {
    // Rice
    "RICE_BLAST_V2": riceBlastV2,

    // Placeholder for future migrations
    // "CHILLI_ANTHRACNOSE_V1": chilliAnthracnoseV1,
};

/**
 * Retrieves a strategy by key.
 * @param {string} key - The strategyKey from the Crop/Disease model.
 * @returns {Object|null} - The strategy module or null if not found.
 */
const getStrategy = (key) => {
    return STRATEGIES[key] || null;
};

module.exports = {
    getStrategy,
};
