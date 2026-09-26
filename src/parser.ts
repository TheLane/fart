import { TokenType, type Token, type TokenTypeValue } from "./token.js";
import { Program, FunctionDeclaration, VariableDeclaration, Block, IfStatement, WhileStatement, ReleaseStatement, ExpressionStatement, Assignment, Binary, Unary, Literal, Variable, Call, ArrayLiteral, Index, IndexAssignment, type Expression, type Statement } from "./ast.js";
export class ParserError extends Error {
  constructor(message: string, token?: Token) { super(message); this.name = "ParserError"; this.line = token?.line ?? 0; this.column = token?.column ?? 0; }
  line: number; column: number;
}
export class Parser {
  private current = 0;
  constructor(private tokens: Token[]) {}
  parse(): Program { const statements: Statement[] = []; while (!this.isAtEnd()) statements.push(this.declaration()); return new Program(statements); }
  declaration(): Statement { return this.match(TokenType.FART) ? this.functionDeclaration() : this.statement(); }
  functionDeclaration(): FunctionDeclaration { const name=this.consume(TokenType.IDENTIFIER,"Expected fart name."); this.consume(TokenType.LEFT_PAREN,"Expected '(' after fart name."); const params: string[]=[]; if(!this.check(TokenType.RIGHT_PAREN)){do{params.push(this.consume(TokenType.IDENTIFIER,"Expected parameter name.").lexeme);}while(this.match(TokenType.COMMA));} this.consume(TokenType.RIGHT_PAREN,"Expected ')' after parameters."); return new FunctionDeclaration(name.lexeme,params,this.block()); }
  statement(): Statement { if(this.match(TokenType.LET))return this.variableDeclaration(); if(this.match(TokenType.IF))return this.ifStatement(); if(this.match(TokenType.WHILE))return this.whileStatement(); if(this.match(TokenType.RELEASE))return this.releaseStatement(); if(this.match(TokenType.LEFT_BRACE))return this.blockAfterOpen(); return this.expressionStatement(); }
  variableDeclaration(): VariableDeclaration { const name=this.consume(TokenType.IDENTIFIER,"Expected gas name."); let initializer: Expression|null=null; if(this.match(TokenType.EQUAL))initializer=this.expression(); this.consume(TokenType.SEMICOLON,"Expected ';' after declaration."); return new VariableDeclaration(name.lexeme,initializer); }
  ifStatement(): IfStatement { this.consume(TokenType.LEFT_PAREN,"Expected '(' after 'if'."); const condition=this.expression(); this.consume(TokenType.RIGHT_PAREN,"Expected ')' after condition."); const thenBranch=this.statement(); const elseBranch=this.match(TokenType.ELSE)?this.statement():null; return new IfStatement(condition,thenBranch,elseBranch); }
  whileStatement(): WhileStatement { this.consume(TokenType.LEFT_PAREN,"Expected '(' after 'while'."); const condition=this.expression(); this.consume(TokenType.RIGHT_PAREN,"Expected ')' after condition."); return new WhileStatement(condition,this.statement()); }
  releaseStatement(): ReleaseStatement { let value: Expression|null=null; if(!this.check(TokenType.SEMICOLON))value=this.expression(); this.consume(TokenType.SEMICOLON,"Expected ';' after release."); return new ReleaseStatement(value); }
  block(): Block { this.consume(TokenType.LEFT_BRACE,"Expected '{' before block."); return this.blockAfterOpen(); }
  blockAfterOpen(): Block { const statements: Statement[]=[]; while(!this.check(TokenType.RIGHT_BRACE)&&!this.isAtEnd())statements.push(this.declaration()); this.consume(TokenType.RIGHT_BRACE,"Expected '}' after block."); return new Block(statements); }
  expressionStatement(): ExpressionStatement { const expression=this.expression(); this.consume(TokenType.SEMICOLON,"Expected ';' after expression."); return new ExpressionStatement(expression); }
  expression(): Expression { return this.assignment(); }
  assignment(): Expression { const expression=this.logicalOr(); if(this.match(TokenType.EQUAL)){const equals=this.previous();const value=this.assignment();if(expression instanceof Variable)return new Assignment(expression.name,value);if(expression instanceof Index)return new IndexAssignment(expression.object,expression.index,value);throw new ParserError("Invalid assignment target.",equals);}return expression; }
  logicalOr(): Expression { let expr=this.logicalAnd(); while(this.match(TokenType.OR_OR))expr=new Binary(expr,this.previous().type,this.logicalAnd()); return expr; }
  logicalAnd(): Expression { let expr=this.equality(); while(this.match(TokenType.AND_AND))expr=new Binary(expr,this.previous().type,this.equality()); return expr; }
  equality(): Expression { let expr=this.comparison(); while(this.match(TokenType.BANG_EQUAL,TokenType.EQUAL_EQUAL))expr=new Binary(expr,this.previous().type,this.comparison()); return expr; }
  comparison(): Expression { let expr=this.term(); while(this.match(TokenType.GREATER,TokenType.GREATER_EQUAL,TokenType.LESS,TokenType.LESS_EQUAL))expr=new Binary(expr,this.previous().type,this.term()); return expr; }
  term(): Expression { let expr=this.factor(); while(this.match(TokenType.MINUS,TokenType.PLUS))expr=new Binary(expr,this.previous().type,this.factor()); return expr; }
  factor(): Expression { let expr=this.unary(); while(this.match(TokenType.SLASH,TokenType.STAR))expr=new Binary(expr,this.previous().type,this.unary()); return expr; }
  unary(): Expression { if(this.match(TokenType.BANG,TokenType.MINUS))return new Unary(this.previous().type,this.unary()); return this.call(); }
  call(): Expression { let expr=this.primary(); while(true){if(this.match(TokenType.LEFT_PAREN)){const args:Expression[]=[];if(!this.check(TokenType.RIGHT_PAREN)){do{args.push(this.expression());}while(this.match(TokenType.COMMA));}this.consume(TokenType.RIGHT_PAREN,"Expected ')' after arguments.");expr=new Call(expr,args);}else if(this.match(TokenType.LEFT_BRACKET)){const index=this.expression();this.consume(TokenType.RIGHT_BRACKET,"Expected ']' after index.");expr=new Index(expr,index);}else break;}return expr; }
  primary(): Expression { if(this.match(TokenType.FALSE))return new Literal(false);if(this.match(TokenType.TRUE))return new Literal(true);if(this.match(TokenType.NULL))return new Literal(null);if(this.match(TokenType.NUMBER,TokenType.STRING))return new Literal(this.previous().literal);if(this.match(TokenType.IDENTIFIER))return new Variable(this.previous().lexeme);if(this.match(TokenType.LEFT_BRACKET)){const elements:Expression[]=[];if(!this.check(TokenType.RIGHT_BRACKET)){do{elements.push(this.expression());}while(this.match(TokenType.COMMA));}this.consume(TokenType.RIGHT_BRACKET,"Expected ']' after array.");return new ArrayLiteral(elements);}if(this.match(TokenType.LEFT_PAREN)){const expr=this.expression();this.consume(TokenType.RIGHT_PAREN,"Expected ')' after expression.");return expr;}throw new ParserError("Expected expression.",this.peek()); }
  match(...types: TokenTypeValue[]): boolean { for(const type of types){if(this.check(type)){this.advance();return true;}}return false; }
  consume(type: TokenTypeValue,message:string):Token { if(this.check(type))return this.advance();throw new ParserError(message,this.peek()); }
  check(type:TokenTypeValue):boolean { if(this.isAtEnd())return type===TokenType.EOF;return this.peek().type===type; }
  advance():Token { if(!this.isAtEnd())this.current++;return this.previous(); }
  isAtEnd():boolean{return this.peek().type===TokenType.EOF;}
  peek():Token{return this.tokens[this.current] ?? this.tokens[this.tokens.length-1];}
  previous():Token{return this.tokens[this.current-1] ?? this.tokens[0];}
}