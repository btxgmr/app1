//
//  HistoryView.swift
//  Leaderboard
//
//  History, Activity Log & Reversion
//

import SwiftUI

public struct HistoryView: View {
    @ObservedObject var viewModel: LeaderboardViewModel

    public init(viewModel: LeaderboardViewModel) {
        self.viewModel = viewModel
    }

    public var body: some View {
        NavigationStack {
            ZStack {
                Color(red: 0.03, green: 0.04, blue: 0.06)
                    .ignoresSafeArea()

                ScrollView {
                    VStack(alignment: .leading, spacing: 16) {
                        VStack(alignment: .leading, spacing: 4) {
                            HStack {
                                Image(systemName: "clock.arrow.circlepath")
                                    .foregroundColor(.blue)
                                Text("Historia i Aktywność")
                                    .font(.title2.bold())
                                    .foregroundColor(.white)
                            }
                            Text("Ostatnie ruchy, zmiany pozycji i modyfikacje punktacji.")
                                .font(.footnote)
                                .foregroundColor(.gray)
                        }
                        .padding(.horizontal)

                        VStack(spacing: 10) {
                            ForEach(viewModel.players) { player in
                                HStack {
                                    Text(player.avatarEmoji)
                                        .font(.title3)
                                    VStack(alignment: .leading, spacing: 2) {
                                        Text(player.name)
                                            .font(.footnote.bold())
                                            .foregroundColor(.white)
                                        if let lastDate = player.lastDeltaDate {
                                            Text("Ostatnia zmiana: \(lastDate.formatted(date: .omitted, time: .shortened))")
                                                .font(.caption2)
                                                .foregroundColor(.gray)
                                        } else {
                                            Text("Brak aktywności")
                                                .font(.caption2)
                                                .foregroundColor(.gray)
                                        }
                                    }

                                    Spacer()

                                    if let delta = player.lastDelta {
                                        Text(delta > 0 ? "+\(delta)" : "\(delta)")
                                            .font(.system(.caption, design: .monospaced).bold())
                                            .foregroundColor(delta > 0 ? .green : .red)
                                            .padding(.horizontal, 8)
                                            .padding(.vertical, 4)
                                            .background(delta > 0 ? Color.green.opacity(0.15) : Color.red.opacity(0.15))
                                            .cornerRadius(8)
                                    }
                                }
                                .padding()
                                .liquidGlass(cornerRadius: 16)
                            }
                        }
                        .padding(.horizontal)
                    }
                    .padding(.top)
                    .padding(.bottom, 90)
                }
            }
            .navigationBarTitleDisplayMode(.inline)
        }
    }
}
