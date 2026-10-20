module.exports = {
    apps: [
        {
            name: 'editodo-server',
            script: './index.js',  // Path to backend entry point
            instances: 1,
            autorestart: true,
            watch: false,
            max_memory_restart: '1G',
            env: {
                NODE_ENV: 'development',
                PORT: 8080
            },
            env_production: {
                NODE_ENV: 'production',
                PORT: 8080
                // DB_*, JWT_SECRET, SESSION_SECRET, ADMIN_* live in server/.env (not committed)
            }
        }
    ]
};
