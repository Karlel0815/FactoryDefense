# Moon Dome – Production Survival (DEV V0.1)

Ein eigenständiger, experimenteller **Browser-Prototyp** von Moon Dome. Keine Verbindung zu Forgefront.

## Start

`index.html` im Browser öffnen. Funktioniert ohne Server und ohne externe Bibliotheken.

## Bedienung

- Zu Beginn eine Fabrik und ein MG auf den markierten Plätzen bauen (Metallkosten sichtbar).
- **Welle 1 starten**: Produktion beginnt erst mit der ersten Welle (kein Vorfarmen).
- Weitere Minen, Fabriken und MGs über feste Plätze kaufen.
- Drei **globale Forschungen** mit jeweils drei Stufen verbessern Förderung, Verarbeitung und MG-Schaden.
- Alle MGs beziehen ihre Munition aus einem gemeinsamen Vorrat. Bei Mangel wird die Schussrate fair gedrosselt.
- Genau ein festgelegter Gegnerweg, ein Gegnertyp, fünf MG-Plätze, begrenzte Reichweite.
- Nächste Welle nach fünf Sekunden; die optionale Pause zwischen Wellen friert die gesamte Wirtschaft ein.
- Kuppelschaden bleibt bestehen. Bei Zerstörung endet der Run; der höchste abgeschlossene Wellenrekord wird lokal gespeichert.

## Konzeptstatus

Die Zahlen zu Startmetall, Kosten, Produktionsraten, HP, Weggeometrie, Reichweiten und Gegnern sind **Testannahmen**, keine festgelegten finalen Balancingwerte. Die fünf Sekunden zwischen den Wellen laufen in diesem Prototyp in Echtzeit. Kein Gold, keine weiteren Waffen oder Wege, keine Leitungen. Kein echtes Savegame und keine Online-Bestenliste.

## Entwicklungsstatus

DEV V0.1 (dev2) befindet sich auf Branch `feat/production-survival-v01` und ist **nicht** auf `main` bzw. GitHub Pages veröffentlicht. Die aktuellen Zahlen sind nur Testwerte. Vor einer Veröffentlichung stehen Smartphone-Tests und Balancingprüfung aus.

Konzept: https://docs.google.com/document/d/1lUb6J9ZJk_QFUXJjMPBIE6NUVYtceo__PW76sJog9mo/edit
