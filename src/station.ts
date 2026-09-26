import fs from "node:fs";
import path from "node:path";
import http from "node:http";
import { URL } from "node:url";
import { readManifest, type BagManifest } from "./bag.js";

export interface RegistryPackage extends BagManifest {
  description?: string;
  publishedAt: string;
  files: Record<string, string>;
}

function safeName(name: string): string {
  if (!/^[a-z0-9][a-z0-9_-]*$/.test(name)) throw new Error("Invalid bag name.");
  return name;
}

function safeVersion(version: string): string {
  if (!/^[0-9A-Za-z][0-9A-Za-z._-]*$/.test(version)) throw new Error("Invalid bag version.");
  return version;
}

function readPackageFiles(root: string): Record<string, string> {
  const files: Record<string, string> = {};
  const walk = (dir: string, relative: string) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.name === ".git" || entry.name === "fart_modules") continue;
      const absolute = path.join(dir, entry.name);
      const rel = relative ? path.join(relative, entry.name) : entry.name;
      if (entry.isDirectory()) walk(absolute, rel);
      else files[rel.replaceAll(path.sep, "/")] = fs.readFileSync(absolute, "base64");
    }
  };
  walk(root, "");
  return files;
}

function packageFromDir(dir: string): RegistryPackage {
  const manifest = readManifest(dir);
  const pkg: RegistryPackage = {
    ...manifest,
    publishedAt: new Date().toISOString(),
    files: readPackageFiles(path.resolve(dir))
  };
  if (manifest.description !== undefined) pkg.description = manifest.description;
  return pkg;
}

function registryDir(root: string, name: string, version: string): string {
  return path.join(root, "packages", safeName(name), safeVersion(version));
}

function writeRegistryPackage(root: string, pkg: RegistryPackage): void {
  const dir = registryDir(root, pkg.name, pkg.version);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "package.json"), JSON.stringify(pkg, null, 2), "utf8");
}

function readRegistryPackages(root: string): RegistryPackage[] {
  const base = path.join(root, "packages");
  if (!fs.existsSync(base)) return [];
  const result: RegistryPackage[] = [];
  for (const name of fs.readdirSync(base, { withFileTypes: true })) {
    if (!name.isDirectory()) continue;
    for (const version of fs.readdirSync(path.join(base, name.name), { withFileTypes: true })) {
      if (!version.isDirectory()) continue;
      const file = path.join(base, name.name, version.name, "package.json");
      if (fs.existsSync(file)) result.push(JSON.parse(fs.readFileSync(file, "utf8")) as RegistryPackage);
    }
  }
  return result;
}

export async function publishBag(dir: string, registryUrl: string): Promise<RegistryPackage> {
  const pkg = packageFromDir(path.resolve(dir));
  const response = await fetch(new URL("/packages", registryUrl), {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(pkg)
  });
  if (!response.ok) throw new Error("Gas Station rejected the bag: HTTP " + response.status);
  return await response.json() as RegistryPackage;
}

export async function searchBags(registryUrl: string, query = ""): Promise<RegistryPackage[]> {
  const url = new URL("/packages", registryUrl);
  if (query) url.searchParams.set("q", query);
  const response = await fetch(url);
  if (!response.ok) throw new Error("Gas Station search failed: HTTP " + response.status);
  return await response.json() as RegistryPackage[];
}

export async function installRemoteBag(name: string, registryUrl: string, projectDir = process.cwd(), version?: string): Promise<RegistryPackage> {
  safeName(name);
  const url = new URL("/packages/" + encodeURIComponent(name), registryUrl);
  if (version) url.searchParams.set("version", version);
  const response = await fetch(url);
  if (!response.ok) throw new Error("Bag not found: " + name + (version ? "@" + version : ""));
  const pkg = await response.json() as RegistryPackage;
  const destination = path.join(path.resolve(projectDir), "fart_modules", pkg.name);
  if (path.resolve(projectDir) === path.resolve(destination)) throw new Error("Invalid install destination.");
  fs.mkdirSync(destination, { recursive: true });
  for (const [relative, encoded] of Object.entries(pkg.files)) {
    const target = path.resolve(destination, relative);
    if (!target.startsWith(path.resolve(destination) + path.sep)) throw new Error("Unsafe file path in package.");
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, Buffer.from(encoded, "base64"));
  }
  const manifest = readManifest(projectDir);
  manifest.dependencies ??= {};
  manifest.dependencies[pkg.name] = "^" + pkg.version;
  fs.writeFileSync(path.join(path.resolve(projectDir), "fart.json"), JSON.stringify(manifest, null, 2) + "\n", "utf8");
  return pkg;
}

function sendJson(response: http.ServerResponse, status: number, value: unknown): void {
  const body = JSON.stringify(value);
  response.writeHead(status, { "content-type": "application/json; charset=utf-8" });
  response.end(body);
}

export function startStation(port = 4873, dataDir = path.join(process.cwd(), ".gas-station")): http.Server {
  fs.mkdirSync(dataDir, { recursive: true });
  const server = http.createServer(async (request, response) => {
    try {
      const url = new URL(request.url ?? "/", "http://localhost");
      if (request.method === "GET" && url.pathname === "/packages") {
        const q = (url.searchParams.get("q") ?? "").toLowerCase();
        const packages = readRegistryPackages(dataDir);
        sendJson(response, 200, q ? packages.filter(pkg => pkg.name.includes(q) || (pkg.description ?? "").toLowerCase().includes(q)) : packages);
        return;
      }
      if (request.method === "GET" && url.pathname.startsWith("/packages/")) {
        const name = decodeURIComponent(url.pathname.slice("/packages/".length));
        const packages = readRegistryPackages(dataDir).filter(pkg => pkg.name === name);
        const version = url.searchParams.get("version");
        const pkg = version ? packages.find(item => item.version === version) : packages.at(-1);
        if (!pkg) { sendJson(response, 404, { error: "Package not found" }); return; }
        sendJson(response, 200, pkg);
        return;
      }
      if (request.method === "POST" && url.pathname === "/packages") {
        let body = "";
        for await (const chunk of request) body += chunk;
        const pkg = JSON.parse(body) as RegistryPackage;
        safeName(pkg.name);
        if (!pkg.version || !pkg.files) throw new Error("Invalid package payload.");
        writeRegistryPackage(dataDir, pkg);
        sendJson(response, 201, pkg);
        return;
      }
      sendJson(response, 404, { error: "Gas Station route not found" });
    } catch (error) {
      sendJson(response, 400, { error: error instanceof Error ? error.message : String(error) });
    }
  });
  server.listen(port, "127.0.0.1");
  return server;
}
