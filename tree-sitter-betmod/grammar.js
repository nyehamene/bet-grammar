/**
 * @file Betmod grammar for tree-sitter
 * @author nyehamene <nhcdeveloper@gmail.com>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

export default grammar({
  name: "betmod",

  extras: $ => [
    /\s/,
    $.comment
  ],

  inline: $ => [
    $.string_content,
    $._arguments,
  ],

  rules: {
    source_file: $ => repeat(choice(
      $._declaration,
      $.comment
    )),

    _declaration: $ => seq(
      $._decl_inner,
      repeat(seq($._separator, $._decl_inner))
    ),

    _decl_inner: $ => choice(
      $.const_declaration,
      $._builtin_declaration
    ),

    const_declaration: $ => seq(
      $.identifier,
      ':',
      optional($.member_access),
      ':',
      $._expression
    ),

    _builtin_declaration: $ => choice(
      $.package_builtin,
      $.version_builtin,
      $.require_builtin,
      $.export_builtin
    ),

    _expression: $ => choice(
      $.string,
      $.number,
      $.boolean,
      $.member_access,
      $._builtin_declaration
    ),

    package_builtin: $ => seq('@package', '(', $._expression, optional($._separator), ')'),
    version_builtin: $ => seq('@version', '(', $._expression, optional($._separator), ')'),
    require_builtin: $ => seq('@require', '(', $._arguments, optional($._separator), ')'),
    export_builtin: $ => seq('@export', '(', $._arguments, optional($._separator), ')'),

    _arguments: $ => choice(
      $._expression,
      $.argument_list
    ),

    argument_list: $ => prec.left(
      seq($._expression, repeat1(seq($._separator, $._expression)))
    ),

    member_access: $ => choice(
      $.identifier,
      seq(
        $.identifier,
        repeat(seq('.', $.identifier)),
        optional(seq('.', '*'))
      )),

    identifier: $ => /[a-zA-Z_][a-zA-Z0-9_]*/,

    number: $ => choice(
      $._number_decimal,
      $._number_hexadecimal,
      $._number_binary,
    ),
    _number_decimal: $ => token(choice(
      '0',
      seq(/[1-9]/, repeat(/[0-9]/), optional(seq('.', repeat(/[0-9]/))))
    )),
    _number_hexadecimal: $ => token(seq(choice('0x', '0X'), repeat1(/[a-fA-F0-9]/))),
    _number_binary: $ => token(seq(choice('0b', '0B'), repeat1(choice('0', '1')))),

    boolean: $ => choice("true", "false"),

    string: $ => seq(
      '"',
      repeat($.string_content),
      ('"')
    ),

    string_line: $ => seq(
      '\\\\',
      repeat($.string_content),
      '\n'
    ),

    string_line_group: $ => repeat1($.string_line),

    string_content: $ => choice(
      $.escape_char,
      $.string_template_expr,
      token(/[^"\n]+/)
    ),

    escape_char: $ => choice(
      '\\\\', '\\"', '\\t', '\\r', '\\s', '\\f', '\\v', '\\n'
    ),

    string_template_expr: $ => seq('\\{', $._expression, '}'),

    comment: $ => token(seq('//', /[^\n]*/, optional('\n'))),

    _separator: $ => choice(";", "\n"),
  }
});
