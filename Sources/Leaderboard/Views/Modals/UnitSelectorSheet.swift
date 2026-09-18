//
//  UnitSelectorSheet.swift
//  Leaderboard
//
//  Configure the scoring unit / suffix (e.g. KCAL, PTS, KM, XP)
//

import SwiftUI

public struct UnitSelectorSheet: View {
    @Environment(\.dismiss) private var dismiss
    public let currentUnit: String
    public let onSelect: (String) -> Void

    @State private var customUnit: String = ""

    public init(currentUnit: String, onSelect: @escaping (String) -> Void) {
        self.currentUnit = currentUnit
        self.onSelect = onSelect
    }

    public var body: some View {
        NavigationStack {
            Form {
                Section("Popular Units") {
                    ForEach(LeaderboardSettings.presetUnits, id: \.self) { preset in
                        Button(action: {
                            onSelect(preset)
                            dismiss()
                        }) {
                            HStack {
                                Text(preset)
                                    .font(.system(.body, design: .rounded).weight(.semibold))
                                    .foregroundColor(.primary)
                                Spacer()
                                if currentUnit == preset {
                                    Image(systemName: "checkmark")
                                        .foregroundColor(.accentColor)
                                        .font(.system(size: 14, weight: .bold))
                                }
                            }
                        }
                    }
                }

                Section("Custom Unit Suffix") {
                    HStack {
                        TextField("e.g. STEPS, W, COINS", text: $customUnit)
                            .autocorrectionDisabled()

                        if !customUnit.isEmpty {
                            Button("Apply") {
                                onSelect(customUnit.trimmingCharacters(in: .whitespacesAndNewlines).uppercased())
                                dismiss()
                            }
                            .font(.system(.body, design: .rounded).weight(.bold))
                        }
                    }
                }
            }
            .navigationTitle("Score Suffix / Unit")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Close") { dismiss() }
                }
            }
        }
        .presentationDetents([.medium])
    }
}
