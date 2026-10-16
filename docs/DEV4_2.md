# DEV4.2 – Technische und spielerische Änderung

## BESCHLOSSEN
- Erzband: gelb/ocker, Mine → Fabrik.
- Munitionsband: blau, Fabrik → MG.
- Beide Förderbänder dürfen sich mit einer visuell erkennbaren **Brücke** kreuzen, ohne sich zu verbinden oder Ressourcen zu vermischen.
- Mine und Fabrik zeigen ihre **Auslastung als Prozentwert** sofort auf der Karte, analog zur Forgefront-Anzeige.

## IMPLEMENTIERT
- Eine Brücke entsteht beim Überzeichnen einer intakten geraden Förderstrecke mit dem anderen Band. Über- und Unterband sind unabhängig.
- Quer- bzw. Seiteneinstieg ist am Kreuzungsfeld gesperrt; beide Linien können nur auf ihrer jeweiligen Achse durchlaufen.
- Kreuzung beim Abreißen des oberen Bandes entfernt, unteres Band bleibt; Beschädigung/Reparatur betrifft nur das ausgewählte Schadensobjekt. Unteres Band kann über das Reparaturwerkzeug erreicht werden, wenn das obere intakt ist.
- `outputRate` wird bei der realen Erzförderung/Produktion gemessen (0–100 % der Nennleistung). Vor Welle 1 zeigt die Karte PAUSE. Infoleiste bei Antippen erläutert Ursachen von Stillstand und Engpässen.
- Bestehende Datenmodelle sind bisher nicht in gespeicherte Spielstände serialisiert; kein Save/Load im Prototyp.

## VORLÄUFIGE ANNAHMEN
- Brücke kostet gleich viel Baumaterial wie ein reguläres Bandfeld. Nur eine orthogonale Einzelkreuzung pro Zelle.
- Auslastung wird aus dem neuesten Simulationsschritt angezeigt, ohne zeitliche Glättung.

## VERWORFEN / NICHT IMPLEMENTIERT
- Gemischte Ressourcenleitungen oder Knoten, die Erz in Munition umwandeln ohne Fabrik.
- Physische Fördermengenbeschränkungen je Band; im Basisspiel bleiben Bänder reine logische Netzverbindungen.

## TESTS
`npm test`: 53/53 bestanden. Chromium/Playwright mit emuliertem Touch und Desktop: beide bestanden. Reale Hardware weiterhin offen.
