# schema-mock-data-factory

A lightweight, beginner-friendly mock data generator based on custom schemas. Generate realistic test data, fixtures, or database seeders without needing an internet connection, database, or external API.

---

## Features

- **Zero External Dependencies**: Built with 100% pure Node.js.
- **Intuitive Schema System**: Define data using simple strings or constraint objects.
- **Rich Data Types**: Strings, numbers, booleans, names, emails, Indian phone numbers, cities, and custom lists.
- **Constraints & Ranges**: Configure min/max for numbers and lengths for arrays.
- **Nested Objects & Arrays**: Generate hierarchical and relational mock structures.
- **Optional Fields**: Support realistic payloads where fields are conditionally omitted.
- **Custom Functions**: Provide your own logic for generating IDs, timestamps, or tokens.
- **Clear Error Messages**: Fast, friendly error reporting if a schema is misconfigured.

---

## Installation

Install using npm:

```bash
npm install schema-mock-data-factory
```

*(Or for local development: `npm link`)*

---

## Quick Start

```javascript
const { generateData, generateOne } = require("schema-mock-data-factory");

// 1. Define your schema
const userSchema = {
    name: "name",
    email: "email",
    age: {
        type: "number",
        min: 18,
        max: 35
    },
    city: "city",
    isActive: "boolean"
};

// 2. Generate a single record
const singleUser = generateOne(userSchema);
console.log(singleUser);

// 3. Generate a batch of 5 records
const users = generateData(userSchema, 5);
console.log(users);
```

### Sample Output

```json
[
  {
    "name": "Aarav Sharma",
    "email": "aarav.patel102@example.com",
    "age": 27,
    "city": "Pune",
    "isActive": true
  },
  {
    "name": "Riya Patel",
    "email": "riya.verma340@testmail.com",
    "age": 22,
    "city": "Mumbai",
    "isActive": false
  }
]
```

---

## Supported Data Types

You can use string shorthands (e.g., `"email"`) or full configuration objects (e.g., `{ type: "email" }`).

| Type | Description | Example Output |
| :--- | :--- | :--- |
| `"string"` | Generates readable words | `"Lorem ipsum"` |
| `"firstName"` | Random first name | `"Aarav"` |
| `"lastName"` | Random last name | `"Sharma"` |
| `"name"` | Full name (first + last) | `"Aarav Sharma"` |
| `"email"` | Mock email address | `"aarav.sharma42@example.com"` |
| `"phone"` | 10-digit mobile number | `"9876543210"` |
| `"city"` | Major Indian city | `"Pune"` |
| `"number"` | Random integer (default 1 to 100) | `42` |
| `"boolean"` | Random true or false | `true` |
| `"pick"` | Selects an item from a provided array | `"admin"` |
| `"array"` | Array of mock items | `["React", "Node.js"]` |
| `"custom"` | Executes a custom generator function | `"USR-1042"` |

---

## Schema Guides & Examples

### 1. Custom Number Constraints (`min` / `max`)

Define lower and upper bounds for numerical fields:

```javascript
const schema = {
    age: {
        type: "number",
        min: 18,
        max: 60
    },
    salary: {
        type: "number",
        min: 30000,
        max: 120000
    }
};
```

### 2. Custom Values (`pick`)

Pick a random value strictly from an array of choices:

```javascript
const schema = {
    role: {
        type: "pick",
        values: ["admin", "editor", "viewer"]
    },
    status: {
        type: "pick",
        values: ["active", "pending", "suspended"]
    }
};
```

### 3. Nested Objects

Nest objects directly without any complex syntax:

```javascript
const schema = {
    name: "name",
    email: "email",
    address: {
        city: "city",
        pincode: {
            type: "number",
            min: 110001,
            max: 560100
        }
    }
};
```

Output:
```json
{
  "name": "Priya Singh",
  "email": "priya.singh219@example.com",
  "address": {
    "city": "Bengaluru",
    "pincode": 412030
  }
}
```

### 4. Arrays

Generate arrays of basic types, custom picks, or nested objects:

```javascript
const schema = {
    name: "name",
    skills: {
        type: "array",
        items: "pick",
        values: ["JavaScript", "React", "Node.js", "Express", "Prisma"],
        minLength: 2,
        maxLength: 4
    }
};
```

You can also generate arrays of nested objects:

```javascript
const schema = {
    teamName: "string",
    members: {
        type: "array",
        items: {
            id: { type: "number", min: 1, max: 999 },
            name: "name"
        },
        minLength: 1,
        maxLength: 3
    }
};
```

### 5. Optional Fields

Add `optional: true` to any field configuration. The field will have a 50% chance of being included in the generated record:

```javascript
const schema = {
    name: "name",
    phone: {
        type: "phone",
        optional: true
    }
};
```

### 6. Custom Generator Functions

Provide custom logic (such as UUIDs, formatted IDs, or computed values):

```javascript
const schema = {
    orderId: {
        type: "custom",
        generate: function () {
            return "ORD-" + Date.now().toString().slice(-6);
        }
    }
};
```

---

## API Reference

### `generateOne(schema)`

Generates a single object based on the schema.

- **Parameters:**
  - `schema` (`Object`): A schema defining field types and constraints.
- **Returns:**
  - `Object`: The generated record.

### `generateData(schema, count)`

Generates multiple records based on the schema.

- **Parameters:**
  - `schema` (`Object`): A schema defining field types and constraints.
  - `count` (`number`): The number of records to generate (default: 1).
- **Returns:**
  - `Array<Object>`: An array containing the generated records.

---

## Error Handling

`schema-mock-data-factory` validates inputs upfront and throws clear, informative error messages:

- **Missing/invalid schema:** `Schema must be a valid non-empty object.`
- **Negative count:** `The 'count' parameter cannot be negative.`
- **Unsupported type:** `Unsupported field type: 'unknownType'.`
- **Invalid min/max:** `Minimum value (50) cannot be greater than maximum value (10).`
- **Invalid array bounds:** `Array 'minLength' (5) cannot be greater than 'maxLength' (2).`
- **Empty pick:** `The 'pick' type requires a non-empty 'values' array.`

---

## Testing

The package uses Node.js's built-in `node:test` runner. To execute tests:

```bash
npm test
```

To run the interactive example script:

```bash
npm run example
```

---

## Publishing to npm

1. Log in to your npm account in the terminal:
   ```bash
   npm login
   ```
2. Check the package name in `package.json` to ensure uniqueness.
3. Publish:
   ```bash
   npm publish
   ```

---

## License

MIT © 2026 Schema Mock Data Factory Contributors
