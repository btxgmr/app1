//
//  AnalyticsView.swift
//  Leaderboard
//
//  Apple Charts & Liquid Glass Performance Analytics
//

import SwiftUI
import Charts

public struct AnalyticsView: View {
    @ObservedObject var viewModel: LeaderboardViewModel

    public init(viewModel: LeaderboardViewModel) {
        self.viewModel = viewModel
    }

    public var body: some View {
        ZStack {
            Color.black.ignoresSafeArea()

            // Dynamic liquid background glow
            RadialGradient(
                colors: [
                    Color(red: 0.12, green: 0.22, blue: 0.45).opacity(0.4),
                    Color(red: 0.25, green: 0.08, blue: 0.35).opacity(0.2),
                    Color.black
                ],
                center: .topLeading,
                startRadius: 40,
                endRadius: 500
            )
            .ignoresSafeArea()

            ScrollView {
                VStack(spacing: 20) {
                    // Title Header
                    HStack {
                        VStack(alignment: .leading, spacing: 4) {
                            Text("Wykresy i Statystyki")
                                .font(.system(size: 28, weight: .heavy, design: .rounded))
                                .foregroundColor(.white)
                            Text("Liquid Glass Analytics & Apple Charts")
                                .font(.system(size: 13, weight: .medium, design: .rounded))
                                .foregroundColor(Color.white.opacity(0.55))
                        }
                        Spacer()
                    }
                    .padding(.horizontal, 16)
                    .padding(.top, 14)

                    // Top 3 Stat Cards in Liquid Glass
                    HStack(spacing: 12) {
                        statCard(
                            title: "Lider",
                            value: "\(viewModel.topScore)",
                            unit: viewModel.settings.unit,
                            icon: "crown.fill",
                            color: Color(red: 1.0, green: 0.84, blue: 0.04)
                        )
                        statCard(
                            title: "Średnia",
                            value: "\(viewModel.averageScore)",
                            unit: viewModel.settings.unit,
                            icon: "chart.bar.fill",
                            color: Color(red: 0.2, green: 0.85, blue: 0.95)
                        )
                        statCard(
                            title: "Łącznie",
                            value: "\(viewModel.totalScore)",
                            unit: viewModel.settings.unit,
                            icon: "flame.fill",
                            color: Color(red: 1.0, green: 0.45, blue: 0.1)
                        )
                    }
                    .padding(.horizontal, 16)

                    // Interactive Apple Charts: Ranking Bar Chart
                    VStack(alignment: .leading, spacing: 14) {
                        HStack {
                            Image(systemName: "chart.bar.xaxis")
                                .foregroundColor(Color(red: 0.3, green: 0.85, blue: 0.5))
                            Text("Wyniki Zawodników")
                                .font(.system(size: 17, weight: .bold, design: .rounded))
                                .foregroundColor(.white)
                            Spacer()
                            Text(viewModel.settings.unit)
                                .font(.system(size: 12, weight: .bold, design: .rounded))
                                .foregroundColor(Color.white.opacity(0.5))
                        }

                        if viewModel.players.isEmpty {
                            Text("Brak danych do wykresu")
                                .foregroundColor(Color.white.opacity(0.4))
                                .frame(height: 180)
                                .frame(maxWidth: .infinity)
                        } else {
                            Chart {
                                ForEach(viewModel.filteredSortedPlayers) { player in
                                    BarMark(
                                        x: .value("Wynik", player.score),
                                        y: .value("Zawodnik", player.name)
                                    )
                                    .foregroundStyle(
                                        LinearGradient(
                                            colors: [
                                                Color(hex: player.avatarColorHex),
                                                Color(hex: player.avatarColorHex).opacity(0.4)
                                            ],
                                            startPoint: .leading,
                                            endPoint: .trailing
                                        )
                                    )
                                    .cornerRadius(6)
                                }
                            }
                            .chartXAxis {
                                AxisMarks(position: .bottom) { _ in
                                    AxisGridLine(stroke: StrokeStyle(lineWidth: 0.5, dash: [4, 4]))
                                        .foregroundStyle(Color.white.opacity(0.15))
                                    AxisValueLabel()
                                        .foregroundStyle(Color.white.opacity(0.6))
                                }
                            }
                            .chartYAxis {
                                AxisMarks { _ in
                                    AxisValueLabel()
                                        .foregroundStyle(Color.white.opacity(0.85))
                                }
                            }
                            .frame(height: max(200, CGFloat(viewModel.filteredSortedPlayers.count * 36)))
                        }
                    }
                    .padding(18)
                    .liquidGlass(cornerRadius: 24, glowColor: Color.blue.opacity(0.25))
                    .padding(.horizontal, 16)

                    // Distribution / Gap to Leader Area Chart
                    VStack(alignment: .leading, spacing: 14) {
                        HStack {
                            Image(systemName: "waveform.path.ecg")
                                .foregroundColor(Color(red: 0.9, green: 0.4, blue: 0.9))
                            Text("Luka do Lidera")
                                .font(.system(size: 17, weight: .bold, design: .rounded))
                                .foregroundColor(.white)
                            Spacer()
                        }

                        if viewModel.players.count > 1 {
                            Chart {
                                ForEach(Array(viewModel.filteredSortedPlayers.enumerated()), id: \.element.id) { index, player in
                                    let gap = max(0, viewModel.topScore - player.score)
                                    AreaMark(
                                        x: .value("Pozycja", "#\(index + 1)"),
                                        y: .value("Strata", gap)
                                    )
                                    .foregroundStyle(
                                        LinearGradient(
                                            colors: [Color.purple.opacity(0.5), Color.purple.opacity(0.05)],
                                            startPoint: .top,
                                            endPoint: .bottom
                                        )
                                    )
                                    LineMark(
                                        x: .value("Pozycja", "#\(index + 1)"),
                                        y: .value("Strata", gap)
                                    )
                                    .foregroundStyle(Color.purple)
                                    .symbol(Circle().strokeBorder(lineWidth: 2))
                                }
                            }
                            .chartYAxis {
                                AxisMarks { _ in
                                    AxisGridLine().foregroundStyle(Color.white.opacity(0.1))
                                    AxisValueLabel().foregroundStyle(Color.white.opacity(0.6))
                                }
                            }
                            .chartXAxis {
                                AxisMarks { _ in
                                    AxisValueLabel().foregroundStyle(Color.white.opacity(0.7))
                                }
                            }
                            .frame(height: 180)
                        } else {
                            Text("Dodaj więcej zawodników, aby zobaczyć wykres luki punktowej.")
                                .font(.system(size: 13, design: .rounded))
                                .foregroundColor(Color.white.opacity(0.4))
                                .frame(height: 120)
                                .frame(maxWidth: .infinity)
                        }
                    }
                    .padding(18)
                    .liquidGlass(cornerRadius: 24, glowColor: Color.purple.opacity(0.2))
                    .padding(.horizontal, 16)
                    .padding(.bottom, 90)
                }
            }
        }
    }

    private func statCard(title: String, value: String, unit: String, icon: String, color: Color) -> some View {
        VStack(alignment: .leading, spacing: 6) {
            HStack {
                Image(systemName: icon)
                    .font(.system(size: 13, weight: .bold))
                    .foregroundColor(color)
                Spacer()
            }

            Text(title)
                .font(.system(size: 12, weight: .medium, design: .rounded))
                .foregroundColor(Color.white.opacity(0.6))

            HStack(alignment: .firstTextBaseline, spacing: 2) {
                Text(value)
                    .font(.system(size: 20, weight: .heavy, design: .rounded))
                    .foregroundColor(.white)
                    .contentTransition(.numericText(value: Double(value) ?? 0))
                    .monospacedDigit()
                Text(unit)
                    .font(.system(size: 10, weight: .bold, design: .rounded))
                    .foregroundColor(Color.white.opacity(0.45))
            }
        }
        .padding(14)
        .frame(maxWidth: .infinity, alignment: .leading)
        .liquidGlass(cornerRadius: 18, glowColor: color.opacity(0.2), borderOpacity: 0.25)
    }
}
