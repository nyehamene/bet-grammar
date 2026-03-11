/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

/**
 * @param {Object<string, Rule>} options
 * @returns {GrammarSymbols<any>}
 */
const defineGrammar = (options) => {
  return {}
}

export default {
  element: $ => choice(
    $.string_element,
    $.if_element,
    $.cond_element,
    $.component_element,
  ),

  string_element: $ => prec(2, choice(
    $.string,
    $.string_line,
  )),

  if_element: $ => seq(
    "(",
    "if",
    field("cond", $.expression),
    field("then", $.element),
    optional(field("else", $.element)),
    ")",
  ),

  cond_element: $ => seq(
    "(",
    "cond",
    field("selector", $.expression),
    optional(alias($.cond_element_case_list, $.case_list)),
    ")",
  ),

  cond_element_case_list: $ => repeat1(
    alias($.cond_element_case, $.case),
  ),

  cond_element_case: $ => seq(
    field("match", $.expression),
    field("branch", $.element),
  ),

  component_element: $ => seq(
    "(",
    field("tag", $.component_identifier),
    optional(alias($.component_property_list, $.properties)),
    repeat(choice(
      alias($.component_attribute_list, $.attributes),
      $.element,
    )),
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
      // optional(seq(property, repeat(seq(";", property)))),
      optional(
        seq(
          property,
          repeat(seq(optional(","), property)),
          optional(","),
        )
      ),
      "]",
    )
  },

  component_property: $ => seq(
    field("name", $.identifier),
    optional(seq(
      "=",
      field("value", alias($.component_attribute_expression, $.expression))
    )),
  ),

  component_attribute_list: $ => {
    const attribute = alias($.component_attribute, $.attribute)
    return seq(
      "{",
      optional(
        seq(
          attribute,
          repeat(seq(optional(","), attribute)),
          optional(","),
        )
      ),
      "}",
    )
  },

  component_attribute: $ => seq(
    field("name", $._component_attribute_identifier),
    optional(
      seq(
        "=",
        field("value", alias($.component_attribute_expression, $.attribue_value))
      )
    ),
  ),

  _component_attribute_identifier: $ => choice(
    $.string,
    $.identifier,
    alias($.identifier_dash, $.identifier),
    seq($.identifier, ":", $._component_attribute_identifier),
  ),

  component_attribute_expression: $ => choice(
    $.identifier,
    $.string,
    $.string_line_group,
    $.member_access,
    $.number,
    $.bool,
    $.call,
    $.if_expression,
    $.cond_expression,
    alias($.identifier_dash, $.identifier),
    alias($.css_size, $.size),
    alias($.css_percentage, $.percentage),
    alias($.color_hex, $.color),
  ),
}
