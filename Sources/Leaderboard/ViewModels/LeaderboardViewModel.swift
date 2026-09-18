//
//  LeaderboardViewModel.swift
//  Leaderboard
//
//  State Management, Persistence, Sorting, Liquid Glass & Pro Status
//

import SwiftUI
import Combine

@MainActor
public final class LeaderboardViewModel: ObservableObject {
    @Published public var players: [Player] = []
    @Published public var settings: LeaderboardSettings = LeaderboardSettings()
    @Published public var searchText: String = ""
    @Published public var isProUnlocked: Bool = false

    private let playersStorageKey = "com.apple.fitness.leaderboard.players.v1"
    private let settingsStorageKey = "com.apple.fitness.leaderboard.settings.v1"
    private let proStorageKey = "com.apple.fitness.leaderboard.pro.v1"

    public init() {
        loadData()
    }

    public var filteredSortedPlayers: [Player] {
        let sorted = players.sorted { (p1: Player, p2: Player) -> Bool in
            if p1.score != p2.score {
                return p1.score > p2.score
            }
            return p1.name < p2.name
        }

        let query = searchText.trimmingCharacters(in: .whitespacesAndNewlines).lowercased()
        if query.isEmpty {
            return sorted
        } else {
            return sorted.filter { $0.name.lowercased().contains(query) }
        }
    }

    public var podiumPlayers: [Player] {
        Array(filteredSortedPlayers.prefix(3))
    }

    public var totalScore: Int {
        players.reduce(0) { $0 + $1.score }
    }

    public var averageScore: Int {
        guard !players.isEmpty else { return 0 }
        return totalScore / players.count
    }

    public var topScore: Int {
        filteredSortedPlayers.first?.score ?? 0
    }

    public func rank(for player: Player) -> Int {
        let sorted = players.sorted { $0.score > $1.score }
        guard let index = sorted.firstIndex(where: { $0.id == player.id }) else { return 1 }
        return index + 1
    }

    public func modifyScore(for playerID: UUID, delta: Int) {
        guard let index = players.firstIndex(where: { $0.id == playerID }) else { return }

        // Update score and delta metadata
        players[index].score += delta
        players[index].lastDelta = delta
        players[index].lastDeltaDate = Date()

        // Reorder smoothly with Apple spring animation to slide cards seamlessly
        withAnimation(.spring(response: 0.45, dampingFraction: 0.78)) {
            saveData()
        }
    }

    public func addPlayer(_ player: Player) {
        withAnimation(.spring(response: 0.45, dampingFraction: 0.78)) {
            players.append(player)
            saveData()
        }
    }

    public func deletePlayer(id: UUID) {
        withAnimation(.easeInOut(duration: 0.28)) {
            players.removeAll { $0.id == id }
            saveData()
        }
    }

    public func updateUnit(_ newUnit: String) {
        settings.unit = newUnit
        saveData()
    }

    public func updateQuickDeltas(_ newDeltas: [Int]) {
        settings.quickDeltas = newDeltas
        saveData()
    }

    public func unlockPro() {
        withAnimation(.spring(response: 0.5, dampingFraction: 0.75)) {
            isProUnlocked = true
            UserDefaults.standard.set(true, forKey: proStorageKey)
        }
    }

    public func resetToDefaults() {
        withAnimation(.spring(response: 0.45, dampingFraction: 0.78)) {
            players = Self.seedPlayers
            settings = LeaderboardSettings()
            saveData()
        }
    }

    public func clearAll() {
        withAnimation(.easeInOut(duration: 0.3)) {
            players = []
            saveData()
        }
    }

    // MARK: - Local Persistence
    private func saveData() {
        if let encodedPlayers = try? JSONEncoder().encode(players) {
            UserDefaults.standard.set(encodedPlayers, forKey: playersStorageKey)
        }
        if let encodedSettings = try? JSONEncoder().encode(settings) {
            UserDefaults.standard.set(encodedSettings, forKey: settingsStorageKey)
        }
    }

    private func loadData() {
        isProUnlocked = UserDefaults.standard.bool(forKey: proStorageKey)

        if let data = UserDefaults.standard.data(forKey: settingsStorageKey),
           let decoded = try? JSONDecoder().decode(LeaderboardSettings.self, from: data) {
            self.settings = decoded
        }

        if let data = UserDefaults.standard.data(forKey: playersStorageKey),
           let decoded = try? JSONDecoder().decode([Player].self, from: data) {
            self.players = decoded
        } else {
            self.players = Self.seedPlayers
        }
    }

    // MARK: - Initial Apple Fitness Athletes
    public static let seedPlayers: [Player] = [
        Player(name: "Alex Rivera", score: 1250, avatarEmoji: "🔥", avatarColorHex: "#FF9F0A"),
        Player(name: "Sarah Chen", score: 980, avatarEmoji: "⚡️", avatarColorHex: "#FFD60A"),
        Player(name: "Marcus Vance", score: 840, avatarEmoji: "🚴‍♂️", avatarColorHex: "#30D158"),
        Player(name: "Elena Rostova", score: 620, avatarEmoji: "🥊", avatarColorHex: "#0A84FF"),
        Player(name: "David Kim", score: 450, avatarEmoji: "🏃‍♂️", avatarColorHex: "#BF5AF2")
    ]
}
