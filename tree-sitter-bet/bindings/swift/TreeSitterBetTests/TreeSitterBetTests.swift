import XCTest
import SwiftTreeSitter
import TreeSitterBet

final class TreeSitterBetTests: XCTestCase {
    func testCanLoadGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_bet())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading Better-template grammar")
    }
}
