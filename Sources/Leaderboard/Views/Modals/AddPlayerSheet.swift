//
//  AddPlayerSheet.swift
//  Leaderboard
//
//  iOS Modal to Add a New Athlete to the Board
//

import SwiftUI

public struct AddPlayerSheet: View {
    @Environment(\.dismiss) private var dismiss
    public let onAdd: (Player) -> Void

    @State private var name: String = ""
    @State private var scoreText: String = "100"
    @State private var selectedEmoji: String = "🔥"
    @State private var selectedColorHex: String = "#FF9F0A"

    private let emojis = ["🔥", "⚡️", "🏃‍♂️", "🚴‍♀️", "🥊", "🧘", "🏆", "💎", "🦁", "🚀", "⭐️", "🎯"]
    private let colors = ["#FF453A", "#FF9F0A", "#FFD60A", "#30D158", "#0A84FF", "#5E5CE6", "#BF5AF2"]

    public init(onAdd: @escaping (Player) -> Void) {
        self.onAdd = onAdd
    }

    public var body: some View {
        NavigationStack {
            Form {
                Section("Athlete Details") {
                    TextField("Full Name", text: $name)
                        .autocorrectionDisabled()

                    TextField("Initial Score", text: $scoreText)
                        .keyboardType(.numberPad)
                }

                Section("Choose Avatar") {
                    ScrollView(.horizontal, showsIndicators: false) {
                        HStack(spacing: 12) {
                            ForEach(emojis, id: \.self) { emoji in
                                Button(action: { selectedEmoji = emoji }) {
                                    Text(emoji)
                                        .font(.system(size: 26))
                                        .frame(width: 46, height: 46)
                                        .background(
                                            Circle()
                                                .fill(selectedEmoji == emoji ? Color.white.opacity(0.2) : Color.clear)
                                        )
                                        .overlay(
                                            Circle()
                                                .stroke(selectedEmoji == emoji ? Color.accentColor : Color.clear, lineWidth: 2)
                                        )
                                }
                                .buttonStyle(.plain)
                            }
                        }
                        .padding(.vertical, 4)
                    }
                }

                Section("Avatar Accent Color") {
                    HStack(spacing: 12) {
                        ForEach(colors, id: \.self) { hex in
                            Button(action: { selectedColorHex = hex }) {
                                Circle()
                                    .fill(Color(hex: hex))
                                    .frame(width: 32, height: 32)
                                    .overlay(
                                        Circle()
                                            .stroke(Color.white, lineWidth: selectedColorHex == hex ? 3 : 0)
                                    )
                            }
                            .buttonStyle(.plain)
                        }
                    }
                    .padding(.vertical, 4)
                }
            }
            .navigationTitle("Add Athlete")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cancel") { dismiss() }
                }
                ToolbarItem(placement: .confirmationAction) {
                    Button("Add") {
                        let trimmedName = name.trimmingCharacters(in: .whitespacesAndNewlines)
                        guard !trimmedName.isEmpty else { return }
                        let score = Int(scoreText) ?? 0
                        let newPlayer = Player(
                            name: trimmedName,
                            score: score,
                            avatarEmoji: selectedEmoji,
                            avatarColorHex: selectedColorHex
                        )
                        onAdd(newPlayer)
                        dismiss()
                    }
                    .disabled(name.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty)
                }
            }
        }
        .presentationDetents([.medium, .large])
    }
}
