# FactoryDefense – DEV3: Verteidigung und Wellen

**Eigenständiges Fabrik-Verteidigungsspiel (Browser), Entwicklungsbranch `feat/dev3-defense-waves`.** Nicht Forgefront und nicht Moon Dome.

## Funktionen
- DEV1: Karte, Erzvorkommen, Minen, Hauptfabrik, selbst gezeichnete und zerstörbare Versorgungswege, Baumenü, Schaden, Reparatur, Rückgängig.
- DEV2: Automatische Erzförderung, gemeinsame Ressourcenbestände, automatische 50:50-Produktion von Munition und Baumaterial, Lagergrenzen, zusätzliche Fabriken und Baukosten.
- DEV3: MG-Geschütze mit Netzanschluss und tatsächlichem Munitionsverbrauch, gezielte feindliche Infrastrukturangriffe, drei stärker werdende Wellen, zeitgesteuerter oder vorzeitiger Wellenstart, Reparaturen während des Angriffs, Sieg oder Niederlage.

## Spielen

**Wichtig:** Alle Werte sind Testannahmen. Verteidige HQ, Mine und Versorgungswege; ein einzelnes MG reicht in der Referenzsimulation auf Dauer nicht aus. Mehrere MGs müssen sinnvoll an das Netz angebunden sein.

Webserver starten:

```bash
python3 -m http.server 8000
# http://localhost:8000/
```

Für lokale Vorschau ohne Webserver:

```bash
node tools/build-preview.mjs
# preview.html direkt öffnen
```

## Testen

```bash
npm test
```

Zusätzlich kann der rein lokale Browser-Test `python3 tests/browser_dev3.py` ausgeführt werden (Playwright mit installiertem Chromium erforderlich). Er lädt die gebaute Einzeldatei ohne Webserver in den Testbrowser. Ein echter Smartphone-Gerätetest ist weiterhin offen.

## Projektgedächtnis
- `docs/GAME_DESIGN.md` – Spielkonzept
- `docs/DECISIONS.md` – verbindliche Entscheidungen
- `docs/DEVELOPMENT_STATUS.md` – reale Implementierung und Tests
- `docs/TASKS.md` – offene Arbeit

**Nicht implementiert:** Produzierbare Angriffseinheiten, feindlicher Bunker und aktive Missionsziele (DEV4), übergreifende Kampagne und echte Meta-Progression. Kein Merge nach `main` ohne Freigabe.
