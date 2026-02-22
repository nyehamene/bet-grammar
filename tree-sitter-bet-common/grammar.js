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
  keyword,
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
      $.css_list,
    ],

    conflicts: $ => [
      [$.css_expression],
      [$.css_expression, $._color_rgb],
      [$.css_expression, $._color_hsl],
      [$.css_expression, $.css_function_call],
      [$._identifier_any, $._basic_expression],
      [$.component_identifier, $._identifier_any],
      [$._identifier_any, $.member_access],
      [$._identifier_any, $._type],
      [$._variable_identifier, $.comment_documentation],
      [$.cond_element, $.cond_expression],
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
      keyword,
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
        field("object", $.expression),
        ".",
        field("member", choice($.identifier, "*", $.call)),
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
        choice($.const_declaration, $.var_declaration),
        repeat(seq($._separator, choice($.const_declaration, $.var_declaration))),
        optional($._separator)
      ),

      expression: $ =>
        choice(
          $._basic_expression,
          $.if_expression,
          $.cond_expression,
          $.call,
        ),

      _top_level_expression: $ => choice(
        $.expression,
        $.enum,
        $.component,
        $.style,
      ),

      if_expression: $ => seq(
        "(",
        "if",
        field("cond", $.expression),
        field("then", $.expression),
        field("else", $.expression),
        ")",
      ),

      cond_expression: $ => seq(
        "(",
        "cond",
        field("selector", $.expression),
        optional(alias($.cond_case_expression_list, $.case_list)),
        ")",
      ),

      cond_case_expression_list: $ => repeat1(
        alias($.cond_case_expression, $.case),
      ),

      cond_case_expression: $ => seq(
        field("match", $.expression),
        field("branch", $.expression),
      ),

      declaration: $ => choice(
        $.const_declaration,
        $.var_declaration,
        $.comment_documentation,
        // allow expression to enable
        // parsing partial code snippets
        $._top_level_expression,
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
          field("value", $._top_level_expression),
        ),
      ),

      const_declaration: $ => seq(
        field("name", $._variable_identifier),
        ":",
        optional(field("type", $._type)),
        ":",
        field("value", $._top_level_expression),
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

      comment_documentation: $ => seq(
        field("name", alias($.identifier, $.documentation_identifier)),
        ":",
        choice(
          alias($.string, $.documentation_string),
          seq(
            $.documentation_string_line,
            repeat(seq("\n", $.documentation_string_line)),
            optional("\n"),
          ),
        ),
      ),

      documentation_string_line: $ => {
        const document_string = alias($.string_line, "");
        return document_string;
      },

    }
  })
}
