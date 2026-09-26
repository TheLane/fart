import test from 'node:test';
import assert from 'node:assert/strict';
import { Lexer, LexerError } from '../dist/lexer.js';
import { TokenType } from '../dist/token.js';

const types = source => new Lexer(source).scanTokens().map(token => token.type);

test('lexes Fart keywords and punctuation', () => {
  assert.deepEqual(types('fart main() { let gas = 42; release gas; }'), [
    TokenType.FART, TokenType.IDENTIFIER, TokenType.LEFT_PAREN,
    TokenType.RIGHT_PAREN, TokenType.LEFT_BRACE, TokenType.LET,
    TokenType.IDENTIFIER, TokenType.EQUAL, TokenType.NUMBER,
    TokenType.SEMICOLON, TokenType.RELEASE, TokenType.IDENTIFIER,
    TokenType.SEMICOLON, TokenType.RIGHT_BRACE, TokenType.EOF
  ]);
});

test('lexes operators and literals', () => {
  const tokens = new Lexer('1.5 >= 1 && true != false || !null').scanTokens();
  assert.deepEqual(tokens.map(t => t.type), [
    TokenType.NUMBER, TokenType.GREATER_EQUAL, TokenType.NUMBER,
    TokenType.AND_AND, TokenType.TRUE, TokenType.BANG_EQUAL,
    TokenType.FALSE, TokenType.OR_OR, TokenType.BANG, TokenType.NULL,
    TokenType.EOF
  ]);
  assert.equal(tokens[0].literal, 1.5);
});

test('lexes strings and ignores comments', () => {
  const tokens = new Lexer('// comment\nsmell("hello");').scanTokens();
  assert.equal(tokens[0].type, TokenType.IDENTIFIER);
  assert.equal(tokens[0].lexeme, 'smell');
  assert.equal(tokens[2].literal, 'hello');
});

test('reports an unexpected character with position', () => {
  assert.throws(() => new Lexer('let x = @;').scanTokens(), error => {
    assert.ok(error instanceof LexerError);
    assert.equal(error.line, 1);
    assert.equal(error.column, 9);
    return true;
  });
});

test('reports an unterminated string', () => {
  assert.throws(() => new Lexer('smell("oops)').scanTokens(), error => {
    assert.ok(error instanceof LexerError);
    assert.equal(error.line, 1);
    return true;
  });
});
