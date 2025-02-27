import { Token, TokenType  } from './token';

export interface Expr {
  accept<R>(visitor: ExprVisitor<R>): R;
}

export interface ExprVisitor<R> {
  visitBinaryExpr(expr: BinaryExpr): R;
  visitGroupingExpr(expr: GroupingExpr): R;
  visitLiteralExpr(expr: LiteralExpr): R;
  visitUnaryExpr(expr: UnaryExpr): R;
}

export class BinaryExpr implements Expr {
  left: Expr;
  operator: Token;
  right: Expr;

  constructor(left: Expr, operator: Token, right: Expr) {
    this.left = left;
    this.operator = operator;
    this.right = right;
  }

  accept<R>(visitor: ExprVisitor<R>): R {
    return visitor.visitBinaryExpr(this);
  }
}

export class GroupingExpr implements Expr {
  expression: Expr;

  constructor(expression: Expr) {
    this.expression = expression;
  }

  accept<R>(visitor: ExprVisitor<R>): R {
    return visitor.visitGroupingExpr(this);
  }
}

export class LiteralExpr implements Expr {
  value: true | false | null | number | string;

  constructor(value: true | false | null | number | string) {
    this.value = value;
  }

  accept<R>(visitor: ExprVisitor<R>): R {
    return visitor.visitLiteralExpr(this);
  }
}

export class UnaryExpr implements Expr {
  operator: Token;
  right: Expr;

  constructor(operator: Token, right: Expr) {
    this.operator = operator;
    this.right = right;
  }

  accept<R>(visitor: ExprVisitor<R>): R {
    return visitor.visitUnaryExpr(this);
  }
}


