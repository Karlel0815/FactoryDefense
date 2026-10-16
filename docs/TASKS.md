# FactoryDefense – priorisierter Aufgabenplan

## DEV1 – Spielbares Bauen (OFFEN; gesonderte Umsetzungsfreigabe erforderlich)
- [ ] Einfache Canvas-Spielschleife und Kartenraster
- [ ] Hauptfabrik, Erzfelder und Minen platzieren
- [ ] Versorgungswege mit Maus/Finger zeichnen, entfernen und reparieren
- [ ] Verbindungsprüfung inkl. getrennten Netzsegmenten
- [ ] Minimal-UI für das Raster und die Bauwerkzeuge
- [ ] Automatisierte Tests für Platzieren, Rastergrenzen, Netztrennung, Undo/Eingabefehler
- [ ] Manueller Desktop-/Smartphone-Test, sofern tatsächlich durchführbar

## DEV2 – Wirtschaft und Versorgung (OFFEN)
- [ ] Zentraler Lagerbestand und Kapazitätsgrenzen
- [ ] Erzförderung nur bei Versorgung
- [ ] Automatische 50:50-Produktion und Wechsel bei vollem Bestand
- [ ] Test: Unterbrechung des Netzes stoppt Versorgung korrekt

## DEV3 – Verteidigung (OFFEN)
- [ ] Geschütze, Munition, Projektil- und Schadensregeln
- [ ] Feindliche Angriffswellen mit zielgerichteten Infrastrukturangriffen
- [ ] Schäden, Reparatur jederzeit, Zerstörung und Neubau
- [ ] Tests: keine negativen Bestände, Wellen-Abbruch, Überlastung

## DEV4 – Offensive und Mission (OFFEN)
- [ ] Angriffs-Einheiten nur auf Bestellung
- [ ] Automatische Zielbewegung und Angriff auf Bunker
- [ ] Sieg/Niederlage, drei vorgeschlagene Wellen

## DEV5 – QA und Balancing (OFFEN)
- [ ] Regressionen, Grenzfälle, Browser/Touch, Performance
- [ ] Check: defensive vs. expansive vs. offensive Strategien
- [ ] Benutzerabnahme und spätere Merge-Freigabe

## Kritische offene Designfragen
1. Netzwerkinterpretation bei abgeschnittenen Fabriken und getrennten Inselsystemen
2. Vorrang von Einheitenbestellungen gegenüber normaler Fabrikproduktion
3. Schutz vor wirtschaftlichem Softlock
4. Genaues Missions-/Siegziel

**Status dieses Dokuments:** Planung, keine Umsetzungszusage oder Tests.
