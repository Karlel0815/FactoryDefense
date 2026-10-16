# FactoryDefense – DEV2: Ressourcen & Produktion

Eigenständiges Fabrik-Verteidigungsspiel im **Entwicklungsbranch** `feat/dev2-economy`.
Dieses Repo wurde aus Moon Dome umbenannt; die historische Moon-Dome-Version bleibt im `main`-Branch erhalten. Forgefront ist ein getrenntes Projekt.

## Aktuell implementiert
- 20 × 12 Rasterkarte, Hauptfabrik, Erzfelder, Minen, selbst gezeichnete und zerstörbare Versorgungswege
- Verbindungsauswertung; abgeschnittene Minen fördern nicht, getrennte Zusatzfabriken produzieren nicht
- Zentrale Bestände und feste Kapazitäten für Erz, Munition, Baumaterial; keine Lagerhäuser
- Automatische 50:50-Produktion in verbundener HQ-Fabrik, zusätzliche Fabriken gegen Baumaterial
- Freiwerdende Kapazität bei vollem Produktlager wird auf anderes Produkt umgeleitet
- Kosten für Wege, Minen, Fabriken und Reparaturen; Testschaden, Abriss, Wiederaufbau, Rückgängig
- Schnellzugriff per Maus/Touch; portable Einzeldatei-Vorschau über Build-Skript erzeugbar

## Starten
```bash
python3 -m http.server 8000
# dann im Browser http://localhost:8000/
```
Für eine lokal ohne Webserver verwendbare Vorschau:
```bash
node tools/build-preview.mjs
# preview.html im Browser öffnen
```
Die reguläre Version verwendet ES-Module und sollte über einen Server gestartet werden.

## Tests
```bash
npm test
```
21 lokale Node-Tests (8 DEV1 + 13 DEV2) bestanden. Zusätzlich Desktop-/simulierter Touch-Interaktionstest mit portabler Vorschau bestanden. Direkter Testserver-Aufruf im automatisierten Browser wurde von der Laufzeitumgebung blockiert; **echter Smartphone-Test bleibt offen**.

## Projektgedächtnis
- [Spieldesign](docs/GAME_DESIGN.md)
- [Beschlüsse](docs/DECISIONS.md)
- [Implementierungsstand/QA](docs/DEVELOPMENT_STATUS.md)
- [Backlog](docs/TASKS.md)

**Nicht implementiert:** Echte Gegnerwellen, Geschützfeuer, Munitionsverbrauch durch Waffen, Kampfeinheiten, Missionen und Meta-Progression.
**Werte sind DEV2-Balancingannahmen**, nicht endgültige Regeln. **Noch keine Freigabe für `main`**.
