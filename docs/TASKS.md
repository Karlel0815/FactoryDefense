# FactoryDefense – DEV4: Aufgaben und Test-Risiken

## DEV3.1 – HQ raus / zwei Netze – IMPLEMENTIERT
- [x] HQ vollständig aus Startkarte und Kampfregel entfernt.
- [x] Fabriken fungieren als Produktionszentren; letzte zerstörte Fabrik führt zur Niederlage.
- [x] Gelbe Erz- und blaue Munitionsbänder, gegenseitige Überlagerung blockiert.
- [x] Mine → Fabrik nur über gelbes Band, Fabrik → MG nur über blaues Band.
- [x] Getrennte Fabrikstandorte behalten ihre eigenen Erz- und Munitionsbestände.
- [x] Netztrennung, beschädigte Bänder, volle Vorräte und Materialgrenzen getestet.

## DEV4 – Offensive / aktives Missionsziel – IMPLEMENTIERT als einzelner Prototyp
- [x] Angriffseinheiten auf Bestellung mit Baukosten, Bauzeit und max. 3 Warteschlangenpositionen.
- [x] Ziel vorgegeben: rechts liegender Bunker; automatische Bewegung und Angriff.
- [x] Gegnerischer Bunker verteidigt sich, zeigt HP, löst Missionssieg bei Zerstörung aus.
- [x] Drei Wellen und Infrastrukturangriffe bleiben erhalten.
- [x] 41 neue Logik-/Regressionstests bestanden.
- [x] Chromium-Desktop und simulierte Touch-Bedienung erfolgreich.
- [ ] Benutzer-/Smartphone-Spieltest auf realer Hardware.
- [ ] GitHub-Actions-Status nach Commit gesondert verifizieren.

## OFFEN für Folgestufen
- [ ] Wirtschaftlichen Softlock vermeiden (ohne Gratis-Exploits).
- [ ] Produktions- und Kampfeinheitenpreise gegen echte Strategien balancieren.
- [ ] Alternative Missionsziele, Zielwahl und mehrere Level/Kampagnen.
- [ ] Kleine Touch-Ziele vergrößern oder Zoom anbieten.
- [ ] Forschungsfreischaltungen über Missions-/Wellen-Meilensteine.
- [ ] Save/Load, Release-Bereinigung, echte Smartphone-Regression.
- [ ] Hauptbranch nur nach Freigabe und überprüften Tests aktualisieren.

## DEV4.1 – erster Wellenstart (IMPLEMENTIERT, Nutzerabnahme OFFEN)
- [x] Vor Welle 1 keine Countdown-Automatik.
- [x] Erste Welle startet ausschließlich über den Button.
- [x] Bis dahin keine Erzförderung, Munition, Baumaterial- oder Einheitenproduktion.
- [x] Aufbau mit Startmaterial vor dem Start weiterhin möglich; Undo erhalten.
- [x] Folgewellen weiterhin automatisch nach Vorbereitungszeit oder früher manuell.
- [x] 44/44 lokale Node-Tests und Desktop-/emulierte Touch-Browser-Smoke bestanden.
- [ ] DEV4.1-Vorschau vom Nutzer abnehmen lassen; echter Hardwaretest weiterhin offen.
