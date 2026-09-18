//
//  LeaderboardTests.swift
//  LeaderboardTests
//
//  Unit tests for Apple Leaderboard models, sorting and ordinals
//

import XCTest
@testable import Leaderboard

final class LeaderboardTests: XCTestCase {
    func testOrdinalRankFormatting() {
        XCTAssertEqual(Player.ordinalRank(for: 1), "1st")
        XCTAssertEqual(Player.ordinalRank(for: 2), "2nd")
        XCTAssertEqual(Player.ordinalRank(for: 3), "3rd")
        XCTAssertEqual(Player.ordinalRank(for: 4), "4th")
        XCTAssertEqual(Player.ordinalRank(for: 11), "11th")
        XCTAssertEqual(Player.ordinalRank(for: 12), "12th")
        XCTAssertEqual(Player.ordinalRank(for: 13), "13th")
        XCTAssertEqual(Player.ordinalRank(for: 21), "21st")
        XCTAssertEqual(Player.ordinalRank(for: 22), "22nd")
        XCTAssertEqual(Player.ordinalRank(for: 23), "23rd")
        XCTAssertEqual(Player.ordinalRank(for: 101), "101st")
    }

    func testPlayerScoreModification() {
        var player = Player(name: "Test Athlete", score: 100)
        player.score += 50
        player.lastDelta = 50
        XCTAssertEqual(player.score, 150)
        XCTAssertEqual(player.lastDelta, 50)
    }

    func testSettingsPresets() {
        let settings = LeaderboardSettings()
        XCTAssertEqual(settings.unit, "KCAL")
        XCTAssertEqual(settings.quickDeltas, [-100, 25, 500])
        XCTAssertTrue(LeaderboardSettings.presetUnits.contains("PTS"))
    }
}
