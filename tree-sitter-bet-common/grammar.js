/**
 * @file Bet grammar for tree-sitter
 * @author nyehamene <nhcdeveloper@gmail.com>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

import {
  bool,
  escape_char,
  identifier,
  identifier_dot,
  identifier_dash,
  identifier_blank,
  identifier_builtin,
  decimalLiteral,
  hexadecimalLiteral,
  binaryLiteral,
  _separator,
} from "./literal_grammar.js"

import styleGrammar from "./style_grammar.js"
import elementGrammar from "./element_grammar.js"

/**
 * @param {string} dialect
 */
export function defineGrammar(dialect) {
  return grammar({
    name: dialect,

    word: $ => $.identifier,

    extras: $ => [
      /\s/,
      $.comment_line,
      $.comment_block,
    ],

    supertypes: $ => [
      $.expression,
      $.element,
      $.component_attribute_expression,
      $.component_attribute_identifier,
      $.component_identifier,
      $.css_expression,
      $.declaration,
      $.css_property_identifier,
    ],

    inline: $ => [
      $._css_block,
      $._css_function_parameters,
      $.if_cond_expression,
      $.css_list,
    ],

    conflicts: $ => [
      [$.css_expression],
      [$.css_expression, $._color_rgb],
      [$.css_expression, $._color_hsl],
      [$.css_expression, $.css_function_call],
      [$._identifier_any, $._basic_expression],
      [$.declaration, $.expression],
    ],

    rules: {
      source_file: $ => seq(
        repeat(choice(
          seq($.declaration, $._separator),
          $.element,
        )),
        optional($.declaration),
      ),

      bool,
      escape_char,
      identifier,
      identifier_dot,
      identifier_dash,
      identifier_builtin,
      identifier_blank,
      _separator,

      ...elementGrammar,
      ...styleGrammar,

      _identifier_any: $ => choice(
        $.identifier,
        $.identifier_dot,
        $.identifier_dash,
        $.identifier_builtin,
      ),

      _type: $ => choice($.member_access, alias($.identifier, $.type_identifier)),

      _basic_expression: $ => choice(
        $.string,
        $.string_line,
        $.bool,
        $.number,
        $.identifier,
        $.identifier_dot,
        $.identifier_blank,
        $.member_access,
        $.keyword,
      ),

      _argument_list: $ => seq(
        "(",
        optional(
          seq(
            $.expression,
            repeat(seq(",", $.expression)),
            optional(","),
          )),
        ")",
      ),

      member_access: $ => prec.left(seq(
        field("object", choice($.identifier, $.member_access)),
        ".",
        field("member", choice($.identifier, "*")),
      )),

      string: $ => seq(
        '"',
        repeat(choice(
          $._string_content,
          $.escape_char,
          $.template_expression,
        )),
        '"'
      ),

      _string_content: $ => token(prec(12, /[^"\\\n]/)),

      string_line: $ => token(
        /\\\\[^\n]*/
      ),

      template_expression: $ => seq(
        field("open", '\\{'), $.expression,
        field("close", '}')
      ),

      number: $ => token(choice(
        decimalLiteral,
        hexadecimalLiteral,
        binaryLiteral,
      )),

      keyword: $ => token(seq(
        "'",
        choice(
          /[a-zA-Z_][a-zA-Z0-9_-]*/,
          /(--)?[a-zA-Z_-][a-zA-Z0-9_-]*/,
        ),
      )),

      _variable_identifier: $ => choice($.identifier, $.identifier_blank),

      call: $ => prec(5, seq(field("name", $._identifier_any), $._argument_list)),

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
        optional($._component_property_list),
        repeat1($.element),
      ),

      _component_property_list: $ => seq(
        $.var_declaration,
        repeat(seq($._separator, $.var_declaration)),
        optional($._separator)
      ),

      expression: $ =>
        choice(
          $._basic_expression,
          $.call,
          $.enum,
          $.component,
          $.style,
        ),

      declaration: $ => choice(
        $.const_declaration,
        $.var_declaration,
        $.enum,
        // allow expression to enable
        // parsing partial code snippets
        $.expression,
      ),

      var_declaration: $ => choice(
        seq(
          field("name", $._variable_identifier),
          ":",
          field("type", $._type),
        ),
        seq(
          field("name", $._variable_identifier),
          ":",
          optional(field("type", $._type)),
          "=",
          field("value", $.expression),
        ),
      ),

      const_declaration: $ => seq(
        field("name", $._variable_identifier),
        ":",
        optional(field("type", $._type)),
        ":",
        field("value", $.expression),
      ),

      comment_line: $ => token(
        seq('//', /[^\n]*/)
      ),

      comment_line_group: $ => seq(
        alias($.comment_line, $.comment),
        repeat(alias($.comment_line, $.comment))
      ),

      comment_block: $ => token(
        seq(
          '/*',
          /[^*]*\*+([^/*][^*]*\*+)*/,
          '/',
        ),
      ),
    }
  })
}
