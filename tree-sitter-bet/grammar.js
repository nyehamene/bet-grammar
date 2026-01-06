/**
 * @file Bet grammar for tree-sitter
 * @author nyehamene <nhcdeveloper@gmail.com>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

const PREC = {
  comment: 0,
  top_level_expression: 1,
  ident: 3,
  size: 2,
  binary: 5,
  unary: 4,
}

const terminator = choice(/\n/, ";", "\0");
const hexDigit = /[a-fA-F0-9]/;
const hexDigits = repeat1(hexDigit);
const binaryDigits = repeat1(choice('0', '1'));

const decimalLiteral = choice(
  '0',
  seq(/[0-9]/, repeat(/[0-9]/), optional(seq('.', repeat(/[0-9]/))))
);

const hexadecimalLiteral = seq(choice('0x', '0X'), hexDigits);
const binaryLiteral = seq(choice('0b', '0B'), binaryDigits);

export default grammar({
  name: "bet",

  word: $ => $.identifier,

  inline: $ => [
    $._basic_expression,
    $._css_block,
    $._css_function_parameters,
    $.if_cond_expression,
    $.declaration,
    $.css_list,
  ],

  conflicts: $ => [
    [$.css_expression],
    [$.css_expression, $._color_rgb],
    [$.css_expression, $._color_hsl],
    [$.css_expression, $.css_function_call],
  ],

  extras: $ => [
    /\s/,
    $.comment,
    $.block_comment,
  ],

  supertypes: $ => [
    $._expression,
    $._type,
    $.element,
    $.component_attribute_expression,
    $.component_attribute_identifier,
    $.component_identifier,
    $.css_expression,
    $.declaration,
    $.css_property_identifier,
  ],

  rules: {
    source_file: $ => repeat($.declaration),

    declaration: $ => choice(
      $.element,
      $.const_declaration,
      $.var_declaration,
    ),

    const_declaration: $ => seq(
      field("name", $.identifier),
      ":",
      optional(field("type", $._type)),
      ":",
      field("value", $._expression),
      $._separator,
    ),

    var_declaration: $ => choice(
      seq(
        field("name", $.identifier),
        ":",
        field("type", $._type),
        $._separator,
      ),
      seq(
        field("name", $.identifier),
        ":",
        optional(field("type", $._type)),
        "=",
        field("value", $._expression),
        $._separator,
      ),
    ),

    _type: $ => choice($.member_access, $.identifier),

    _expression: $ => choice(
      $._basic_expression,
      $.string_line_group,
      $.import_builtin,
      $.enum,
      $.component,
      $.style,
    ),

    enum: $ => seq(
      "enum",
      "{",
      repeat($.enum_member),
      "}",
    ),

    enum_member: $ => seq(
      $.identifier,
      $._separator,
    ),

    component: $ => seq(
      "component",
      "{",
      optional($._component_body),
      "}",
    ),

    _component_body: $ => seq(
      repeat($.var_declaration),
      repeat1($.element),
    ),

    import_builtin: $ => seq(
      "@import",
      "(",
      choice($.string, "package"),
      ")",
    ),

    _basic_expression: $ => prec(PREC.top_level_expression,
      choice(
        $.string,
        $.bool,
        $.number,
        $.identifier,
        $.identifier_dot,
        $.member_access,
      )),

    string: $ => seq(
      '"',
      repeat($._string_content),
      '"'
    ),

    _string_content: $ => choice(
      $.escape_char,
      $.string_template_expr,
      token(/[^"\\\n]+?/)
    ),

    string_line_group: $ => prec.right(repeat1($.string_line)),

    string_line: $ => seq(
      '\\\\',
      repeat($._string_line_content),
      optional(token.immediate(/\n/)),
    ),

    _string_line_content: $ => prec.left(choice(
      $.escape_char,
      $.string_template_expr,
      token.immediate(/[^\\\n]+?/),
    )),

    escape_char: _ => token.immediate(seq(
      '\\',
      choice('\\', '"', 't', 'r', 's', 'f', 'v', 'n')
    )),

    string_template_expr: $ => seq('\\{', $._expression, '}'),

    bool: () => choice("true", "false"),

    number: _ => token(choice(
      decimalLiteral,
      hexadecimalLiteral,
      binaryLiteral,
    )),

    identifier: _ => token(/[a-zA-Z_][a-zA-Z0-9_]*/),

    identifier_dot: _ => token(
      /\.[a-zA-Z_-][a-zA-Z0-9_-]*/,
    ),

    identifier_dash: _ => token(
      /(--)?[a-zA-Z_-][a-zA-Z0-9_-]*/,
    ),

    member_access: $ => prec.left(seq(
      field("object", choice($.identifier, $.member_access)),
      ".",
      field("member", $.identifier),
    )),

    _separator: _ => token(terminator),

    comment: _ => prec(PREC.comment, token(seq('//', /[^\n]*/))),

    comment_group: $ => prec.left(repeat1(
      $.comment
    )),

    element: $ => choice(
      $.string_element,
      $.if_element,
      $.cond_element,
      $.component_element,
    ),

    string_element: $ => choice(
      $.string,
      $.string_line_group,
    ),

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
      const property = alias($.component_property, $.property);
      return seq(
        "[",
        optional(seq(property, repeat(seq(";", property)))),
        "]",
      )
    },

    component_property: $ => seq(
      field("name", $.identifier),
      field("value", $._basic_expression),
    ),

    component_attribute_list: $ => {
      const attribute = alias($.component_attribute, $.attribute);
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
      alias($.css_size, $.size),
      alias($.css_percentage, $.percentage),
      alias($.css_function_call, $.function_call),
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
      alias($.css_size, $.size),
      alias($.css_percentage, $.percentage),
      alias($.css_function_call, $.function_call),
      alias($.css_variable, $.variable),
      alias($.css_url, $.url),
      alias($.css_unary, $.unary),
      alias($.css_binary, $.binary),
      alias($.css_color, $.color),
      alias($.css_list, $.list),
    ),

    css_size: _ => token(seq(
      decimalLiteral,
      token.immediate(prec.left(2, repeat1(/[a-zA-Z]/))),
    )),

    css_percentage: _ => token(seq(
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
      choice($.css_property_identifier),
      optional($.css_expression),
      ")",
    ),

    css_url: _ => token(seq(
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
      repeat1(seq(choice(",", "/"), $.css_expression)))),

    block_comment: _ => token(prec(PREC.comment,
      seq(
        '/*',
        /[^*]*\*+([^/*][^*]*\*+)*/,
        '/',
      ),
    )),
  }
});

