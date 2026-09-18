//
//  RankBadgeView.swift
//  Leaderboard
//
//  Apple Olympic/Fitness Podium Badge with Dynamic Ordinals & Glow
//

import SwiftUI

public struct RankBadgeView: View {
    public let rank: Int

    public init(rank: Int) {
        self.rank = rank
    }

    private var rankColor: Color {
        switch rank {
        case 1: return Color(red: 1.0, green: 0.84, blue: 0.04) // Gold #FFD60A
        case 2: return Color(red: 0.90, green: 0.90, blue: 0.92) // Silver #E5E5EA
        case 3: return Color(red: 1.0, green: 0.62, blue: 0.04) // Bronze #FF9F0A
        default: return Color(red: 0.56, green: 0.56, blue: 0.58) // iOS Neutral Gray
        }
    }

    private var glowColor: Color {
        switch rank {
        case 1: return Color(red: 1.0, green: 0.84, blue: 0.04).opacity(0.35)
        case 2: return Color(red: 0.90, green: 0.90, blue: 0.92).opacity(0.20)
        case 3: return Color(red: 1.0, green: 0.62, blue: 0.04).opacity(0.25)
        default: return Color.clear
        }
    }

    public var body: some View {
        Text(Player.ordinalRank(for: rank))
            .font(.system(size: 15, weight: .heavy, design: .rounded))
            .foregroundColor(rankColor)
            .padding(.horizontal, 10)
            .padding(.vertical, 5)
            .background(
                Capsule()
                    .fill(Color(white: 0.12).opacity(0.85))
                    .overlay(
                        Capsule()
                            .strokeBorder(rankColor.opacity(rank <= 3 ? 0.65 : 0.2), lineWidth: 1)
                    )
            )
            .shadow(color: glowColor, radius: rank <= 3 ? 8 : 0, x: 0, y: 0)
    }
}
