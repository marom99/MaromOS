import { createServer } from "node:http";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = dirname(fileURLToPath(import.meta.url));

function loadEnvFile(filepath: string) {
  try {
    for (const line of readFileSync(filepath, "utf-8").split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      if (!process.env[key]) {
        process.env[key] = trimmed.slice(eq + 1).trim();
      }
    }
  } catch {
    /* file missing, ignore */
  }
}

loadEnvFile(join(rootDir, ".env.local"));
loadEnvFile(join(rootDir, ".env"));

const PORT = Number(process.env.API_PORT) || 3000;

const routeCache = new Map<string, any>();

const server = createServer(async (req, res) => {
  const url = new URL(req.url!, `http://${req.headers.host || "localhost"}`);

  if (!url.pathname.startsWith("/api/")) {
    res.writeHead(404);
    res.end();
    return;
  }

  const route = url.pathname.slice("/api/".length);

  const enriched = res as typeof res & {
    status(code: number): typeof enriched;
    json(body: any): typeof enriched;
    send(body: any): typeof enriched;
    redirect(statusOrUrl: string | number, url?: string): typeof enriched;
  };

  if (!enriched.status) {
    enriched.status = function (code: number) {
      res.statusCode = code;
      return enriched;
    };
    enriched.json = function (body: any) {
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify(body));
      return enriched;
    };
    enriched.send = function (body: any) {
      if (typeof body === "string" || Buffer.isBuffer(body)) {
        res.end(body);
      } else {
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(body));
      }
      return enriched;
    };
    enriched.redirect = function (statusOrUrl: string | number, url?: string) {
      const code = typeof statusOrUrl === "number" ? statusOrUrl : 302;
      const location = url ?? (statusOrUrl as string);
      res.writeHead(code, { Location: location });
      res.end();
      return enriched;
    };
  }

  try {
    const modulePath = join(rootDir, "api", `${route}.ts`);
    let mod = routeCache.get(modulePath);
    if (!mod) {
      mod = await import(modulePath);
      routeCache.set(modulePath, mod);
    }

    const handler = mod.default;
    if (typeof handler !== "function") {
      res.writeHead(404);
      res.end();
      return;
    }

    await handler(req, enriched);

    if (!res.writableEnded) {
      res.writeHead(504);
      res.end();
    }
  } catch (err: any) {
    if (err.code === "ERR_MODULE_NOT_FOUND" || err.message?.includes("Cannot find module")) {
      res.writeHead(404);
      res.end();
    } else {
      console.error("[api]", err);
      res.writeHead(500);
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ error: "Internal server error" }));
    }
  }
});

server.listen(PORT, () => {
  console.log(`API server listening on http://localhost:${PORT}`);
});
