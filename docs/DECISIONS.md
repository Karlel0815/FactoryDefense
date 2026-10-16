# FactoryDefense – verbindliche Entscheidungen

**Gültig nur für dieses Repository.** Keine stillschweigende Übernahme von Forgefront- oder Moon-Dome-Regeln.

| ID | Status | Entscheidung |
|---|---|---|
| FD-001 | BESCHLOSSEN | Neues, eigenständiges Fabrik-Verteidigungsspiel mit kurzen, abschließbaren Missionen und überschaubarer Komplexität. |
| FD-002 | BESCHLOSSEN | Einfaches automatisches Fabriksystem statt detaillierter Einzelmaschinen. |
| FD-003 | BESCHLOSSEN | Zentral sichtbare, kapazitätsbegrenzte Ressourcenbestände; keine Lagerhäuser. |
| FD-004 | BESCHLOSSEN | Fabrik verteilt normale Produktion gleichmäßig 50:50 auf Munition/Baumaterial; voller Produktbestand gibt Kapazität an das andere Produkt ab. |
| FD-005 | BESCHLOSSEN | Erzförderung und Waffennachschub brauchen ein funktionsfähiges Versorgungsnetz. |
| FD-006 | BESCHLOSSEN | Versorgungswege im Raster selbst zeichnen; sichtbar, angreifbar, zerstörbar; keine physischen Rohstofftransporte simulieren. |
| FD-007 | BESCHLOSSEN | Alle Erzvorkommen ab Missionsstart sichtbar. |
| FD-008 | BESCHLOSSEN | Mine, Fabrik, Wege und Verteidigungsanlagen können angegriffen und zerstört werden. Gegner greifen Infrastruktur gezielt an. |
| FD-009 | BESCHLOSSEN | Geschütze verbrauchen tatsächlich produzierte Munition. |
| FD-010 | BESCHLOSSEN | Reparieren mit Baumaterial jederzeit, auch während einer Welle. Zerstörtes muss neu gebaut werden. |
| FD-011 | BESCHLOSSEN | Wellen starten nach Vorbereitungszeit automatisch oder früher auf Spielereingabe. |
| FD-012 | BESCHLOSSEN | Meilenstein-basierte Freischaltungen statt eigener Forschungswährung. |
| FD-013 | BESCHLOSSEN | Mehrere Missionen mit übergreifender Kampagne und aktiven Zielen, beispielsweise feindlichen Bunker zerstören. |
| FD-014 | BESCHLOSSEN | Einfache Kampf-Einheiten werden auf Bestellung mit Baumaterial/Produktionszeit hergestellt und zum Ziel losgeschickt, ohne direkte Echtzeitsteuerung. |
| FD-015 | BESCHLOSSEN | Webtechnik: JavaScript, HTML, CSS und Canvas; eigenes GitHub-Repository. |
| FD-016 | BESCHLOSSEN | Geeignete Funktionen aus Forgefront nur nach Prüfung und ohne Änderung des Forgefront-Repositories verwenden. |
| FD-017 | BESCHLOSSEN | Eigenständige Dokumentation, Entwicklungsbranches, Tests und Release-Freigaben pro Spiel. |

## Nicht beschlossen / OFFEN
- Verhältnis und Kopplung von Kampfeinheiten-Produktion zu normalem 50:50-Durchsatz.
- Zahlenwerte, UI-Details, die genaue Reihenfolge der drei Prototypwellen.
- Kartenlayout, Schwierigkeitsstufen, Forschungssymbole und Missionstexte.
- Release- und Merge-Zeitpunkt.

## Historie
- 2026-10-16: FD-001 bis FD-017 aus der bisherigen Designabstimmung zusammengestellt.
- Früherer Beschluss „Reparaturen nur in Pausen“ wurde vom Nutzer ausdrücklich **ersetzt**: Reparaturen sind jederzeit möglich.
- Die zuvor vorgeschlagenen drei Produktionsmodi sind **nicht** beschlossen.

## DEV2 – implementierte Annahmen, nicht als Designbeschluss interpretieren
- HQ produziert in DEV2 wie eine erste Fabrik (2 Güter/Sekunde).
- Beispielwerte: Mine 4 Erz/s, Fabrik 2 Güter/s; Anfangsbestand Baumaterial 50; Kapazitäten 100/100/80 für Erz/Munition/Baumaterial.
- Beispielkosten: Weg 2, Mine 18, Fabrik 24, Reparatur 3 je HP; Abriss intakter Anlagen erstattet testweise 50 %.
- Keine baubaren Lager, keine Produktionsmodi. Der Munitionsbestand wird erst in DEV3 durch Geschütze verbraucht.
- Alle genannten Zahlen und die Abriss-Rückgewinnung sind **OFFEN für Balancing**, nicht verbindlich.

## DEV3 – implementierte Testannahmen, nicht endgültig beschlossen
MG-Kosten 14 Baumaterial, 1 Munition pro Schuss und vorläufige Reichweite 4,8 Rasterzellen. Wellen mit 3/6/9 Feinden und zunehmender Trefferfestigkeit sind Testwerte, keine abschließenden Balancingbeschlüsse. Gegenüber bereits BESCHLOSSENEN Regeln keine Änderung: Reparaturen jederzeit; keine Lagerhäuser; 50:50-Produktion; selbst gezeichnete angreifbare Versorgungswege; gezielte Gegnerangriffe.
