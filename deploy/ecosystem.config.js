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
                DB_HOST: '222.239.250.229', //'127.0.0.1', // Use IP to force TCP connection
                DB_USER: 'editodo',
                DB_PASSWORD: 'dbEdit0d0!@',
                DB_NAME: 'editodo'
            }
        }
    ]
};
