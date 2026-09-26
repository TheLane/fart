import type { TokenTypeValue } from "./token.js";

export type Expression = Literal | Variable | Binary | Unary | Call | ArrayLiteral | Index | Assignment | IndexAssignment;
export type Statement = FunctionDeclaration | VariableDeclaration | Block | IfStatement | WhileStatement | ReleaseStatement | ExpressionStatement;

export class Program { constructor(public statements: Statement[]) {} }
export class FunctionDeclaration { constructor(public name: string, public params: string[], public body: Block, public line = 0) {} }
export class VariableDeclaration { constructor(public name: string, public initializer: Expression | null, public line = 0) {} }
export class Block { constructor(public statements: Statement[], public line = 0) {} }
export class IfStatement { constructor(public condition: Expression, public thenBranch: Statement, public elseBranch: Statement | null, public line = 0) {} }
export class WhileStatement { constructor(public condition: Expression, public body: Statement, public line = 0) {} }
export class ReleaseStatement { constructor(public value: Expression | null, public line = 0) {} }
export class ExpressionStatement { constructor(public expression: Expression, public line = 0) {} }
export class Assignment { constructor(public name: string, public value: Expression) {} }
export class Binary { constructor(public left: Expression, public operator: TokenTypeValue, public right: Expression) {} }
export class Unary { constructor(public operator: TokenTypeValue, public right: Expression) {} }
export class Literal { constructor(public value: string | number | boolean | null) {} }
export class Variable { constructor(public name: string) {} }
export class Call { constructor(public callee: Expression, public args: Expression[]) {} }
export class ArrayLiteral { constructor(public elements: Expression[]) {} }
export class Index { constructor(public object: Expression, public index: Expression) {} }
export class IndexAssignment { constructor(public object: Expression, public index: Expression, public value: Expression) {} }
export type AstNode = Program | Statement | Expression;