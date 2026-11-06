# Palermo, presto.

Ein schneller, mobiler Palermo-Guide für Oliver: 30 Host-Empfehlungen, recherchierte Ergänzungen, Bilder, Kategorien, Karte, Budget, konkrete Tipps, Merkliste und persönliche Notizen.

**Website:** https://kollektionhannemann.github.io/palermo-presto/

## Benutzen

- Suche nach einem Ort, einem Gericht oder einem Viertel.
- Filtere nach Kategorie, oberer Budgetgrenze, Zeit, Viertel, Host-Empfehlung oder recherchiertem Öffnungsplan.
- „Such mir was aus“ berücksichtigt Tageszeit in Palermo, aktuelle Filter, besuchte Orte und auf Wunsch Entfernung.
- Standort bleibt im Browser. Entfernungen sind Luftlinien; Google Maps übernimmt die Fußgängernavigation.
- Merkliste, eigene Sterne, Besuchsstatus und Notizen werden lokal gespeichert. Export und Wiederherstellung sind im Footer verfügbar. Kein geräteübergreifender Sync persönlicher Daten.
- Auf dem Smartphone über das Browsermenü zum Home-Bildschirm hinzufügen. Nach erfolgreichem Offline-Cache stehen Infos und Fotos auch ohne Internet bereit. Kartenhintergrund und externe Links benötigen Internet.

## Einen Link importieren

**Ohne zusätzliche Schlüssel:** Im Guide „Ort hinzufügen“ öffnen und einen HTTPS-Link einsetzen. Der vorausgefüllte GitHub-Import benötigt einmal „Submit new issue“. Die GitHub-Anmeldung bleibt auf github.com. Nur Issues des Repository-Eigentümers lösen den Import aus.

**Direkt aus der Website:** Optional ein auf dieses Repository beschränktes Fine-grained GitHub-Token mit **Actions: read/write** hinterlegen. Es bleibt nur im `sessionStorage` des aktuellen Tabs, wird nicht exportiert und nicht an fremde Orts-Websites übermittelt. Dann genügt ein Klick im Linkformular. Das Token kann dort wieder gelöscht werden.

**Per CLI / GitHub:**

```sh
gh workflow run import-place.yml -R KollektionHannemann/palermo-presto -f url=https://example.com/place
```

Der Workflow löst Weiterleitungen auf, liest Open Graph und JSON-LD, sucht eine Position über Nominatim, erkennt vorhandene Orte, ergänzt benachbarte Einträge, committet die JSON-Daten und veröffentlicht den Guide neu. Neue Inhalte erscheinen typischerweise nach 1–3 Minuten. Ein Link kann keine Daten liefern, die die Quelle nicht öffentlich bereitstellt: manche Google-/Instagram-Links blockieren das Auslesen. In diesem Fall die offizielle Website oder einen ausführlichen Maps-Link verwenden. Fehlende Preise, Bewertungen und Zeiten werden nicht erfunden. Automatische Einträge werden als ungeprüft markiert.

Zum redaktionellen Ergänzen anschließend den Eintrag in `public/data/places.json` bearbeiten. `status: "check"` und die entsprechende Warnung erst entfernen, wenn die Angaben tatsächlich geprüft wurden. Preise, Quellen und Datum pflegen; Stundenpläne verfallen in der Oberfläche nach 45 Tagen. Die Workflow-Ausgaben zeigen Importfehler an; fehlgeschlagene Issues bleiben offen.

## Lokal entwickeln

Node.js 22.12 oder neuer (GitHub Actions verwendet Node 24).

```sh
npm ci
npm run dev
npm test
npm run validate
npm run build
npm run preview
```

`src/core.js` enthält Filter, Distanzen, Wochenpläne und Vorschläge. `src/app.js` ist die Oberfläche. `scripts/import-place.mjs` reichert die gemeinsame Ortsdatenbank an. Der Build enthält eine Startkopie der Daten; eine Hintergrundabfrage holt Updates. Leaflet und Marker-Clustering laden erst beim Öffnen der Karte. Der Service Worker speichert nur lokale Dateien, **keine** OpenStreetMap-Kacheln. Ein Inhalts-Hash ersetzt den Cache bei neuen Veröffentlichungen.

`npm test` prüft unter anderem Nachtöffnungszeiten, Sommerzeit, abgelaufene Stundenpläne, Filterkombinationen, verschiedene Bewertungsskalen, Backups, Import-Metadaten, Dubletten, Palermo-Grenzen und blockierte private Netzwerkadressen. `npm run validate` prüft Datenkonsistenz, alle 30 Host-Tipps, Bilddateien und Bildnachweise.

## Daten & Bilder

- Recherchebeginn: **6. November 2026**. Jede Ortsseite hat Quellen und Prüfdatum.
- Budgetspannen sind **redaktionelle Schätzungen**, sofern nicht ausdrücklich als publizierter Eintrittspreis gekennzeichnet. Menüpreise werden im konkreten Tipp mit Anbieterquelle genannt.
- Sterne sind belegte Momentaufnahmen mit Plattform, Originalskala, ggf. Anzahl und Datum. Keine erfundenen Gesamtbewertungen. Für viele Orte gibt es bewusst noch keinen Sternwert.
- Restaurantfotos sind als **Motivfotos der Kategorie** gekennzeichnet und behaupten nicht, das einzelne Lokal zu zeigen.
- Fotografien: Wikimedia Commons. Autor, Lizenz, Original und Bearbeitung stehen in `public/data/photo-credits.json` und unter „Quellen & Hinweise“.
- Schrift: DM Sans, Colophon Foundry, SIL Open Font License 1.1 (`public/fonts/OFL.txt`).
- Geodaten: © OpenStreetMap-Mitwirkende, [ODbL](https://www.openstreetmap.org/copyright). Ungefähre Positionen sind mit `~` gekennzeichnet.
- [Nominatim-Nutzungsregeln](https://operations.osmfoundation.org/policies/nominatim/): höchstens **eine Anfrage pro Sekunde**, identifizierender User-Agent, Ergebnisse zwischenspeichern, kein Autocomplete und keine systematischen Massendownloads. Importe sind serialisiert; Geocoding läuft nur für konkret hinzugefügte Orte.
- [OSM-Kachelregeln](https://operations.osmfoundation.org/policies/tiles/): nur beim tatsächlichen Kartenaufruf laden; kein Offline-Prefetch. Bei deutlich wachsender Nutzung einen geeigneten Karten-/Geocoding-Anbieter konfigurieren.

Die Python-Skripte `seed.py`, `geocode.py`, `photos.py` und `curated-photos.py` dokumentieren die einmalige Erstbefüllung. Sie sind nicht für regelmäßige Datenpflege oder CI nötig. Den Seed nicht über eine bereits ergänzte Datenbank laufen lassen. Die Fotowerkzeuge benötigen Pillow.

## Veröffentlichung

GitHub Pages verwendet GitHub Actions. Jeder Push auf `main` testet, validiert, baut und veröffentlicht `dist/`. Der Import-Workflow ruft denselben Veröffentlichungsprozess ausdrücklich auf, da ein Push mit `GITHUB_TOKEN` keine weiteren Push-Workflows auslöst. Öffentliche Website und gemeinsame Ortsdaten benötigen keine kostenpflichtigen API-Schlüssel. Keine laufenden KI-Abfragen beim Seitenaufruf.

Das Repository und importierte Ortslinks sind öffentlich. Persönliche Unterkunftsadresse und private Kontaktdaten sind nicht Bestandteil der Datenbank.
