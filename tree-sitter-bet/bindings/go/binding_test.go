package tree_sitter_bet_test

import (
	"testing"

	tree_sitter "github.com/tree-sitter/go-tree-sitter"
	tree_sitter_bet "github.com/tree-sitter/tree-sitter-bet/bindings/go"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_bet.Language())
	if language == nil {
		t.Errorf("Error loading Better-template grammar")
	}
}
