const path = require("node:path");
module.exports = {
  apps: [
    {
      name: "trazo",
      cwd: __dirname,
      script: "src/app.js",
      interpreter: process.execPath,
      exec_mode: "fork",
      instances: 1,
      watch: false,
      autorestart: true,
      min_uptime: "10s",
      max_restarts: 10,
      restart_delay: 3000,
      kill_timeout: 10000,
      shutdown_with_message: true,
      time: true,
      out_file: path.join(__dirname, "logs", "pm2-out.log"),
      error_file: path.join(__dirname, "logs", "pm2-error.log"),
      env: {
        NODE_ENV: "production",
        PORT: process.env.PORT || "5173",
      },
    },
  ],
};
