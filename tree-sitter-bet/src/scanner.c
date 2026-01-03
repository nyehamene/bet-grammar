#include "tree_sitter/parser.h"

enum TokenType {
  CSS_COMMENT_CONTENT,
};

void *tree_sitter_bet_external_scanner_create() { return NULL; }
void tree_sitter_bet_external_scanner_destroy(void *p) {}
void tree_sitter_bet_external_scanner_reset(void *p) {}
unsigned tree_sitter_bet_external_scanner_serialize(void *p, char *buffer) { return 0; }
void tree_sitter_bet_external_scanner_deserialize(void *p, const char *b, unsigned n) {}

bool tree_sitter_bet_external_scanner_scan(void *payload, TSLexer *lexer,
                                            const bool *valid_symbols) {
  if (valid_symbols[CSS_COMMENT_CONTENT]) {
    while (lexer->lookahead != 0 && lexer->lookahead != '*') {
      lexer->advance(lexer, false);
    }
    lexer->result_symbol = CSS_COMMENT_CONTENT;
    return true;
  }
  return false;
}
