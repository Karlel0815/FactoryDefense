# FactoryDefense – DEV4 Fabriknetze & Angriffseinheiten

Eigenständiges Browser-Spiel. **Entwicklungsversion**, kein Release. **Branch:** `feat/dev4-factory-conveyors-offense`. Nicht mit Forgefront oder dem früheren Moon Dome verwechseln.

## So funktioniert der neue Prototyp

1. **Gelbe Erzbänder** verbinden Erzminen mit Fabriken. Eine erste Fabrik und Mine plus zwei gelbe Bandfelder sind auf der Karte vorhanden.
2. Fabriken verwandeln Erz automatisch 50:50 in **Munition und Baumaterial**. Beide Bestände haben Grenzen; volle Bestände lenken den Output auf das andere Produkt um.
3. **Blaue Munitionsbänder** verbinden Fabriken mit MGs. Ein blaues Startfeld liegt an der ersten Fabrik. Setze z. B. ein MG bei `(3,5)`, direkt neben diesem blauen Feld. Gelbe und blaue Bänder verbinden sich nie und können nicht dieselbe Rasterzelle belegen.
4. Gegner greifen die Infrastruktur in drei zunehmend starken Wellen an. Reparieren ist auch während der Angriffe möglich.
5. Bestelle über **„Angriffseinheit“** neue Einheiten. Sie werden vier Sekunden lang in einer lebenden Fabrik produziert und steuern automatisch den rechts liegenden **Gegnerbunker** an. Sieg durch Zerstörung des Bunkers, Niederlage sobald keine Fabrik mehr intakt ist.

Das **HQ ist vollständig entfernt**. Mehrere Fabriken können erhalten bleiben; der Verlust einer einzelnen Fabrik beendet das Spiel nicht. Erz/Munition werden je Fabrik getrennt bevorratet, und ein MG darf nur aus einer über blaue Bänder angeschlossenen Fabrik schießen. Baumaterial ist für den DEV4-Prototyp weiterhin ein **globaler abstrakter Bauvorrat**, nicht als Förderband umgesetzt.

### Start

Am einfachsten `preview.html` im Browser öffnen. Alternativ auf einem statischen Webserver die normale ES-Modul-Version starten:

```bash
python3 -m http.server 8000
# http://localhost:8000
```

### Tests und Vorschau erstellen

```bash
npm test                 # 41 DEV4-Logik- und Regressionstests
npm run preview          # portable preview.html erzeugen
python3 tests/browser_dev4.py   # Chromium/Playwright erforderlich
```

Die früheren DEV1-3-Testdateien bleiben als **historische Prüfszenarien** erhalten; wegen der bewusst aufgegebenen HQ-Architektur sind ihre alten Erwartungen nicht mehr gültig. Die aktuelle Testsuite deckt die weiter gültigen Funktionen erneut ab.

## Grenzen

Zahlenwerte, Wellen, Baukosten, Bewegung und Kampf sind **Testannahmen**. Kampfeinheiten steuern in DEV4 ausschließlich den einzigen Bunker als automatisch vorgegebenes Ziel an. Mehrere Missionen, freie Angriffszielwahl, Forschung und echte Kampagnenprogression sind noch **nicht implementiert**. Keine echte Smartphone-Hardwareprüfung. Keine Merge-/Release-Freigabe auf `main`.

Dokumentation: [`docs/GAME_DESIGN.md`](docs/GAME_DESIGN.md), [`docs/DECISIONS.md`](docs/DECISIONS.md), [`docs/DEVELOPMENT_STATUS.md`](docs/DEVELOPMENT_STATUS.md), [`docs/TASKS.md`](docs/TASKS.md).

## DEV4.1 – manuelle erste Welle
Die Startphase ist unbegrenzt: Baue zunächst mit dem verfügbaren Startbaumaterial. **Erst der Button „Welle 1 starten“ startet Förderung, Munition-/Baumaterialproduktion, Einheitenfertigung und den ersten Angriff.** Vorher läuft kein Countdown und es werden keine Ressourcen erzeugt. Welle 2 und 3 starten nach ihren Vorbereitungs-Countdowns automatisch, können aber früher gestartet werden.

Stand: `feat/dev4-1-manual-wave-start`, lokale Regression **44/44** und simulierte Desktop-/Touch-Interaktion erfolgreich. Echter Smartphone-Test und Merge nach `main` offen.
