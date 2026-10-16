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

## DEV2 – Implementierung (2026-10-16)
Die erste Wirtschaft ist programmiert und nutzt zunächst **Testwerte**, keine endgültigen Balancingbeschlüsse: Hauptfabrik dient als erste Produktionsstätte; fördernde verbundene Mine 4 Erz/s; produzierende Fabrik 2 Güter/s (Munition/Baumaterial). Startkapital 50 Baumaterial, Lagerlimits Erz 100 / Munition 100 / Baumaterial 80. Kosten pro Wegfeld 2, Mine 18, zusätzliche Fabrik 24, Reparatur pro HP 3. Auflösung fractional; UI zeigt eine Dezimalstelle. Abbau intakter Objekte gibt die Hälfte der ursprünglichen Materialkosten (abgerundet) zurück. Produktionsstopp bei Unterbrechungen und Kapazitätsgrenzen wie beschlossen. Alle Zahlen und Rückgewinnungsregeln sind **vorläufige Testannahmen**, nicht neue verbindliche Designentscheidungen.

## DEV3 – Technischer Verteidigungsprototyp (vorläufig)
Ein einfacher MG-Geschütztyp benötigt einen Anschluss an das Versorgungsnetz und echte Munition. Gegner greifen Minen, Transportwege und andere Infrastruktur gezielt an. Drei zeitlich gesteuerte Angriffswellen mit optionalem Frühstart, Reparaturen auch im Kampf sowie Sieg/Niederlage sind umgesetzt. Waffen-/Gegnerwerte und die direkten Bewegungswege sind weiterhin **Testannahmen**, nicht verbindlich beschlossen.

## Änderung nach DEV3 – HQ entfällt (BESCHLOSSEN, noch nicht implementiert)

**Neue Produktions- und Versorgungskette:** Mine → selbst gezeichneter verbundener Weg → Fabrik → derselbe oder angeschlossener Weg → MG. Erz wird logisch übertragen, von der Fabrik automatisch in Munition und Baumaterial umgewandelt und die Munition fließt ohne einzelne Transportfahrzeuge zu angebundenen MGs. **Kein HQ und keine HQ-Verbindung mehr.** Jede Fabrik ist ein potenzieller Versorgungskern; die **letzte intakte Fabrik zu verlieren beendet sofort das Spiel**.

Dies ersetzt die Passagen im früheren MVP-Vorschlag („Hauptfabrik/HQ“ bzw. Niederlage durch HQ-Verlust). Der ältere Prototyp (DEV3) verwendet technisch noch HQ und zentrale Bestände; dies ist **nicht** der beschlossene Zielzustand.

Bei mehreren voneinander getrennten Fabriknetzen dürfen Erz und Munition nicht ohne Netzanschluss zwischen den Inseln übertragen werden. Wie wir diese Ressourcen intern je Netz bilanzieren und die gemeinsame HUD-Anzeige erhalten, ist noch OFFEN und vor dem Code-Umbau zu spezifizieren.

## DEV4 – aktuelle Produktions- und Offensivstruktur (BESCHLOSSEN, implementierter Prototyp)

**Kernnetz:** Mine → **gelbes Erzförderband** → Fabrik → **blaues Munitionsförderband** → MG. Ein Band befördert logisch nur seine eigene Güterart. Gelbe und blaue Bänder können sich berühren, ohne sich zu verbinden, und überlagern in DEV4 keine gemeinsame Rasterzelle. Eine zerstörte Verbindung unterbricht nur die zugehörige Güterart.

**Spielerzentralgebäude:** Es gibt **kein HQ**. Die erste Fabrik steht bereits auf der Karte. Solange mindestens eine Fabrik intakt ist, läuft die Mission. Sobald die letzte intakte Fabrik zerstört ist, ist die Mission verloren.

**Lager:** Erz und Munition liegen intern an konkreten Fabriken, damit keine Fabrikinseln unverbunden Ressourcen austauschen. Das HUD summiert sie. Baumaterial bleibt als KISS-Prototypentscheidung ein gemeinsamer Bauvorrat ohne dritten Bandtyp. Die weitere Lokalisierung von Baumaterial ist offen.

**Offensive:** Einheiten werden per Knopfdruck gegen Baumaterial mit Bauzeit bestellt, entstehen bei einer intakten Fabrik und greifen den sichtbaren Gegnerbunker automatisch an. Der Bunker wehrt sie ab. Der prototypische Missionssieg erfolgt bei Bunkerzerstörung; drei abgewehrte Wellen ohne Bunkerzerstörung reichen **nicht** mehr für den Sieg.

**OFFEN:** Freie Zieleingabe, verschiedene Missionsziele/Kampagnen, Meta-Progression, vollständige Lager-/Logistikbalance, Softlock-Schutz und Smartphone-Feinbedienung. Alle Kosten, Wellenwerte, Reichweiten und Bauzeiten sind weiterhin vorläufig.

## DEV4.1 – Bauphase ohne Produktion (BESCHLOSSEN)
Vor der ersten Welle wird nicht automatisch gestartet: Der Spieler legt Bänder, Minen, Fabriken und MGs in Ruhe mit dem Startmaterial an. **Vor Klick auf „Welle 1 starten“ pausieren Erzförderung, Munition, Baumaterialerzeugung und Produktion von Angriffseinheiten vollständig.** Der Klick startet die erste Welle und das Wirtschaftssystem zusammen. Ab Welle 2 gilt der automatische Vorbereitungs-Countdown (mit Frühstartmöglichkeit). Dies ersetzt alte Formulierungen über einen automatischen Start von Welle 1.

## DEV4.2 – Kreuzungen und Auslastung

Die beiden getrennten Netztypen (gelb = Erz zur Fabrik, blau = Munition zum MG) dürfen sich **rechtwinklig mit einer automatischen Brücke** kreuzen. Eine Kreuzung ist kein Verteiler: Erz und Munition wechseln nie zwischen Bandtypen und es wird am Kreuzungspunkt keine Ware umgewandelt. Das Unterband muss eine gerade Durchfahrt haben; die Brücke auf der anderen Ebene läuft senkrecht dazu. Pro Feld ist maximal eine solche Kreuzung vorgesehen.

Direkt auf Minen und Fabriken wird im laufenden Betrieb die **reale Auslastung in Prozent ihrer Nennleistung** eingeblendet. Vor Start von Welle 1 ist die Produktion angehalten; angezeigt wird deshalb „PAUSE“ statt 0 %. Beim Antippen eines Gebäudes erhält der Spieler Informationen zu Ist-/Maximalleistung sowie möglichen Engpässen. Die pro Bandsegment maximal transportierte Materialmenge bleibt absichtlich nicht begrenzt.
