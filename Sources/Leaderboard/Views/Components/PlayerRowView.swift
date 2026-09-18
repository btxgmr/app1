//
//  PlayerRowView.swift
//  Leaderboard
//
//  Glassmorphic iOS Squircle Row with Quick Actions and Rolling Numbers
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

    public var body: some View {
        VStack(spacing: 12) {
            HStack(spacing: 14) {
                // Rank Badge
                RankBadgeView(rank: rank)

                // Avatar
                ZStack {
                    Circle()
                        .fill(Color(hex: player.avatarColorHex).opacity(0.25))
                        .frame(width: 44, height: 44)
                        .overlay(
                            Circle()
                                .stroke(Color(hex: player.avatarColorHex).opacity(0.5), lineWidth: 1.5)
                        )
                    Text(player.avatarEmoji)
                        .font(.system(size: 22))
                }

                // Name & Delta
                VStack(alignment: .leading, spacing: 2) {
                    Text(player.name)
                        .font(.system(size: 17, weight: .bold, design: .rounded))
                        .foregroundColor(.white)
                        .lineLimit(1)

                    DeltaBadgeView(delta: player.lastDelta, date: player.lastDeltaDate)
                }

                Spacer()

                // Rolling Score and Unit Suffix
                HStack(alignment: .firstTextBaseline, spacing: 4) {
                    RollingDigitView(
                        value: player.score,
                        delta: player.lastDelta ?? 0,
                        font: .system(size: 24, weight: .heavy, design: .rounded),
                        textColor: .white
                    )

                    Text(unit)
                        .font(.system(size: 13, weight: .bold, design: .rounded))
                        .foregroundColor(Color(white: 0.55))
                }
            }

            // Quick Modification Buttons
            HStack(spacing: 8) {
                ForEach(quickDeltas, id: \.self) { delta in
                    Button(action: {
                        onModifyScore(delta)
                    }) {
                        Text("\(delta > 0 ? "+" : "")\(delta)")
                            .font(.system(size: 13, weight: .heavy, design: .rounded))
                            .foregroundColor(delta > 0 ? Color(red: 0.19, green: 0.82, blue: 0.35) : Color(red: 1.0, green: 0.27, blue: 0.23))
                            .frame(maxWidth: .infinity)
                            .padding(.vertical, 7)
                            .background(
                                Capsule()
                                    .fill(Color(white: 0.16).opacity(0.7))
                            )
                    }
                    .buttonStyle(.plain)
                }

                Button(action: onDelete) {
                    Image(systemName: "trash")
                        .font(.system(size: 12, weight: .bold))
                        .foregroundColor(Color(white: 0.45))
                        .padding(.horizontal, 12)
                        .padding(.vertical, 7)
                        .background(
                            Capsule()
                                .fill(Color(white: 0.14).opacity(0.6))
                        )
                }
                .buttonStyle(.plain)
            }
        }
        .padding(16)
        .background(
            RoundedRectangle(cornerRadius: 24, style: .continuous)
                .fill(Color(white: 0.11).opacity(0.85))
                .overlay(
                    RoundedRectangle(cornerRadius: 24, style: .continuous)
                        .strokeBorder(Color.white.opacity(0.08), lineWidth: 1)
                )
        )
        .shadow(color: Color.black.opacity(0.35), radius: 10, x: 0, y: 4)
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
        case 3: // RGB (12-bit)
            (a, r, g, b) = (255, (int >> 8) * 17, (int >> 4 & 0xF) * 17, (int & 0xF) * 17)
        case 6: // RGB (24-bit)
            (a, r, g, b) = (255, int >> 16, int >> 8 & 0xFF, int & 0xFF)
        case 8: // ARGB (32-bit)
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
