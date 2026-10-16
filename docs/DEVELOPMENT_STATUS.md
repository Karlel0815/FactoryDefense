# FactoryDefense – Entwicklungsstand

**Datum:** 16.10.2026 · **Projekt:** FactoryDefense (Arbeitstitel)  
**Repository:** `Karlel0815/FactoryDefense` (aus Moon Dome umbenannt)  
**Entwicklungsbranch:** `feat/dev2-economy`  
**DEV1-Referenz:** `cd67d3169a5ff3d0fa1631ce61fbedf0da944ec9`  
**DEV1-Playtest:** Nutzer bestätigte „Jop geht“, dokumentiert im Folgecommit `6e88cf61f79a12da91b7863f2827293b6ca3bf73`.  
**DEV2:** Aktueller Commit siehe Branch-HEAD; nicht auf `main` freigegeben.  
**Main:** Enthält weiterhin den alten Moon-Dome-Prototyp, zuletzt `a6649de5b3d7d7503ce4baf11a543218d39cf786`. Kein Merge.

## IMPLEMENTIERT
DEV1 unverändert weiter nutzbar: Raster, HQ, Erzfelder, Minen, Transportnetz, Wegzeichnen, Schaden/Reparatur (Test), Rückgängig und Neubau.
DEV2 ergänzt: `src/economy.js` mit dynamischen Ressourcenbeständen und Limits; verbundene Minen erzeugen Erz, HQ verarbeitet Erz als Anfangsfabrik; weitere Fabriken platzierbar; Output 50:50 Munition/Baumaterial, Übertrag bei vollem Bestand. Verbundene Förder- und Fabrikgebäude sind wirtschaftlich aktiv, getrennte nicht. Bauen/Reparieren kostet Baumaterial; intakte Bauten lassen sich gegen Teilrückerstattung abreißen. Undo nimmt nur strukturelle Eingriffe und deren Materialdifferenz zurück, nicht die zwischenzeitlich erzeugte Produktion. Offline-Fortschritt wird nicht aufsummiert.

## VERIFIZIERTE TESTS
- 21 lokale `npm test` Node-Tests **21/21 bestanden** (8 DEV1 Regression + 13 DEV2).
- Desktop- und simulierte Touch-Interaktion der portablen HTML-Vorschau via Playwright/Chromium **jeweils bestanden**: Munitions-/Erzproduktion, dreifacher Wegschaden und Netztrennung, Weg-Neubau, Undo, zusätzliche Fabrik. Keine Script-Ausnahmen.
- Chromium-Navigation auf `localhost` von Testumgebung mit `ERR_BLOCKED_BY_ADMINISTRATOR` unterbunden; deshalb regulärer Server-Aufruf im echten Browser hier **nicht bestätigt**.
- GitHub Actions nach Push: **Status noch prüfen**, nicht automatisch grün behaupten.
- Reale Smartphone-Hardware: **OFFEN**.

## OFFEN / TECHNISCHE RISIKEN
- 20-Spalten-Raster auf kleinen Smartphones teilweise winzige Tap-Ziele; realer Gerätetest erforderlich.
- Reale Versorgung durch Geschütze und Munitionsverbrauch fehlen (DEV3).
- Bei vollständigem Materialmangel und zerstörtem Versorgungsnetz kann ein Softlock auftreten; DEV2 bietet Neustart und Teilrückgewinnung durch Abriss, aber noch keine vollständige Schutzregel.
- Die wirtschaftlichen Werte (Förderung, Umwandlung, Baukosten, Limits, Abriss-Rückgewinnung) sind **Testannahmen**.
- Keine Wellen, Angriffe, Verluste, Kampfeinheiten oder Kampagne.

## NÄCHSTER SCHRITT
Nutzer prüft DEV2-Vorschau. Erst danach DEV3 (Verteidigung) spezifizieren/freigeben. Änderungen weiterhin nur über Entwicklungsbranch und geprüfte Commits. Forgefront unverändert.
