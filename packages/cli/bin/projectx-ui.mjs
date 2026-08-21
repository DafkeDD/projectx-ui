#!/usr/bin/env node
/**
 * projectx-ui — kopieert componenten uit de registry naar je project.
 * Zelfde idee als de shadcn-CLI, volledig zelf geschreven, zonder dependencies.
 *
 *   npx projectx-ui init
 *   npx projectx-ui add button card dialog
 *   npx projectx-ui add --all
 *   npx projectx-ui list
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join, dirname, basename } from "node:path";
import { fileURLToPath } from "node:url";
import { createInterface } from "node:readline/promises";

const here = dirname(fileURLToPath(import.meta.url));
const cwd = process.cwd();
const ESC = "\u001b";

const c = {
  reset: `${ESC}[0m`,
  bold: `${ESC}[1m`,
  dim: `${ESC}[2m`,
  teal: `${ESC}[36m`,
  green: `${ESC}[32m`,
  red: `${ESC}[31m`,
  amber: `${ESC}[33m`,
};

const log = (message = "") => console.log(message);
const ok = (message) => log(`${c.green}+${c.reset} ${message}`);
const warn = (message) => log(`${c.amber}!${c.reset} ${message}`);
const fail = (message) => {
  log(`${c.red}x${c.reset} ${message}`);
  process.exit(1);
};

const CONFIG_FILE = "projectx-ui.json";
const DEFAULT_CONFIG = {
  componentsDir: "components/ui",
  cssEntry: "components/ui/ui.css",
  importAlias: "@/components/ui",
};

let registryPath = null;

/* ------------------------------------------------------------------ */
/* Registry vinden: --registry -> env -> monorepo -> meegeleverde kopie */
/* ------------------------------------------------------------------ */
async function loadRegistry(explicit) {
  const candidates = [
    explicit,
    process.env.PASPORT_UI_REGISTRY,
    findUp("registry/index.json"),
    join(here, "../registry/index.json"),
  ].filter(Boolean);

  for (const candidate of candidates) {
    if (/^https?:\/\//.test(candidate)) {
      const response = await fetch(candidate);
      if (!response.ok) continue;
      registryPath = candidate;
      return response.json();
    }
    if (existsSync(candidate)) {
      registryPath = candidate;
      return JSON.parse(readFileSync(candidate, "utf8"));
    }
  }

  fail("Geen registry gevonden. Draai `npm run registry` in de monorepo, of geef --registry <pad|url> mee.");
  return null;
}

function findUp(relative) {
  let dir = cwd;
  for (let depth = 0; depth < 8; depth += 1) {
    const candidate = join(dir, relative);
    if (existsSync(candidate)) return candidate;
    const parent = dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return null;
}

function readConfig() {
  const path = join(cwd, CONFIG_FILE);
  if (!existsSync(path)) return null;
  return { ...DEFAULT_CONFIG, ...JSON.parse(readFileSync(path, "utf8")) };
}

function writeFileSafe(path, content, force) {
  mkdirSync(dirname(path), { recursive: true });
  if (existsSync(path) && !force) {
    return readFileSync(path, "utf8") === content ? "gelijk" : "bestaat";
  }
  writeFileSync(path, content);
  return "geschreven";
}

function ensureCssImport(config, cssFileName) {
  const entry = join(cwd, config.cssEntry);
  const line = `@import "./${cssFileName}";`;
  mkdirSync(dirname(entry), { recursive: true });

  if (!existsSync(entry)) {
    writeFileSync(
      entry,
      [
        "/* ProjectX UI — verzamelbestand.",
        "   Importeer dit een keer in je globale stylesheet. */",
        line,
        "",
      ].join("\n")
    );
    return;
  }

  const current = readFileSync(entry, "utf8");
  if (current.includes(line)) return;
  writeFileSync(entry, `${current.trimEnd()}\n${line}\n`);
}

/** Zet interne imports om naar een platte map met componenten. */
function rewriteImports(content) {
  return content
    .replace(/from "\.\.\/lib\/([\w-]+)"/g, 'from "./$1"')
    .replace(/from "\.\.\/icons\/([\w-]+)"/g, 'from "./$1"');
}

function report(status, target) {
  const relative = target.replace(`${cwd}/`, "");
  if (status === "geschreven") ok(relative);
  else if (status === "gelijk") log(`${c.dim}= ${relative} (ongewijzigd)${c.reset}`);
  else warn(`${relative} bestaat al — gebruik --force om te overschrijven`);
}

function flag(args, name) {
  const index = args.indexOf(name);
  return index === -1 ? undefined : args[index + 1];
}

/* ------------------------------------------------------------------ */
/* Commando's                                                          */
/* ------------------------------------------------------------------ */
async function cmdInit(args) {
  const registry = await loadRegistry(flag(args, "--registry"));
  const force = args.includes("--force") || args.includes("-f");
  let config = readConfig();

  if (!config || force) {
    const auto = args.includes("--yes") || args.includes("-y");
    const rl = auto ? null : createInterface({ input: process.stdin, output: process.stdout });
    const ask = async (question, fallback) => {
      if (!rl) return fallback;
      const answer = await rl.question(`${c.teal}?${c.reset} ${question} ${c.dim}(${fallback})${c.reset} `);
      return answer.trim() || fallback;
    };

    config = {
      componentsDir: await ask("Waar mogen de componenten komen?", DEFAULT_CONFIG.componentsDir),
      cssEntry: await ask("Pad van het CSS-verzamelbestand?", DEFAULT_CONFIG.cssEntry),
      importAlias: await ask("Import-alias voor je componenten?", DEFAULT_CONFIG.importAlias),
    };
    rl?.close();
    writeFileSync(join(cwd, CONFIG_FILE), `${JSON.stringify(config, null, 2)}\n`);
    ok(`${CONFIG_FILE} aangemaakt`);
  } else {
    warn(`${CONFIG_FILE} bestaat al — gebruik --force om opnieuw te configureren.`);
  }

  log();
  log(`${c.bold}Gedeelde bestanden${c.reset}`);
  for (const file of registry.shared) {
    const name = basename(file.path);
    const target = join(cwd, config.componentsDir, name);
    report(writeFileSafe(target, rewriteImports(file.content), force), target);
    if (name.endsWith(".css")) ensureCssImport(config, name);
  }

  log();
  ok("Klaar. Importeer het verzamelbestand in je globale stylesheet:");
  log(`  ${c.dim}@import "./${config.cssEntry}";${c.reset}`);
  log();
  log(`Volgende stap: ${c.teal}npx projectx-ui add button${c.reset}`);
}

function readComponentPayload(name) {
  const file = join(dirname(registryPath), "components", `${name}.json`);
  if (existsSync(file)) return JSON.parse(readFileSync(file, "utf8"));
  fail(`Bronbestanden voor "${name}" niet gevonden naast ${registryPath}.`);
  return null;
}

async function cmdAdd(args) {
  const registry = await loadRegistry(flag(args, "--registry"));
  const config = readConfig();
  if (!config) fail(`Geen ${CONFIG_FILE} gevonden. Draai eerst \`npx projectx-ui init\`.`);

  const force = args.includes("--force") || args.includes("-f");
  const all = args.includes("--all");
  const registryArg = flag(args, "--registry");
  const requested = all
    ? registry.components.map((component) => component.name)
    : args.filter((argument) => !argument.startsWith("-") && argument !== registryArg);

  if (requested.length === 0) fail("Geef minstens een component op, of gebruik --all.");

  const queue = [];
  const seen = new Set();
  const push = (name) => {
    if (seen.has(name)) return;
    const component = registry.components.find((entry) => entry.name === name);
    if (!component) {
      warn(`Onbekend component: ${name}`);
      return;
    }
    seen.add(name);
    for (const dependency of component.dependencies ?? []) push(dependency);
    queue.push(component);
  };
  requested.forEach(push);

  for (const component of queue) {
    const payload = readComponentPayload(component.name);
    log();
    log(`${c.bold}${payload.title}${c.reset} ${c.dim}${payload.description}${c.reset}`);
    for (const file of payload.files) {
      const name = basename(file.path);
      const target = join(cwd, config.componentsDir, name);
      report(writeFileSafe(target, rewriteImports(file.content), force), target);
      if (name.endsWith(".css")) ensureCssImport(config, name);
    }
  }

  log();
  ok(`${queue.length} component(en) klaar in ${config.componentsDir}/`);
}

async function cmdList(args) {
  const registry = await loadRegistry(flag(args, "--registry"));
  const groups = new Map();
  for (const component of registry.components) {
    const list = groups.get(component.category) ?? [];
    list.push(component);
    groups.set(component.category, list);
  }

  log();
  log(`${c.bold}ProjectX UI${c.reset} ${c.dim}v${registry.version} - ${registry.components.length} componenten${c.reset}`);
  for (const [category, items] of groups) {
    log();
    log(`${c.teal}${category}${c.reset}`);
    for (const item of items) {
      log(`  ${item.name.padEnd(16)} ${c.dim}${item.description}${c.reset}`);
    }
  }
  log();
}

async function main() {
  const [command, ...args] = process.argv.slice(2);

  switch (command) {
    case "init":
      return cmdInit(args);
    case "add":
      return cmdAdd(args);
    case "list":
    case "ls":
      return cmdList(args);
    case "--version":
    case "-v":
      return log("projectx-ui 0.1.0");
    default:
      log();
      log(`${c.bold}projectx-ui${c.reset} — je eigen componenten, in je eigen project.`);
      log();
      log(`  ${c.teal}init${c.reset}                 tokens, basis-CSS en hulpfuncties kopieren`);
      log(`  ${c.teal}add <namen...>${c.reset}       componenten kopieren (met hun afhankelijkheden)`);
      log(`  ${c.teal}add --all${c.reset}            alles in een keer`);
      log(`  ${c.teal}list${c.reset}                 toont alle beschikbare componenten`);
      log();
      log(`${c.dim}Opties: --force  --yes  --registry <pad|url>${c.reset}`);
      log();
      return undefined;
  }
}

main().catch((error) => fail(error.message));
