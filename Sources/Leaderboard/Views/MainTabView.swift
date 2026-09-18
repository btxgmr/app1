//
//  MainTabView.swift
//  Leaderboard
//
//  Floating Liquid Glass Tab Bar with 4 Screens & Haptic Navigation
//

import SwiftUI

public enum AppTab: String, CaseIterable, Identifiable {
    case leaderboard = "Tabela"
    case analytics = "Wykresy"
    case store = "PRO (0 zł)"
    case settings = "Ustawienia"

    public var id: String { rawValue }

    public var icon: String {
        switch self {
        case .leaderboard: return "trophy.fill"
        case .analytics: return "chart.bar.xaxis"
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
        ZStack(alignment: .bottom) {
            // Main View Switcher
            Group {
                switch selectedTab {
                case .leaderboard:
                    LeaderboardView(viewModel: viewModel)
                case .analytics:
                    AnalyticsView(viewModel: viewModel)
                case .store:
                    PremiumStoreView(viewModel: viewModel)
                case .settings:
                    SettingsView(viewModel: viewModel)
                }
            }
            .frame(maxWidth: .infinity, maxHeight: .infinity)

            // Floating Liquid Glass Tab Bar
            floatingTabBar
                .padding(.horizontal, 20)
                .padding(.bottom, 16)
        }
        .preferredColorScheme(.dark)
    }

    private var floatingTabBar: some View {
        HStack(spacing: 6) {
            ForEach(AppTab.allCases) { tab in
                Button(action: {
                    withAnimation(.spring(response: 0.35, dampingFraction: 0.75)) {
                        selectedTab = tab
                    }
                }) {
                    VStack(spacing: 4) {
                        Image(systemName: tab.icon)
                            .font(.system(size: 18, weight: selectedTab == tab ? .bold : .medium))
                            .foregroundColor(selectedTab == tab ? (tab == .store ? Color(red: 1.0, green: 0.84, blue: 0.04) : Color(red: 0.2, green: 0.85, blue: 1.0)) : Color.white.opacity(0.45))

                        Text(tab.rawValue)
                            .font(.system(size: 10, weight: selectedTab == tab ? .heavy : .medium, design: .rounded))
                            .foregroundColor(selectedTab == tab ? .white : Color.white.opacity(0.45))
                    }
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 10)
                    .background(
                        selectedTab == tab
                        ? Capsule().fill(Color.white.opacity(0.14))
                        : Capsule().fill(Color.clear)
                    )
                }
                .buttonStyle(.plain)
            }
        }
        .padding(6)
        .liquidGlass(
            cornerRadius: 32,
            glowColor: Color.blue.opacity(0.2),
            borderOpacity: 0.35
        )
    }
}

#Preview {
    MainTabView()
}
