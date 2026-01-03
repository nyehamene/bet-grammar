### Plan for Tree-sitter Parser Implementation

- [x] Convert the `mod.grammar` file into a Tree-sitter `grammar.js` file. And save it to `tree-sitter-betmod/`.
- [x] Generate the C parser from the `grammar.js` file.
- [x] Write example `mod` files to test the parser.
- [x] Run the Tree-sitter CLI to parse the test files and validate the results.
- [x] Create a `queries/highlights.scm` file in `tree-sitter-betmod/`.
- [x] Define highlighting rules in `highlights.scm` for the `mod` grammar.
- [x] Create highlight test files named `bet.mod` in `tree-sitter-betmod/test/highlight/`.
- [x] Run the highlight tests using `tree-sitter highlight`.