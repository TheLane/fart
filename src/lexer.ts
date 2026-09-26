import { Token, TokenType, type TokenTypeValue } from "./token.js";
const keywords = new Map<string, TokenTypeValue>([
  ["fart", TokenType.FART], ["let", TokenType.LET], ["if", TokenType.IF], ["else", TokenType.ELSE],
  ["while", TokenType.WHILE], ["release", TokenType.RELEASE], ["true", TokenType.TRUE],
  ["false", TokenType.FALSE], ["null", TokenType.NULL]
]);
export class LexerError extends Error {
  constructor(message: string, public line: number, public column: number) { super(message); this.name = "LexerError"; }
}
export class Lexer {
  private tokens: Token[] = []; private start = 0; private current = 0; private line = 1; private column = 1; private tokenColumn = 1;
  constructor(private source: string) {}
  scanTokens(): Token[] {
    while (!this.isAtEnd()) { this.start = this.current; this.tokenColumn = this.column; this.scanToken(); }
    this.tokens.push(new Token(TokenType.EOF, "", null, this.line, this.column)); return this.tokens;
  }
  private scanToken(): void {
    const c = this.advance();
    const single: Record<string, TokenTypeValue> = {
      "(":TokenType.LEFT_PAREN, ")":TokenType.RIGHT_PAREN, "{":TokenType.LEFT_BRACE, "}":TokenType.RIGHT_BRACE,
      "[":TokenType.LEFT_BRACKET, "]":TokenType.RIGHT_BRACKET, ",":TokenType.COMMA, ".":TokenType.DOT,
      ";":TokenType.SEMICOLON, "-":TokenType.MINUS, "+":TokenType.PLUS, "*":TokenType.STAR
    };
    if (single[c]) return this.addToken(single[c]);
    if (c === "!") return this.addToken(this.match("=") ? TokenType.BANG_EQUAL : TokenType.BANG);
    if (c === "=") return this.addToken(this.match("=") ? TokenType.EQUAL_EQUAL : TokenType.EQUAL);
    if (c === ">") return this.addToken(this.match("=") ? TokenType.GREATER_EQUAL : TokenType.GREATER);
    if (c === "<") return this.addToken(this.match("=") ? TokenType.LESS_EQUAL : TokenType.LESS);
    if (c === "&" && this.match("&")) return this.addToken(TokenType.AND_AND);
    if (c === "|" && this.match("|")) return this.addToken(TokenType.OR_OR);
    if (c === "/") { if (this.match("/")) { while (this.peek() !== "\n" && !this.isAtEnd()) this.advance(); return; } return this.addToken(TokenType.SLASH); }
    if (this.isWhitespace(c)) return;
    if (c === "\n") { this.line++; this.column = 1; return; }
    if (c === '"') return this.string();
    if (this.isDigit(c)) return this.number();
    if (this.isAlpha(c)) return this.identifier();
    throw new LexerError(`Unexpected character '${c}'.`, this.line, this.tokenColumn);
  }
  private string(): void {
    while (this.peek() !== '"' && !this.isAtEnd()) { if (this.peek() === "\n") { this.line++; this.column = 1; } this.advance(); }
    if (this.isAtEnd()) throw new LexerError("Unterminated string.", this.line, this.tokenColumn);
    this.advance(); this.addToken(TokenType.STRING, this.source.slice(this.start + 1, this.current - 1));
  }
  private number(): void {
    while (this.isDigit(this.peek())) this.advance();
    if (this.peek() === "." && this.isDigit(this.peekNext())) { this.advance(); while (this.isDigit(this.peek())) this.advance(); }
    this.addToken(TokenType.NUMBER, Number.parseFloat(this.source.slice(this.start, this.current)));
  }
  private identifier(): void {
    while (this.isAlphaNumeric(this.peek())) this.advance();
    const text = this.source.slice(this.start, this.current); this.addToken(keywords.get(text) ?? TokenType.IDENTIFIER);
  }
  private advance(): string { const c = this.source[this.current++] ?? "\0"; this.column++; return c; }
  private match(expected: string): boolean { if (this.isAtEnd() || this.source[this.current] !== expected) return false; this.current++; this.column++; return true; }
  private peek(): string { return this.isAtEnd() ? "\0" : this.source[this.current] ?? "\0"; }
  private peekNext(): string { return this.current + 1 >= this.source.length ? "\0" : this.source[this.current + 1] ?? "\0"; }
  private isAtEnd(): boolean { return this.current >= this.source.length; }
  private addToken(type: TokenTypeValue, literal: string | number | null = null): void { this.tokens.push(new Token(type, this.source.slice(this.start, this.current), literal, this.line, this.tokenColumn)); }
  private isWhitespace(c: string): boolean { return c === " " || c === "\r" || c === "\t"; }
  private isDigit(c: string): boolean { return c >= "0" && c <= "9"; }
  private isAlpha(c: string): boolean { return (c >= "a" && c <= "z") || (c >= "A" && c <= "Z") || c === "_"; }
  private isAlphaNumeric(c: string): boolean { return this.isAlpha(c) || this.isDigit(c); }
}