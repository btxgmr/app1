//
//  LeaderboardSettings.swift
//  Leaderboard
//
//  Created for iOS 17+ (SwiftUI & Apple Fitness HIG)
//

import SwiftUI

public struct LeaderboardSettings: Codable, Equatable {
    public var unit: String
    public var quickDeltas: [Int]

    public static let defaultUnit = "KCAL"
    public static let defaultQuickDeltas = [-100, 25, 500]

    public init(
        unit: String = defaultUnit,
        quickDeltas: [Int] = defaultQuickDeltas
    ) {
        self.unit = unit
        self.quickDeltas = quickDeltas
    }

    public static let presetUnits: [String] = ["KCAL", "PTS", "PKT", "KM", "$", "XP", "KG"]
}
