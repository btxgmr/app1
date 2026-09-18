//
//  LeaderboardView.swift
//  Leaderboard
//
//  Apple Liquid Glass Leaderboard Screen with Card Sliding Physics & Podiums
//

import SwiftUI

public struct LeaderboardView: View {
    @ObservedObject var viewModel: LeaderboardViewModel
    @State private var isAddPlayerPresented: Bool = false
    @State private var isUnitSelectorPresented: Bool = false
    @State private var isQuickActionsPresented: Bool = false

    public init(viewModel: LeaderboardViewModel) {
        self.viewModel = viewModel
    }

    public var body: some View {
        ZStack {
            // Liquid Glass Background
            Color.black.ignoresSafeArea()

            RadialGradient(
                colors: [
                    Color(red: 0.08, green: 0.18, blue: 0.38).opacity(0.45),
                    Color(red: 0.2, green: 0.05, blue: 0.28).opacity(0.2),
                    Color.black
                ],
                center: .top,
                startRadius: 60,
                endRadius: 550
            )
            .ignoresSafeArea()

            VStack(spacing: 0) {
                // Header Bar with Liquid Glass Accents
                headerBar

                // Search Bar
                searchBar
                    .padding(.horizontal, 16)
                    .padding(.bottom, 10)

                // Scrollable Athletes with Liquid Glass and Sliding Card Physics
                ScrollView {
                    VStack(spacing: 14) {
                        // Liquid Glass Podium for Top 3 (if exists)
                        if viewModel.searchText.isEmpty && viewModel.filteredSortedPlayers.count >= 3 {
                            podiumView
                                .padding(.bottom, 6)
                        }

                        // Athletes Cards with layout animation on position changes
                        if viewModel.filteredSortedPlayers.isEmpty {
                            emptyStateView
                        } else {
                            LazyVStack(spacing: 12) {
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
                                    .id(player.id)
                                    .transition(.asymmetric(
                                        insertion: .scale(scale: 0.92).combined(with: .opacity),
                                        removal: .opacity.combined(with: .move(edge: .trailing))
                                    ))
                                }
                            }
                            // Smooth layout spring physics when rank positions swap
                            .animation(.spring(response: 0.48, dampingFraction: 0.78), value: viewModel.filteredSortedPlayers.map(\.id))
                        }
                    }
                    .padding(.horizontal, 16)
                    .padding(.vertical, 8)
                    .padding(.bottom, 90)
                }
            }
        }
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
    }

    // MARK: - Header Bar
    private var headerBar: some View {
        HStack(alignment: .center, spacing: 12) {
            VStack(alignment: .leading, spacing: 2) {
                Text("Leaderboard")
                    .font(.system(size: 28, weight: .heavy, design: .rounded))
                    .foregroundColor(.white)

                Text("Liquid Glass Edition")
                    .font(.system(size: 13, weight: .medium, design: .rounded))
                    .foregroundColor(Color.white.opacity(0.55))
            }

            Spacer()

            // Unit Selector Pill in Liquid Glass
            Button(action: { isUnitSelectorPresented = true }) {
                HStack(spacing: 4) {
                    Text(viewModel.settings.unit)
                        .font(.system(size: 12, weight: .heavy, design: .rounded))
                    Image(systemName: "chevron.down")
                        .font(.system(size: 9, weight: .bold))
                }
                .foregroundColor(.white)
                .padding(.horizontal, 12)
                .padding(.vertical, 7)
                .background(
                    Capsule()
                        .fill(.ultraThinMaterial)
                        .overlay(Capsule().strokeBorder(Color.white.opacity(0.18), lineWidth: 1))
                )
            }
            .buttonStyle(.plain)

            // Add Athlete Button
            Button(action: { isAddPlayerPresented = true }) {
                Image(systemName: "plus.circle.fill")
                    .font(.system(size: 28))
                    .symbolRenderingMode(.hierarchical)
                    .foregroundColor(Color(red: 0.2, green: 0.85, blue: 1.0))
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
                .foregroundColor(Color.white.opacity(0.45))
                .font(.system(size: 15))

            TextField("Szukaj zawodnika...", text: $viewModel.searchText)
                .font(.system(size: 15, design: .rounded))
                .foregroundColor(.white)
                .autocorrectionDisabled()

            if !viewModel.searchText.isEmpty {
                Button(action: { viewModel.searchText = "" }) {
                    Image(systemName: "xmark.circle.fill")
                        .foregroundColor(Color.white.opacity(0.5))
                        .font(.system(size: 14))
                }
                .buttonStyle(.plain)
            }
        }
        .padding(.horizontal, 14)
        .padding(.vertical, 10)
        .background(
            RoundedRectangle(cornerRadius: 16, style: .continuous)
                .fill(.ultraThinMaterial)
                .overlay(
                    RoundedRectangle(cornerRadius: 16, style: .continuous)
                        .strokeBorder(Color.white.opacity(0.12), lineWidth: 1)
                )
        )
    }

    // MARK: - Liquid Glass Podium (Top 3)
    private var podiumView: some View {
        HStack(alignment: .bottom, spacing: 10) {
            // 2nd Place (Silver)
            if viewModel.filteredSortedPlayers.count > 1 {
                podiumColumn(player: viewModel.filteredSortedPlayers[1], rank: 2, height: 95, color: Color(red: 0.9, green: 0.9, blue: 0.94))
            }

            // 1st Place (Gold)
            if !viewModel.filteredSortedPlayers.isEmpty {
                podiumColumn(player: viewModel.filteredSortedPlayers[0], rank: 1, height: 120, color: Color(red: 1.0, green: 0.84, blue: 0.04))
            }

            // 3rd Place (Bronze)
            if viewModel.filteredSortedPlayers.count > 2 {
                podiumColumn(player: viewModel.filteredSortedPlayers[2], rank: 3, height: 80, color: Color(red: 1.0, green: 0.62, blue: 0.15))
            }
        }
        .padding(16)
        .liquidGlass(cornerRadius: 24, glowColor: Color(red: 1.0, green: 0.84, blue: 0.04).opacity(0.15))
    }

    private func podiumColumn(player: Player, rank: Int, height: CGFloat, color: Color) -> some View {
        VStack(spacing: 6) {
            Text(player.avatarEmoji)
                .font(.system(size: rank == 1 ? 30 : 24))

            Text(player.name.components(separatedBy: " ").first ?? player.name)
                .font(.system(size: 12, weight: .bold, design: .rounded))
                .foregroundColor(.white)
                .lineLimit(1)

            RollingDigitView(
                value: player.score,
                font: .system(size: rank == 1 ? 16 : 14, weight: .heavy, design: .rounded),
                textColor: color
            )

            // Podium Base
            RoundedRectangle(cornerRadius: 12, style: .continuous)
                .fill(
                    LinearGradient(
                        colors: [color.opacity(0.3), color.opacity(0.08)],
                        startPoint: .top,
                        endPoint: .bottom
                    )
                )
                .overlay(
                    RoundedRectangle(cornerRadius: 12, style: .continuous)
                        .strokeBorder(color.opacity(0.5), lineWidth: 1)
                )
                .frame(height: height)
                .overlay(
                    VStack {
                        Text("\(rank)")
                            .font(.system(size: 22, weight: .black, design: .rounded))
                            .foregroundColor(color)
                            .padding(.top, 8)
                        Spacer()
                    }
                )
        }
        .frame(maxWidth: .infinity)
    }

    // MARK: - Empty State
    private var emptyStateView: some View {
        VStack(spacing: 16) {
            ZStack {
                Circle()
                    .fill(Color.white.opacity(0.08))
                    .frame(width: 80, height: 80)
                Image(systemName: "trophy.fill")
                    .font(.system(size: 36))
                    .foregroundColor(Color(red: 1.0, green: 0.84, blue: 0.04))
            }

            VStack(spacing: 4) {
                Text("Brak zawodników")
                    .font(.system(size: 18, weight: .bold, design: .rounded))
                    .foregroundColor(.white)

                Text("Dodaj pierwszego uczestnika, aby rozpocząć rywalizację.")
                    .font(.system(size: 14, design: .rounded))
                    .foregroundColor(Color.white.opacity(0.55))
                    .multilineTextAlignment(.center)
            }

            Button(action: { isAddPlayerPresented = true }) {
                Text("Dodaj Zawodnika")
                    .font(.system(size: 15, weight: .bold, design: .rounded))
                    .foregroundColor(.black)
                    .padding(.horizontal, 24)
                    .padding(.vertical, 12)
                    .background(Capsule().fill(Color.white))
            }
            .buttonStyle(.plain)
        }
        .padding(40)
        .frame(maxWidth: .infinity)
        .liquidGlass(cornerRadius: 24)
        .padding(.top, 24)
    }
}
