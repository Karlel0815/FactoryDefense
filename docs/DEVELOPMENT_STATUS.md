# FactoryDefense – Entwicklungsstand

**Datum:** 2026-10-16  
**Repository:** `Karlel0815/FactoryDefense` (ehemals Moon Dome)  
**Arbeitsbranch:** `feat/dev1-grid-network`  
**Dokumentations-Baseline:** `598dee1eb612c1875682db33dc6a01905adcb9a7`  
**DEV1-Commit:** GitHub-Branch-HEAD (siehe Commit-Historie des Branches)  
**Main:** Moon-Dome-Altstand `a6649de5b3d7d7503ce4baf11a543218d39cf786`, vorerst unverändert.

## IMPLEMENTIERT in DEV1
- Canvas-Karte mit 20 x 12 Rasterzellen, Hauptfabrik, vier sichtbaren Erzfeldern, Startmine.
- Selbst gezeichnete Versorgungswege (Pointerevents, Maus/Touch), Linienlücken aufgefüllt; diagonales Zeichnen wird in orthogonale Segmente aufgelöst.
- Minen auf Erzfeldern, Abreißen von Minen und Wegen; Hauptfabrik ist nicht abreißbar.
- Automatische Neuberechnung der Verbindung nach jedem Eingriff; getrennte Inseln bleiben unversorgt.
- HP und Testschaden für Wege/Gebäude; Reparatur nur beschädigter, nicht zerstörter Objekte. Neubau zerstörter Wege, zerstörte Minen erst entfernen und wieder bauen.
- UI für verbundene Minen und Wegsegmente, Werkzeugwahl, Neustart und Rückgängig.
- Keine Ressourcen- oder Produktionskosten – **bewusst noch nicht implementiert**.

## TESTS / QA
- 8 lokale Node.js-Unit-Tests für Rastergrenzen, schnelles Ziehen/Diagonalen, Netzunterbrechung, getrennte Inseln, Platzierungsregeln, Schaden/Reparatur, Neubau und Snapshot-Rückgängig: **8/8 bestanden**.
- Browserprüfung mittels Chromium/Playwright versucht: **blockiert durch Administrator-Navigationssperre**. Daher **nicht als bestanden** markieren.
- Reale Smartphone- und Touchscreen-Prüfung: **OFFEN**.
- GitHub CI: noch nicht nachgewiesen. Nicht als erfolgreich behaupten.

## OFFEN / Korrekturbedarf
- Browser- und Smartphone-Bedienbarkeit mit manueller Abnahme prüfen; 20-Spalten-Raster kann bei kleinen Mobilgeräten zu klein sein.
- Mehrere Eingaben und Undo im echten Browser prüfen (Unit-Test prüft nur Modell-Snapshot).
- Produktion, Munition, Gebäude-Baukosten, Wellen, Kampfeinheiten (DEV2–DEV4).
- Keine Freigabe für `main` / öffentliche Veröffentlichung erteilt.

## Aktive Entscheidung
Neuer Spielcode wird nur in Entwicklungsbranches geändert; Forgefront bleibt unangetastet. Code-Reuse dort nur nach Prüfung. Projektstatus und Entscheidungen werden getrennt geführt.
