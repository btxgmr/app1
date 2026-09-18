//
//  RollingDigitView.swift
//  Leaderboard
//
//  Apple Fitness Liquid Glass Numeric Text Physics Engine (.numericText())
//

import SwiftUI

public struct RollingDigitView: View {
    public let value: Int
    public let delta: Int
    public let font: Font
    public let textColor: Color

    public init(
        value: Int,
        delta: Int = 0,
        font: Font = .system(size: 26, weight: .heavy, design: .rounded),
        textColor: Color = .white
    ) {
        self.value = value
        self.delta = delta
        self.font = font
        self.textColor = textColor
    }

    private var formattedString: String {
        let formatter = NumberFormatter()
        formatter.numberStyle = .decimal
        formatter.groupingSeparator = " "
        return formatter.string(from: NSNumber(value: value)) ?? "\(value)"
    }

    public var body: some View {
        Text(formattedString)
            .font(font)
            .foregroundColor(textColor)
            .contentTransition(.numericText(value: Double(value)))
            .monospacedDigit()
            .animation(.spring(response: 0.42, dampingFraction: 0.82), value: value)
    }
}
