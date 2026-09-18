# 🏆 iOS Leaderboard (Swift / SwiftUI)

> **Zaawansowana, responsywna Tablica Wyników (Leaderboard) w natywnej estetyce Apple Dark Mode / Apple Fitness HIG dla iOS 17+, napisana w czystym Swift & SwiftUI, gotowa jako repozytorium GitHub.**

![Platform](https://img.shields.io/badge/Platform-iOS%2017%2B%20%7C%20macOS%2014%2B-black?style=for-the-badge&logo=apple)
![Swift](https://img.shields.io/badge/Swift-5.9%2B-F05138?style=for-the-badge&logo=swift)
![SwiftUI](https://img.shields.io/badge/UI-SwiftUI%20%2B%20Glassmorphism-007AFF?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

---

## 📱 Cechy i Estetyka (Apple HIG)

1. **Typografia Apple**:
   - Krój **SF Pro Rounded** (`.font(.system(.body, design: .rounded))`).
   - Pogrubienia glifów: **Heavy (800)** i **Black (900)**.
   - Wyrównanie cyfr: `.monospacedDigit()` (tabular-nums), eliminujące drganie cyfr przy modyfikacji wyników.
2. **Apple Dark Mode & Glassmorphism**:
   - Prawdziwa głęboka czerń `#000000` z subtelnym gradientem radialnym w tle.
   - Półprzezroczyste panele z rozmyciem tła (`.ultraThinMaterial`), delikatnym obramowaniem `rgba(255, 255, 255, 0.08)`.
   - Zaokrąglenia rogów typu iOS **squircle / continuous** (`RoundedRectangle(cornerRadius: 24, style: .continuous)`).
3. **Odznaki Pozycji (Rangi / Medale)**:
   - Dynamiczne formatowanie ordynalne: `1st`, `2nd`, `3rd`, `4th`, `11th`, `21st` z poprawną angielską gramatyką sufiksów.
   - Styl podium:
     - 🥇 **1st**: Złoto (`#FFD60A`) z poświatą (ambient glow),
     - 🥈 **2nd**: Srebro (`#E5E5EA`),
     - 🥉 **3rd**: Brąz (`#FF9F0A`),
     - 🏅 **4th+**: Minimalistyczny, neutralny szary.
4. **Fizyka Cyfr Apple Fitness (Rolling Numbers & Motion Blur)**:
   - **Kierunkowość**: Przy dodawaniu punktów cyfra przesuwa się w dół, nowa wchodzi z góry. Przy odejmowaniu odwrotnie.
   - **Scale & Blur**: Schodząca cyfra zmniejsza się (`scale: 0.95`), rozmywa (`blur: 4.5px`) i zanika. Wchodząca startuje z rozmyciem (`blur: 5px`) i wyostrza się na krzywej Apple `timingCurve(0.16, 1.0, 0.3, 1.0)`.
   - **Zero Ghostingu**: Każdy slot znaku jest odizolowany i przycięty (`.clipped()`).
   - **Odporność na spam klikaniem**: Mechanizm `Task` z anulowaniem poprzedniej klatki animacji.
5. **Płynna Zamiana Miejsc (Spring Reorder)**:
   - Zmiana punktów automatycznie sortuje graczy malejąco.
   - Płynne, sprężyste mijanie się wierszy w czasie rzeczywistym (`.spring(response: 0.42, dampingFraction: 0.82)`).
6. **Zarządzanie i Persistence**:
   - Dodawanie nieograniczonej liczby uczestników z wyborem Memoji/Emoji i koloru akcentu.
   - Konfigurator jednostki punktacji (np. `KCAL`, `PTS`, `KM`, `$`, `XP`).
   - Konfigurator 3 przycisków szybkiej modyfikacji punktów (+/-) (np. `-100`, `+25`, `+500`).
   - Wyszukiwarka zawodników na żywo.
   - Automatyczny zapis w `UserDefaults` (JSON Codable).
   - Wskaźnik Delty (`↑ +50` / `↓ -20`) z 2-sekundowym czasem wygaszania.

---

## 📂 Struktura Repozytorium (SPM / Xcode Ready)

```
├── Package.swift                                # Manifest Swift Package Managera
├── README.md                                    # Dokumentacja projektu
├── Sources/
│   └── Leaderboard/
│       ├── App/
│       │   └── LeaderboardApp.swift             # @main punkt wejściowy aplikacji iOS
│       ├── Models/
│       │   ├── Player.swift                     # Model gracza, formatowanie ordynalne (1st, 2nd...)
│       │   └── LeaderboardSettings.swift        # Ustawienia jednostki i przycisków szybkiej akcji
│       ├── ViewModels/
│       │   └── LeaderboardViewModel.swift       # Zarządzanie stanem, sortowanie, filtracja i UserDefaults
│       └── Views/
│           ├── LeaderboardView.swift            # Główny ekran tablicy wyników
│           ├── Components/
│           │   ├── RollingDigitView.swift       # Silnik animacji cyfr (Motion Blur + Scale)
│           │   ├── PlayerRowView.swift          # Wiersz gracza w stylu Squircle Glassmorphism
│           │   ├── RankBadgeView.swift          # Odznaka pozycji (1st, 2nd, 3rd) z poświatą
│           │   └── DeltaBadgeView.swift         # Wskaźnik ostatniej zmiany punktów
│           └── Modals/
│               ├── AddPlayerSheet.swift         # Modal dodawania zawodnika
│               ├── QuickActionSettingsSheet.swift # Konfigurator przycisków +/-
│               └── UnitSelectorSheet.swift      # Wybór jednostki (KCAL, PTS, etc.)
```

---

## 🚀 Jak uruchomić w Xcode?

### Opcja 1: Jako Swift Package (SPM)
1. Otwórz **Xcode** ➔ **File** ➔ **Open...**
2. Wskaż katalog z plikiem `Package.swift`.
3. Wybierz schemat `Leaderboard` i uruchom na symulatorze iOS 17+.

### Opcja 2: Utworzenie nowego projektu iOS w Xcode
1. W Xcode wybierz **File** ➔ **New** ➔ **Project...** ➔ **App** (iOS).
2. Wybierz interfejs **SwiftUI** i język **Swift**.
3. Skopiuj zawartość katalogu `Sources/Leaderboard/` do swojego projektu.
4. Zbuduj i uruchom (`Cmd + R`)!

---

## 🛠 Wymagania systemowe
- **Xcode 15.0+**
- **iOS 17.0+** / **macOS 14.0+**
- **Swift 5.9+**

---

## 📄 Licencja
Projekt udostępniony na licencji MIT.
