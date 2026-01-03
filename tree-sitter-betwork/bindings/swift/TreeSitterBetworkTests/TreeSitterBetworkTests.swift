import XCTest
import SwiftTreeSitter
import TreeSitterBetwork

final class TreeSitterBetworkTests: XCTestCase {
    func testCanLoadGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_betwork())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading Betwork grammar")
    }
}
