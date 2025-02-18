export enum TokenType {
  LEFT_PAREN, RIGHT_PAREN, LEFT_BRACE, RIGHT_BRACE,
  COMMA, DOT, MINUS, PLUS, SEMICOLON, SLASH, STAR,
  BANG, BANG_EQUAL, EQUAL, EQUAL_EQUAL,
  GREATER, GREATER_EQUAL, LESS, LESS_EQUAL,
  IDENTIFIER, STRING, NUMBER,
  AND, CLASS, ELSE, FALSE, FUN, FOR, IF, NIL, OR,
  PRINT, RETURN, SUPER, THIS, TRUE, VAR, WHILE,
  EOF
}

export class Token {
  type: TokenType;
  lexeme: string;
  literal: Object;
  line: number;

  constructor(token: TokenType, lexeme: string, literal: Object, line: number) {
    this.type = token;
    this.lexeme = lexeme;
    this.literal = literal;
    this.line = line;
  }

  toString() {
    return this.type + " " + this.lexeme + " " + this.literal;
  }
}
