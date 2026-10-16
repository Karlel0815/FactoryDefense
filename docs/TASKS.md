# FactoryDefense – DEV-Plan und offener Testumfang

## DEV1 – Raster & Versorgung (abgeschlossen als Prototyp)
- [x] Raster, Wegzeichnen, Minen, Unterbrechung, Schaden/Reparatur, Undo, 8 Logiktests
- [x] Einfacher Nutzer-Funktionstest positiv
- [ ] Reale Smartphone-Abnahme mit überprüfter Touch-Bedienung

## DEV2 – Ressourcen und Wirtschaft (Code und lokale QA abgeschlossen)
- [x] Erzförderung nur angeschlossener Minen
- [x] Zentrale Bestände mit Lagerlimits und HUD
- [x] 50:50-Produktion und automatische Umleitung bei vollem Bestand
- [x] Zusätzliche Fabrik bauen, nur verbunden aktiv
- [x] Materialkosten für Minen, Wege, Fabriken, Reparaturen
- [x] Testschaden, Abkopplung, Verlust der HQ-Produktion
- [x] Abriss-Rückgewinnung als vorläufige Testregel
- [x] 13 neue Node-Tests + 8 Regressionstests, lokal bestanden
- [x] Simulierter Touch- und Desktop-Interaktionstest der portablen Vorschau bestanden
- [ ] Realer Smartphone-Test der regulären Version
- [ ] GitHub-CI-Status kontrollieren und dokumentieren
- [x] DEV2-Vorschau vom Nutzer grundsätzlich als funktionierend bestätigt („Geht“, 16.10.2026)
- [ ] DEV2-Spielgefühl und Wirtschaftsbalance vertieft bewerten (positive Funktionsmeldung ersetzt keinen Balancingtest)

## DEV3 – Verteidigung (NICHT implementiert)
- [ ] Geschütze, tatsächlicher Munitionsverbrauch, Reichweite, Schüsse
- [ ] Angriffswellen, Gegner-Zielpriorität, Gebäudeschäden
- [ ] Reparaturen jederzeit, Unterbrechung im Kampf, Niederlage
- [ ] End-to-End-Tests und unabhängige Critic-Prüfung

## DEV4 – Offensive / Kampagne (NICHT implementiert)
- [ ] Einheiten auf Bestellung; automatische Zielbewegung
- [ ] Bunkerzerstörung, Missionserfolg, Meilenstein-Freischaltungen

## Critic / Balance
- [ ] Softlock-Schutz bei völligem Ressourcenmangel besprechen
- [ ] Kosten und Produktionsraten testen (nur Annahmen in DEV2)
- [ ] Energie-/Performanceprofil auf echtem Mobilgerät testen
