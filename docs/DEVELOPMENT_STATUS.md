# FactoryDefense – Projektstand DEV4

**Datum:** 2026-10-16  
**Repository:** `Karlel0815/FactoryDefense`  
**Entwicklungsbranch:** `feat/dev4-factory-conveyors-offense`  
**Referenz DEV3-Dokumentationsstand:** `60fc8298d6e6370a9a8c028bc157f416878cc6e8`  
**DEV4-Commit:** siehe den aktuellen Commit des Entwicklungsbranches  
**main:** alter Moon-Dome-Stand; absichtlich nicht überschrieben. Forgefront unverändert.

## IMPLEMENTIERT

- Das HQ wurde aus der Startkarte und aus Netz-, Wirtschaft-, Darstellungs- und Verlustlogik entfernt. Erste Fabrik (`factory-1`) mit Startmine und Startverbindung.
- **Niederlage erst bei Zerstörung aller Fabriken**; eine zweite intakte Fabrik ermöglicht Weiterspielen. Absichtliches Entfernen der letzten intakten Fabrik ist gesperrt.
- Zwei logisch unabhängige, zerstörbare Bandtypen: `ore` (gelb) für Mine → Fabrik, `ammo` (blau) für Fabrik → MG. Verschiedene Typen dürfen sich nicht überlagern und verbinden sich nicht miteinander, auch bei direkter Nachbarschaft. Beide verwenden die zuvor eingeführte Raster-/Touch-Zeichenlogik.
- Fabrikbezogene Erz- und Munitionsbestände, global aggregiert im HUD. Erzmine wird genau einer erreichbaren Fabrik zugeordnet. MG kann nur Munition erreichbarer Fabriken beziehen; keine Munitionsübertragung über unverbundene Inseln. **Baumaterial als gemeinsamer abstrakter Vorrat** ist eine bewusste, vorläufige DEV4-Vereinfachung.
- 50:50-Produktion, Rückumleitung bei vollem Vorrat, Materialkosten, Reparaturen in jeder Phase, Bänderabriss und -neubau sowie Debugschaden.
- Drei feindliche Angriffswellen, Infrastruktur-Zielwahl, Geschütze mit Munitionsverbrauch, zeitgesteuerter oder früherer Wellenstart.
- Bunker am rechten Kartenrand als Missionsziel, Angriffseinheiten auf Bestellung (Kosten, Bauzeit, Warteschlange max. 3). Die Einheiten laufen und kämpfen autonom. Gegnerischer Bunker kann Einheiten beschädigen.
- Sieg bei Bunkerzerstörung; nach drei abgewehrten Wellen bleibt die Mission bestehen, bis der Bunker zerstört ist. Alte Wellen-Sieg-Regel ersetzt.

## TESTS

- `npm test`: **41/41 bestanden** – neue suite mit Raster-/Touch-Koordinaten, Bandtypen-Trennung, Netz-Zerfall, Wirtschaft, isolierten Fabriken, Munition, Reparaturen, Angriffseinheiten, Gegnern, Missionssieg, Niederlage, Grenzfällen und Belastungstest.
- Chromium/Playwright-Browser-Test per portabler `preview.html`: **Desktop und simuliertes Touch-Gerät bestanden**. Keine erfassten JavaScript-Ausnahmen. Bau eines verbundenen MGs, blockierte falsche Bandplatzierung, Einheitenbestellung, Wellenstart und Undo-Sperre erfolgreich.
- Balancing-Simulation: Zwei Einheiten derselben Fabrik können den Bunker zerstören, eine allein nicht (unter festen Testbedingungen). Keine allgemein gültige Balance nachgewiesen.
- Alter DEV1/DEV2/DEV3-Testcode bleibt im Repository als Geschichte, wird wegen seiner expliziten HQ- und Ein-Netz-Annahmen nicht mehr ausgeführt; die neue Suite ersetzt ihn funktional.
- **GitHub Actions**: Erfolgsstatus erst nach tatsächlich geprüftem Lauf als bestätigt vermerken.
- **Realgerätetest / realer Smartphone-Spielablauf: OFFEN.** Automatisierter Browser-Test benutzt Emulation statt echter Hardware.

## OFFEN / CRITIC

- Prototyp ist noch keine ausgeglichene Kampagne: Angriffseinheiten haben nur den einen Bunker als Ziel. Mehr Missionen, freie Zielauswahl, Forschung und Meta-Progression fehlen.
- Gemeinsames Baumaterial bleibt eine abstrakte Designvereinfachung; für vollständig lokal begrenzte Fabrikinseln müsste auch dieses System netzbezogen modelliert werden. Keine offensichtliche Erz-/Munitions-Teleportation.
- Risiko wirtschaftlicher Sackgasse nach Verlust von Material und Förderbändern; Restart ist vorhanden, eine Rettungsmechanik nicht.
- Touch-Zielgrößen auf 20 Spalten teilweise klein, reale Smartphone-Abnahme offen.
- Ungültige ältere Tests sind zur Rückverfolgbarkeit erhalten, nur die neue aktive DEV4-Testsuite ist für den geänderten Vertrag maßgeblich.
- Kein Save/Load, keine komplexe Hinderniswegfindung, keine feste Release-Freigabe und kein Merge nach `main`.

## NÄCHSTER SCHRITT

DEV4-Preview durch Nutzer spielen lassen und dabei Produktionswege, Verteidigung und Bunkerangriff prüfen. Danach Balancing und weitere Kampagnenziele diskutieren.


## DEV4.2 – BRÜCKEN UND AUSLASTUNG (IMPLEMENTIERT, RELEASE OFFEN)
Entwicklungsbranch: `feat/dev4-2-bridges-utilization`, ab DEV4.1. Neu: `state.crossings` definiert in den zwei parallelen Medien-Netzen die Richtung jeder Kreuzung und welches Band oben liegt. Orthogonale Kreuzung nur bei geradem, durchgehendem Unterband; Routing im BFS blockiert seitliches Ein- oder Abbiegen am Kreuzungsfeld. Erz und Munition haben weiterhin getrennte Ressourcenräume, die Fabrik verbindet sie nur durch Umwandlung. Bei Zerstörung des oberen Bandes bleibt das untere nutzbar; Testschaden, Reparatur, Ersetzen und Abriss sind geprüft. Neu sind `outputRate` pro Mine und Fabrik als tatsächliche Förder- bzw. Produktionsleistung; direkter Prozentwert im Gebäude, Pausenstatus vor Welle 1 und eine antippbare Informationsleiste mit Ursache für Unterauslastung.

QA: **53/53 lokale Node-Tests bestanden**, darunter Kreuzungen in beiden Richtungen, unzulässige T-Stücke, Durchleitung ohne Ressourcendurchmischung, separater Schaden, Wiederaufbau, historische Tests und Auslastungswerte. Chromium/Playwright Desktop sowie simuliertes Touch-Gerät **bestanden**. Echtes Smartphone offen; GitHub-CI nicht als bestanden nachgewiesen. Die UI ist auf schmalen Mobilgeräten grundsätzlich noch sehr klein. Alle Produktions-/Brückenkosten sind Prototypwerte. Bisher keine Freigabe für `main`.
