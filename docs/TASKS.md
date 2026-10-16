# FactoryDefense – Entwicklungsaufgaben

## DEV1 (IMPLEMENTIERT / Nutzer-Funktionsprüfung positiv)
- [x] Raster, Mine, Wege, Schaden, Reparaturen, Undo, Netzberechnung.

## DEV2 (IMPLEMENTIERT / Nutzer-Funktionsprüfung positiv)
- [x] Lagerlimits, Förderung und 50:50-Produktion, Zusatzfabrik, Bau-/Reparaturkosten.

## DEV3 (IMPLEMENTIERT / lokale QA durchgeführt)
- [x] MG kaufen/platzieren, Netzprüfung, Reichweite, Munition und Gegner-Schaden.
- [x] Drei Wellen, Timer und manueller Frühstart.
- [x] Infrastruktur-Zielwahl, Gebäude- und Straßenschaden.
- [x] Reparaturen jederzeit, Sieg/Niederlage, Restart.
- [x] Undo gegen Kampfschaden-Exploit abgesichert.
- [x] 35 automatisierte Logik-/Regressionstests.
- [x] Desktop-/emulierte Touch-Browser-Smokes.
- [x] Einfaches Balancing-A/B-Szenario (ein MG verliert, zwei gewinnen).
- [ ] Reale Smartphone- und Spielerabnahme für DEV3.
- [ ] GitHub CI nach Commit prüfen; noch kein positiver Nachweis.

## DEV4 (OFFEN / keine Freigabe)
- [ ] Kampf-Einheiten auf Bestellung, automatische Zielbewegung.
- [ ] Gegnerischer Bunker, Missionserfolg, Fortschritt über Missionen.
- [ ] Aufs Neue Entscheidungen prüfen, Softlock-Schutz vor finalem Release.

## Critic / Testergebnisse
- [ ] Wirtschaftlicher Softlock nach Zerstörung kritischer Infrastruktur.
- [ ] Balancing zwischen Aufbau, Munitionsproduktion und Verteidigung.
- [ ] Gegnerwegfindung: derzeit direkte Zielbewegung ohne Hinderniskollision.
- [ ] Smartphone-UI mit kleinen Rasterzellen und langer Spielsession.
- [ ] Debug-Schadenswerkzeug vor Veröffentlichung entfernen.

## Nach DEV3: HQ entfernen und Fabriknetz anpassen (BESCHLOSSEN, Code OFFEN)
- [ ] HQ aus Startkarte, Darstellung, Sieg-/Niederlagelogik und Wirtschaft entfernen; erste Fabrik und Mine als Startausstattung.
- [ ] Fabriken als Netzquellen; korrekte logische Versorgung Mine → Fabrik → MG (kein separater HQ-Anschluss).
- [ ] Niederlage nur, wenn **alle Fabriken zerstört** sind; mit einer verbleibenden Fabrik geht das Spiel weiter.
- [ ] Netzinseln korrekt behandeln, keine unverbundenen Vorräte teleportieren; HUD weiterhin verständlich.
- [ ] Benutzerfreundlichkeit beim Abriss der letzten Fabrik klären.
- [ ] Tests: zwei Fabriken, getrennte Inseln, ausgefallene Fabrik, Netztrennung, vorhandene Munition, Bau/Undo/Reparatur, Niederlage.
