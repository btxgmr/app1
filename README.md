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

## 📦 Jak wygenerować plik `.ipa` (iOS App Package)?

Plik `.ipa` to skompilowana i spakowana paczka instalacyjna na iPhone / iPad. Apple wymaga podpisania kodu certyfikatem (nawet darmowym kontem Apple ID).

### Metoda 1: Przez Xcode (na macOS – zalecana i najprostsza)

1. **Eksportuj repozytorium**:
   - W Google AI Studio kliknij **Settings ➔ Export to GitHub** (lub pobierz ZIP).
2. **Otwórz w Xcode**:
   - Utwórz nowy projekt **iOS App (SwiftUI)** w Xcode, np. o nazwie `Leaderboard`.
   - Skopiuj pliki z folderu `Sources/Leaderboard/` do projektu.
3. **Podpisz aplikację (Signing)**:
   - W zakładce projektu: **Signing & Capabilities** ➔ zaznacz *Automatically manage signing*.
   - W polu **Team** wybierz swoje konto Apple ID (wystarczy darmowe konto osobiste).
4. **Zbuduj Archiwum**:
   - Jako urządzenie docelowe wybierz: **Any iOS Device (arm64)**.
   - W menu górnym wybierz: **Product ➔ Archive**.
5. **Wyeksportuj `.ipa`**:
   - Po zakończeniu archiwizacji otworzy się okno **Organizer**.
   - Kliknij **Distribute App** ➔ wybierz **Custom** ➔ **Development** lub **Ad Hoc** (albo App Store Connect dla TestFlight).
   - Klikaj *Next* i wybierz folder docelowy — Xcode wygeneruje gotowy plik `Leaderboard.ipa`!

---

### Metoda 2: Z wiersza poleceń (Terminal na Macu)

Jeśli wolisz terminal, możesz wygenerować `.ipa` jednym ciągiem poleceń `xcodebuild`:

```bash
# 1. Zbuduj archiwum xcarchive
xcodebuild archive \
  -scheme Leaderboard \
  -destination 'generic/platform=iOS' \
  -archivePath ./build/Leaderboard.xcarchive \
  -allowProvisioningUpdates

# 2. Wyeksportuj IPA
xcodebuild -exportArchive \
  -archivePath ./build/Leaderboard.xcarchive \
  -exportOptionsPlist exportOptions.plist \
  -exportPath ./build/IPA
```

Plik `.ipa` znajdzie się w katalogu `./build/IPA/Leaderboard.ipa`.

---

### Metoda 3: Jak zainstalować plik `.ipa` na swoim iPhonie?

Gdy masz już plik `.ipa`:
- **Sideloadly (PC Windows / Mac)**: Podłącz iPhone kablem USB, przeciągnij plik `.ipa`, wpisz Apple ID i kliknij *Start* — aplikacja pojawi się bezpośrednio na ekranie iPhone'a.
- **AltStore (Mac / Windows)**: Oficjalny sklep sideloadingu dla iOS.
- **Xcode Devices**: W Xcode wejdź w **Window ➔ Devices and Simulators** ➔ przeciągnij plik `.ipa` pod sekcję *Installed Apps*.
- **TestFlight**: Jeśli masz płatne konto Apple Developer ($99/rok), wyślij archiwum bezpośrednio do App Store Connect i zainstaluj przez aplikację TestFlight.

---

## 🛠 Wymagania systemowe
- **Xcode 15.0+**
- **iOS 17.0+** / **macOS 14.0+**
- **Swift 5.9+**

---

## 📄 Licencja
Projekt udostępniony na licencji MIT.
