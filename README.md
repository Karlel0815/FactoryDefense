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
npm test                 # 53 DEV4.2-Logik- und Regressionstests
npm run preview          # portable preview.html erzeugen
python3 tests/browser_dev4.py   # Chromium/Playwright erforderlich
```

Die früheren DEV1-3-Testdateien bleiben als **historische Prüfszenarien** erhalten; wegen der bewusst aufgegebenen HQ-Architektur sind ihre alten Erwartungen nicht mehr gültig. Die aktuelle Testsuite deckt die weiter gültigen Funktionen erneut ab.

## Grenzen

Zahlenwerte, Wellen, Baukosten, Bewegung und Kampf sind **Testannahmen**. Kampfeinheiten steuern in DEV4 ausschließlich den einzigen Bunker als automatisch vorgegebenes Ziel an. Mehrere Missionen, freie Angriffszielwahl, Forschung und echte Kampagnenprogression sind noch **nicht implementiert**. Keine echte Smartphone-Hardwareprüfung. Keine Merge-/Release-Freigabe auf `main`.

Dokumentation: [`docs/GAME_DESIGN.md`](docs/GAME_DESIGN.md), [`docs/DECISIONS.md`](docs/DECISIONS.md), [`docs/DEVELOPMENT_STATUS.md`](docs/DEVELOPMENT_STATUS.md), [`docs/TASKS.md`](docs/TASKS.md).

## DEV4.1 – manuelle erste Welle
Vor dem Start bleibt die Produktion aus; baue mit Startmaterial. Erst der Startknopf schaltet Förderung, Produktion und erste Angriffswelle gleichzeitig frei. Folgewellen behalten ihren Countdown.


## DEV4.2 – Förderbandbrücken und Auslastung (2026-10-16)
- Gelbes Erzband und blaues Munitionsband können eine **automatische orthogonale Brücke** bilden: Im Kreuzungsfeld verlaufen beide Medien auf getrennten Ebenen, niemals gemischt. Die untere Strecke muss gerade durchgehen; das darüberliegende Band verläuft rechtwinklig dazu. Beide Baurichtungen sind erlaubt.
- Eine Brücke kostet aktuell denselben Baumaterialbetrag wie ein normales Bandsegment (vorläufige Balancingannahme). Schaden, Wiederaufbau, Abriss und Undo bewahren das jeweils andere Band.
- Direkt auf Minen und Fabriken zeigt der Canvas einen echten Nutzungswert in Prozent der maximalen Rate. **Vor Welle 1 steht PAUSE**, kein irreführender Wert. Für Details kann das Werkzeug **🔍 Info** oder direkt ein bestehendes Gebäude angetippt werden.
- Die Förderquote wird im Produktionsschritt gemessen; es wird keine komplexe Forgefront-Transport-Allokation übernommen. Vollständige End-to-End-Netztrennung und Ressourceninseln bleiben erhalten.
- QA: `npm test` **53/53**, Desktop- und simulierte Touch-Browserprüfungen erfolgreich. Smartphone-Hardware und GitHub Actions CI noch offen.
