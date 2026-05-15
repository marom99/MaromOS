import { spawn } from "node:child_process";

const children: ReturnType<typeof spawn>[] = [];

function cleanup() {
  for (const child of children) {
    child.kill("SIGTERM");
  }
  process.exit();
}

process.on("SIGINT", cleanup);
process.on("SIGTERM", cleanup);
process.on("exit", () => {
  for (const child of children) child.kill("SIGTERM");
});

const apiServer = spawn("bun", ["run", "dev:api"], { stdio: "inherit" });
children.push(apiServer);

apiServer.on("exit", (code) => {
  if (code !== null && code !== 0) {
    cleanup();
  }
});

process.stdout.write("\n");

const viteServer = spawn(
  "bun",
  [
    "run",
    "dev:vite",
  ],
  {
    stdio: "inherit",
    env: {
      ...process.env,
      STANDALONE_API_PROXY_TARGET: "http://localhost:3000",
    },
  },
);
children.push(viteServer);

viteServer.on("exit", (code) => {
  cleanup();
  process.exit(code ?? 0);
});
