/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

const PREC = {
  top_level_expression: 1,
  ident: 3,
  size: 2,
  binary: 5,
  unary: 4,
}

const hexDigit = /[a-fA-F0-9]/;

const hexDigits = repeat1(hexDigit);

const decimalLiteral = choice(
  '0',
  seq(/[0-9]/, repeat(/[0-9]/), optional(seq('.', repeat(/[0-9]/))))
);

const binaryDigits = repeat1(choice('0', '1'));

const hexadecimalLiteral = seq(choice('0x', '0X'), hexDigits);
const binaryLiteral = seq(choice('0b', '0B'), binaryDigits);

const bool = () => choice("true", "false");

const identifier = () => token(/[a-zA-Z_][a-zA-Z0-9_]*/);

const identifier_blank = () => token("_");

const identifier_dot = () => token(
  /\.[a-zA-Z_-][a-zA-Z0-9_-]*/,
);

const identifier_dash = () => token(
  /(--)?[a-zA-Z_-][a-zA-Z0-9_-]*/,
);

const identifier_builtin = () => token(
  /@[a-zA-Z_][a-zA-Z0-9_-]*/,
);

const escape_char = () => token(/\\[^\{]/);


const _separator = $ => token(choice(/\n/, ";", "\0"));

export {
  PREC,
  hexDigit,
  hexDigits,
  decimalLiteral,
  hexadecimalLiteral,
  binaryLiteral,
  bool,
  identifier,
  identifier_blank,
  identifier_dot,
  identifier_dash,
  identifier_builtin,
  escape_char,
  _separator,
}
