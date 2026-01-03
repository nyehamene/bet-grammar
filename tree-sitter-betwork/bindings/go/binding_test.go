package tree_sitter_betwork_test

import (
	"testing"

	tree_sitter "github.com/tree-sitter/go-tree-sitter"
	tree_sitter_betwork "github.com/tree-sitter/tree-sitter-betwork/bindings/go"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_betwork.Language())
	if language == nil {
		t.Errorf("Error loading Betwork grammar")
	}
}
