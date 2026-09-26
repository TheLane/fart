import { Lexer } from "./lexer.js";
import { TokenType, type TokenTypeValue } from "./token.js";

const binaryOperators: Set<TokenTypeValue> = new Set([
  TokenType.PLUS, TokenType.MINUS, TokenType.STAR, TokenType.SLASH,
  TokenType.EQUAL, TokenType.EQUAL_EQUAL, TokenType.BANG_EQUAL,
  TokenType.GREATER, TokenType.GREATER_EQUAL, TokenType.LESS, TokenType.LESS_EQUAL,
  TokenType.AND_AND, TokenType.OR_OR
]);

const wordLike: Set<TokenTypeValue> = new Set([
  TokenType.IDENTIFIER, TokenType.NUMBER, TokenType.STRING,
  TokenType.FART, TokenType.LET, TokenType.IF, TokenType.ELSE,
  TokenType.WHILE, TokenType.RELEASE, TokenType.TRUE, TokenType.FALSE, TokenType.NULL
]);

export function formatSource(source) {
  const tokens = new Lexer(source).scanTokens().filter(token => token.type !== TokenType.EOF);
  const comments = extractComments(source);
  const lines = [];
  let current = "";
  let indent = 0;
  let parens = 0;
  let previous = null;

  const push = () => {
    const text = current.trimEnd();
    if (text) lines.push("    ".repeat(Math.max(0, indent)) + text);
    current = "";
  };

  const space = () => {
    if (current && !/[ \t]$/.test(current)) current += " ";
  };

  for (const token of tokens) {
    const t = token.type;
    if (t === TokenType.LEFT_BRACE) {
      space();
      current += "{";
      push();
      indent++;
    } else if (t === TokenType.RIGHT_BRACE) {
      if (current.trim()) push();
      indent = Math.max(0, indent - 1);
      current = "}";
      push();
    } else if (t === TokenType.ELSE && previous && previous.type === TokenType.RIGHT_BRACE) {
      current = (lines.pop() ?? "") + " else";
    } else if (t === TokenType.SEMICOLON) {
      current = current.trimEnd() + ";";
      push();
    } else if (t === TokenType.COMMA) {
      current = current.trimEnd() + ", ";
    } else if (t === TokenType.LEFT_PAREN) {
      if (previous && (previous.type === TokenType.IF || previous.type === TokenType.WHILE)) space();
      current += "(";
      parens++;
    } else if (t === TokenType.RIGHT_PAREN) {
      current = current.trimEnd() + ")";
      parens = Math.max(0, parens - 1);
    } else if (t === TokenType.LEFT_BRACKET) {
      current = current.trimEnd() + "[";
    } else if (t === TokenType.RIGHT_BRACKET) {
      current = current.trimEnd() + "]";
    } else if (t === TokenType.DOT) {
      current = current.trimEnd() + ".";
    } else if (binaryOperators.has(t)) {
      space();
      current += token.lexeme;
      current += " ";
    } else {
      if (wordLike.has(t) && previous && (wordLike.has(previous.type) || previous.type === TokenType.RIGHT_BRACKET)) space();
      if (previous && previous.type === TokenType.RIGHT_PAREN && wordLike.has(t)) space();
      current += token.lexeme;
    }
    previous = token;
  }
  if (current.trim()) push();

  const withComments = addComments(lines, comments);
  return withComments.join("\n") + (withComments.length ? "\n" : "");
}

function extractComments(source) {
  const result = new Map();
  let line = 1;
  let i = 0;
  let inString = false;
  while (i < source.length) {
    const c = source[i];
    if (c === "\"") {
      if (inString && source[i - 1] !== "\\") inString = false;
      else if (!inString) inString = true;
      i++;
      continue;
    }
    if (!inString && c === "/" && source[i + 1] === "/") {
      const start = i;
      i += 2;
      while (i < source.length && source[i] !== "\n") i++;
      const text = source.slice(start, i).trim();
      const list = result.get(line) ?? [];
      list.push(text);
      result.set(line, list);
      continue;
    }
    if (c === "\n") line++;
    i++;
  }
  return result;
}

function addComments(lines, comments) {
  const output = [...lines];
  for (const [line, list] of comments) {
    const text = list.join("  ");
    const target = Math.min(output.length - 1, line - 1);
    if (target >= 0 && output[target].trim()) output[target] += "  " + text;
    else output.push(text);
  }
  return output;
}




