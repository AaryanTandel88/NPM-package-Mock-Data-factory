const { generateValue } = require("./generateValue");
const { getRandomBoolean, isPlainObject } = require("./helpers");


function validateSchema(schema) {
    if (!schema || !isPlainObject(schema)) {
        throw new Error("Schema must be a valid non-empty object.");
    }

    const keys = Object.keys(schema);
    if (keys.length === 0) {
        throw new Error("Schema cannot be empty. It must contain at least one field.");
    }
}

/**
 * @param {object} schema - The schema describing the fields and types
 * @returns {object} The generated record
 */
function generateRecord(schema) {
    validateSchema(schema);

    const record = {};
    const keys = Object.keys(schema);

    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const fieldConfig = schema[key];


        if (isPlainObject(fieldConfig) && fieldConfig.optional === true) {
            const shouldInclude = getRandomBoolean();
            if (!shouldInclude) {
                continue; // Skip this field so it does not appear in the record
            }
        }

        record[key] = generateValue(fieldConfig, generateRecord);
    }

    return record;
}

/**
 * @param {object} schema - The schema definition
 * @returns {object} A single mock record
 */
function generateOne(schema) {
    return generateRecord(schema);
}

/**
 * @param {object} schema - The schema definition
 * @param {number} count - Number of records to generate (default: 1)
 * @returns {Array<object>} Array of mock records
 */
function generateData(schema, count = 1) {
    if (typeof count !== "number" || isNaN(count)) {
        throw new Error("The 'count' parameter must be a valid number.");
    }

    if (count < 0) {
        throw new Error("The 'count' parameter cannot be negative.");
    }

    const totalRecords = Math.floor(count);
    const records = [];

    for (let i = 0; i < totalRecords; i++) {
        records.push(generateRecord(schema));
    }

    return records;
}

module.exports = {
    generateData,
    generateOne,
    generateRecord
};
