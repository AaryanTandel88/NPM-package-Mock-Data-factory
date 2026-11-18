// examples/example.js
// Quick demonstration of schema-mock-data-factory

const { generateData, generateOne } = require("../src/index");

console.log("=== 1. Generate Single Record (generateOne) ===");
const userSchema = {
    name: "name",
    email: "email",
    age: {
        type: "number",
        min: 18,
        max: 45
    },
    city: "city",
    role: {
        type: "pick",
        values: ["Developer", "Designer", "Product Manager", "DevOps"]
    },
    isActive: "boolean",
    phone: {
        type: "phone",
        optional: true
    }
};

const singleUser = generateOne(userSchema);
console.log(JSON.stringify(singleUser, null, 2));

console.log("\n=== 2. Generate Multiple Records with Nested Objects & Arrays (generateData) ===");
const complexSchema = {
    userId: {
        type: "custom",
        generate: function () {
            return "USR-" + Math.floor(1000 + Math.random() * 9000);
        }
    },
    name: "name",
    email: "email",
    address: {
        city: "city",
        pincode: {
            type: "number",
            min: 110001,
            max: 560100
        }
    },
    skills: {
        type: "array",
        items: "pick",
        values: ["JavaScript", "React", "Node.js", "Express", "Prisma", "SQL"],
        minLength: 2,
        maxLength: 4
    }
};

const userBatch = generateData(complexSchema, 3);
console.log(JSON.stringify(userBatch, null, 2));
