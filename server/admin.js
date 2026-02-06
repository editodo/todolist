const AdminJS = require('adminjs');
const AdminJSExpress = require('@adminjs/express');
const Adapter = require('@adminjs/mysql2');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

// Register the adapter
AdminJS.registerAdapter(Adapter);

const setupAdmin = async (app) => {
    // Create a connection for AdminJS
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME || 'editodo',
        port: process.env.DB_PORT || 3306,
    });

    const adminOptions = {
        databases: [connection],
        rootPath: '/admin',
        branding: {
            companyName: 'Editodo Admin',
            logo: false, // Use text only for now
        },
        resources: [
            // Optional: Customize resources here if needed
            // { resource: 'notices', options: { ... } }
        ],
    };

    const admin = new AdminJS(adminOptions);

    // Build authenticated router
    const router = AdminJSExpress.buildAuthenticatedRouter(admin, {
        authenticate: async (email, password) => {
            const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@editodo.com';
            const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'editodo1234';

            if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
                return Promise.resolve({ email: email, role: 'admin' });
            }
            return null;
        },
        cookieName: 'adminjs',
        cookiePassword: 'super-secret-password-change-in-production',
    }, null, {
        resave: false,
        saveUninitialized: true
    });

    app.use(admin.options.rootPath, router);
    console.log(`🛡️ AdminJS started on http://localhost:${process.env.PORT || 8080}${admin.options.rootPath}`);
};

module.exports = setupAdmin;
