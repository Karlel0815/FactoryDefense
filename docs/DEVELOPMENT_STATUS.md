# FactoryDefense – Entwicklungsstand

**Datum:** 2026-10-16

| Punkt | Tatsächlicher Stand |
|---|---|
| Repository | `Karlel0815/FactoryDefense` (früher Moon Dome) |
| Arbeitsbranch | `feat/factory-defense-bootstrap` |
| Ursprungs-Commit | `a6649de5b3d7d7503ce4baf11a543218d39cf786` |
| Aktueller Commit | Siehe GitHub-Branch-HEAD; nach Erstellung in Projektstatus aktualisieren |
| Code des neuen Spiels | NICHT IMPLEMENTIERT |
| Dokumentationsbasis | In Vorbereitung / nach Commit implementiert |
| Prüfungen | Keine Code-, Browser- oder Smartphone-Tests für das neue Spiel durchgeführt |
| Releases | Keiner |
| `main` | Bleibt bis Freigabe auf altem Moon-Dome-Stand |

## Besonderheit der Wiederverwendung
Forgefront basiert auf JavaScript/HTML/CSS; im dortigen `src/game.js` existieren Raster-, Karten-, Geschütz-, Gegner-, Wellen- und Kampagnenkonzepte. Eine produktive direkte Übernahme ist nicht geprüft. Der Vorgänger im umbenannten Repository war ebenfalls ein Browser-Prototyp; **nicht** als fertige Grundlage für das neue Design behandeln.

## Arbeitsregeln
- Vor Arbeit den aktuellen Branch/Commit prüfen.
- Zustände kennzeichnen: IMPLEMENTIERT / BESCHLOSSEN / OFFEN / VERWORFEN.
- Für Codeänderungen ausdrückliche Umsetzungsfreigabe, danach isolierter Entwicklungsbranch.
- Nach jeder Entwicklungsstufe Tests und Critic-Prüfung; Smartphone-Test offen, bis real erfolgt.
- Keine Freigabe auf `main` ohne Tests und Zustimmung.
