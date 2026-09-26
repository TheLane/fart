import test from "node:test";
import assert from "node:assert/strict";
import { Lexer } from "../src/lexer.js";
import { Parser, ParserError } from "../src/parser.js";
import { TokenType } from "../src/token.js";
import {
  Program, FunctionDeclaration, VariableDeclaration, IfStatement,
  WhileStatement, ReleaseStatement, Binary, Call, Variable, Literal
} from "../src/ast.js";

function parse(source) {
  const tokens = new Lexer(source).scanTokens();
  return new Parser(tokens).parse();
}

test("parses function, declaration and call", () => {
  const ast = parse('fart main() { let gas = 42; smell(gas); }');
  assert.ok(ast instanceof Program);
  assert.equal(ast.statements.length, 1);
  const fn = ast.statements[0];
  assert.ok(fn instanceof FunctionDeclaration);
  assert.equal(fn.name, "main");
  assert.deepEqual(fn.params, []);
  assert.ok(fn.body.statements[0] instanceof VariableDeclaration);
  assert.ok(fn.body.statements[1].expression instanceof Call);
});

test("respects arithmetic precedence", () => {
  const ast = parse("let gas = 2 + 3 * 4;");
  const expr = ast.statements[0].initializer;
  assert.ok(expr instanceof Binary);
  assert.equal(expr.operator, TokenType.PLUS);
  assert.equal(expr.right.operator, TokenType.STAR);
});

test("parses if/else and while", () => {
  const ast = parse("if (true) { while (false) { release; } } else { release 42; }");
  assert.ok(ast.statements[0] instanceof IfStatement);
  assert.ok(ast.statements[0].thenBranch.statements[0] instanceof WhileStatement);
  assert.ok(ast.statements[0].elseBranch.statements[0] instanceof ReleaseStatement);
});

test("parses assignment and literals", () => {
  const ast = parse("let gas = 1; gas = gas + 2;");
  const assignment = ast.statements[1].expression;
  assert.equal(assignment.name, "gas");
  assert.equal(assignment.value.left.name, "gas");
  assert.ok(assignment.value.right instanceof Literal);
});

test("reports syntax errors with position", () => {
  assert.throws(
    () => parse("let = 42;"),
    error => error instanceof ParserError && error.line === 1 && error.column > 1
  );
});
