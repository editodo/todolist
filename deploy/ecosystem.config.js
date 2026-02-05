module.exports = {
    apps: [
        {
            name: 'editodo-server',
            script: './server/index.js',  // Path to backend entry point
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
                PORT: 8080,
                DB_HOST: 'localhost', // Or the internal IP if DB is separate
                DB_USER: 'editodo',
                DB_PASS: 'dbEdit0d0!@',
                DB_NAME: 'editodo'
            }
        }
    ]
};
