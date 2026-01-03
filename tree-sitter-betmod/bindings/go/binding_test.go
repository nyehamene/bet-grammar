package tree_sitter_betmod_test

import (
	"testing"

	tree_sitter "github.com/tree-sitter/go-tree-sitter"
	tree_sitter_betmod "github.com/tree-sitter/tree-sitter-betmod/bindings/go"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_betmod.Language())
	if language == nil {
		t.Errorf("Error loading BetMod grammar")
	}
}
