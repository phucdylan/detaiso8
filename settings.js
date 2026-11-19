
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const credentialSecret = process.env.NODE_RED_CREDENTIAL_SECRET;
const adminPasswordHash = process.env.NODE_RED_ADMIN_PASSWORD_HASH;
const mqttUsername = process.env.CLOUDAMQP_USERNAME;
const mqttPassword = process.env.CLOUDAMQP_PASSWORD;

if (!credentialSecret) {
    throw new Error("Missing NODE_RED_CREDENTIAL_SECRET");
}

if (!adminPasswordHash) {
    throw new Error("Missing NODE_RED_ADMIN_PASSWORD_HASH");
}

if (!mqttUsername || !mqttPassword) {
    throw new Error("Missing CLOUDAMQP_USERNAME or CLOUDAMQP_PASSWORD");
}

// Create encrypted MQTT credentials at every startup
const encryptionKey = crypto
    .createHash("sha256")
    .update(credentialSecret)
    .digest();

const initVector = crypto.randomBytes(16);

const cipher = crypto.createCipheriv(
    "aes-256-ctr",
    encryptionKey,
    initVector
);

const credentials = {
    "476c2ac9ccb44c46": {
        user: mqttUsername,
        password: mqttPassword
    }
};

const encryptedCredentials =
    initVector.toString("hex") +
    cipher.update(
        JSON.stringify(credentials),
        "utf8",
        "base64"
    ) +
    cipher.final("base64");

fs.writeFileSync(
    path.join(__dirname, "flows_cred.json"),
    JSON.stringify({ "$": encryptedCredentials }),
    { mode: 0o600 }
);

module.exports = {
    uiPort: process.env.PORT || 10000,
    uiHost: "0.0.0.0",

    credentialSecret: credentialSecret,

    adminAuth: {
        type: "credentials",
        users: [{
            username: process.env.NODE_RED_ADMIN_USER || "admin",
            password: adminPasswordHash,
            permissions: "*"
        }]
    },

    flowFile: process.env.FLOWS || "flows.json",

    functionGlobalContext: {},

    logging: {
        console: {
            level: "info",
            metrics: false,
            audit: false
        }
    },

    editorTheme: {
        projects: {
            enabled: false
        }
    }
};
