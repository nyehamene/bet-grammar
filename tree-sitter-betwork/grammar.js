/**
 * @file Betwork grammar for tree-sitter
 * @author nyehamene <nhcdeveloper@gmail.com>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

export default grammar({
  name: "betwork",

  word: $ => $.identifier,

  externals: $ => [
    // $._string_content,
  ],

  extras: $ => [
    /\s/,
    $.comment
  ],

  rules: {
    source_file: $ => repeat($._stmt),

    _stmts: $ => choice(seq($._stmt, repeat(seq($._separator, $._stmt)))),

    _stmt: $ => seq(choice(
      $.dir_statement,
      $.var_statement,
    ),
      optional($._separator)
    ),

    dir_statement: $ => seq(
      "@dir",
      "(",
      $._expression,
      ")"
    ),

    var_statement: $ => seq(
      $.identifier,
      "::",
      $._expression,
    ),

    _expression: $ => choice(
      $.string,
      $.string_line_group,
      $.number,
      $.member_access,
      $.boolean,
    ),

    identifier: $ => /[a-zA-Z_][a-zA-Z0-9_]*/,
    number: $ => choice(
      $.number_decimal,
      $.number_hexadecimal,
      $.number_binary,
    ),
    number_decimal: $ => token(choice(
      '0',
      seq(/[1-9]/, repeat(/[0-9]/), optional(seq('.', repeat(/[0-9]/))))
    )),
    number_hexadecimal: $ => token(seq(choice('0x', '0X'), repeat1(/[a-fA-F0-9]/))),
    number_binary: $ => token(seq(choice('0b', '0B'), repeat1(choice('0', '1')))),

    member_access: $ => seq($.identifier, repeat(seq(".", $.identifier))),
    boolean: $ => choice("true", "false"),

    string: $ => seq(
      '"',
      repeat($._string_content),
      '"',
    ),

    string_line: $ => seq(
      '\\\\',
      repeat($._string_content),
      '\n'
    ),

    string_line_group: $ => repeat1($.string_line),

    _string_content: $ => choice(
      $.escape_char,
      $.string_template_expr,
      /[^\n"]/,
    ),

    string_template_expr: $ =>
      seq("\\{", $._expression, "}")
    ,

    escape_char: $ => choice(
      "\\\\",
      "\\\"",
      "\\t",
      "\\r",
      "\\s",
      "\\f",
      "\\v",
      "\\n",
    ),

    comment: $ => token(seq('//', /[^\n]*/, optional('\n'))),

    _separator: $ => choice(
      ";",
      "\n",
    ),
  }
});
