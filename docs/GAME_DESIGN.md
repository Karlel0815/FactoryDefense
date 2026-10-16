# FactoryDefense – Game Design V0.1

**Projekt:** FactoryDefense (Arbeitstitel), **Datum:** 2026-10-16, **Status:** Konzept.

## Spielversprechen
Entspanntes, gut verständliches Fabrik-Aufbau- und Verteidigungsspiel mit echtem äußerem Druck. Der Spieler optimiert die Produktion, schützt neue Fördergebiete, übersteht stärkere Angriffswellen und erfüllt konkrete Missionsziele. Wiederspielbarkeit und Meta-Progression ja, aber kein langer Grind; die Kampagne ist abschließbar.

## Kernspielschleife – BESCHLOSSEN
Mine fördern lassen → Erz durch ein funktionsfähiges Versorgungsnetz bereitstellen → Fabrik produziert automatisch Munition und Baumaterial → Expansion, Verteidigung und Reparaturen bezahlen → Gegnerwellen abwehren → bei Bedarf Kampfeinheiten in Auftrag geben und gegen Ziele losschicken → Mission erfüllen.

## Produktion – BESCHLOSSEN
- Gemeinsame Ressourcenanzeige (Erz, Munition, Baumaterial) mit jeweils begrenztem Bestand, **keine baubaren Lagerhäuser**.
- Eine angeschlossene Mine liefert Erz ins Netz; eine angeschlossene Fabrik verarbeitet automatisch im Normalfall 50:50 Munition und Baumaterial.
- Ist einer der beiden Produktbestände voll, erhält das andere Produkt die freie Produktionskapazität. Fehlen Erz oder Kapazitäten, sinkt die Leistung.
- Lagerkapazität und Produktionsgeschwindigkeit bleiben getrennte Kenngrößen.
- Kampfeinheiten werden **auf Bestellung**, mit Baumaterial und Produktionszeit, hergestellt.

## Raster, Expansion und Transport – BESCHLOSSEN
- Alle Erzvorkommen sind von Beginn an sichtbar.
- Der Spieler zeichnet sichtbare Versorgungswege selbst im Raster, mit Maus oder Finger.
- Wege, Minen, Fabriken und Verteidigungsgebäude sind angreifbar und zerstörbar.
- Wege übertragen nur eine abstrakte Netzverbindung: **keine** einzelnen Förderbänder, Lieferfahrzeuge oder Transportzeiten.
- Wird ein Weg getrennt, verlieren abgetrennte Gebäude ihre Ein- bzw. Auslieferung und abgetrennte Geschütze die Netzmunition. Bereits gespeicherte zentrale Bestände bleiben bestehen.

## Verteidigung, Reparatur, Offensive – BESCHLOSSEN
- Geschütze verbrauchen reale Munition aus dem gemeinsamen Vorrat und benötigen Netzanschluss.
- Gegner greifen Infrastruktur gezielt an, nicht nur den zentralen Fabrikstandort.
- Beschädigte Gebäude können **jederzeit**, auch während laufender Wellen, gegen Baumaterial repariert werden. Zerstörte Gebäude werden neu gebaut.
- Einfache Kampfeinheiten werden produziert und zu einem Ziel losgeschickt, ohne permanente Einzelsteuerung.
- Angriffswellen beginnen nach Vorbereitungszeit automatisch, können aber früher ausgelöst werden.

## Kampagne/Forschung – BESCHLOSSEN
- Mehrere Missionen mit übergreifenden Zielen; z. B. gegnerischen Bunker oder besondere Fabrikanlage zerstören.
- Neue Möglichkeiten durch Meilensteine, insbesondere überstandene Wellen; keine separate Forschungswährung im Basisspiel.
- Meta-Progression und klar erreichbares Endziel; keine künstliche Dauerschleife.

## MVP – VORGESCHLAGEN (noch nicht freigegeben)
Eine Karte, Hauptfabrik, Startmine, mindestens ein zusätzlich erschließbares Erzfeld, Wegzeichnen, ein Geschütz, ein einfaches Gegnerprofil, ein bestellbarer Kampfeinheitentyp, ein gegnerischer Bunker und drei ansteigende Wellen. Sieg durch Zerstören des Bunkers, Niederlage durch Verlust der Hauptfabrik.

## OFFEN
- Genaue Rezepte, Zahlenwerte, Reparaturdauer, Ressourcenverbrauch und Baukosten.
- Transportnetz bei mehreren Inselnetzen: Zurechnung zum gemeinsamen Vorrat, Abkopplungsfälle, ggf. Neubau ohne Netzanschluss.
- Zielpriorität, Angriffswege, Angriffseinheitenproduktion und Wegfindung im Detail.
- Konkrete Missionsabfolge, Forschungsmeilensteine, Kampagnenbelohnungen und Speicherformat.
- Technische Implementierung und spielerisches Balancing.
