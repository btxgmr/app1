//
//  RollingDigitView.swift
//  Leaderboard
//
//  Apple Fitness Digit Physics Engine with Directional Motion Blur, Scale & Zero Ghosting
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
        formatter.groupingSeparator = ","
        return formatter.string(from: NSNumber(value: value)) ?? "\(value)"
    }

    public var body: some View {
        HStack(spacing: 0) {
            ForEach(Array(formattedString.enumerated()), id: \.offset) { index, char in
                SingleCharacterSlot(
                    character: char,
                    isPositiveDelta: delta >= 0,
                    font: font,
                    textColor: textColor
                )
            }
        }
        .monospacedDigit()
    }
}

/// A single character slot (digit or comma) featuring Apple Fitness motion blur and scale physics.
public struct SingleCharacterSlot: View {
    let character: Character
    let isPositiveDelta: Bool
    let font: Font
    let textColor: Color

    @State private var currentCharacter: Character
    @State private var previousCharacter: Character?
    @State private var isAnimating: Bool = false
    @State private var animationTask: Task<Void, Never>?

    public init(
        character: Character,
        isPositiveDelta: Bool,
        font: Font,
        textColor: Color
    ) {
        self.character = character
        self.isPositiveDelta = isPositiveDelta
        self.font = font
        self.textColor = textColor
        self._currentCharacter = State(initialValue: character)
    }

    public var body: some View {
        ZStack {
            // Exiting character with scale down, directional motion blur and fade out
            if let prev = previousCharacter, isAnimating {
                Text(String(prev))
                    .font(font)
                    .foregroundColor(textColor)
                    .scaleEffect(0.95)
                    .blur(radius: 4.5)
                    .opacity(0.0)
                    .offset(y: isPositiveDelta ? 24 : -24)
            }

            // Current/Entering character
            Text(String(currentCharacter))
                .font(font)
                .foregroundColor(textColor)
                .scaleEffect(isAnimating ? 1.0 : 1.0)
                .blur(radius: isAnimating ? 0.0 : 0.0)
                .opacity(isAnimating ? 1.0 : 1.0)
                .offset(y: 0)
        }
        .frame(minWidth: character == "," ? 8 : 16)
        .clipped()
        .onChange(of: character) { oldChar, newChar in
            guard oldChar != newChar else { return }

            // Cancel ongoing task for spam-click resilience
            animationTask?.cancel()

            previousCharacter = oldChar
            currentCharacter = newChar
            isAnimating = true

            animationTask = Task { @MainActor in
                withAnimation(.timingCurve(0.16, 1.0, 0.3, 1.0, duration: 0.42)) {
                    isAnimating = true
                }
                try? await Task.sleep(nanoseconds: 420_000_000)
                if !Task.isCancelled {
                    previousCharacter = nil
                    isAnimating = false
                }
            }
        }
    }
}
