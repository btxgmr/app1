//
//  MainTabView.swift
//  Leaderboard
//
//  Modern iOS TabView (iOS 18 / 26 pattern) with Obsidian Liquid Glass
//

import SwiftUI

public enum AppTab: String, CaseIterable, Identifiable {
    case leaderboard = "Tabela"
    case duels = "Pojedynki"
    case analytics = "Wykresy"
    case history = "Historia"
    case store = "PRO (0 zł)"
    case settings = "Ustawienia"

    public var id: String { rawValue }

    public var icon: String {
        switch self {
        case .leaderboard: return "trophy.fill"
        case .duels: return "bolt.shield.fill"
        case .analytics: return "chart.bar.xaxis"
        case .history: return "clock.arrow.circlepath"
        case .store: return "crown.fill"
        case .settings: return "gearshape.fill"
        }
    }
}

public struct MainTabView: View {
    @StateObject private var viewModel = LeaderboardViewModel()
    @State private var selectedTab: AppTab = .leaderboard

    public init() {}

    public var body: some View {
        TabView(selection: $selectedTab) {
            LeaderboardView(viewModel: viewModel)
                .tag(AppTab.leaderboard)
                .tabItem {
                    Label(AppTab.leaderboard.rawValue, systemImage: AppTab.leaderboard.icon)
                }

            DuelsView(viewModel: viewModel)
                .tag(AppTab.duels)
                .tabItem {
                    Label(AppTab.duels.rawValue, systemImage: AppTab.duels.icon)
                }

            AnalyticsView(viewModel: viewModel)
                .tag(AppTab.analytics)
                .tabItem {
                    Label(AppTab.analytics.rawValue, systemImage: AppTab.analytics.icon)
                }

            HistoryView(viewModel: viewModel)
                .tag(AppTab.history)
                .tabItem {
                    Label(AppTab.history.rawValue, systemImage: AppTab.history.icon)
                }

            PremiumStoreView(viewModel: viewModel)
                .tag(AppTab.store)
                .tabItem {
                    Label(AppTab.store.rawValue, systemImage: AppTab.store.icon)
                }

            SettingsView(viewModel: viewModel)
                .tag(AppTab.settings)
                .tabItem {
                    Label(AppTab.settings.rawValue, systemImage: AppTab.settings.icon)
                }
        }
        .tint(Color(red: 0.2, green: 0.85, blue: 1.0))
        .preferredColorScheme(.dark)
    }
}

#Preview {
    MainTabView()
}
