
const {
    firstNames,
    lastNames,
    cities,
    emailDomains,
    sampleWords
} = require("./data");

const {
    getRandomInt,
    getRandomElement,
    getRandomBoolean,
    getRandomPhone,
    isPlainObject
} = require("./helpers");

/**
 * @param {string|object} fieldConfig - The type string (e.g. "number") or config object
 * @param {Function} generateRecordRef - Reference to generateRecord for handling nested objects
 * @returns {*} The generated mock value
 */
function generateValue(fieldConfig, generateRecordRef) {
    if (typeof fieldConfig === "string") {
        return generateByType(fieldConfig, {});
    }

    if (!isPlainObject(fieldConfig)) {
        throw new Error("Field configuration must be a string or an object.");
    }

    if (fieldConfig.type === "custom") {
        if (typeof fieldConfig.generate !== "function") {
            throw new Error("The 'custom' type requires a valid 'generate' function.");
        }
        return fieldConfig.generate();
    }


    if (fieldConfig.type === "array") {
        return generateArray(fieldConfig, generateRecordRef);
    }

    if (!fieldConfig.type || fieldConfig.type === "object") {
        const nestedSchema = fieldConfig.schema || fieldConfig;
        if (typeof generateRecordRef === "function") {
            return generateRecordRef(nestedSchema);
        }
        throw new Error("Nested objects require a record generator reference.");
    }

    return generateByType(fieldConfig.type, fieldConfig);
}


function generateByType(type, options) {
    switch (type) {
        case "string": {
            const wordCount = options.words || 2;
            const words = [];
            for (let i = 0; i < wordCount; i++) {
                words.push(getRandomElement(sampleWords));
            }
            const combinedString = words.join(" ");
            return combinedString.charAt(0).toUpperCase() + combinedString.slice(1);
        }

        case "firstName": {
            return getRandomElement(firstNames);
        }

        case "lastName": {
            return getRandomElement(lastNames);
        }

        case "name": {
            return getRandomElement(firstNames) + " " + getRandomElement(lastNames);
        }

        case "city": {
            return getRandomElement(cities);
        }

        case "email": {
            const first = getRandomElement(firstNames).toLowerCase();
            const last = getRandomElement(lastNames).toLowerCase();
            const domain = getRandomElement(emailDomains);
            const randomNum = getRandomInt(1, 999);
            return `${first}.${last}${randomNum}@${domain}`;
        }

        case "phone": {
            return getRandomPhone();
        }

        case "boolean": {
            return getRandomBoolean();
        }

        case "number": {
            const min = options.min !== undefined ? options.min : 1;
            const max = options.max !== undefined ? options.max : 100;

            if (typeof min !== "number" || typeof max !== "number") {
                throw new Error("The 'number' constraints 'min' and 'max' must be valid numbers.");
            }

            if (min > max) {
                throw new Error(`Minimum value (${min}) cannot be greater than maximum value (${max}).`);
            }

            return getRandomInt(min, max);
        }

        case "pick": {
            if (!Array.isArray(options.values) || options.values.length === 0) {
                throw new Error("The 'pick' type requires a non-empty 'values' array.");
            }
            return getRandomElement(options.values);
        }

        default: {
            throw new Error(`Unsupported field type: '${type}'.`);
        }
    }
}

function generateArray(config, generateRecordRef) {
    if (!config.items) {
        throw new Error("The 'array' type requires an 'items' property specifying what each item should be.");
    }

    const minLength = config.minLength !== undefined ? config.minLength : 1;
    const maxLength = config.maxLength !== undefined ? config.maxLength : 5;

    if (typeof minLength !== "number" || typeof maxLength !== "number") {
        throw new Error("Array 'minLength' and 'maxLength' must be numbers.");
    }

    if (minLength < 0) {
        throw new Error("Array 'minLength' cannot be negative.");
    }

    if (minLength > maxLength) {
        throw new Error(`Array 'minLength' (${minLength}) cannot be greater than 'maxLength' (${maxLength}).`);
    }

    const arrayLength = getRandomInt(minLength, maxLength);
    const resultArray = [];


    let itemConfig = config.items;
    if (config.items === "pick" && config.values) {
        itemConfig = {
            type: "pick",
            values: config.values
        };
    }

    for (let i = 0; i < arrayLength; i++) {
        if (isPlainObject(itemConfig) && !itemConfig.type && typeof generateRecordRef === "function") {
            resultArray.push(generateRecordRef(itemConfig));
        } else {
            resultArray.push(generateValue(itemConfig, generateRecordRef));
        }
    }

    return resultArray;
}

module.exports = {
    generateValue,
    generateByType
};
