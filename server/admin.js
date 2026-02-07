const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

const setupAdmin = async (app) => {
    // Dynamic Import for ESM modules
    const { default: AdminJS } = await import('adminjs');
    const AdminJSExpress = await import('@adminjs/express');
    const { Database, Resource } = await import('@adminjs/sql');

    // Import Knex dynamically or require it if likely CJS (Knex is usually CJS compatible, but let's dynamic import to be safe or just require if permitted. Standard require is safer for Knex usually)
    const { default: knex } = await import('knex');

    // Register the adapter
    if (!AdminJS.UserComponents) {
        AdminJS.registerAdapter({ Database, Resource });
    }

    // Create a connection for AdminJS using Knex
    const db = knex({
        client: 'mysql2',
        connection: {
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME || 'editodo',
            port: process.env.DB_PORT || 3306,
        }
    });

    const adminOptions = {
        databases: [db],
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
