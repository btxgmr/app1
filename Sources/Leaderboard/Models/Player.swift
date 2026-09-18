//
//  Player.swift
//  Leaderboard
//
//  Created for iOS 17+ (SwiftUI & Apple Fitness HIG)
//

import SwiftUI

public struct Player: Identifiable, Codable, Equatable, Hashable {
    public let id: UUID
    public var name: String
    public var score: Int
    public var avatarEmoji: String
    public var avatarColorHex: String
    public var lastDelta: Int?
    public var lastDeltaDate: Date?

    public init(
        id: UUID = UUID(),
        name: String,
        score: Int,
        avatarEmoji: String = "⚡️",
        avatarColorHex: String = "#FF9F0A",
        lastDelta: Int? = nil,
        lastDeltaDate: Date? = nil
    ) {
        self.id = id
        self.name = name
        self.score = score
        self.avatarEmoji = avatarEmoji
        self.avatarColorHex = avatarColorHex
        self.lastDelta = lastDelta
        self.lastDeltaDate = lastDeltaDate
    }

    /// Returns the English ordinal rank representation (e.g. 1st, 2nd, 3rd, 11th, 21st)
    public static func ordinalRank(for rank: Int) -> String {
        guard rank > 0 else { return "\(rank)" }
        let remainder100 = rank % 100
        let remainder10 = rank % 10

        let suffix: String
        if remainder100 >= 11 && remainder100 <= 13 {
            suffix = "th"
        } else {
            switch remainder10 = remainder10 {
            case 1: suffix = "st"
            case 2: suffix = "nd"
            case 3: suffix = "rd"
            default: suffix = "th"
            }
        }
        return "\(rank)\(suffix)"
    }
}
