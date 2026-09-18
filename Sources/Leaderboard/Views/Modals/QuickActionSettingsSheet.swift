//
//  QuickActionSettingsSheet.swift
//  Leaderboard
//
//  Configure the 3 quick-action (+/-) modification buttons
//

import SwiftUI

public struct QuickActionSettingsSheet: View {
    @Environment(\.dismiss) private var dismiss
    public let currentDeltas: [Int]
    public let onSave: ([Int]) -> Void

    @State private var delta1: String = ""
    @State private var delta2: String = ""
    @State private var delta3: String = ""

    public init(currentDeltas: [Int], onSave: @escaping ([Int]) -> Void) {
        self.currentDeltas = currentDeltas
        self.onSave = onSave
    }

    public var body: some View {
        NavigationStack {
            Form {
                Section {
                    HStack {
                        Text("Action 1 (Subtract)")
                        Spacer()
                        TextField("-100", text: $delta1)
                            .keyboardType(.numbersAndPunctuation)
                            .multilineTextAlignment(.trailing)
                    }

                    HStack {
                        Text("Action 2 (Add)")
                        Spacer()
                        TextField("25", text: $delta2)
                            .keyboardType(.numbersAndPunctuation)
                            .multilineTextAlignment(.trailing)
                    }

                    HStack {
                        Text("Action 3 (Boost)")
                        Spacer()
                        TextField("500", text: $delta3)
                            .keyboardType(.numbersAndPunctuation)
                            .multilineTextAlignment(.trailing)
                    }
                } header: {
                    Text("Button Values")
                } footer: {
                    Text("Values can be negative or positive integers (e.g. -100, 25, 500).")
                }

                Section {
                    Button("Reset to Defaults (-100, +25, +500)") {
                        delta1 = "-100"
                        delta2 = "25"
                        delta3 = "500"
                    }
                    .foregroundColor(.orange)
                }
            }
            .onAppear {
                if currentDeltas.count >= 3 {
                    delta1 = "\(currentDeltas[0])"
                    delta2 = "\(currentDeltas[1])"
                    delta3 = "\(currentDeltas[2])"
                }
            }
            .navigationTitle("Quick Actions")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cancel") { dismiss() }
                }
                ToolbarItem(placement: .confirmationAction) {
                    Button("Save") {
                        let d1 = Int(delta1) ?? -100
                        let d2 = Int(delta2) ?? 25
                        let d3 = Int(delta3) ?? 500
                        onSave([d1, d2, d3])
                        dismiss()
                    }
                }
            }
        }
        .presentationDetents([.medium])
    }
}
