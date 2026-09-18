//
//  PlayerRowView.swift
//  Leaderboard
//
//  Liquid Glass iOS Athlete Row with Quick +/- and Rolling Numbers
//

import SwiftUI

public struct PlayerRowView: View {
    public let player: Player
    public let rank: Int
    public let unit: String
    public let quickDeltas: [Int]
    public let onModifyScore: (Int) -> Void
    public let onDelete: () -> Void

    public init(
        player: Player,
        rank: Int,
        unit: String,
        quickDeltas: [Int],
        onModifyScore: @escaping (Int) -> Void,
        onDelete: @escaping () -> Void
    ) {
        self.player = player
        self.rank = rank
        self.unit = unit
        self.quickDeltas = quickDeltas
        self.onModifyScore = onModifyScore
        self.onDelete = onDelete
    }

    private var accentColor: Color {
        Color(hex: player.avatarColorHex)
    }

    public var body: some View {
        VStack(spacing: 12) {
            HStack(spacing: 14) {
                // Liquid Rank Badge
                RankBadgeView(rank: rank)

                // Liquid Avatar with glass border
                ZStack {
                    Circle()
                        .fill(accentColor.opacity(0.22))
                        .frame(width: 46, height: 46)
                        .overlay(
                            Circle()
                                .stroke(
                                    LinearGradient(
                                        colors: [accentColor.opacity(0.8), accentColor.opacity(0.2)],
                                        startPoint: .topLeading,
                                        endPoint: .bottomTrailing
                                    ),
                                    lineWidth: 1.5
                                )
                        )
                    Text(player.avatarEmoji)
                        .font(.system(size: 22))
                }
                .shadow(color: accentColor.opacity(0.35), radius: 8, x: 0, y: 2)

                // Name & Delta Badge
                VStack(alignment: .leading, spacing: 3) {
                    Text(player.name)
                        .font(.system(size: 17, weight: .bold, design: .rounded))
                        .foregroundColor(.white)
                        .lineLimit(1)

                    DeltaBadgeView(delta: player.lastDelta, date: player.lastDeltaDate)
                }

                Spacer()

                // Rolling Score with iOS 17 .numericText transition
                HStack(alignment: .firstTextBaseline, spacing: 4) {
                    RollingDigitView(
                        value: player.score,
                        delta: player.lastDelta ?? 0,
                        font: .system(size: 24, weight: .heavy, design: .rounded),
                        textColor: .white
                    )

                    Text(unit)
                        .font(.system(size: 13, weight: .bold, design: .rounded))
                        .foregroundColor(Color.white.opacity(0.55))
                }
            }

            // Quick Modification Liquid Buttons
            HStack(spacing: 8) {
                ForEach(quickDeltas, id: \.self) { delta in
                    Button(action: {
                        onModifyScore(delta)
                    }) {
                        Text("\(delta > 0 ? "+" : "")\(delta)")
                            .font(.system(size: 13, weight: .heavy, design: .rounded))
                            .foregroundColor(delta > 0 ? Color(red: 0.2, green: 0.88, blue: 0.4) : Color(red: 1.0, green: 0.32, blue: 0.28))
                            .frame(maxWidth: .infinity)
                            .padding(.vertical, 8)
                            .background(
                                Capsule()
                                    .fill(.ultraThinMaterial)
                                    .overlay(
                                        Capsule()
                                            .strokeBorder(
                                                (delta > 0 ? Color.green : Color.red).opacity(0.25),
                                                lineWidth: 1
                                            )
                                    )
                            )
                    }
                    .buttonStyle(.plain)
                }

                Button(action: onDelete) {
                    Image(systemName: "trash")
                        .font(.system(size: 12, weight: .bold))
                        .foregroundColor(Color.white.opacity(0.45))
                        .padding(.horizontal, 14)
                        .padding(.vertical, 8)
                        .background(
                            Capsule()
                                .fill(.ultraThinMaterial)
                                .overlay(Capsule().strokeBorder(Color.white.opacity(0.12), lineWidth: 1))
                        )
                }
                .buttonStyle(.plain)
            }
        }
        .padding(16)
        .liquidGlass(
            cornerRadius: 22,
            glowColor: accentColor.opacity(rank <= 3 ? 0.3 : 0.08),
            borderOpacity: rank <= 3 ? 0.35 : 0.2
        )
    }
}

// MARK: - Color Hex Extension
extension Color {
    init(hex: String) {
        let hex = hex.trimmingCharacters(in: CharacterSet.alphanumerics.inverted)
        var int: UInt64 = 0
        Scanner(string: hex).scanHexInt64(&int)
        let a, r, g, b: UInt64
        switch hex.count {
        case 3:
            (a, r, g, b) = (255, (int >> 8) * 17, (int >> 4 & 0xF) * 17, (int & 0xF) * 17)
        case 6:
            (a, r, g, b) = (255, int >> 16, int >> 8 & 0xFF, int & 0xFF)
        case 8:
            (a, r, g, b) = (int >> 24, int >> 16 & 0xFF, int >> 8 & 0xFF, int & 0xFF)
        default:
            (a, r, g, b) = (255, 128, 128, 128)
        }
        self.init(
            .sRGB,
            red: Double(r) / 255,
            green: Double(g) / 255,
            blue:  Double(b) / 255,
            opacity: Double(a) / 255
        )
    }
}
