# FactoryDefense – DEV1 Raster & Versorgungsnetz

**Eigenständiges Fabrik-Verteidigungsspiel.** Nicht Forgefront und nicht Moon Dome.

## Aktueller Stand
DEV1-Prototyp: Rasterkarte, sichtbare Erzfelder, Hauptfabrik und Startmine, Minen bauen, Versorgungswege mit Maus/Finger zeichnen, Verbundenheit anzeigen, Wege/Minen entfernen, simulierten Schaden setzen, beschädigte Anlagen reparieren, zerstörte Wege neu bauen, Rückgängig und Neustart. **Noch keine Produktion, Wellen oder Kampfeinheiten.** Bauen kostet in DEV1 keine Ressourcen.

## Starten
Ein statischer Webserver ist für ES-Module nötig (einfaches Öffnen über file:// kann Browser-CORS auslösen):

```bash
python3 -m http.server 8000
# Dann http://localhost:8000/
```

## Testen
```bash
npm test
```
Ohne externe Node-Pakete. Chromium-Browsertest konnte im Entwicklungscontainer wegen Administrator-Navigationssperre nicht abgeschlossen werden. Reale Touch-/Smartphone-Tests sind **offen**.

## Wichtige Dateien
- `index.html` – Start
- `src/game.js` – Canvas-Bedienung und Anzeige
- `src/grid.js` – Raster / Streichlinien
- `src/model.js` – Bauen, Entfernen, Schaden, Reparatur
- `src/network.js` – Versorgung über verbundene Straßen
- `tests/dev1.test.mjs` – automatisierte Logiktests
- `docs/GAME_DESIGN.md`, `docs/DECISIONS.md` – Spielregeln
- `docs/DEVELOPMENT_STATUS.md` – tatsächlicher Entwicklungsstand
- `docs/TASKS.md` – nächste Schritte

## Sicherheit
Das Repository wurde aus dem früheren Moon Dome umbenannt. **Die Vorgängerhistorie bleibt erhalten.** Ein neuer Entwicklungsbranch `feat/dev1-grid-network` enthält FactoryDefense. `main` bleibt bis expliziter Freigabe auf dem ehemaligen Moon-Dome-Stand.
