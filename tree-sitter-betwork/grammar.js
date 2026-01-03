/**
 * @file Betwork grammar for tree-sitter
 * @author nyehamene <nhcdeveloper@gmail.com>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

export default grammar({
  name: "betwork",

  rules: {
    // TODO: add the actual grammar rules
    source_file: $ => "hello"
  }
});
