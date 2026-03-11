/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

import { decimalLiteral, hexDigits, PREC } from "./literal_grammar.js"

export default {
  style: $ => seq(
    "style",
    optional($._style_params),
    $._css_block
  ),

  _style_params: $ => seq(
    "(",
    optional(
      seq(
        $.style_param,
        repeat(seq(",", $.style_param)),
        optional(","),
      )
    ),
    ")",
  ),

  style_param: $ => seq(
    $.identifier,
    ":",
    choice($.identifier, $.member_access),
    optional(seq("=", alias($.component_attribute_expression, $.expression))),
    optional($.style_param_tag)
  ),

  style_param_tag: $ => seq("@", "var", "(", $.string, repeat(seq(",", $.string)), optional(","), ")"),

  _css_block: $ => seq(
    "{",
    optional($._style_rules),
    "}",
  ),

  _style_rules: $ => seq(
    $.style_rule,
    repeat(seq(";", $.style_rule)),
    optional(";")
  ),

  style_rule: $ => $._css_declaration,

  _css_declaration: $ => choice(
    $.css_property_declaration,
    // $.css_at_rule,
    // $.css_nesting,
  ),

  css_property_declaration: $ => seq(
    field("name", $.css_property_identifier),
    ":",
    field("value", $.property_value),
    optional(field("modifier", "!important")),
  ),

  css_property_identifier: $ => choice(
    $.identifier,
    alias($.identifier_dash, $.identifier),
  ),

  property_value: $ => seq(
    $.css_expression,
    repeat($.css_expression),
  ),

  css_expression: $ => choice(
    $.identifier,
    $.string,
    $.number,
    $.bool,
    $.css_size,
    $.color_hex,
    $.css_unary_expr,
    $.css_binary_expr,
    $.css_percentage,
    $.css_function_call,
    $.css_expression_list,
    seq("(", $.css_expression, ")"),
    alias($.identifier_dash, $.identifier),
  ),

  css_calc_expr: $ => choice(
    $.css_unary_expr,
    $.css_binary_expr,
  ),

  css_unary_expr: $ => seq(
    token(prec.right(PREC.unary, choice("+", "-"))),
    $.css_expression,
  ),

  css_binary_expr: $ => prec.left(PREC.binary,
    seq(
      $.css_expression,
      token(choice("*", "/", "+", "-")),
      $.css_expression),
  ),

  css_function_call: $ => seq(
    choice($.identifier, $.identifier_dash),
    "(",
    repeat(choice($.css_calc_expr, $.css_expression)),
    optional(","),
    ")",
  ),

  css_size: $ => token(seq(
    decimalLiteral,
    token.immediate(prec.left(2, repeat1(/[a-zA-Z]/))),
  )),

  css_percentage: $ => token(seq(
    decimalLiteral,
    token.immediate("%"),
  )),

  color_hex: _ => token(seq("#", hexDigits)),

  css_expression_list: $ => prec.left(
    seq(
      $.css_expression,
      repeat1(seq(choice(",", "/"), $.css_expression))
    )
  ),
}
