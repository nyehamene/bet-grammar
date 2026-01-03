### Plan for Tree-sitter Parser Implementation

- [ ] Create the `tree-sitter-bet/` directory to house the parser project.
- [ ] Convert the `bet.grammar` file and its dependencies (`util/literals.grammar`, `util/element.grammar`, and `util/style.grammar`) into a Tree-sitter `grammar.js` file and save it to `tree-sitter-bet/`.
- [ ] Generate the C parser from the `grammar.js` file.
- [ ] Write example `bet` files to test the parser.
- [ ] Run the Tree-sitter CLI to parse the test files and validate the results.
- [ ] Create a `queries/highlights.scm` file in `tree-sitter-bet/`.
- [ ] Define highlighting rules in `highlights.scm` for the `bet` grammar.
- [ ] Create highlight test files named `test.bet` in `tree-sitter-bet/test/highlight/`.
- [ ] Run the highlight tests using `tree-sitter highlight`.
