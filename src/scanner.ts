import { Token, TokenType } from "./token";
import { Reda } from "./index.ts";

export class Scanner {
  private source: string;
  private tokens: Token[];
  private start: number = 0;
  private current: number = 0;
  private line: number = 1;

  private keywords: Map<string, TokenType>;

  constructor(source: string) {
    this.source = source;
    this.tokens = [];
    this.keywords = new Map<string, TokenType>([
      ["and", TokenType.AND],
      ["class", TokenType.CLASS],
      ["else", TokenType.ELSE],
      ["false", TokenType.FALSE],
      ["for", TokenType.FOR],
      ["fun", TokenType.FUN],
      ["if", TokenType.IF],
      ["nil", TokenType.NIL],
      ["or", TokenType.OR],
      ["print", TokenType.PRINT],
      ["return", TokenType.RETURN],
      ["super", TokenType.SUPER],
      ["this", TokenType.THIS],
      ["true", TokenType.TRUE],
      ["var", TokenType.VAR],
      ["while", TokenType.WHILE],
    ]);
  }

  private isAtEnd(): boolean {
    return this.current >= this.source.length;
  }

  private advance(): string {
    this.current++;
    return this.source[this.current - 1];
  }

  private addToken(type: TokenType): void {
    this.addTokenWithLiteral(type, null);
  }

  private addTokenWithLiteral(type: TokenType, literal: Object) {
    let text: string = this.source.substring(this.start, this.current);
    this.tokens.push(new Token(type, text, literal, this.line));
  }

  private scanToken(): void {
    let char: string = this.advance();

    switch (char) {
      case "(":
        this.addToken(TokenType.LEFT_PAREN);
        break;
      case ")":
        this.addToken(TokenType.RIGHT_PAREN);
        break;
      case "{":
        this.addToken(TokenType.LEFT_BRACE);
        break;
      case "}":
        this.addToken(TokenType.RIGHT_BRACE);
        break;
      case ",":
        this.addToken(TokenType.COMMA);
        break;
      case ".":
        this.addToken(TokenType.DOT);
        break;
      case "-":
        this.addToken(TokenType.MINUS);
        break;
      case "+":
        this.addToken(TokenType.PLUS);
        break;
      case ";":
        this.addToken(TokenType.SEMICOLON);
        break;
      case "*":
        this.addToken(TokenType.STAR);
        break;
      case "!": {
        this.addToken(this.match("=") ? TokenType.BANG_EQUAL : TokenType.BANG);
        break;
      }
      case "=": {
        this.addToken(
          this.match("=") ? TokenType.EQUAL_EQUAL : TokenType.EQUAL,
        );
        break;
      }
      case "<": {
        this.addToken(this.match("=") ? TokenType.LESS_EQUAL : TokenType.LESS);
        break;
      }
      case ">": {
        this.addToken(
          this.match("=") ? TokenType.GREATER_EQUAL : TokenType.GREATER,
        );
        break;
      }
      case "/": {
        if (this.match("/")) {
          while (this.peek() != "\n" && !this.isAtEnd()) {
            this.advance();
          }
        } else {
          this.addToken(TokenType.SLASH);
        }
        break;
      }
      case " ":
      case "\r":
      case "\t":
        break;
      case "\n":
        this.line++;
        break;
      case '"':
        this.string();
        break;
      default: {
        if (this.isDigit(char)) {
          this.number();
        } else if (this.isAlpha(char)) {
          this.identifier();
        } else {
          Reda.error(this.line, "Unexpected character.");
        }
        break;
      }
    }
  }

  scanTokens(): Token[] {
    while (!this.isAtEnd()) {
      this.start = this.current;
      this.scanToken();
    }

    this.tokens.push(new Token(TokenType.EOF, "", null, this.line));

    return this.tokens;
  }

  private identifier(): void {
    while (this.isAlphaNumeric(this.peek())) this.advance();
    let text:string = this.source.substring(this.start, this.current);
    let type:TokenType = this.keywords.get(text);
    if (type == null) type = TokenType.IDENTIFIER;
    this.addToken(TokenType.IDENTIFIER);
  }

  private number(): void {
    while (this.isDigit(this.peek())) this.advance();

    if (this.peek() == "." && this.isDigit(this.peekNext())) {
      this.advance();

      while (this.isDigit(this.peek())) this.advance();
    }

    let value: number = parseFloat(
      this.source.substring(this.start, this.current),
    );
    this.addTokenWithLiteral(TokenType.NUMBER, value);
  }

  private string() {
    while (this.peek() != '"' && !this.isAtEnd()) {
      if (this.peek() == "\n") this.line++;
      this.advance();
    }

    if (this.isAtEnd()) {
      Reda.error(this.line, "Unterminated string.");
      return;
    }

    this.advance();

    let value: string = this.source.substring(this.start + 1, this.current - 1);
    this.addTokenWithLiteral(TokenType.STRING, value);
  }

  private match(expected: string): boolean {
    if (this.isAtEnd()) return false;
    if (this.source.charAt(this.current) != expected) return false;

    this.current++;
    return true;
  }

  private peek(): string {
    if (this.isAtEnd()) return "\0";
    return this.source.charAt(this.current);
  }

  private peekNext(): string {
    if (this.current + 1 >= this.source.length) return "\0";
    return this.source.charAt(this.current + 1);
  }

  private isAlpha(c: string): boolean {
    return (c >= "a" && c <= "z") || (c >= "A" && c <= "Z") || c == "=";
  }

  private isAlphaNumeric(c:string): boolean {
    return this.isAlpha(c) || this.isDigit(c);
  }

  private isDigit(c: string): boolean {
    return c >= "0" && c <= "9";
  }
}
