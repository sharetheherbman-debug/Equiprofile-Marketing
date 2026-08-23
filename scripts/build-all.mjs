import { spawnSync } from "node:child_process";

const npmCli = process.env.npm_execpath;
if (!npmCli) {
  throw new Error(
    "npm_execpath is required to run the production build steps.",
  );
}
const buildSteps = [
  "build:sw",
  "build:management",
  "build:academy",
  "build:shop",
  "build:server",
  "build:fingerprint",
];

const env = {
  ...process.env,
  NODE_OPTIONS: [process.env.NODE_OPTIONS, "--max_old_space_size=2048"]
    .filter(Boolean)
    .join(" "),
};

for (const step of buildSteps) {
  const result = spawnSync(process.execPath, [npmCli, "run", step], {
    env,
    stdio: "inherit",
    shell: false,
  });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}
