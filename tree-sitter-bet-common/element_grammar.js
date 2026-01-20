/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

export default {
  element: $ => choice(
    $.string_element,
    $.if_element,
    $.cond_element,
    $.component_element,
  ),

  string_element: $ => prec(15, choice(
    $.string,
    $.string_line,
  )),

  if_element: $ => seq(
    "(",
    "if",
    field("cond", $.if_cond_expression),
    field("then", $.element),
    optional(field("else", $.element)),
    ")",
  ),

  if_cond_expression: $ => $._basic_expression,

  cond_element: $ => seq(
    "(",
    "cond",
    field("selector", $.if_cond_expression),
    optional(alias($.cond_element_case_list, $.case_list)),
    ")",
  ),

  cond_element_case_list: $ => repeat1(
    alias($.cond_element_case, $.case),
  ),

  cond_element_case: $ => seq(
    field("match", $.if_cond_expression),
    field("branch", $.element),
  ),

  component_element: $ => seq(
    "(",
    field("tag", $.component_identifier),
    optional(alias($.component_property_list, $.properties)),
    repeat(alias($.component_attribute_list, $.attributes)),
    alias(repeat($.element), $.children),
    ")",
  ),

  component_identifier: $ => choice(
    $.identifier,
    alias($.identifier_dash, $.identifier),
    $.member_access,
  ),

  component_property_list: $ => {
    const property = alias($.component_property, $.property)
    return seq(
      "[",
      optional(seq(property, repeat(seq(";", property)))),
      "]",
    )
  },

  component_property: $ => seq(
    field("name", $.identifier),
    optional(seq(
      ":",
      field("value", $._basic_expression))),
  ),

  component_attribute_list: $ => {
    const attribute = alias($.component_attribute, $.attribute)
    return seq(
      "{",
      optional(seq(attribute, repeat(seq(";", attribute)))),
      "}",
    )
  },

  component_attribute: $ => seq(
    field("name", $.component_attribute_identifier),
    optional(seq(
      ":",
      field("value", alias($._component_attribute_expression_list, $.attribue_value)))),
  ),

  component_attribute_identifier: $ => choice(
    $.identifier,
    alias($.identifier_dash, $.identifier),
  ),

  _component_attribute_expression_list: $ => seq(
    $.component_attribute_expression,
    repeat($.component_attribute_expression),
  ),

  component_attribute_expression: $ => choice(
    $._basic_expression,
    $.if_attribute_expression,
    $.cond_attribute_expression,
    $.template_expression,
    $.css_function_call,
    alias($.css_size, $.size),
    alias($.css_percentage, $.percentage),
    alias($.css_variable, $.variable),
    alias($.css_url, $.url),
    alias($.css_unary, $.unary),
    alias($.css_binary, $.binary),
    alias($.css_color, $.color),
    alias($.css_list, $.list),
  ),

  if_attribute_expression: $ => seq(
    "(",
    "if",
    field("cond", $._basic_expression),
    field("then", $.if_attribute_expression),
    optional(field("else", $.if_attribute_expression)),
    ")",
  ),

  cond_attribute_expression: $ => seq(
    "(",
    "cond",
    field("selector", $._basic_expression),
    optional(alias($.cond_attribute_expression_case_list, $.case_list)),
    ")",
  ),

  cond_attribute_expression_case_list: $ => repeat1(
    alias($.cond_attribute_expression_case, $.case),
  ),

  cond_attribute_expression_case: $ => seq(
    field("match", $._basic_expression),
    field("branch", $.if_attribute_expression),
  ),
}
