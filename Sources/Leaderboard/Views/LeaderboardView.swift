//
//  LeaderboardView.swift
//  Leaderboard
//
//  Main Screen: Apple Dark Mode & Glassmorphic Leaderboard in SwiftUI
//

import SwiftUI

public struct LeaderboardView: View {
    @StateObject private var viewModel = LeaderboardViewModel()

    @State private var isAddPlayerPresented: Bool = false
    @State private var isUnitSelectorPresented: Bool = false
    @State private var isQuickActionsPresented: Bool = false
    @State private var isResetAlertPresented: Bool = false

    public init() {}

    public var body: some View {
        ZStack {
            // Background: Pure Black with subtle Apple Dark Glow
            Color.black.ignoresSafeArea()

            RadialGradient(
                gradient: Gradient(colors: [
                    Color(red: 0.08, green: 0.14, blue: 0.28).opacity(0.4),
                    Color.black.opacity(0.85)
                ]),
                center: .top,
                startRadius: 50,
                endRadius: 550
            )
            .ignoresSafeArea()

            VStack(spacing: 0) {
                // Header Bar
                headerBar

                // Search Bar
                searchBar
                    .padding(.horizontal, 16)
                    .padding(.bottom, 8)

                // Scrollable Athletes List
                ScrollView {
                    LazyVStack(spacing: 12) {
                        if viewModel.filteredSortedPlayers.isEmpty {
                            emptyStateView
                        } else {
                            ForEach(viewModel.filteredSortedPlayers) { player in
                                PlayerRowView(
                                    player: player,
                                    rank: viewModel.rank(for: player),
                                    unit: viewModel.settings.unit,
                                    quickDeltas: viewModel.settings.quickDeltas,
                                    onModifyScore: { delta in
                                        viewModel.modifyScore(for: player.id, delta: delta)
                                    },
                                    onDelete: {
                                        viewModel.deletePlayer(id: player.id)
                                    }
                                )
                                .transition(.asymmetric(
                                    insertion: .scale(scale: 0.95).combined(with: .opacity),
                                    removal: .opacity.combined(with: .move(edge: .trailing))
                                ))
                            }
                        }
                    }
                    .padding(.horizontal, 16)
                    .padding(.vertical, 8)
                }
            }
        }
        // Sheets
        .sheet(isPresented: $isAddPlayerPresented) {
            AddPlayerSheet { newPlayer in
                viewModel.addPlayer(newPlayer)
            }
        }
        .sheet(isPresented: $isUnitSelectorPresented) {
            UnitSelectorSheet(currentUnit: viewModel.settings.unit) { selectedUnit in
                viewModel.updateUnit(selectedUnit)
            }
        }
        .sheet(isPresented: $isQuickActionsPresented) {
            QuickActionSettingsSheet(currentDeltas: viewModel.settings.quickDeltas) { newDeltas in
                viewModel.updateQuickDeltas(newDeltas)
            }
        }
        .confirmationDialog(
            "Reset Leaderboard",
            isPresented: $isResetAlertPresented,
            titleVisibility: .visible
        ) {
            Button("Reset to Seed Athletes", role: .none) {
                viewModel.resetToDefaults()
            }
            Button("Clear All Athletes", role: .destructive) {
                viewModel.clearAll()
            }
            Button("Cancel", role: .cancel) {}
        } message: {
            Text("Choose whether to reload the default athletes or clear the entire leaderboard.")
        }
    }

    // MARK: - Header Bar
    private var headerBar: some View {
        HStack(alignment: .center, spacing: 12) {
            VStack(alignment: .leading, spacing: 2) {
                Text("Leaderboard")
                    .font(.system(size: 28, weight: .heavy, design: .rounded))
                    .foregroundColor(.white)

                Text("Apple Fitness HIG & Dark Mode")
                    .font(.system(size: 13, weight: .medium, design: .rounded))
                    .foregroundColor(Color(white: 0.5))
            }

            Spacer()

            // Unit Selector Pill
            Button(action: { isUnitSelectorPresented = true }) {
                HStack(spacing: 4) {
                    Text(viewModel.settings.unit)
                        .font(.system(size: 12, weight: .heavy, design: .rounded))
                    Image(systemName: "chevron.down")
                        .font(.system(size: 9, weight: .bold))
                }
                .foregroundColor(.white)
                .padding(.horizontal, 10)
                .padding(.vertical, 6)
                .background(
                    Capsule()
                        .fill(Color(white: 0.16))
                        .overlay(Capsule().strokeBorder(Color.white.opacity(0.12), lineWidth: 1))
                )
            }
            .buttonStyle(.plain)

            // Settings Menu (Quick Actions, Reset)
            Menu {
                Button(action: { isQuickActionsPresented = true }) {
                    Label("Configure Quick +/-", systemImage: "slider.horizontal.3")
                }
                Button(action: { isUnitSelectorPresented = true }) {
                    Label("Change Unit Suffix", systemImage: "character")
                }
                Divider()
                Button(role: .destructive, action: { isResetAlertPresented = true }) {
                    Label("Reset Leaderboard...", systemImage: "arrow.counterclockwise")
                }
            } label: {
                Image(systemName: "ellipsis.circle.fill")
                    .font(.system(size: 24))
                    .foregroundColor(Color(white: 0.75))
            }

            // Add Button
            Button(action: { isAddPlayerPresented = true }) {
                Image(systemName: "plus.circle.fill")
                    .font(.system(size: 26))
                    .symbolRenderingMode(.hierarchical)
                    .foregroundColor(.accentColor)
            }
            .buttonStyle(.plain)
        }
        .padding(.horizontal, 16)
        .padding(.top, 14)
        .padding(.bottom, 12)
    }

    // MARK: - Search Bar
    private var searchBar: some View {
        HStack(spacing: 8) {
            Image(systemName: "magnifyingglass")
                .foregroundColor(Color(white: 0.45))
                .font(.system(size: 15))

            TextField("Search athletes...", text: $viewModel.searchText)
                .font(.system(size: 15, design: .rounded))
                .foregroundColor(.white)
                .autocorrectionDisabled()

            if !viewModel.searchText.isEmpty {
                Button(action: { viewModel.searchText = "" }) {
                    Image(systemName: "xmark.circle.fill")
                        .foregroundColor(Color(white: 0.5))
                        .font(.system(size: 14))
                }
                .buttonStyle(.plain)
            }
        }
        .padding(.horizontal, 12)
        .padding(.vertical, 8)
        .background(
            RoundedRectangle(cornerRadius: 14, style: .continuous)
                .fill(Color(white: 0.12))
        )
    }

    // MARK: - Empty State
    private var emptyStateView: some View {
        VStack(spacing: 16) {
            ZStack {
                Circle()
                    .fill(Color(white: 0.12))
                    .frame(width: 80, height: 80)
                Image(systemName: "trophy.fill")
                    .font(.system(size: 36))
                    .foregroundColor(Color(red: 1.0, green: 0.84, blue: 0.04))
            }

            VStack(spacing: 4) {
                Text("No Athletes on the Board")
                    .font(.system(size: 18, weight: .bold, design: .rounded))
                    .foregroundColor(.white)

                Text("Add your first participant or reset the board to get started.")
                    .font(.system(size: 14, design: .rounded))
                    .foregroundColor(Color(white: 0.5))
                    .multilineTextAlignment(.center)
            }

            Button(action: { isAddPlayerPresented = true }) {
                Text("Add Athlete")
                    .font(.system(size: 15, weight: .bold, design: .rounded))
                    .foregroundColor(.black)
                    .padding(.horizontal, 20)
                    .padding(.vertical, 10)
                    .background(Capsule().fill(Color.white))
            }
            .buttonStyle(.plain)
        }
        .padding(40)
        .frame(maxWidth: .infinity)
        .background(
            RoundedRectangle(cornerRadius: 24, style: .continuous)
                .fill(Color(white: 0.08).opacity(0.7))
        )
        .padding(.top, 24)
    }
}

#Preview {
    LeaderboardView()
        .preferredColorScheme(.dark)
}
