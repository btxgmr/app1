//
//  DuelsView.swift
//  Leaderboard
//
//  1v1 Arena for Apple Athletes with Point Transfer
//

import SwiftUI

public struct DuelsView: View {
    @ObservedObject var viewModel: LeaderboardViewModel
    @State private var player1ID: UUID?
    @State private var player2ID: UUID?
    @State private var stake: Int = 50
    @State private var duelResultText: String?
    @State private var isSimulating: Bool = false

    public init(viewModel: LeaderboardViewModel) {
        self.viewModel = viewModel
    }

    public var body: some View {
        NavigationStack {
            ZStack {
                Color(red: 0.03, green: 0.04, blue: 0.06)
                    .ignoresSafeArea()

                ScrollView {
                    VStack(spacing: 20) {
                        // Header
                        VStack(alignment: .leading, spacing: 4) {
                            HStack {
                                Image(systemName: "swords")
                                    .foregroundColor(.pink)
                                Text("Arena Pojedynków 1v1")
                                    .font(.title2.bold())
                                    .foregroundColor(.white)
                            }
                            Text("Wybierz dwóch zawodników i rozstrzygnij starcie o punkty.")
                                .font(.footnote)
                                .foregroundColor(.gray)
                        }
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .padding(.horizontal)

                        if viewModel.players.count >= 2 {
                            // Fighter Selection Cards
                            HStack(spacing: 12) {
                                fighterCard(isFirst: true)
                                fighterCard(isFirst: false)
                            }
                            .padding(.horizontal)

                            // Stake Selector
                            VStack(alignment: .leading, spacing: 8) {
                                HStack {
                                    Text("Stawka pojedynku")
                                        .font(.subheadline.bold())
                                        .foregroundColor(.white)
                                    Spacer()
                                    Text("±\(stake) \(viewModel.settings.unit)")
                                        .font(.system(.subheadline, design: .monospaced).bold())
                                        .foregroundColor(.yellow)
                                }

                                HStack(spacing: 8) {
                                    ForEach([10, 25, 50, 100, 250], id: \.self) { val in
                                        Button(action: { stake = val }) {
                                            Text("\(val)")
                                                .font(.system(.footnote, design: .monospaced).bold())
                                                .frame(maxWidth: .infinity)
                                                .padding(.vertical, 8)
                                                .background(stake == val ? Color.yellow.opacity(0.2) : Color.white.opacity(0.06))
                                                .foregroundColor(stake == val ? .yellow : .white)
                                                .cornerRadius(12)
                                                .overlay(
                                                    RoundedRectangle(cornerRadius: 12)
                                                        .stroke(stake == val ? Color.yellow.opacity(0.5) : Color.clear, lineWidth: 1)
                                                )
                                        }
                                    }
                                }
                            }
                            .padding()
                            .liquidGlass(cornerRadius: 20)
                            .padding(.horizontal)

                            // Action Button
                            Button(action: simulateDuel) {
                                HStack {
                                    Image(systemName: "dice.fill")
                                    Text(isSimulating ? "Trwa walka..." : "Rozstrzygnij pojedynek")
                                }
                                .font(.headline.bold())
                                .foregroundColor(.black)
                                .frame(maxWidth: .infinity)
                                .padding(.vertical, 16)
                                .background(
                                    LinearGradient(
                                        colors: [Color.yellow, Color.orange],
                                        startPoint: .leading,
                                        endPoint: .trailing
                                    )
                                )
                                .cornerRadius(20)
                                .shadow(color: Color.orange.opacity(0.3), radius: 12, y: 6)
                            }
                            .disabled(isSimulating)
                            .padding(.horizontal)

                            if let result = duelResultText {
                                Text(result)
                                    .font(.subheadline.bold())
                                    .foregroundColor(.green)
                                    .padding()
                                    .frame(maxWidth: .infinity)
                                    .liquidGlass(cornerRadius: 16)
                                    .padding(.horizontal)
                                    .transition(.opacity.combined(with: .scale))
                            }
                        } else {
                            Text("Dodaj co najmniej 2 zawodników, aby rozpocząć pojedynek.")
                                .foregroundColor(.gray)
                                .padding()
                        }
                    }
                    .padding(.top)
                    .padding(.bottom, 90)
                }
            }
            .navigationBarTitleDisplayMode(.inline)
        }
        .onAppear {
            if player1ID == nil, let first = viewModel.players.first {
                player1ID = first.id
            }
            if player2ID == nil, viewModel.players.count > 1 {
                player2ID = viewModel.players[1].id
            }
        }
    }

    private func fighterCard(isFirst: Bool) -> some View {
        let selectedID = isFirst ? player1ID : player2ID
        let player = viewModel.players.first(where: { $0.id == selectedID })

        return VStack(spacing: 8) {
            Text(isFirst ? "Zawodnik A" : "Zawodnik B")
                .font(.caption2.bold())
                .foregroundColor(isFirst ? .cyan : .pink)
                .textCase(.uppercase)

            Menu {
                ForEach(viewModel.players) { p in
                    Button("\(p.avatarEmoji) \(p.name)") {
                        if isFirst {
                            player1ID = p.id
                        } else {
                            player2ID = p.id
                        }
                    }
                }
            } label: {
                HStack {
                    Text(player?.name ?? "Wybierz")
                        .font(.footnote.bold())
                        .foregroundColor(.white)
                        .lineLimit(1)
                    Image(systemName: "chevron.up.chevron.down")
                        .font(.caption2)
                        .foregroundColor(.gray)
                }
                .padding(.vertical, 6)
                .padding(.horizontal, 10)
                .background(Color.white.opacity(0.08))
                .cornerRadius(10)
            }

            if let p = player {
                Text(p.avatarEmoji)
                    .font(.system(size: 36))
                    .padding(6)
                    .background(Circle().fill(Color.white.opacity(0.06)))

                Text("\(p.score) \(viewModel.settings.unit)")
                    .font(.system(.subheadline, design: .monospaced).bold())
                    .foregroundColor(.white)
            }
        }
        .frame(maxWidth: .infinity)
        .padding()
        .liquidGlass(cornerRadius: 20)
    }

    private func simulateDuel() {
        guard let p1ID = player1ID, let p2ID = player2ID, p1ID != p2ID else { return }
        guard let p1 = viewModel.players.first(where: { $0.id == p1ID }),
              let p2 = viewModel.players.first(where: { $0.id == p2ID }) else { return }

        isSimulating = true

        DispatchQueue.main.asyncAfter(deadline: .now() + 0.6) {
            let p1Wins = Bool.random()
            let winner = p1Wins ? p1 : p2
            let loser = p1Wins ? p2 : p1

            viewModel.modifyScore(for: winner.id, delta: stake)
            viewModel.modifyScore(for: loser.id, delta: -stake)

            withAnimation {
                duelResultText = "🏆 Zwycięzca: \(winner.name) (+\(stake) \(viewModel.settings.unit))!"
                isSimulating = false
            }
        }
    }
}
