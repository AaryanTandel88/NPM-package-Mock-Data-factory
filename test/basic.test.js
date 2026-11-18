// test/basic.test.js
// Tests for schema-mock-data-factory using Node.js built-in node:test and node:assert

const test = require("node:test");
const assert = require("node:assert");
const { generateData, generateOne } = require("../src/index");

test("generateOne: generates basic string, number, and boolean fields", () => {
    const schema = {
        title: "string",
        age: "number",
        isActive: "boolean"
    };

    const result = generateOne(schema);

    assert.strictEqual(typeof result.title, "string");
    assert.strictEqual(typeof result.age, "number");
    assert.strictEqual(typeof result.isActive, "boolean");
    assert.ok(result.age >= 1 && result.age <= 100);
});

test("generateOne: generates email, phone, city, firstName, lastName, and name", () => {
    const schema = {
        email: "email",
        phone: "phone",
        city: "city",
        firstName: "firstName",
        lastName: "lastName",
        fullName: "name"
    };

    const result = generateOne(schema);

    assert.ok(result.email.includes("@"));
    assert.strictEqual(typeof result.phone, "string");
    assert.strictEqual(result.phone.length, 10);
    assert.strictEqual(typeof result.city, "string");
    assert.strictEqual(typeof result.firstName, "string");
    assert.strictEqual(typeof result.lastName, "string");
    assert.ok(result.fullName.includes(" "));
});

test("Custom constraints: number respects min and max values", () => {
    const schema = {
        score: {
            type: "number",
            min: 50,
            max: 60
        }
    };

    for (let i = 0; i < 20; i++) {
        const result = generateOne(schema);
        assert.ok(result.score >= 50 && result.score <= 60);
    }
});

test("Custom values: pick selects strictly from provided array", () => {
    const allowedRoles = ["admin", "editor", "viewer"];
    const schema = {
        role: {
            type: "pick",
            values: allowedRoles
        }
    };

    for (let i = 0; i < 20; i++) {
        const result = generateOne(schema);
        assert.ok(allowedRoles.includes(result.role));
    }
});

test("generateData: generates the exact count of records requested", () => {
    const schema = {
        id: "number",
        name: "name"
    };

    const count = 5;
    const results = generateData(schema, count);

    assert.strictEqual(Array.isArray(results), true);
    assert.strictEqual(results.length, 5);
    for (let i = 0; i < results.length; i++) {
        assert.strictEqual(typeof results[i].id, "number");
        assert.strictEqual(typeof results[i].name, "string");
    }
});

test("Nested objects: generates nested object structure", () => {
    const schema = {
        name: "name",
        address: {
            city: "city",
            pincode: {
                type: "number",
                min: 100000,
                max: 999999
            }
        }
    };

    const result = generateOne(schema);

    assert.strictEqual(typeof result.name, "string");
    assert.strictEqual(typeof result.address, "object");
    assert.notStrictEqual(result.address, null);
    assert.strictEqual(typeof result.address.city, "string");
    assert.ok(result.address.pincode >= 100000 && result.address.pincode <= 999999);
});

test("Arrays: generates array respecting minLength and maxLength", () => {
    const schema = {
        skills: {
            type: "array",
            items: "pick",
            values: ["JavaScript", "React", "Node.js"],
            minLength: 2,
            maxLength: 4
        }
    };

    const result = generateOne(schema);

    assert.strictEqual(Array.isArray(result.skills), true);
    assert.ok(result.skills.length >= 2 && result.skills.length <= 4);
    for (let i = 0; i < result.skills.length; i++) {
        assert.ok(["JavaScript", "React", "Node.js"].includes(result.skills[i]));
    }
});

test("Arrays: generates array of nested objects", () => {
    const schema = {
        team: {
            type: "array",
            items: {
                memberId: {
                    type: "number",
                    min: 1,
                    max: 50
                },
                role: "string"
            },
            minLength: 2,
            maxLength: 2
        }
    };

    const result = generateOne(schema);

    assert.strictEqual(result.team.length, 2);
    assert.strictEqual(typeof result.team[0].memberId, "number");
    assert.strictEqual(typeof result.team[0].role, "string");
});

test("Optional fields: field is sometimes included and sometimes omitted", () => {
    const schema = {
        requiredField: "string",
        optionalPhone: {
            type: "phone",
            optional: true
        }
    };

    let seenIncluded = false;
    let seenOmitted = false;

    // Run 50 iterations; statistically an optional field will appear and be omitted
    for (let i = 0; i < 50; i++) {
        const record = generateOne(schema);
        if (record.optionalPhone !== undefined) {
            seenIncluded = true;
        } else {
            seenOmitted = true;
        }
    }

    assert.ok(seenIncluded, "Optional field was never included");
    assert.ok(seenOmitted, "Optional field was never omitted");
});

test("Custom generator function: executes custom function correctly", () => {
    const schema = {
        customCode: {
            type: "custom",
            generate: function () {
                return "CODE-" + 999;
            }
        }
    };

    const result = generateOne(schema);
    assert.strictEqual(result.customCode, "CODE-999");
});

test("Error handling: throws clear errors for invalid inputs", () => {
    // 1. Invalid schema (null or not object)
    assert.throws(() => {
        generateOne(null);
    }, /Schema must be a valid non-empty object/);

    // 2. Empty schema
    assert.throws(() => {
        generateOne({});
    }, /Schema cannot be empty/);

    // 3. Negative count
    assert.throws(() => {
        generateData({ id: "number" }, -1);
    }, /cannot be negative/);

    // 4. Invalid count type
    assert.throws(() => {
        generateData({ id: "number" }, "invalid");
    }, /must be a valid number/);

    // 5. Unsupported type
    assert.throws(() => {
        generateOne({ test: "unsupportedType123" });
    }, /Unsupported field type: 'unsupportedType123'/);

    // 6. Number min > max
    assert.throws(() => {
        generateOne({
            age: { type: "number", min: 100, max: 10 }
        });
    }, /Minimum value \(100\) cannot be greater than maximum value \(10\)/);

    // 7. Pick with empty values
    assert.throws(() => {
        generateOne({
            role: { type: "pick", values: [] }
        });
    }, /requires a non-empty 'values' array/);

    // 8. Array with minLength > maxLength
    assert.throws(() => {
        generateOne({
            tags: { type: "array", items: "string", minLength: 10, maxLength: 2 }
        });
    }, /Array 'minLength' \(10\) cannot be greater than 'maxLength' \(2\)/);

    // 9. Custom type without valid generate function
    assert.throws(() => {
        generateOne({
            code: { type: "custom", generate: "notAFunction" }
        });
    }, /requires a valid 'generate' function/);
});
