
/**
 * settings.js – Node-RED 5.0.9
 * Đồ án 08: Giám sát nhiều trụ sạc xe điện qua MQTT
 *
 * - Đọc toàn bộ cấu hình từ Environment Variables
 * - Tạo flows_cred.json cho các MQTT broker config đang dùng
 * - Không ghi cứng mật khẩu vào source
 */

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

// -------------------------------------------------------
// Tạo flows_cred.json cho các broker config ID thực tế
// -------------------------------------------------------
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
    "broker_cloudamqp": {
        user: mqttUsername,
        password: mqttPassword
    },
    "476c2ac9ccb44c46": {
        user: mqttUsername,
        password: mqttPassword
    }
};

const encryptedCredentials =
    initVector.toString("hex") +
    cipher.update(JSON.stringify(credentials), "utf8", "base64") +
    cipher.final("base64");

const credPath = path.join(__dirname, "flows_cred.json");

fs.writeFileSync(
    credPath,
    JSON.stringify({ $: encryptedCredentials }),
    { mode: 0o600 }
);

// -------------------------------------------------------
// Cấu hình Node-RED
// -------------------------------------------------------
module.exports = {
    uiPort: process.env.PORT || 10000,
    uiHost: "0.0.0.0",

    // ---------------------------------------------------
    // CORS cho API Người dùng - Flow 4
    // ---------------------------------------------------
    httpNodeCors: {
        origin: "https://detaiso8-1.onrender.com",
        methods: "GET,HEAD,POST,OPTIONS",
        allowedHeaders: "Content-Type,Authorization",
        maxAge: 86400
    },

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

    functionGlobalContext: {
        // Có thể mở rộng sau nếu cần chia sẻ util
    },

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
    },

    // Tắt telemetry của Node-RED
    diagnostics: {
        enabled: false
    },

    runtimeState: {
        enabled: false
    }
};
