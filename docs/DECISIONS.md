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
| FD-011 | BESCHLOSSEN | **Nur Welle 1 startet durch ausdrücklichen Klick auf „Welle 1 starten“; davor keine Erzförderung, Munitions-, Baumaterial- oder Einheitenproduktion.** Ab Welle 2 automatischer Vorbereitungs-Countdown mit optionalem Frühstart. |
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

## Richtungsänderung nach DEV3-Playtest – 2026-10-16

| ID | Status | Entscheidung |
|---|---|---|
| FD-018 | BESCHLOSSEN | Das separate **HQ entfällt vollständig** als Gebäude, Verbindungspunkt und Verlustbedingung. |
| FD-019 | BESCHLOSSEN | **Niederlage**, sobald keine intakte Fabrik mehr existiert (Lebenspunkte > 0). Mehrere Fabriken können den Fortbestand sichern. |
| FD-020 | BESCHLOSSEN | **Fabriken** sind statt des HQ die Versorgungszentren. Erz gelangt über verbundene Wege von Minen zur Fabrik; die Fabrik erzeugt Munition/Baumaterial; verbundene MGs erhalten Munition über das Fabriknetz. Eine zusätzliche HQ-Verbindung ist nicht erforderlich. |

Diese Entscheidungen **ersetzen** bisherige Aussagen, dass ein HQ als Netzquelle oder Sieg-/Niederlagegebäude benötigt wird. Vorherige DEV1–DEV3-Implementierungen bleiben als **historischer Codezustand** gekennzeichnet, bis der Umbau getestet ist.

### Für Implementierung noch OFFEN
- Getrennte Fabriknetze: korrekte Ressourcen- und Munitionszuordnung, ohne Material zwischen physisch getrennten Netzen zu teleportieren; zentrale HUD-Übersicht darf bleiben.
- Verhindern versehentlichen Abrisses der allerletzten Fabrik oder explizite Niederlage durch Eigenabriss (Usability).
- Anfangslayout/Startressourcen für eine erste Fabrik und Mine, sodass kein wirtschaftlicher Softlock entsteht.

## DEV3.1/DEV4 – Beschlüsse vom 16.10.2026

| ID | Status | Entscheidung |
|---|---|---|
| FD-021 | BESCHLOSSEN | **Zwei getrennte Förderbandarten:** Erzförderbänder (gelb/ocker) Mine → Fabrik und Munitionsförderbänder (blau) Fabrik → MG. Keine direkte logische Verbindung zwischen den Bandtypen. |
| FD-022 | BESCHLOSSEN | Verschiedene Bandtypen müssen visuell eindeutig unterscheidbar sein und dürfen nicht zu einem gemischten Leitungsnetz werden. |
| FD-023 | BESCHLOSSEN | DEV3.1-Umbau und DEV4 Offensive gemeinsam durchführen; Angriffseinheiten werden auf Bestellung hergestellt, greifen automatisch das Missionsziel an. |

**Ersetzt:** Ein einziges, neutrales Wegenetz aus DEV1–DEV3. Die ab DEV4 erprobten gelben und blauen Bänder sind nun getrennte Systeme. Das HQ entfällt entsprechend FD-018, letzte Fabrik verloren entsprechend FD-019. 

**Implementierte DEV4-Testannahmen, nicht endgültig beschlossen:** Kein Überlappen beider Bandtypen auf einem Feld; Erz/Munition bleiben je Fabrik bevorratet, Baumaterial ist global; eine Mine wird genau einer versorgenden Fabrik zugeordnet; jede versorgte MG-Einheit darf Munition aus einer erreichbaren Fabrik entnehmen; Angriffseinheiten zielen vorerst nur auf den einzelnen Bunker. Produktions-/Kampfzahlen weiterhin offen für Balancing. 

## DEV4.1 – verbindlicher Spielstart (BESCHLOSSEN)
Der Spieler kann vor Welle 1 **unbegrenzt bauen**, finanziert aus dem vorhandenen Startbaumaterial. Die Zeit läuft nicht herunter. **Alle Produktion und Erzförderung stehen still, bis die erste Welle manuell gestartet wurde.** Auch Angriffseinheiten können davor nicht produziert/bestellt werden. Die automatische Vorbereitungszeit gilt erst ab der **zweiten** Welle. Diese neue Regel ersetzt den alten automatischen Start der ersten Welle.
