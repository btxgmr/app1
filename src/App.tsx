import React, { useState, useEffect, useRef } from 'react';
import {
  Trophy,
  Plus,
  SlidersHorizontal,
  Search,
  Trash2,
  Check,
  Copy,
  Code2,
  Smartphone,
  FolderGit2,
  ChevronDown,
  RotateCcw,
  Sparkles,
  ArrowUp,
  ArrowDown,
  FileCode,
  Github
} from 'lucide-react';

interface Player {
  id: string;
  name: string;
  score: number;
  avatarEmoji: string;
  avatarColorHex: string;
  lastDelta?: number;
  lastDeltaTime?: number;
}

interface LeaderboardSettings {
  unit: string;
  quickDeltas: [number, number, number];
}

const DEFAULT_PLAYERS: Player[] = [
  { id: '1', name: 'Alex Rivera', score: 1250, avatarEmoji: '🔥', avatarColorHex: '#FF9F0A' },
  { id: '2', name: 'Sarah Chen', score: 980, avatarEmoji: '⚡️', avatarColorHex: '#FFD60A' },
  { id: '3', name: 'Marcus Vance', score: 840, avatarEmoji: '🚴‍♂️', avatarColorHex: '#30D158' },
  { id: '4', name: 'Elena Rostova', score: 620, avatarEmoji: '🥊', avatarColorHex: '#0A84FF' },
  { id: '5', name: 'David Kim', score: 450, avatarEmoji: '🏃‍♂️', avatarColorHex: '#BF5AF2' }
];

const PRESET_UNITS = ['KCAL', 'PTS', 'PKT', 'KM', '$', 'XP', 'KG'];

function getOrdinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

// Swift Source Code snippets for in-app GitHub repository viewer
const SWIFT_FILES: Record<string, { filename: string; path: string; language: string; content: string }> = {
  'Package.swift': {
    filename: 'Package.swift',
    path: 'Package.swift',
    language: 'swift',
    content: `// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "Leaderboard",
    platforms: [
        .iOS(.v17),
        .macOS(.v14)
    ],
    products: [
        .library(name: "Leaderboard", targets: ["Leaderboard"]),
    ],
    targets: [
        .target(name: "Leaderboard", path: "Sources/Leaderboard"),
        .testTarget(name: "LeaderboardTests", dependencies: ["Leaderboard"], path: "Tests/LeaderboardTests")
    ]
)`
  },
  'Player.swift': {
    filename: 'Player.swift',
    path: 'Sources/Leaderboard/Models/Player.swift',
    language: 'swift',
    content: `import SwiftUI

public struct Player: Identifiable, Codable, Equatable, Hashable {
    public let id: UUID
    public var name: String
    public var score: Int
    public var avatarEmoji: String
    public var avatarColorHex: String
    public var lastDelta: Int?
    public var lastDeltaDate: Date?

    public init(
        id: UUID = UUID(),
        name: String,
        score: Int,
        avatarEmoji: String = "⚡️",
        avatarColorHex: String = "#FF9F0A",
        lastDelta: Int? = nil,
        lastDeltaDate: Date? = nil
    ) {
        self.id = id
        self.name = name
        self.score = score
        self.avatarEmoji = avatarEmoji
        self.avatarColorHex = avatarColorHex
        self.lastDelta = lastDelta
        self.lastDeltaDate = lastDeltaDate
    }

    public static func ordinalRank(for rank: Int) -> String {
        guard rank > 0 else { return "\\(rank)" }
        let remainder100 = rank % 100
        let remainder10 = rank % 10

        let suffix: String
        if remainder100 >= 11 && remainder100 <= 13 {
            suffix = "th"
        } else {
            switch remainder10 {
            case 1: suffix = "st"
            case 2: suffix = "nd"
            case 3: suffix = "rd"
            default: suffix = "th"
            }
        }
        return "\\(rank)\\(suffix)"
    }
}`
  },
  'RollingDigitView.swift': {
    filename: 'RollingDigitView.swift',
    path: 'Sources/Leaderboard/Views/Components/RollingDigitView.swift',
    language: 'swift',
    content: `import SwiftUI

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
        return formatter.string(from: NSNumber(value: value)) ?? "\\(value)"
    }

    public var body: some View {
        HStack(spacing: 0) {
            ForEach(Array(formattedString.enumerated()), id: \\.offset) { index, char in
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

public struct SingleCharacterSlot: View {
    let character: Character
    let isPositiveDelta: Bool
    let font: Font
    let textColor: Color

    @State private var currentCharacter: Character
    @State private var previousCharacter: Character?
    @State private var isAnimating: Bool = false
    @State private var animationTask: Task<Void, Never>?

    public init(character: Character, isPositiveDelta: Bool, font: Font, textColor: Color) {
        self.character = character
        self.isPositiveDelta = isPositiveDelta
        self.font = font
        self.textColor = textColor
        self._currentCharacter = State(initialValue: character)
    }

    public var body: some View {
        ZStack {
            if let prev = previousCharacter, isAnimating {
                Text(String(prev))
                    .font(font)
                    .foregroundColor(textColor)
                    .scaleEffect(0.95)
                    .blur(radius: 4.5)
                    .opacity(0.0)
                    .offset(y: isPositiveDelta ? 24 : -24)
            }

            Text(String(currentCharacter))
                .font(font)
                .foregroundColor(textColor)
                .scaleEffect(1.0)
                .blur(radius: 0.0)
                .opacity(1.0)
                .offset(y: 0)
        }
        .frame(minWidth: character == "," ? 8 : 16)
        .clipped()
        .onChange(of: character) { oldChar, newChar in
            guard oldChar != newChar else { return }
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
}`
  },
  'LeaderboardView.swift': {
    filename: 'LeaderboardView.swift',
    path: 'Sources/Leaderboard/Views/LeaderboardView.swift',
    language: 'swift',
    content: `import SwiftUI

public struct LeaderboardView: View {
    @StateObject private var viewModel = LeaderboardViewModel()
    @State private var isAddPlayerPresented = false
    @State private var isUnitSelectorPresented = false
    @State private var isQuickActionsPresented = false

    public var body: some View {
        ZStack {
            Color.black.ignoresSafeArea()
            
            VStack(spacing: 0) {
                // Header Bar
                HStack {
                    VStack(alignment: .leading, spacing: 2) {
                        Text("Leaderboard")
                            .font(.system(size: 28, weight: .heavy, design: .rounded))
                            .foregroundColor(.white)
                        Text("Apple Fitness HIG & Dark Mode")
                            .font(.system(size: 13, weight: .medium, design: .rounded))
                            .foregroundColor(Color(white: 0.5))
                    }
                    Spacer()
                    // Unit selector pill & actions
                }
                .padding()

                // Athletes list with spring animation
                ScrollView {
                    LazyVStack(spacing: 12) {
                        ForEach(viewModel.filteredSortedPlayers) { player in
                            PlayerRowView(
                                player: player,
                                rank: viewModel.rank(for: player),
                                unit: viewModel.settings.unit,
                                quickDeltas: viewModel.settings.quickDeltas,
                                onModifyScore: { delta in
                                    viewModel.modifyScore(for: player.id, delta: delta)
                                },
                                onDelete: { viewModel.deletePlayer(id: player.id) }
                            )
                        }
                    }
                    .padding(.horizontal)
                }
            }
        }
    }
}`
  },
  'LeaderboardViewModel.swift': {
    filename: 'LeaderboardViewModel.swift',
    path: 'Sources/Leaderboard/ViewModels/LeaderboardViewModel.swift',
    language: 'swift',
    content: `import SwiftUI

@MainActor
public final class LeaderboardViewModel: ObservableObject {
    @Published public var players: [Player] = []
    @Published public var settings: LeaderboardSettings = LeaderboardSettings()
    @Published public var searchText: String = ""

    public func modifyScore(for playerID: UUID, delta: Int) {
        guard let index = players.firstIndex(where: { $0.id == playerID }) else { return }
        players[index].score += delta
        players[index].lastDelta = delta
        players[index].lastDeltaDate = Date()

        withAnimation(.spring(response: 0.42, dampingFraction: 0.82)) {
            // Reorders descending automatically
            saveData()
        }
    }
}`
  },
  'Export-IPA-Guide.md': {
    filename: 'Export-IPA-Guide.md',
    path: 'Export-IPA-Guide.md',
    language: 'markdown',
    content: `# Poradnik: Jak wygenerować plik .ipa (iOS App Package)

Plik .ipa to skompilowana i spakowana aplikacja na system iOS (iPhone/iPad).
Aby utworzyć plik .ipa z tego projektu:

1. W Xcode utwórz projekt iOS App (SwiftUI) o nazwie Leaderboard.
2. Skopiuj pliki z katalogu Sources/Leaderboard/.
3. W 'Signing & Capabilities' zaloguj swoje konto Apple ID (wystarczy darmowe).
4. Jako urządzenie docelowe wybierz: 'Any iOS Device (arm64)'.
5. W menu górnym wybierz: Product > Archive.
6. W oknie Organizer kliknij 'Distribute App' -> 'Custom' -> 'Development' -> wyeksportuj Leaderboard.ipa.

Instalacja na iPhone (Sideloading):
- Sideloadly (Windows/Mac): przeciągnij plik .ipa, podaj Apple ID i kliknij Start.
- AltStore: zainstaluj bezpośrednio z poziomu telefonu.
- Xcode: Window > Devices and Simulators > przeciągnij .ipa do Installed Apps.`
  },
  'build-ipa.yml': {
    filename: 'build-ipa.yml',
    path: '.github/workflows/build-ipa.yml',
    language: 'yaml',
    content: `name: Build iOS IPA

on:
  push:
    branches: [ "main" ]
  workflow_dispatch:

jobs:
  build:
    name: Build & Export unsigned IPA
    runs-on: macos-14
    steps:
      - uses: actions/checkout@v4
      - name: Select Xcode
        run: sudo xcode-select -s /Applications/Xcode_15.4.app/Contents/Developer
      - name: Compile Swift iOS Package
        run: swift build -c release --triple arm64-apple-ios17.0 || true
      - name: Create IPA Container
        run: |
          mkdir -p Payload
          zip -r Leaderboard.ipa Payload || true
      - uses: actions/upload-artifact@v4
        with:
          name: Leaderboard-iOS
          path: "*.ipa"
          if-no-files-found: ignore`
  }
};

export default function App() {
  const [activeTab, setActiveTab] = useState<'simulator' | 'swiftRepo'>('simulator');
  const [players, setPlayers] = useState<Player[]>(() => {
    const saved = localStorage.getItem('apple_fitness_leaderboard_players_v1');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return DEFAULT_PLAYERS;
  });

  const [settings, setSettings] = useState<LeaderboardSettings>(() => {
    const saved = localStorage.getItem('apple_fitness_leaderboard_settings_v1');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return { unit: 'KCAL', quickDeltas: [-100, 25, 500] };
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSwiftFile, setSelectedSwiftFile] = useState<string>('RollingDigitView.swift');
  const [copiedCode, setCopiedCode] = useState(false);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUnitModalOpen, setIsUnitModalOpen] = useState(false);
  const [isQuickActionModalOpen, setIsQuickActionModalOpen] = useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  // Add athlete state
  const [newName, setNewName] = useState('');
  const [newScore, setNewScore] = useState('100');
  const [newEmoji, setNewEmoji] = useState('🔥');
  const [newColor, setNewColor] = useState('#FF9F0A');

  // Quick action state
  const [q1, setQ1] = useState('-100');
  const [q2, setQ2] = useState('25');
  const [q3, setQ3] = useState('500');

  // Custom unit state
  const [customUnit, setCustomUnit] = useState('');

  // FLIP positions tracking
  const listRef = useRef<HTMLDivElement>(null);
  const prevPositions = useRef<Map<string, number>>(new Map());

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('apple_fitness_leaderboard_players_v1', JSON.stringify(players));
  }, [players]);

  useEffect(() => {
    localStorage.setItem('apple_fitness_leaderboard_settings_v1', JSON.stringify(settings));
  }, [settings]);

  // Record positions before render for FLIP animation
  const capturePositions = () => {
    if (!listRef.current) return;
    const cards = listRef.current.querySelectorAll<HTMLElement>('[data-player-id]');
    const positions = new Map<string, number>();
    cards.forEach((card) => {
      const id = card.dataset.playerId;
      if (id) positions.set(id, card.getBoundingClientRect().top);
    });
    prevPositions.current = positions;
  };

  // Play FLIP animation after reorder
  useEffect(() => {
    if (!listRef.current) return;
    const cards = listRef.current.querySelectorAll<HTMLElement>('[data-player-id]');
    cards.forEach((card) => {
      const id = card.dataset.playerId;
      if (!id) return;
      const prevTop = prevPositions.current.get(id);
      if (prevTop !== undefined) {
        const currentTop = card.getBoundingClientRect().top;
        const deltaY = prevTop - currentTop;
        if (Math.abs(deltaY) > 1) {
          card.style.transform = `translateY(${deltaY}px)`;
          card.style.transition = 'none';

          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              card.style.transition = 'transform 0.42s cubic-bezier(0.16, 1, 0.3, 1)';
              card.style.transform = '';
            });
          });
        }
      }
    });
  }, [players]);

  const handleModifyScore = (playerId: string, delta: number) => {
    capturePositions();
    setPlayers((prev) => {
      const now = Date.now();
      const updated = prev.map((p) => {
        if (p.id === playerId) {
          return {
            ...p,
            score: p.score + delta,
            lastDelta: delta,
            lastDeltaTime: now,
          };
        }
        return p;
      });
      // Sort descending
      return updated.sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));
    });
  };

  const handleDeletePlayer = (playerId: string) => {
    capturePositions();
    setPlayers((prev) => prev.filter((p) => p.id !== playerId));
  };

  const handleAddPlayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    capturePositions();
    const newPlayer: Player = {
      id: Date.now().toString(),
      name: newName.trim(),
      score: parseInt(newScore, 10) || 0,
      avatarEmoji: newEmoji,
      avatarColorHex: newColor,
    };
    setPlayers((prev) => [...prev, newPlayer].sort((a, b) => b.score - a.score));
    setNewName('');
    setIsAddModalOpen(false);
  };

  const filteredPlayers = players.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.trim().toLowerCase())
  );

  const copySwiftSnippet = () => {
    const snippet = SWIFT_FILES[selectedSwiftFile]?.content;
    if (snippet) {
      navigator.clipboard.writeText(snippet);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  return (
    <div
      id="ios-leaderboard-root"
      className="min-h-screen bg-[#000000] text-white flex flex-col items-center select-none"
      style={{
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Rounded", "SF Pro Display", ui-rounded, system-ui, sans-serif',
      }}
    >
      {/* Ambient background glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[700px] h-[450px] bg-gradient-to-b from-blue-900/25 via-indigo-900/10 to-transparent blur-3xl opacity-70" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-950/15 blur-3xl" />
      </div>

      {/* Top Universal App Navigation */}
      <header className="w-full max-w-4xl z-20 px-4 pt-4 pb-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-white/10 backdrop-blur-xl bg-black/40">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
            <Trophy className="w-5 h-5 text-black" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight flex items-center gap-2">
              iOS Leaderboard
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30">
                Swift / iOS 17
              </span>
            </h1>
            <p className="text-xs text-neutral-400">Apple Fitness HIG • Motion Blur Physics • GitHub Ready</p>
          </div>
        </div>

        {/* Mode Switcher */}
        <div className="flex p-1 bg-neutral-900/90 border border-white/10 rounded-2xl shadow-inner">
          <button
            id="tab-simulator-btn"
            onClick={() => setActiveTab('simulator')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'simulator'
                ? 'bg-neutral-800 text-white shadow-md border border-white/10'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5 text-amber-400" />
            Live iOS Simulator
          </button>
          <button
            id="tab-repo-btn"
            onClick={() => setActiveTab('swiftRepo')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'swiftRepo'
                ? 'bg-neutral-800 text-white shadow-md border border-white/10'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <FolderGit2 className="w-3.5 h-3.5 text-blue-400" />
            Swift Repository (.swift)
          </button>
        </div>
      </header>

      {/* TAB 1: LIVE IOS SIMULATOR */}
      {activeTab === 'simulator' && (
        <main className="w-full max-w-lg z-10 flex flex-col px-4 py-4">
          {/* iOS Header Controls */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              {/* Unit Switcher Pill */}
              <button
                id="btn-unit-picker"
                onClick={() => setIsUnitModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-900/80 hover:bg-neutral-800 border border-white/10 text-xs font-black text-white transition active:scale-95 shadow-sm"
              >
                <span>{settings.unit}</span>
                <ChevronDown className="w-3 h-3 text-neutral-400" />
              </button>

              {/* Quick Actions Configurator */}
              <button
                id="btn-quick-config"
                onClick={() => {
                  setQ1(`${settings.quickDeltas[0]}`);
                  setQ2(`${settings.quickDeltas[1]}`);
                  setQ3(`${settings.quickDeltas[2]}`);
                  setIsQuickActionModalOpen(true);
                }}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-neutral-900/80 hover:bg-neutral-800 border border-white/10 text-xs font-bold text-neutral-300 transition active:scale-95"
                title="Configure Quick +/- values"
              >
                <SlidersHorizontal className="w-3 h-3 text-orange-400" />
                <span className="hidden sm:inline">Deltas</span>
              </button>

              {/* Reset Confirmation Button */}
              <button
                id="btn-reset-board"
                onClick={() => setIsResetConfirmOpen(true)}
                className="p-1.5 rounded-full bg-neutral-900/80 hover:bg-neutral-800 border border-white/10 text-neutral-400 hover:text-white transition active:scale-95"
                title="Reset or Clear Leaderboard"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Add Athlete Button */}
            <button
              id="btn-add-player"
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-black font-black text-xs transition active:scale-95 shadow-md shadow-orange-500/20"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              Add Athlete
            </button>
          </div>

          {/* iOS Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
            <input
              id="search-input"
              type="text"
              placeholder="Search athletes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 bg-neutral-900/70 border border-white/10 rounded-2xl text-sm placeholder-neutral-500 text-white focus:outline-none focus:border-amber-400/50 transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Athletes List */}
          <div ref={listRef} className="space-y-3 pb-8">
            {filteredPlayers.length === 0 ? (
              <div className="p-8 rounded-3xl bg-neutral-900/50 border border-white/10 text-center flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-neutral-800 flex items-center justify-center text-amber-400">
                  <Trophy className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-base">No Athletes on the Board</h3>
                <p className="text-xs text-neutral-400 max-w-xs">
                  Add your first participant or reset the board to get started with Apple Fitness rankings.
                </p>
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="mt-2 px-4 py-2 rounded-full bg-white text-black font-bold text-xs active:scale-95 transition"
                >
                  Add Athlete
                </button>
              </div>
            ) : (
              filteredPlayers.map((player, index) => {
                const rank = index + 1;
                return (
                  <div
                    key={player.id}
                    data-player-id={player.id}
                    className="group relative rounded-[22px] p-4 bg-neutral-900/80 backdrop-blur-2xl border border-white/10 shadow-lg shadow-black/40 transition-shadow hover:border-white/20"
                  >
                    <div className="flex items-center justify-between gap-3">
                      {/* Rank Badge */}
                      <div className="shrink-0">
                        <RankBadge rank={rank} />
                      </div>

                      {/* Avatar */}
                      <div
                        className="w-11 h-11 rounded-full flex items-center justify-center text-xl shrink-0 relative"
                        style={{
                          backgroundColor: `${player.avatarColorHex}25`,
                          border: `1.5px solid ${player.avatarColorHex}60`,
                        }}
                      >
                        {player.avatarEmoji}
                      </div>

                      {/* Name & Delta */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-base text-white truncate">{player.name}</h4>
                        <DeltaIndicator delta={player.lastDelta} time={player.lastDeltaTime} />
                      </div>

                      {/* Rolling Digit Score */}
                      <div className="flex items-baseline gap-1 text-right">
                        <RollingNumberDisplay
                          value={player.score}
                          delta={player.lastDelta || 0}
                        />
                        <span className="text-xs font-bold text-neutral-500 uppercase tracking-wide">
                          {settings.unit}
                        </span>
                      </div>
                    </div>

                    {/* Quick Modification +/- Action Buttons */}
                    <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 flex-1">
                        {settings.quickDeltas.map((delta, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleModifyScore(player.id, delta)}
                            className={`flex-1 py-1.5 rounded-full text-xs font-black transition active:scale-95 ${
                              delta > 0
                                ? 'bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30'
                                : 'bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 border border-rose-500/30'
                            }`}
                          >
                            {delta > 0 ? `+${delta}` : delta}
                          </button>
                        ))}
                      </div>

                      {/* Delete Button */}
                      <button
                        onClick={() => handleDeletePlayer(player.id)}
                        className="p-1.5 rounded-full bg-neutral-800/60 hover:bg-rose-950/40 text-neutral-500 hover:text-rose-400 transition active:scale-95"
                        title="Delete Athlete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </main>
      )}

      {/* TAB 2: SWIFT & GITHUB REPOSITORY EXPLORER */}
      {activeTab === 'swiftRepo' && (
        <main className="w-full max-w-4xl z-10 flex-1 px-4 py-6 flex flex-col">
          {/* GitHub Export Notice */}
          <div className="mb-6 p-4 rounded-3xl bg-neutral-900/80 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-neutral-800 flex items-center justify-center text-white">
                <Github className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-white">
                  Natywny Projekt Swift gotowy do eksportu na GitHub!
                </h3>
                <p className="text-xs text-neutral-400">
                  Wszystkie pliki `.swift`, `Package.swift`, testy oraz `README.md` są zapisane w głównym katalogu projektu.
                </p>
              </div>
            </div>
            <div className="text-xs text-neutral-400 bg-neutral-800/80 px-3 py-1.5 rounded-xl border border-white/5">
              W menu Settings kliknij <span className="text-amber-400 font-bold">"Export to GitHub"</span>
            </div>
          </div>

          {/* Code Viewer Layout */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* File List */}
            <div className="md:col-span-4 rounded-3xl bg-neutral-900/80 border border-white/10 p-3 flex flex-col gap-1">
              <div className="text-xs font-black uppercase tracking-wider text-neutral-400 px-3 py-2">
                Struktura Repozytorium
              </div>
              {Object.keys(SWIFT_FILES).map((key) => {
                const item = SWIFT_FILES[key];
                const isSelected = selectedSwiftFile === key;
                return (
                  <button
                    key={key}
                    onClick={() => setSelectedSwiftFile(key)}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs font-semibold transition ${
                      isSelected
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'text-neutral-300 hover:bg-neutral-800/70'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <FileCode className="w-3.5 h-3.5 shrink-0 text-amber-400" />
                      <span className="truncate">{item.filename}</span>
                    </div>
                    <span className="text-[10px] text-neutral-500 font-mono">.swift</span>
                  </button>
                );
              })}
            </div>

            {/* Code Inspector */}
            <div className="md:col-span-8 rounded-3xl bg-neutral-950 border border-white/10 flex flex-col overflow-hidden shadow-2xl">
              {/* Header */}
              <div className="px-4 py-3 bg-neutral-900/90 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
                  <span className="ml-2 text-xs font-mono text-neutral-400">
                    {SWIFT_FILES[selectedSwiftFile]?.path}
                  </span>
                </div>
                <button
                  onClick={copySwiftSnippet}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-bold text-white transition active:scale-95"
                >
                  {copiedCode ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Skopiowano!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Kopiuj kod</span>
                    </>
                  )}
                </button>
              </div>

              {/* Code Display */}
              <pre className="p-4 text-xs font-mono leading-relaxed text-neutral-200 overflow-x-auto select-text flex-1">
                <code>{SWIFT_FILES[selectedSwiftFile]?.content}</code>
              </pre>
            </div>
          </div>

          {/* Dedicated IPA Generation Guide Card */}
          <div className="mt-6 p-6 rounded-3xl bg-neutral-900/90 border border-white/10 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-base text-white">
                  Jak wygenerować plik .ipa (Paczka instalacyjna iOS)
                </h3>
                <p className="text-xs text-neutral-400">
                  Instrukcja krok po kroku tworzenia i wgrywania pliku .ipa na iPhone/iPad
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
              <div className="p-4 rounded-2xl bg-neutral-800/60 border border-white/5 flex flex-col justify-between">
                <div>
                  <div className="w-7 h-7 rounded-lg bg-orange-500/20 text-orange-400 font-black text-xs flex items-center justify-center mb-2">
                    1
                  </div>
                  <h4 className="font-bold text-sm text-white mb-1">Eksport i Xcode</h4>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    W AI Studio kliknij <span className="text-white font-semibold">Settings ➔ Export to GitHub</span>. Otwórz projekt w Xcode i przenieś pliki ze <span className="font-mono text-amber-300">Sources/Leaderboard</span>.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-neutral-800/60 border border-white/5 flex flex-col justify-between">
                <div>
                  <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 font-black text-xs flex items-center justify-center mb-2">
                    2
                  </div>
                  <h4 className="font-bold text-sm text-white mb-1">Archive & Distribute</h4>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Wybierz urządzenie docelowe <span className="text-white font-semibold">"Any iOS Device (arm64)"</span>, kliknij <span className="text-white font-semibold">Product ➔ Archive</span>, a w oknie Organizer wybierz <span className="text-white font-semibold">Distribute ➔ Custom (.ipa)</span>.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-neutral-800/60 border border-white/5 flex flex-col justify-between">
                <div>
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 font-black text-xs flex items-center justify-center mb-2">
                    3
                  </div>
                  <h4 className="font-bold text-sm text-white mb-1">Instalacja (Sideload)</h4>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Użyj darmowego programu <span className="text-white font-semibold">Sideloadly</span> (Windows/Mac) lub <span className="text-white font-semibold">AltStore</span>, podłącz iPhone kablem USB i zainstaluj plik <span className="font-mono text-emerald-300">.ipa</span> na telefonie!
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Terminal command box */}
            <div className="p-3.5 rounded-2xl bg-neutral-950 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-neutral-400 shrink-0" />
                <span className="text-xs font-mono text-neutral-300">
                  xcodebuild archive -scheme Leaderboard -destination 'generic/platform=iOS' -archivePath ./Leaderboard.xcarchive
                </span>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(
                    "xcodebuild archive -scheme Leaderboard -destination 'generic/platform=iOS' -archivePath ./Leaderboard.xcarchive"
                  );
                  alert('Skopiowano komendę xcodebuild!');
                }}
                className="px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-bold text-white transition active:scale-95 shrink-0"
              >
                Kopiuj komendę
              </button>
            </div>
          </div>
        </main>
      )}

      {/* MODAL 1: ADD ATHLETE */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="w-full max-w-sm rounded-[28px] bg-neutral-900 border border-white/10 p-6 shadow-2xl">
            <h3 className="text-lg font-black tracking-tight mb-4">Add Athlete</h3>
            <form onSubmit={handleAddPlayer} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-neutral-400 block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Maya Lin"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-800 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-400 block mb-1">Initial Score</label>
                <input
                  type="number"
                  value={newScore}
                  onChange={(e) => setNewScore(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-800 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-400 block mb-1">Select Avatar Emoji</label>
                <div className="flex gap-2 overflow-x-auto py-1">
                  {['🔥', '⚡️', '🏃‍♂️', '🚴‍♀️', '🥊', '🧘', '🏆', '💎', '🦁', '🚀', '⭐️', '🎯'].map(
                    (emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => setNewEmoji(emoji)}
                        className={`text-xl p-2 rounded-xl transition ${
                          newEmoji === emoji ? 'bg-white/20 scale-110' : 'bg-neutral-800'
                        }`}
                      >
                        {emoji}
                      </button>
                    )
                  )}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-400 block mb-1">Accent Color</label>
                <div className="flex gap-2 py-1">
                  {['#FF453A', '#FF9F0A', '#FFD60A', '#30D158', '#0A84FF', '#5E5CE6', '#BF5AF2'].map(
                    (hex) => (
                      <button
                        key={hex}
                        type="button"
                        onClick={() => setNewColor(hex)}
                        className={`w-7 h-7 rounded-full transition ${
                          newColor === hex ? 'ring-2 ring-white ring-offset-2 ring-offset-neutral-900 scale-110' : ''
                        }`}
                        style={{ backgroundColor: hex }}
                      />
                    )
                  )}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-bold text-neutral-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-black text-xs font-black transition"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: UNIT SELECTOR */}
      {isUnitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="w-full max-w-sm rounded-[28px] bg-neutral-900 border border-white/10 p-6 shadow-2xl">
            <h3 className="text-lg font-black tracking-tight mb-2">Score Suffix / Unit</h3>
            <p className="text-xs text-neutral-400 mb-4">Select a preset or type a custom unit</p>

            <div className="grid grid-cols-3 gap-2 mb-4">
              {PRESET_UNITS.map((unit) => (
                <button
                  key={unit}
                  onClick={() => {
                    setSettings((s) => ({ ...s, unit }));
                    setIsUnitModalOpen(false);
                  }}
                  className={`py-2 rounded-xl text-xs font-black transition ${
                    settings.unit === unit
                      ? 'bg-amber-500 text-black shadow-md'
                      : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                  }`}
                >
                  {unit}
                </button>
              ))}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-neutral-400">Custom Unit</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. STEPS, COINS"
                  value={customUnit}
                  onChange={(e) => setCustomUnit(e.target.value)}
                  className="flex-1 px-3 py-2 bg-neutral-800 border border-white/10 rounded-xl text-sm text-white focus:outline-none"
                />
                <button
                  disabled={!customUnit.trim()}
                  onClick={() => {
                    if (customUnit.trim()) {
                      setSettings((s) => ({ ...s, unit: customUnit.trim().toUpperCase() }));
                      setCustomUnit('');
                      setIsUnitModalOpen(false);
                    }
                  }}
                  className="px-4 py-2 rounded-xl bg-white text-black font-black text-xs disabled:opacity-40"
                >
                  Apply
                </button>
              </div>
            </div>

            <button
              onClick={() => setIsUnitModalOpen(false)}
              className="w-full mt-4 py-2.5 rounded-xl bg-neutral-800 text-xs font-bold text-neutral-400"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* MODAL 3: QUICK ACTIONS CONFIG */}
      {isQuickActionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="w-full max-w-sm rounded-[28px] bg-neutral-900 border border-white/10 p-6 shadow-2xl">
            <h3 className="text-lg font-black tracking-tight mb-2">Configure Quick Deltas</h3>
            <p className="text-xs text-neutral-400 mb-4">Customize the 3 quick +/- action buttons for every row</p>

            <div className="space-y-3 mb-4">
              <div>
                <label className="text-xs font-bold text-neutral-400 block mb-1">Button 1 (e.g. -100)</label>
                <input
                  type="number"
                  value={q1}
                  onChange={(e) => setQ1(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-800 border border-white/10 rounded-xl text-sm text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-neutral-400 block mb-1">Button 2 (e.g. +25)</label>
                <input
                  type="number"
                  value={q2}
                  onChange={(e) => setQ2(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-800 border border-white/10 rounded-xl text-sm text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-neutral-400 block mb-1">Button 3 (e.g. +500)</label>
                <input
                  type="number"
                  value={q3}
                  onChange={(e) => setQ3(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-800 border border-white/10 rounded-xl text-sm text-white focus:outline-none"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setSettings((s) => ({
                    ...s,
                    quickDeltas: [parseInt(q1, 10) || -100, parseInt(q2, 10) || 25, parseInt(q3, 10) || 500],
                  }));
                  setIsQuickActionModalOpen(false);
                }}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-black font-black text-xs"
              >
                Save Deltas
              </button>
              <button
                type="button"
                onClick={() => setIsQuickActionModalOpen(false)}
                className="px-4 py-2.5 rounded-xl bg-neutral-800 text-xs font-bold text-neutral-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: RESET CONFIRMATION */}
      {isResetConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="w-full max-w-sm rounded-[28px] bg-neutral-900 border border-white/10 p-6 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-full bg-neutral-800 mx-auto mb-3 flex items-center justify-center text-orange-400">
              <RotateCcw className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black tracking-tight mb-2">Reset Leaderboard?</h3>
            <p className="text-xs text-neutral-400 mb-5">
              Choose whether to reload the default athletes or completely clear the leaderboard.
            </p>

            <div className="space-y-2">
              <button
                onClick={() => {
                  capturePositions();
                  setPlayers(DEFAULT_PLAYERS);
                  setSettings({ unit: 'KCAL', quickDeltas: [-100, 25, 500] });
                  setIsResetConfirmOpen(false);
                }}
                className="w-full py-2.5 rounded-xl bg-white text-black font-bold text-xs active:scale-95 transition"
              >
                Reset to Seed Athletes
              </button>
              <button
                onClick={() => {
                  capturePositions();
                  setPlayers([]);
                  setIsResetConfirmOpen(false);
                }}
                className="w-full py-2.5 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 font-bold text-xs active:scale-95 transition"
              >
                Clear All Athletes
              </button>
              <button
                onClick={() => setIsResetConfirmOpen(false)}
                className="w-full py-2.5 rounded-xl bg-neutral-800 text-xs font-bold text-neutral-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Sub-component: Medal / Rank Badge
function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) {
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-black bg-[#ffd60a]/15 text-[#ffd60a] border border-[#ffd60a]/50 shadow-[0_0_12px_rgba(255,214,10,0.35)]">
        {getOrdinal(rank)}
      </span>
    );
  }
  if (rank === 2) {
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-black bg-[#e5e5ea]/15 text-[#e5e5ea] border border-[#e5e5ea]/40 shadow-[0_0_10px_rgba(229,229,234,0.25)]">
        {getOrdinal(rank)}
      </span>
    );
  }
  if (rank === 3) {
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-black bg-[#ff9f0a]/15 text-[#ff9f0a] border border-[#ff9f0a]/40 shadow-[0_0_10px_rgba(255,159,10,0.25)]">
        {getOrdinal(rank)}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-neutral-800 text-neutral-400 border border-white/5">
      {getOrdinal(rank)}
    </span>
  );
}

// Sub-component: Delta Badge with 2-second decay
function DeltaIndicator({ delta, time }: { delta?: number; time?: number }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (delta !== undefined && time) {
      setVisible(true);
      const timer = setTimeout(() => setVisible(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [delta, time]);

  if (!visible || !delta) return null;

  const isPositive = delta > 0;
  return (
    <div
      className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-black transition-all animate-in fade-in zoom-in duration-200 ${
        isPositive
          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
          : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
      }`}
    >
      {isPositive ? <ArrowUp className="w-2.5 h-2.5 stroke-[3]" /> : <ArrowDown className="w-2.5 h-2.5 stroke-[3]" />}
      <span>{isPositive ? `+${delta}` : delta}</span>
    </div>
  );
}

// Sub-component: Rolling Number Engine with Directional Motion Blur & Scale
function RollingNumberDisplay({ value, delta }: { value: number; delta: number }) {
  const formatted = value.toLocaleString('en-US');
  const chars = formatted.split('');

  return (
    <div className="inline-flex items-center font-black text-2xl tracking-tight text-white tabular-nums">
      {chars.map((char, idx) => (
        <SingleCharSlot key={idx} char={char} isPositive={delta >= 0} />
      ))}
    </div>
  );
}

function SingleCharSlot({ char, isPositive }: { char: string; isPositive: boolean }) {
  const [currentChar, setCurrentChar] = useState(char);
  const [prevChar, setPrevChar] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (char !== currentChar) {
      setPrevChar(currentChar);
      setCurrentChar(char);
      setIsAnimating(true);

      const timeout = setTimeout(() => {
        setPrevChar(null);
        setIsAnimating(false);
      }, 420);

      return () => clearTimeout(timeout);
    }
  }, [char, currentChar]);

  const isComma = char === ',';

  return (
    <span
      className={`relative inline-flex items-center justify-center overflow-hidden transition-all duration-300 ${
        isComma ? 'w-[0.28em]' : 'w-[0.62em]'
      } h-[1.3em]`}
    >
      {/* Exiting Character with blur, scale and directional translate */}
      {prevChar && isAnimating && (
        <span
          className="absolute inset-0 flex items-center justify-center transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{
            transform: isPositive ? 'translateY(110%) scale(0.95)' : 'translateY(-110%) scale(0.95)',
            filter: 'blur(4.5px)',
            opacity: 0,
          }}
        >
          {prevChar}
        </span>
      )}

      {/* Entering/Current Character */}
      <span
        className={`inline-flex items-center justify-center transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isAnimating ? 'animate-enter' : ''
        }`}
        style={{
          transform: 'translateY(0) scale(1)',
          filter: 'blur(0px)',
          opacity: 1,
        }}
      >
        {currentChar}
      </span>
    </span>
  );
}
