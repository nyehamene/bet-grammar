#include "tree_sitter/parser.h"
#include <bits/posix2_lim.h>

enum TokenType {
  STRING_LINE_END,
  IGNORED,
};

static bool parse_string_line_content(TSLexer *lexer,
                                      const bool *valid_symbols) { //
  if (lexer->eof(lexer)) {
    lexer->result_symbol = STRING_LINE_END;
    return true;
  }
  if (lexer->lookahead == '\n') {
    lexer->result_symbol = STRING_LINE_END;
    return true;
  }
  return false;
}

void *tree_sitter_bet_external_scanner_create() { //
  return NULL;
}

void tree_sitter_bet_external_scanner_destroy(void *payload) { //
}

unsigned tree_sitter_bet_external_scanner_serialize(void *payload,
                                                    char *buffer) {
  return 0;
}

void tree_sitter_bet_external_scanner_deserialize(void *payload, char *buffer,
                                                  unsigned length) { //
}

bool tree_sitter_bet_external_scanner_scan(void *payload, TSLexer *lexer,
                                           const bool *valid_symbols) {
  if (valid_symbols[IGNORED]) {
    return false;
  }
  if (valid_symbols[STRING_LINE_END] &&
      parse_string_line_content(lexer, valid_symbols)) {
    return true;
  }
  return false;
}
