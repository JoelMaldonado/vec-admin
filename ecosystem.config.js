module.exports = {
  apps: [
    {
      name: 'vec-admin',
      script: 'node_modules/.bin/next',
      args: 'start',
      cwd: '/var/www/vec-admin',
      instances: 1,
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: 'production',
        PORT: 3009,
      },
    },
  ],
}
