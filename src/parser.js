import { TokenType } from "./token.js";
import { Program, FunctionDeclaration, VariableDeclaration, Block, IfStatement, WhileStatement, ReleaseStatement, ExpressionStatement, Assignment, Binary, Unary, Literal, Variable, Call, ArrayLiteral, Index, IndexAssignment } from "./ast.js";
export class ParserError extends Error { constructor(message,token){super(message);this.name="ParserError";this.line=token?.line??0;this.column=token?.column??0;} }
export class Parser {
 constructor(tokens){this.tokens=tokens;this.current=0;}
 parse(){const statements=[];while(!this.isAtEnd())statements.push(this.declaration());return new Program(statements);}
 declaration(){return this.match(TokenType.FART)?this.functionDeclaration():this.statement();}
 functionDeclaration(){const name=this.consume(TokenType.IDENTIFIER,"Expected fart name.");this.consume(TokenType.LEFT_PAREN,"Expected '(' after fart name.");const params=[];if(!this.check(TokenType.RIGHT_PAREN)){do{params.push(this.consume(TokenType.IDENTIFIER,"Expected parameter name."));}while(this.match(TokenType.COMMA));}this.consume(TokenType.RIGHT_PAREN,"Expected ')' after parameters.");return new FunctionDeclaration(name.lexeme,params.map(p=>p.lexeme),this.block());}
 statement(){if(this.match(TokenType.LET))return this.variableDeclaration();if(this.match(TokenType.IF))return this.ifStatement();if(this.match(TokenType.WHILE))return this.whileStatement();if(this.match(TokenType.RELEASE))return this.releaseStatement();if(this.match(TokenType.LEFT_BRACE))return this.blockAfterOpen();return this.expressionStatement();}
 variableDeclaration(){const name=this.consume(TokenType.IDENTIFIER,"Expected gas name.");let initializer=null;if(this.match(TokenType.EQUAL))initializer=this.expression();this.consume(TokenType.SEMICOLON,"Expected ';' after declaration.");return new VariableDeclaration(name.lexeme,initializer);}
 ifStatement(){this.consume(TokenType.LEFT_PAREN,"Expected '(' after 'if'.");const condition=this.expression();this.consume(TokenType.RIGHT_PAREN,"Expected ')' after condition.");const thenBranch=this.statement();const elseBranch=this.match(TokenType.ELSE)?this.statement():null;return new IfStatement(condition,thenBranch,elseBranch);}
 whileStatement(){this.consume(TokenType.LEFT_PAREN,"Expected '(' after 'while'.");const condition=this.expression();this.consume(TokenType.RIGHT_PAREN,"Expected ')' after condition.");return new WhileStatement(condition,this.statement());}
 releaseStatement(){let value=null;if(!this.check(TokenType.SEMICOLON))value=this.expression();this.consume(TokenType.SEMICOLON,"Expected ';' after release.");return new ReleaseStatement(value);}
 block(){this.consume(TokenType.LEFT_BRACE,"Expected '{' before block.");return this.blockAfterOpen();}
 blockAfterOpen(){const statements=[];while(!this.check(TokenType.RIGHT_BRACE)&&!this.isAtEnd())statements.push(this.declaration());this.consume(TokenType.RIGHT_BRACE,"Expected '}' after block.");return new Block(statements);}
 expressionStatement(){const expression=this.expression();this.consume(TokenType.SEMICOLON,"Expected ';' after expression.");return new ExpressionStatement(expression);}
 expression(){return this.assignment();}
 assignment(){const expression=this.logicalOr();if(this.match(TokenType.EQUAL)){const equals=this.previous();const value=this.assignment();if(expression instanceof Variable)return new Assignment(expression.name,value);if(expression instanceof Index)return new IndexAssignment(expression.object,expression.index,value);throw new ParserError("Invalid assignment target.",equals);}return expression;}
 logicalOr(){let expr=this.logicalAnd();while(this.match(TokenType.OR_OR))expr=new Binary(expr,this.previous().type,this.logicalAnd());return expr;}
 logicalAnd(){let expr=this.equality();while(this.match(TokenType.AND_AND))expr=new Binary(expr,this.previous().type,this.equality());return expr;}
 equality(){let expr=this.comparison();while(this.match(TokenType.BANG_EQUAL,TokenType.EQUAL_EQUAL))expr=new Binary(expr,this.previous().type,this.comparison());return expr;}
 comparison(){let expr=this.term();while(this.match(TokenType.GREATER,TokenType.GREATER_EQUAL,TokenType.LESS,TokenType.LESS_EQUAL))expr=new Binary(expr,this.previous().type,this.term());return expr;}
 term(){let expr=this.factor();while(this.match(TokenType.MINUS,TokenType.PLUS))expr=new Binary(expr,this.previous().type,this.factor());return expr;}
 factor(){let expr=this.unary();while(this.match(TokenType.SLASH,TokenType.STAR))expr=new Binary(expr,this.previous().type,this.unary());return expr;}
 unary(){if(this.match(TokenType.BANG,TokenType.MINUS))return new Unary(this.previous().type,this.unary());return this.call();}
 call(){let expr=this.primary();while(true){if(this.match(TokenType.LEFT_PAREN)){const args=[];if(!this.check(TokenType.RIGHT_PAREN)){do{args.push(this.expression());}while(this.match(TokenType.COMMA));}this.consume(TokenType.RIGHT_PAREN,"Expected ')' after arguments.");expr=new Call(expr,args);}else if(this.match(TokenType.LEFT_BRACKET)){const index=this.expression();this.consume(TokenType.RIGHT_BRACKET,"Expected ']' after index.");expr=new Index(expr,index);}else break;}return expr;}
 primary(){if(this.match(TokenType.FALSE))return new Literal(false);if(this.match(TokenType.TRUE))return new Literal(true);if(this.match(TokenType.NULL))return new Literal(null);if(this.match(TokenType.NUMBER,TokenType.STRING))return new Literal(this.previous().literal);if(this.match(TokenType.IDENTIFIER))return new Variable(this.previous().lexeme);if(this.match(TokenType.LEFT_BRACKET)){const elements=[];if(!this.check(TokenType.RIGHT_BRACKET)){do{elements.push(this.expression());}while(this.match(TokenType.COMMA));}this.consume(TokenType.RIGHT_BRACKET,"Expected ']' after array.");return new ArrayLiteral(elements);}if(this.match(TokenType.LEFT_PAREN)){const expr=this.expression();this.consume(TokenType.RIGHT_PAREN,"Expected ')' after expression.");return expr;}throw new ParserError("Expected expression.",this.peek());}
 match(...types){for(const type of types){if(this.check(type)){this.advance();return true;}}return false;}
 consume(type,message){if(this.check(type))return this.advance();throw new ParserError(message,this.peek());}
 check(type){if(this.isAtEnd())return type===TokenType.EOF;return this.peek().type===type;}
 advance(){if(!this.isAtEnd())this.current++;return this.previous();}
 isAtEnd(){return this.peek().type===TokenType.EOF;}peek(){return this.tokens[this.current];}previous(){return this.tokens[this.current-1];}
}
