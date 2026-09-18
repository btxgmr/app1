//
//  LeaderboardApp.swift
//  Leaderboard
//
//  iOS Application Entry Point
//

import SwiftUI

@main
public struct LeaderboardApp: App {
    public init() {}

    public var body: some Scene {
        WindowGroup {
            LeaderboardView()
                .preferredColorScheme(.dark)
        }
    }
}
