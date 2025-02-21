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
  constructor(
    public left: Expr,
    public operator: Token,
    public right: Expr
  ) {}

  accept<R>(visitor: ExprVisitor<R>): R {
    return visitor.visitBinaryExpr(this);
  }
}

export class GroupingExpr implements Expr {
  constructor(public expression: Expr) {}

  accept<R>(visitor: ExprVisitor<R>): R {
    return visitor.visitGroupingExpr(this);
  }
}

export class LiteralExpr implements Expr {
  constructor(public value: any) {}

  accept<R>(visitor: ExprVisitor<R>): R {
    return visitor.visitLiteralExpr(this);
  }
}

export class UnaryExpr implements Expr {
  constructor(
    public operator: Token,
    public right: Expr
  ) {}

  accept<R>(visitor: ExprVisitor<R>): R {
    return visitor.visitUnaryExpr(this);
  }
}


