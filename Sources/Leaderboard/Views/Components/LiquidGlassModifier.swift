//
//  LiquidGlassModifier.swift
//  Leaderboard
//
//  Ultra-Refined Apple Liquid Glass Material & Lighting Physics
//

import SwiftUI

public struct LiquidGlassModifier: ViewModifier {
    public var cornerRadius: CGFloat = 24
    public var glowColor: Color = Color.white.opacity(0.12)
    public var borderOpacity: Double = 0.22

    public func body(content: Content) -> some View {
        content
            .background(
                RoundedRectangle(cornerRadius: cornerRadius, style: .continuous)
                    .fill(Color(red: 0.05, green: 0.07, blue: 0.12).opacity(0.85))
                    .overlay(
                        // Chromatic Specular Highlight (Liquid Glass effect without white haze)
                        LinearGradient(
                            colors: [
                                Color.white.opacity(0.08),
                                Color.clear,
                                Color.clear,
                                Color.white.opacity(0.03)
                            ],
                            startPoint: .topLeading,
                            endPoint: .bottomTrailing
                        )
                    )
            )
            .overlay(
                RoundedRectangle(cornerRadius: cornerRadius, style: .continuous)
                    .strokeBorder(
                        LinearGradient(
                            colors: [
                                Color.white.opacity(0.14),
                                Color.white.opacity(0.04),
                                Color.clear,
                                Color.white.opacity(0.07)
                            ],
                            startPoint: .topLeading,
                            endPoint: .bottomTrailing
                        ),
                        lineWidth: 1
                    )
            )
            .shadow(color: Color.black.opacity(0.5), radius: 16, x: 0, y: 8)
            .shadow(color: glowColor.opacity(0.12), radius: 24, x: 0, y: 0)
    }
}

public extension View {
    func liquidGlass(
        cornerRadius: CGFloat = 24,
        glowColor: Color = Color.white.opacity(0.12),
        borderOpacity: Double = 0.22
    ) -> some View {
        modifier(LiquidGlassModifier(
            cornerRadius: cornerRadius,
            glowColor: glowColor,
            borderOpacity: borderOpacity
        ))
    }
}
