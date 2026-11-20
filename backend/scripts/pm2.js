const path = require("node:path");

const { spawnSync } = require("node:child_process");
const backend = path.resolve(__dirname, "..");
const action = process.argv[2];
if (!["start", "restart", "stop", "logs"].includes(action))
  throw Error("Acción de PM2 no válida.");
const args =
  action === "start"
    ? [
        "startOrRestart",
        path.join(backend, "ecosystem.config.cjs"),
        "--only",
        "trazo",
      ]
    : [action, "trazo"];
const result = spawnSync(
  process.execPath,
  [path.join(backend, "node_modules", "pm2", "bin", "pm2"), ...args],
  {
    cwd: backend,
    env: {
      ...process.env,
      PM2_HOME: path.resolve(backend, "..", ".pm2-local"),
    },
    stdio: "inherit",
    windowsHide: true,
  },
);
if (result.error) throw result.error;
process.exitCode = result.status ?? 1;
