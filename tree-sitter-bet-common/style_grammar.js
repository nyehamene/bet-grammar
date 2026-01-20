/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

import { decimalLiteral, hexDigits, PREC } from "./literal_grammar.js"

export default {
  style: $ => seq("style", $._css_block),

  _css_block: $ => seq(
    "{",
    repeat($.css_property_declaration),
    "}",
  ),

  css_property_declaration: $ => seq(
    field("name", $.css_property_identifier),
    ":",
    field("value", alias($._css_expression_list, $.property_value)),
    field("modifier", optional("!important")),
    token(";"),
  ),

  css_property_identifier: $ => choice(
    $.identifier,
    alias($.identifier_dash, $.identifier),
  ),

  _css_expression_list: $ => seq(
    $.css_expression,
    repeat($.css_expression),
  ),

  css_expression: $ => choice(
    $.identifier,
    $.identifier_dot,
    $.string,
    $.number,
    $.template_expression,
    $.css_variable,
    $.css_function_call,
    $.css_url,
    alias($.css_size, $.size),
    alias($.css_percentage, $.percentage),
    alias($.css_unary, $.unary),
    alias($.css_binary, $.binary),
    alias($.css_color, $.color),
    alias($.css_list, $.list),
  ),

  css_size: $ => token(seq(
    decimalLiteral,
    token.immediate(prec.left(2, repeat1(/[a-zA-Z]/))),
  )),

  css_percentage: $ => token(seq(
    decimalLiteral,
    token.immediate("%"),
  )),

  css_color: $ => choice(
    alias($._color_hex, ""),
    alias($._color_rgb, ""),
    alias($._color_hsl, ""),
    "currentcolor",
  ),

  _color_rgb: $ => seq(
    choice("rgb", "rgba"),
    "(",
    $.css_expression,
    ",",
    $.css_expression,
    ",",
    $.css_expression,
    optional(seq(",", $.css_expression)),
    ")",
  ),

  _color_hsl: $ => seq(
    choice("hsl", "hsla"),
    "(",
    $.css_expression,
    ",",
    $.css_expression,
    ",",
    $.css_expression,
    optional(seq(",", $.css_expression)),
    ")",
  ),

  _color_hex: _ => token(seq("#", hexDigits)),

  css_function_call: $ => seq(
    field("name", $.css_property_identifier),
    token(prec.left(3, "(")),
    alias(
      seq($._css_function_parameters,
        repeat(seq(",", $._css_function_parameters))),
      $.parameters),
    ")",
  ),

  _css_function_parameters: $ => $.css_expression,

  css_variable: $ => seq(
    "var",
    "(",
    field("name", choice($.css_property_identifier)),
    optional(field("fallback", $.css_expression)),
    ")",
  ),

  css_url: $ => token(seq(
    "url",
    "(",
    repeat(/[^\)\n]/),
    ")",
  )),

  css_unary: $ => seq(
    token(prec.right(PREC.unary, choice("+", "-"))),
    choice($.number, $.css_size, $.css_percentage),
  ),

  css_binary: $ => prec.left(PREC.binary,
    seq(
      $.css_expression,
      token(choice("*", "/", "+", "-")),
      $.css_expression),
  ),

  css_list: $ => prec.left(seq(
    $.css_expression,
    repeat1(seq(choice(",", "/"), $.css_expression)))
  ),
}
