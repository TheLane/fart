export class Program { constructor(statements) { this.statements = statements; } }
export class FunctionDeclaration { constructor(name, params, body) { this.name=name; this.params=params; this.body=body; } }
export class VariableDeclaration { constructor(name, initializer) { this.name=name; this.initializer=initializer; } }
export class Block { constructor(statements) { this.statements=statements; } }
export class IfStatement { constructor(condition, thenBranch, elseBranch) { this.condition=condition; this.thenBranch=thenBranch; this.elseBranch=elseBranch; } }
export class WhileStatement { constructor(condition, body) { this.condition=condition; this.body=body; } }
export class ReleaseStatement { constructor(value) { this.value=value; } }
export class ExpressionStatement { constructor(expression) { this.expression=expression; } }
export class Assignment { constructor(name, value) { this.name=name; this.value=value; } }
export class Binary { constructor(left, operator, right) { this.left=left; this.operator=operator; this.right=right; } }
export class Unary { constructor(operator, right) { this.operator=operator; this.right=right; } }
export class Literal { constructor(value) { this.value=value; } }
export class Variable { constructor(name) { this.name=name; } }
export class Call { constructor(callee, args) { this.callee=callee; this.args=args; } }
