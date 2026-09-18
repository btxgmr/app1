//
//  PremiumStoreView.swift
//  Leaderboard
//
//  Apple Pay 0 zł Liquid Glass Pro Membership Store
//

import SwiftUI

public struct PremiumStoreView: View {
    @ObservedObject var viewModel: LeaderboardViewModel
    @State private var isShowingPaymentSheet: Bool = false
    @State private var isProcessingPayment: Bool = false
    @State private var isPaymentSuccess: Bool = false

    public init(viewModel: LeaderboardViewModel) {
        self.viewModel = viewModel
    }

    public var body: some View {
        ZStack {
            Color.black.ignoresSafeArea()

            // Mesh Liquid Glass Glow
            RadialGradient(
                colors: [
                    Color(red: 1.0, green: 0.75, blue: 0.1).opacity(0.25),
                    Color(red: 0.8, green: 0.2, blue: 0.6).opacity(0.18),
                    Color.black
                ],
                center: .top,
                startRadius: 30,
                endRadius: 520
            )
            .ignoresSafeArea()

            ScrollView {
                VStack(spacing: 22) {
                    // Title
                    VStack(spacing: 6) {
                        Text("Leaderboard PRO")
                            .font(.system(size: 32, weight: .heavy, design: .rounded))
                            .foregroundColor(.white)

                        Text("Odblokuj pełną moc Liquid Glass i Apple Pay")
                            .font(.system(size: 14, weight: .medium, design: .rounded))
                            .foregroundColor(Color.white.opacity(0.6))
                    }
                    .padding(.top, 16)

                    // Holographic Liquid Glass Membership Card
                    VStack(alignment: .leading, spacing: 18) {
                        HStack {
                            VStack(alignment: .leading, spacing: 3) {
                                Text("CZŁONKOSTWO PRO")
                                    .font(.system(size: 11, weight: .black, design: .rounded))
                                    .tracking(2)
                                    .foregroundColor(Color(red: 1.0, green: 0.84, blue: 0.04))
                                Text("Dożywotni Dostęp")
                                    .font(.system(size: 20, weight: .heavy, design: .rounded))
                                    .foregroundColor(.white)
                            }
                            Spacer()
                            Image(systemName: "apple.logo")
                                .font(.system(size: 26))
                                .foregroundColor(.white)
                        }

                        Spacer().frame(height: 10)

                        HStack(alignment: .bottom) {
                            VStack(alignment: .leading, spacing: 4) {
                                HStack(spacing: 8) {
                                    Text("49,99 zł")
                                        .font(.system(size: 15, weight: .semibold, design: .rounded))
                                        .strikethrough(true, color: .red)
                                        .foregroundColor(Color.white.opacity(0.45))

                                    Text("PROMOCJA 100% OFF")
                                        .font(.system(size: 10, weight: .heavy, design: .rounded))
                                        .padding(.horizontal, 8)
                                        .padding(.vertical, 3)
                                        .background(Capsule().fill(Color.green.opacity(0.25)))
                                        .foregroundColor(Color.green)
                                }

                                HStack(alignment: .firstTextBaseline, spacing: 4) {
                                    Text("0,00 zł")
                                        .font(.system(size: 36, weight: .black, design: .rounded))
                                        .foregroundColor(.white)
                                    Text("/ zawsze za darmo")
                                        .font(.system(size: 13, weight: .bold, design: .rounded))
                                        .foregroundColor(Color.white.opacity(0.6))
                                }
                            }
                            Spacer()

                            if viewModel.isProUnlocked {
                                HStack(spacing: 4) {
                                    Image(systemName: "checkmark.seal.fill")
                                    Text("AKTYWNY")
                                }
                                .font(.system(size: 12, weight: .heavy, design: .rounded))
                                .padding(.horizontal, 12)
                                .padding(.vertical, 6)
                                .background(Capsule().fill(Color.green))
                                .foregroundColor(.black)
                            }
                        }
                    }
                    .padding(24)
                    .frame(height: 200)
                    .liquidGlass(
                        cornerRadius: 26,
                        glowColor: Color(red: 1.0, green: 0.8, blue: 0.1).opacity(0.4),
                        borderOpacity: 0.4
                    )
                    .padding(.horizontal, 16)

                    // Features Checklist
                    VStack(alignment: .leading, spacing: 16) {
                        featureRow(icon: "infinity", text: "Nielimitowana liczba zawodników")
                        featureRow(icon: "sparkles", text: "Złoty i Chromatyczny motyw Liquid Glass")
                        featureRow(icon: "chart.xyaxis.line", text: "Zaawansowane analizy i wykresy postępów")
                        featureRow(icon: "arrow.down.doc.fill", text: "Eksport tabeli do PDF & arkusza CSV")
                        featureRow(icon: "icloud.fill", text: "Bezpieczny zapis i kopia zapasowa")
                    }
                    .padding(20)
                    .liquidGlass(cornerRadius: 22)
                    .padding(.horizontal, 16)

                    // Apple Pay Button (0 zł)
                    if viewModel.isProUnlocked {
                        HStack(spacing: 8) {
                            Image(systemName: "checkmark.circle.fill")
                                .foregroundColor(Color.green)
                            Text("Dziękujemy! Posiadasz wersję PRO.")
                                .font(.system(size: 16, weight: .bold, design: .rounded))
                                .foregroundColor(.white)
                        }
                        .padding(18)
                        .frame(maxWidth: .infinity)
                        .liquidGlass(cornerRadius: 20, glowColor: Color.green.opacity(0.2))
                        .padding(.horizontal, 16)
                    } else {
                        Button(action: {
                            isShowingPaymentSheet = true
                        }) {
                            HStack(spacing: 8) {
                                Image(systemName: "apple.logo")
                                    .font(.system(size: 20))
                                Text("Zapłać z")
                                    .font(.system(size: 18, weight: .semibold, design: .rounded))
                                Text("Pay")
                                    .font(.system(size: 20, weight: .black, design: .rounded))
                                Spacer()
                                Text("0,00 zł")
                                    .font(.system(size: 16, weight: .bold, design: .rounded))
                                    .padding(.horizontal, 10)
                                    .padding(.vertical, 4)
                                    .background(Capsule().fill(Color.white.opacity(0.18)))
                            }
                            .foregroundColor(.white)
                            .padding(.horizontal, 24)
                            .padding(.vertical, 16)
                            .background(
                                RoundedRectangle(cornerRadius: 18, style: .continuous)
                                    .fill(Color.white.opacity(0.12))
                                    .overlay(
                                        RoundedRectangle(cornerRadius: 18, style: .continuous)
                                            .strokeBorder(Color.white.opacity(0.4), lineWidth: 1.5)
                                    )
                            )
                        }
                        .buttonStyle(.plain)
                        .padding(.horizontal, 16)
                    }

                    Spacer().frame(height: 80)
                }
            }
        }
        // Apple Pay Modal Sheet
        .sheet(isPresented: $isShowingPaymentSheet) {
            applePayConfirmationSheet
        }
    }

    private func featureRow(icon: String, text: String) -> some View {
        HStack(spacing: 12) {
            ZStack {
                Circle()
                    .fill(Color(red: 1.0, green: 0.84, blue: 0.04).opacity(0.15))
                    .frame(width: 32, height: 32)
                Image(systemName: icon)
                    .font(.system(size: 13, weight: .bold))
                    .foregroundColor(Color(red: 1.0, green: 0.84, blue: 0.04))
            }
            Text(text)
                .font(.system(size: 15, weight: .semibold, design: .rounded))
                .foregroundColor(.white)
            Spacer()
        }
    }

    // Simulated iOS Apple Pay Native Sheet
    private var applePayConfirmationSheet: some View {
        ZStack {
            Color(white: 0.12).ignoresSafeArea()

            VStack(spacing: 20) {
                // Header
                HStack {
                    Image(systemName: "apple.logo")
                        .font(.system(size: 20))
                    Text("Pay")
                        .font(.system(size: 20, weight: .bold))
                    Spacer()
                    Button("Anuluj") {
                        isShowingPaymentSheet = false
                    }
                    .foregroundColor(Color.accentColor)
                }
                .padding(.top, 18)

                Divider().background(Color.white.opacity(0.2))

                // Card info
                HStack(spacing: 14) {
                    RoundedRectangle(cornerRadius: 6)
                        .fill(LinearGradient(colors: [Color.blue, Color.cyan], startPoint: .topLeading, endPoint: .bottomTrailing))
                        .frame(width: 50, height: 34)
                        .overlay(Text("CARD").font(.system(size: 8, weight: .black)).foregroundColor(.white))

                    VStack(alignment: .leading, spacing: 2) {
                        Text("Apple Cash / Karta domyślna")
                            .font(.system(size: 15, weight: .semibold))
                            .foregroundColor(.white)
                        Text("•••• 1234")
                            .font(.system(size: 13))
                            .foregroundColor(Color.white.opacity(0.5))
                    }
                    Spacer()
                }
                .padding(.vertical, 6)

                Divider().background(Color.white.opacity(0.2))

                // Line items
                VStack(spacing: 8) {
                    HStack {
                        Text("Leaderboard PRO Lifetime")
                            .foregroundColor(Color.white.opacity(0.8))
                        Spacer()
                        Text("0,00 zł")
                            .foregroundColor(.white)
                    }
                    HStack {
                        Text("Rabat wczesnego dostępu")
                            .foregroundColor(Color.green)
                        Spacer()
                        Text("-49,99 zł")
                            .foregroundColor(Color.green)
                    }
                }
                .font(.system(size: 14))

                Divider().background(Color.white.opacity(0.2))

                // Total
                HStack {
                    Text("ŁĄCZNIE")
                        .font(.system(size: 13, weight: .bold))
                        .foregroundColor(Color.white.opacity(0.6))
                    Spacer()
                    Text("0,00 zł")
                        .font(.system(size: 24, weight: .black))
                        .foregroundColor(.white)
                }

                Spacer()

                // Confirm button / Face ID trigger
                if isProcessingPayment {
                    ProgressView()
                        .tint(.white)
                        .scaleEffect(1.4)
                        .padding()
                } else if isPaymentSuccess {
                    VStack(spacing: 8) {
                        Image(systemName: "checkmark.circle.fill")
                            .font(.system(size: 44))
                            .foregroundColor(.green)
                        Text("Płatność zaakceptowana (0,00 zł)")
                            .font(.system(size: 16, weight: .bold))
                            .foregroundColor(.white)
                    }
                    .padding()
                } else {
                    Button(action: {
                        isProcessingPayment = true
                        DispatchQueue.main.asyncAfter(deadline: .now() + 1.2) {
                            isProcessingPayment = false
                            isPaymentSuccess = true
                            viewModel.unlockPro()
                            DispatchQueue.main.asyncAfter(deadline: .now() + 0.8) {
                                isShowingPaymentSheet = false
                                isPaymentSuccess = false
                            }
                        }
                    }) {
                        HStack(spacing: 8) {
                            Image(systemName: "faceid")
                                .font(.system(size: 20))
                            Text("Kliknij dwukrotnie, aby zapłacić")
                                .font(.system(size: 16, weight: .bold))
                        }
                        .foregroundColor(.black)
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 14)
                        .background(Capsule().fill(Color.white))
                    }
                }
            }
            .padding(.horizontal, 20)
            .padding(.bottom, 24)
        }
        .presentationDetents([.medium])
    }
}
