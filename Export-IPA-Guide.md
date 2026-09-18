# 📦 Poradnik: Jak wygenerować plik .ipa (iOS App Package)

Plik `.ipa` to skompilowana i spakowana aplikacja na system iOS (iPhone/iPad). Ponieważ Apple wymaga cyfrowego podpisywania aplikacji, proces tworzenia `.ipa` odbywa się za pośrednictwem narzędzia **Xcode** na komputerze Mac (lub w chmurze CI/CD np. GitHub Actions / Codemagic).

---

## Metoda 1: Xcode (Najprostsza i oficjalna droga)

### Krok 1: Eksport z AI Studio
1. W prawym górnym rogu platformy kliknij menu **Settings** (ikona koła zębatego).
2. Wybierz **Export to GitHub** (lub pobierz jako ZIP).

### Krok 2: Otwórz projekt w Xcode
1. Na komputerze Mac uruchom **Xcode** (darmowy w Mac App Store).
2. Wybierz **File > New > Project...** -> wybierz szablon **iOS > App** (język: **Swift**, interfejs: **SwiftUI**).
3. Nazwij projekt `Leaderboard`.
4. Przeciągnij zawartość katalogu `Sources/Leaderboard/` z pobranego repozytorium do okna projektu w Xcode.

### Krok 3: Podpisanie aplikacji (Signing & Capabilities)
1. Kliknij główny węzeł projektu po lewej stronie (niebieska ikona).
2. Przejdź do zakładki **Signing & Capabilities**.
3. Zaznacz **Automatically manage signing**.
4. W polu **Team** zaloguj się swoim Apple ID (wystarczy darmowe konto osobiste, nie musisz płacić $99 za konto deweloperskie do testów na własnym telefonie!).
5. W polu **Bundle Identifier** wpisz unikalną nazwę, np. `com.twojenazwisko.leaderboard`.

### Krok 4: Zbudowanie archiwum (Archive)
1. W górnym pasku Xcode, obok nazwy projektu, zmień urządzenie docelowe z symulatora na:
   **Any iOS Device (arm64)** (lub podłącz swój fizyczny iPhone kablem).
2. Z górnego paska menu wybierz: **Product > Archive**.
3. Xcode skompiluje aplikację do postaci binarnej.

### Krok 5: Eksport do pliku `.ipa`
1. Po zakończeniu kompilacji automatycznie otworzy się okno **Organizer** (możesz je też otworzyć przez `Window > Organizer`).
2. Kliknij niebieski przycisk **Distribute App**.
3. Wybierz metodę dystrybucji:
   - **Development** / **Ad Hoc** / **Custom** – do instalacji bezpośredniej (.ipa).
   - lub **App Store Connect** – jeśli chcesz wysłać aplikację do **TestFlight**.
4. Kliknij *Next*, pozostaw domyślne opcje podpisywania i wybierz folder docelowy.
5. Xcode wygeneruje folder, w którym znajdziesz plik **`Leaderboard.ipa`**!

---

## Metoda 2: Wiersz poleceń (Terminal na Macu)

Jeśli posiadasz Xcode Command Line Tools, możesz to zrobić komendą:

```bash
# 1. Kompilacja i archiwizacja
xcodebuild archive \
  -scheme Leaderboard \
  -destination 'generic/platform=iOS' \
  -archivePath ./build/Leaderboard.xcarchive \
  -allowProvisioningUpdates

# 2. Wygenerowanie pliku .ipa
xcodebuild -exportArchive \
  -archivePath ./build/Leaderboard.xcarchive \
  -exportOptionsPlist exportOptions.plist \
  -exportPath ./build/IPA
```

---

## Metoda 3: Jak zainstalować plik `.ipa` na iPhonie (Sideloading)?

Mając gotowy plik `Leaderboard.ipa`, możesz go wgrać na telefon na kilka sposobów:

1. **Sideloadly** (Działa na Windows i Mac):
   - Pobierz Sideloadly (darmowe).
   - Podłącz iPhone kablem USB do komputera.
   - Przeciągnij plik `.ipa` do okna programu.
   - Podaj swoje Apple ID i kliknij **Start**. Aplikacja pojawi się na pulpicie telefonu.
2. **AltStore**:
   - Zainstaluj AltServer na komputerze i zainstaluj AltStore na telefonie.
   - W aplikacji AltStore kliknij `+` i wskaż plik `.ipa`.
3. **Xcode (Direct Install)**:
   - W Xcode otwórz: **Window > Devices and Simulators**.
   - Podłącz telefon kablem, zaznacz go i przeciągnij plik `.ipa` do sekcji **Installed Apps**.
4. **TrollStore** (dla urządzeń z kompatybilną wersją iOS / jailbreak):
   - Otwórz plik `.ipa` bezpośrednio na telefonie i kliknij *Install*.

---

*Uwaga:* Przy instalacji z darmowym Apple ID (Sideloading), po pierwszym uruchomieniu na iPhonie wejdź w:
**Ustawienia > Ogólne > Zarządzanie urządzeniami i siecią VPN** i kliknij **Zaufaj [Twoje Apple ID]**.
