function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomElement(array) {
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
}

function getRandomBoolean() {
    return Math.random() >= 0.5;
}

function getRandomPhone() {
    const startingDigits = [6, 7, 8, 9];
    const firstDigit = getRandomElement(startingDigits);
    let remainingDigits = "";

    for (let i = 0; i < 9; i++) {
        remainingDigits += getRandomInt(0, 9);
    }

    return String(firstDigit) + remainingDigits;
}

function isPlainObject(value) {
    return (
        value !== null &&
        typeof value === "object" &&
        !Array.isArray(value)
    );
}

module.exports = {
    getRandomInt,
    getRandomElement,
    getRandomBoolean,
    getRandomPhone,
    isPlainObject
};
