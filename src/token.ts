export const TokenType = {
  LEFT_PAREN: "LEFT_PAREN", RIGHT_PAREN: "RIGHT_PAREN", LEFT_BRACE: "LEFT_BRACE", RIGHT_BRACE: "RIGHT_BRACE",
  LEFT_BRACKET: "LEFT_BRACKET", RIGHT_BRACKET: "RIGHT_BRACKET", COMMA: "COMMA", DOT: "DOT", SEMICOLON: "SEMICOLON",
  MINUS: "MINUS", PLUS: "PLUS", SLASH: "SLASH", STAR: "STAR", BANG: "BANG", BANG_EQUAL: "BANG_EQUAL",
  EQUAL: "EQUAL", EQUAL_EQUAL: "EQUAL_EQUAL", GREATER: "GREATER", GREATER_EQUAL: "GREATER_EQUAL",
  LESS: "LESS", LESS_EQUAL: "LESS_EQUAL", AND_AND: "AND_AND", OR_OR: "OR_OR",
  IDENTIFIER: "IDENTIFIER", STRING: "STRING", NUMBER: "NUMBER", FART: "FART", LET: "LET", IF: "IF",
  ELSE: "ELSE", WHILE: "WHILE", RELEASE: "RELEASE", TRUE: "TRUE", FALSE: "FALSE", NULL: "NULL", EOF: "EOF"
} as const;
export type TokenTypeValue = typeof TokenType[keyof typeof TokenType];
export type TokenLiteral = string | number | boolean | null;
export class Token {
  constructor(public type: TokenTypeValue, public lexeme: string, public literal: TokenLiteral,
    public line: number, public column: number) {}
  toString(): string { return `${this.type} ${this.lexeme} ${this.literal ?? ""}`.trim(); }
}