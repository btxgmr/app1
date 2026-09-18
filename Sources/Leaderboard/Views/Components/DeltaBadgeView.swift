//
//  DeltaBadgeView.swift
//  Leaderboard
//
//  Delta Indicator showing point changes with auto-fade
//

import SwiftUI

public struct DeltaBadgeView: View {
    public let delta: Int?
    public let date: Date?

    public init(delta: Int?, date: Date?) {
        self.delta = delta
        self.date = date
    }

    private var isVisible: Bool {
        guard let delta = delta, delta != 0, let date = date else { return false }
        return Date().timeIntervalSince(date) < 2.0
    }

    private var isPositive: Bool {
        (delta ?? 0) > 0
    }

    public var body: some View {
        if isVisible, let delta = delta {
            HStack(spacing: 2) {
                Image(systemName: isPositive ? "arrow.up" : "arrow.down")
                    .font(.system(size: 10, weight: .bold))
                Text("\(isPositive ? "+" : "")\(delta)")
                    .font(.system(size: 11, weight: .heavy, design: .rounded))
            }
            .foregroundColor(isPositive ? Color(red: 0.19, green: 0.82, blue: 0.35) : Color(red: 1.0, green: 0.27, blue: 0.23))
            .padding(.horizontal, 6)
            .padding(.vertical, 3)
            .background(
                Capsule()
                    .fill((isPositive ? Color.green : Color.red).opacity(0.18))
                    .overlay(
                        Capsule()
                            .strokeBorder((isPositive ? Color.green : Color.red).opacity(0.35), lineWidth: 0.8)
                    )
            )
            .transition(.scale.combined(with: .opacity))
        }
    }
}
