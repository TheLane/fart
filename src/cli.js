#!/usr/bin/env node
import fs from "node:fs";
import readline from "node:readline";
import { Lexer } from "./lexer.js";
import { Parser } from "./parser.js";
import { Interpreter } from "./interpreter.js";

const VERSION = "0.5.0";

function execute(source, output = console.log) {
  const tokens = new Lexer(source).scanTokens();
  const program = new Parser(tokens).parse();
  const interpreter = new Interpreter(output);
  interpreter.interpret(program);
  return interpreter.runMain();
}

function printHelp() {
  console.log("Fart — a programming language that stinks, but runs.");
  console.log("");
  console.log("Usage:");
  console.log("  fart <file.fart>   Run a Fart program");
  console.log("  fart repl          Start the Fart REPL");
  console.log("  fart --version     Show version");
  console.log("  fart --help        Show this help");
}

async function repl() {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout, prompt: "fart> " });
  console.log("Fart REPL v" + VERSION);
  console.log("Type .help for commands, .exit to leave.");
  rl.prompt();
  for await (const line of rl) {
    const input = line.trim();
    if (input === ".exit") { rl.close(); break; }
    if (input === ".help") { console.log(".help  Show help\n.exit  Exit REPL"); rl.prompt(); continue; }
    if (!input) { rl.prompt(); continue; }
    try { execute(input); }
    catch (error) { console.error("FART ERROR: " + error.message); }
    rl.prompt();
  }
}

const args = process.argv.slice(2);
if (args.length === 0 || args[0] === "--help" || args[0] === "-h") {
  printHelp();
  process.exit(args.length === 0 ? 0 : 0);
}
if (args[0] === "--version" || args[0] === "-v") {
  console.log(VERSION);
  process.exit(0);
}
if (args[0] === "repl") {
  await repl();
  process.exit(0);
}

const file = args[0];
if (!fs.existsSync(file)) {
  console.error("FART ERROR: File not found: " + file);
  process.exit(1);
}
try {
  execute(fs.readFileSync(file, "utf8"));
} catch (error) {
  console.error("FART ERROR: " + error.message);
  process.exit(1);
}
