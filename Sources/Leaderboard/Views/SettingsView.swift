//
//  SettingsView.swift
//  Leaderboard
//
//  Settings & Liquid Glass Preferences
//

import SwiftUI

public struct SettingsView: View {
    @ObservedObject var viewModel: LeaderboardViewModel
    @State private var isUnitSelectorPresented: Bool = false
    @State private var isQuickActionsPresented: Bool = false
    @State private var isResetAlertPresented: Bool = false

    public init(viewModel: LeaderboardViewModel) {
        self.viewModel = viewModel
    }

    public var body: some View {
        ZStack {
            Color.black.ignoresSafeArea()

            RadialGradient(
                colors: [
                    Color(red: 0.1, green: 0.18, blue: 0.35).opacity(0.35),
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
                            Text("Ustawienia")
                                .font(.system(size: 28, weight: .heavy, design: .rounded))
                                .foregroundColor(.white)
                            Text("Personalizacja Liquid Glass i reguł gry")
                                .font(.system(size: 13, weight: .medium, design: .rounded))
                                .foregroundColor(Color.white.opacity(0.55))
                        }
                        Spacer()
                    }
                    .padding(.horizontal, 16)
                    .padding(.top, 14)

                    // Unit settings card
                    VStack(alignment: .leading, spacing: 14) {
                        settingRow(
                            icon: "scalemass.fill",
                            title: "Jednostka punktacji",
                            value: viewModel.settings.unit,
                            action: { isUnitSelectorPresented = true }
                        )

                        Divider().background(Color.white.opacity(0.12))

                        settingRow(
                            icon: "slider.horizontal.3",
                            title: "Szybkie przyciski +/-",
                            value: viewModel.settings.quickDeltas.map { "\($0 > 0 ? "+" : "")\($0)" }.joined(separator: ", "),
                            action: { isQuickActionsPresented = true }
                        )
                    }
                    .padding(18)
                    .liquidGlass(cornerRadius: 22)
                    .padding(.horizontal, 16)

                    // Pro Status Banner
                    HStack(spacing: 14) {
                        ZStack {
                            Circle()
                                .fill(Color(red: 1.0, green: 0.84, blue: 0.04).opacity(0.2))
                                .frame(width: 44, height: 44)
                            Image(systemName: viewModel.isProUnlocked ? "crown.fill" : "lock.fill")
                                .foregroundColor(Color(red: 1.0, green: 0.84, blue: 0.04))
                                .font(.system(size: 18))
                        }

                        VStack(alignment: .leading, spacing: 3) {
                            Text(viewModel.isProUnlocked ? "Status: PRO Aktywny" : "Status: Wersja Podstawowa")
                                .font(.system(size: 16, weight: .bold, design: .rounded))
                                .foregroundColor(.white)
                            Text(viewModel.isProUnlocked ? "Wszystkie funkcje Liquid Glass odblokowane" : "Aktywuj w zakładce PRO za 0,00 zł")
                                .font(.system(size: 12, design: .rounded))
                                .foregroundColor(Color.white.opacity(0.55))
                        }
                        Spacer()
                    }
                    .padding(18)
                    .liquidGlass(cornerRadius: 22, glowColor: Color.yellow.opacity(0.2))
                    .padding(.horizontal, 16)

                    // Reset & Danger Zone
                    VStack(alignment: .leading, spacing: 14) {
                        Button(action: {
                            isResetAlertPresented = true
                        }) {
                            HStack {
                                Image(systemName: "arrow.counterclockwise.circle.fill")
                                    .foregroundColor(.red)
                                    .font(.system(size: 18))
                                Text("Resetuj lub wyczyść tabelę...")
                                    .font(.system(size: 15, weight: .semibold, design: .rounded))
                                    .foregroundColor(.red)
                                Spacer()
                                Image(systemName: "chevron.right")
                                    .font(.system(size: 12, weight: .bold))
                                    .foregroundColor(Color.white.opacity(0.3))
                            }
                        }
                        .buttonStyle(.plain)
                    }
                    .padding(18)
                    .liquidGlass(cornerRadius: 22)
                    .padding(.horizontal, 16)

                    // Info
                    VStack(spacing: 4) {
                        Text("Leaderboard iOS • Liquid Glass Edition")
                            .font(.system(size: 12, weight: .bold, design: .rounded))
                            .foregroundColor(Color.white.opacity(0.4))
                        Text("Kompilacja natywna SwiftUI iOS 17+")
                            .font(.system(size: 11, design: .rounded))
                            .foregroundColor(Color.white.opacity(0.3))
                    }
                    .padding(.top, 10)
                    .padding(.bottom, 90)
                }
            }
        }
        .sheet(isPresented: $isUnitSelectorPresented) {
            UnitSelectorSheet(currentUnit: viewModel.settings.unit) { selectedUnit in
                viewModel.updateUnit(selectedUnit)
            }
        }
        .sheet(isPresented: $isQuickActionsPresented) {
            QuickActionSettingsSheet(currentDeltas: viewModel.settings.quickDeltas) { newDeltas in
                viewModel.updateQuickDeltas(newDeltas)
            }
        }
        .confirmationDialog("Reset Tablicy", isPresented: $isResetAlertPresented, titleVisibility: .visible) {
            Button("Przywróć domyślnych zawodników") {
                viewModel.resetToDefaults()
            }
            Button("Wyczyść całą tabelę", role: .destructive) {
                viewModel.clearAll()
            }
            Button("Anuluj", role: .cancel) {}
        }
    }

    private func settingRow(icon: String, title: String, value: String, action: @escaping () -> Void) -> some View {
        Button(action: action) {
            HStack {
                Image(systemName: icon)
                    .font(.system(size: 16))
                    .foregroundColor(Color(red: 0.3, green: 0.8, blue: 1.0))
                    .frame(width: 26)

                Text(title)
                    .font(.system(size: 15, weight: .semibold, design: .rounded))
                    .foregroundColor(.white)

                Spacer()

                Text(value)
                    .font(.system(size: 14, weight: .bold, design: .rounded))
                    .foregroundColor(Color.white.opacity(0.5))

                Image(systemName: "chevron.right")
                    .font(.system(size: 12, weight: .bold))
                    .foregroundColor(Color.white.opacity(0.3))
            }
        }
        .buttonStyle(.plain)
    }
}
