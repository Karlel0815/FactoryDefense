# FactoryDefense – Entwicklungsstand

**Datum:** 2026-10-16  
**Repository:** Karlel0815/FactoryDefense  
**Referenz:** `feat/dev2-economy` / `3d79ced14d8753155468a660512606b9f8a1a621` (DEV2, dokumentiertes Spielerfeedback)  
**Arbeitsbranch:** `feat/dev3-defense-waves`  
**Commit DEV3:** Siehe GitHub Branch-HEAD (nach Push eintragen).  
**main:** Weiterhin alter Moon-Dome-Prototyp `a6649de5b3d7d7503ce4baf11a543218d39cf786`, kein Merge.

## IMPLEMENTIERT
Alle DEV1/DEV2-Module und Funktionen erhalten. DEV3 ergänzt:
- Einfache MG-Bauoption, Materialkosten, Netzwerkgebundenheit, Reichweite, echte Munition je Schuss, Projektilspur, Schaden an Gegnern.
- Feindliche Angriffswellen mit festen Prototyp-Spawns und zunehmender Gegnerzahl/Zähigkeit. Gegner zielen autonom auf Fabriken, Minen, Türme, HQ und Transportwege (netzfokussierte Gegner).
- Wellen 1–3; zunächst automatische Vorbereitung mit freiwilligem früherem Start, automatische Pausen zwischen Wellen.
- Angriffe senken Gebäude-/Wege-Lebenspunkte; Wegzerstörung trennt das Versorgungsnetz; Reparatur gegen Baumaterial ist auch **während Angriffen** erlaubt.
- Sieg nach drei tatsächlich abgewehrten Wellen; Niederlage nach Zerstörung des HQ; Neustart möglich.
- Undo während Angriffsphasen gesperrt und Historie an Phasenübergängen geleert, um Rücknahme von Kampfschäden zu verhindern.

## TESTERGEBNISSE
- Node-Tests DEV1/DEV2/DEV3 lokal bestanden: **35/35** (21 Regression + 14 DEV3).
- Automatisierter Browser-Smoke: Desktop + emuliertes Touch-Gerät mit Inline-Einzeldatei geprüft; Bau, Ressourcenänderung, Wellenstart, Gegner-Anzeige und Undo-Sperre. **Bestanden**.
- Szenariosimulation: 0 oder 1 MG führt zum Verlust; 2 an das Netz angeschlossene MGs gewinnen gegen alle drei Wellen ohne Eingriffe. Ergebnis nur für das feste Testlayout, **nicht** allgemeines Balancing.
- Lokaler Server-/`file://`-Aufruf der regulären App im automatisierten Browser wurde durch Sandbox-Navigationsregeln blockiert; Browser-Test erfolgte mit `set_content` aus der Einzeldatei. **Keine** allgemeine Browserkompatibilität daraus behaupten.
- Reales Smartphone und benutzerseitiger vollständiger Spieltest: **OFFEN**.
- GitHub CI-Status: nach Upload gesondert prüfen, nicht automatisch als bestanden ausgeben.

## OFFEN / KRITISCH
- Kein offensiver Missionsabschluss oder Meta-Progression – erst DEV4.
- Turm-/Gegnerparameter und drei Wellen sind Testwerte und noch nicht vom Spieler gebalanced.
- Gegner laufen derzeit direkt zum Zielpunkt; komplexe Hindernisnavigation wurde bewusst nicht implementiert.
- Wirtschaftlicher Softlock nach vollständiger Zerstörung und Materialmangel bleibt möglich; Critic-Review vor DEV4 notwendig.
- Für 20x12 Raster sind einzelne Touch-Zellen auf kleinen Smartphones weiterhin relativ klein.
- Debug-Schadenswerkzeug bleibt im Testbuild verfügbar, nicht für Release vorgesehen.

## NÄCHSTER SCHRITT
Spielvorschau vom Nutzer testen lassen. Nach Feedback Anpassungen vornehmen und erst dann DEV4 freigeben. `main` und Forgefront nicht ändern.

## NEUE BESCHLÜSSE nach DEV3 – noch NICHT implementiert
Der Nutzer hat festgelegt: HQ vollständig entfernen; Produktionsfabriken übernehmen die Netzversorgung; Niederlage sobald **keine intakte Fabrik mehr vorhanden** ist. Die Soll-Kette ist Mine → Fabrik → MG über das vorhandene, verwundbare Wegenetz. **DEV3 enthält weiterhin HQ-basierte Logik** in `src/network.js`, `src/model.js`, `src/economy.js` und `src/combat.js`. Diese Funktionen gelten nur als IMPLEMENTIERT nach altem Stand und müssen in einem gesondert freigegebenen Änderungsbranch überarbeitet und mit neuen Regressionstests geprüft werden.

**Critic-Risiko:** Bisherige zentrale Bestände dürfen bei mehreren getrennten Fabriknetzen keine magische netzübergreifende Versorgung erzeugen. Datenmodell und Benutzeranzeige entsprechend spezifizieren. Noch keine Codeänderung durch diesen Dokumentationscommit.
