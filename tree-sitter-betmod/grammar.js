/**
 * @file Betmod grammar for tree-sitter
 * @author nyehamene <nhcdeveloper@gmail.com>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check


import { defineGrammar } from "../tree-sitter-bet-common/grammar.js";

const name = "betmod"

export default defineGrammar(name);
