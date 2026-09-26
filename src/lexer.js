import { Token, TokenType } from './token.js';

const keywords = new Map([
  ['fart', TokenType.FART], ['let', TokenType.LET],
  ['if', TokenType.IF], ['else', TokenType.ELSE],
  ['while', TokenType.WHILE], ['release', TokenType.RELEASE],
  ['true', TokenType.TRUE], ['false', TokenType.FALSE],
  ['null', TokenType.NULL]
]);

export class LexerError extends Error {
  constructor(message, line, column) {
    super(message);
    this.name = 'LexerError';
    this.line = line;
    this.column = column;
  }
}

export class Lexer {
  constructor(source) {
    this.source = source;
    this.tokens = [];
    this.start = 0;
    this.current = 0;
    this.line = 1;
    this.column = 1;
    this.tokenColumn = 1;
  }

  scanTokens() {
    while (!this.isAtEnd()) {
      this.start = this.current;
      this.tokenColumn = this.column;
      this.scanToken();
    }
    this.tokens.push(new Token(TokenType.EOF, '', null, this.line, this.column));
    return this.tokens;
  }

  scanToken() {
    const c = this.advance();
    const single = {
      '(': TokenType.LEFT_PAREN, ')': TokenType.RIGHT_PAREN,
      '{': TokenType.LEFT_BRACE, '}': TokenType.RIGHT_BRACE, '[': TokenType.LEFT_BRACKET, ']': TokenType.RIGHT_BRACKET,
      ',': TokenType.COMMA, '.': TokenType.DOT, ';': TokenType.SEMICOLON,
      '-': TokenType.MINUS, '+': TokenType.PLUS, '*': TokenType.STAR
    };
    if (single[c]) return this.addToken(single[c]);
    if (c === '!') return this.match('=') ? this.addToken(TokenType.BANG_EQUAL) : this.addToken(TokenType.BANG);
    if (c === '=') return this.match('=') ? this.addToken(TokenType.EQUAL_EQUAL) : this.addToken(TokenType.EQUAL);
    if (c === '>') return this.match('=') ? this.addToken(TokenType.GREATER_EQUAL) : this.addToken(TokenType.GREATER);
    if (c === '<') return this.match('=') ? this.addToken(TokenType.LESS_EQUAL) : this.addToken(TokenType.LESS);
    if (c === '&' && this.match('&')) return this.addToken(TokenType.AND_AND);
    if (c === '|' && this.match('|')) return this.addToken(TokenType.OR_OR);
    if (c === '/') {
      if (this.match('/')) { while (this.peek() !== '\n' && !this.isAtEnd()) this.advance(); return; }
      return this.addToken(TokenType.SLASH);
    }
    if (this.isWhitespace(c)) return;
    if (c === '\n') { this.line++; this.column = 1; return; }
    if (c === '"') return this.string();
    if (this.isDigit(c)) return this.number();
    if (this.isAlpha(c)) return this.identifier();
    throw new LexerError(`Unexpected character '${c}'.`, this.line, this.tokenColumn);
  }

  string() {
    while (this.peek() !== '"' && !this.isAtEnd()) {
      if (this.peek() === '\n') { this.line++; this.column = 1; }
      this.advance();
    }
    if (this.isAtEnd()) throw new LexerError('Unterminated string.', this.line, this.tokenColumn);
    this.advance();
    const value = this.source.slice(this.start + 1, this.current - 1);
    this.addToken(TokenType.STRING, value);
  }

  number() {
    while (this.isDigit(this.peek())) this.advance();
    if (this.peek() === '.' && this.isDigit(this.peekNext())) {
      this.advance();
      while (this.isDigit(this.peek())) this.advance();
    }
    this.addToken(TokenType.NUMBER, Number.parseFloat(this.source.slice(this.start, this.current)));
  }

  identifier() {
    while (this.isAlphaNumeric(this.peek())) this.advance();
    const text = this.source.slice(this.start, this.current);
    this.addToken(keywords.get(text) ?? TokenType.IDENTIFIER);
  }

  advance() { const c = this.source[this.current++]; this.column++; return c; }
  match(expected) { if (this.isAtEnd() || this.source[this.current] !== expected) return false; this.current++; this.column++; return true; }
  peek() { return this.isAtEnd() ? '\0' : this.source[this.current]; }
  peekNext() { return this.current + 1 >= this.source.length ? '\0' : this.source[this.current + 1]; }
  isAtEnd() { return this.current >= this.source.length; }
  addToken(type, literal = null) { this.tokens.push(new Token(type, this.source.slice(this.start, this.current), literal, this.line, this.tokenColumn)); }
  isWhitespace(c) { return c === ' ' || c === '\r' || c === '\t'; }
  isDigit(c) { return c >= '0' && c <= '9'; }
  isAlpha(c) { return (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || c === '_'; }
  isAlphaNumeric(c) { return this.isAlpha(c) || this.isDigit(c); }
}
