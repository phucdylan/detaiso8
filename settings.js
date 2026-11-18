const credentialSecret = process.env.NODE_RED_CREDENTIAL_SECRET;

if (!credentialSecret) {
    throw new Error("Missing NODE_RED_CREDENTIAL_SECRET environment variable");
}

const adminPasswordHash = process.env.NODE_RED_ADMIN_PASSWORD_HASH;

if (!adminPasswordHash) {
    throw new Error("Missing NODE_RED_ADMIN_PASSWORD_HASH environment variable");
}

module.exports = {
    uiPort: process.env.PORT || 1880,
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
