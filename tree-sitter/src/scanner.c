// tree-sitter/src/scanner.c
#include "tree_sitter/parser.h"
#include <string.h>
#include <stdbool.h>
#include <stdio.h> // For debugging

enum TokenType {
    STRING_CONTENT_FRAGMENT,        // Non-escaped, non-quote content of a regular string
    STRING_TEMPLATE_CONTENT_FRAGMENT, // Non-escaped, non-quote, non-interpolation content of a template string
    ESCAPE_SEQUENCE,                // Any \x sequence
};

void *tree_sitter_bet_external_scanner_create() {
    return NULL;
}

void tree_sitter_bet_external_scanner_destroy(void *payload) {}

unsigned tree_sitter_bet_external_scanner_serialize(void *payload, char *buffer) {
    return 0;
}

void tree_sitter_bet_external_scanner_deserialize(void *payload, const char *buffer, unsigned length) {}

bool tree_sitter_bet_external_scanner_scan(void *payload, TSLexer *lexer, const bool *valid_symbols) {
    // Skip whitespace before scanning for tokens
    // Note: tree-sitter's grammar `extras` usually handles this.
    // However, if the external scanner needs to consume leading whitespace
    // that the grammar *doesn't* define as `extras`, it can be done here.
    // For this context, string contents don't usually start with significant whitespace
    // unless it's part of the literal content. We'll rely on grammar's `extras`.

    // Handle Escape Sequences (e.g., \n, \", \\)
    if (valid_symbols[ESCAPE_SEQUENCE] && lexer->lookahead == '\\') {
        lexer->advance(lexer, false); // Consume '\'
        if (lexer->lookahead != 0 && lexer->lookahead != '\n') { // Don't consume newline for multiline string logic
            lexer->advance(lexer, false); // Consume escaped char
            lexer->result_symbol = ESCAPE_SEQUENCE;
            return true;
        }
        return false; // Incomplete escape sequence or bare backslash at line end
    }

    // Handle STRING_CONTENT_FRAGMENT
    // This is for regular strings: consume anything until next quote, backslash, or EOF/newline
    if (valid_symbols[STRING_CONTENT_FRAGMENT]) {
        bool advanced_once = false;
        while (lexer->lookahead != 0 && lexer->lookahead != '"' && lexer->lookahead != '\\' && lexer->lookahead != '\n') {
            lexer->advance(lexer, false);
            advanced_once = true;
        }
        if (advanced_once) {
            lexer->result_symbol = STRING_CONTENT_FRAGMENT;
            return true;
        }
    }

    // Handle STRING_TEMPLATE_CONTENT_FRAGMENT
    // This is for template strings: consume anything until next quote, backslash, '{', or EOF/newline
    if (valid_symbols[STRING_TEMPLATE_CONTENT_FRAGMENT]) {
        bool advanced_once = false;
        while (lexer->lookahead != 0 && lexer->lookahead != '"' && lexer->lookahead != '\\' && lexer->lookahead != '{' && lexer->lookahead != '\n') {
            lexer->advance(lexer, false);
            advanced_once = true;
        }
        if (advanced_once) {
            lexer->result_symbol = STRING_TEMPLATE_CONTENT_FRAGMENT;
            return true;
        }
    }

    // Nothing matched
    return false;
}
