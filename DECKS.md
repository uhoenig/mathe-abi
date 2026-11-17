# MatheQuest 2.0: Architektur und Aufgabenbelegung

Entscheidungsstand vor Implementierung, 16. November 2026.

## Vorhandene Architektur und Weiterverwendung

Vanilla-Skripte ohne Build-Schritt. `app.js` enthält Router, Darstellung, Auswertung und lokale Speicherung. `review.js` enthält die bisherige deterministische Zeitplanung, `theme.js` die unabhängige Theme-Präferenz. Die Frage-/Lösungsdateien und Generatoren bleiben unverändert. Speicherfehlerbehandlung, bestätigter Import/Reset, eindeutige Einheiten-IDs, XP-Grenzen, JSON-Downloads und Theme-Steuerung werden weiterverwendet.

## Entscheidungen für Version 2.0

- Zehn explizite Decks mit stabilen Frage-IDs, Belegungsversion 1. Keine neuen Fragen und keine veränderten Antwortreihenfolgen. Alle 100 Analysis-/Geometrie-Basisfragen und sechs passende Abschlussfragen werden genau einmal zugeordnet. Die 50 Stochastik-Basisfragen und drei Stochastik-Abschlussfragen bleiben für eine spätere Aktivierung erhalten.
- Freischaltung: mindestens `ceil(0.8 * Aufgabenanzahl)` unterschiedliche jemals richtig beantwortete Aufgaben im Vorgängerdeck. Deck 1 ist offen. Leere Decks lösen keine automatische Freischaltung aus. Bereits gespeicherte Freischaltungen werden beim Ergänzen neuer Aufgaben nie zurückgenommen. XP sind davon unabhängig.
- Lernplan: zentral konfigurierte Intervalle 1/3/7/14/30/60 Tage; falsch/Weiß nicht am nächsten Tag, Wiederholungsstufe zurückgesetzt. Nur abgeschlossene tägliche Einheiten verändern Termine. Freies Training zählt zu Antwortstatistik, XP und Freischaltung, lässt den gesamten Wiederholungszeitplan unverändert. Keine Selbsteinschätzungsbuttons und keine Ratemarkierung.
- Heute: gemeinsame fällige Warteschlange aller offenen Decks, danach neue Fragen nur aus dem aktuellen Deck. Maximal zehn Aufgaben pro Runde und standardmäßig zehn neue Fragen pro Berliner Kalendertag; Tageslimit in Einstellungen 0–30 konfigurierbar. Weitere fällige Fragen können in folgenden Runden bearbeitet werden.
- Ein Antwortklick sperrt und speichert die erste Antwort unmittelbar und zeigt direkt die Erklärung. Es gibt keinen separaten Bestätigungsschritt. „Weiß nicht“ bleibt als zusätzliche Auswahl erhalten. Fragenformat ist vorerst Multiple Choice; Deckmetadaten und vorhandene mündliche Lösungsimpulse lassen spätere Aufgabenformate zu, ohne eine freie Antwortbewertung vorzutäuschen.
- Fortschrittsversion 3: bestehende Einheiten/Antworten bleiben Quelle für XP und Beleg für richtige Aufgaben. Zusätzlich werden ein Lernplan-Snapshot mit Versuchen, richtigen Antworten, erster/letzter Bearbeitung, Fälligkeit, Intervall und Stufe, offene Decks, aktuelles Deck, Tageslimit und Tageszählung gespeichert. Die manuelle Hell-/Dunkel-Präferenz bleibt separat gespeichert und wird zusätzlich im vollständigen JSON-Backup mitgeführt. Kein zusätzlicher Server.
- Alte Versionen 1/2: Laden verändert die Rohdaten nicht. Erst bestätigte Übernahme schreibt Version 3; vorher kann der Originalstand exportiert werden. Alte Einheiten bleiben erhalten, einschließlich inaktiver Stochastik. Ein laufender alter Durchlauf wird samt Antworten als `archivedActive` mitgeführt, nicht stillschweigend gelöscht oder als neue tägliche Einheit gewertet. Neue Planung startet auf Basis der bisherigen aktiven Antwortverläufe mit transparent neu berechneten Terminen. Unbekannte Versionen werden geschützt abgewiesen.
- Erweiterbarkeit: stabile IDs und dauerhafte offene Decks schützen Fortschritt bei neuen Fragen. Reine Designupdates benötigen keinen Reset. Nicht mehr bekannte Frage-IDs oder unbekannte Belegungsversionen erzeugen eine schützende Fehlermeldung statt stiller Datenlöschung. Eine neue inkompatible Zuordnung benötigt eine bewusste Versionsentscheidung.

## Bestehender Fragenbestand je Deck

Die bisherigen `difficulty`-Werte sind grob (1/2 für Basisfragen, 3 für Abschlussfragen), keine empirische Kalibrierung. Die Belegung folgt hauptsächlich fachlichen Voraussetzungen. Die höheren Decknamen beschreiben die angestrebte Ausbaustufe; die meisten vorhandenen Aufgaben bleiben Einstiegsfragen. Das Ziel von etwa 50 Aufgaben pro Deck ist noch nicht erreicht.

| Deck | Name | Analysis | Analytische Geometrie | Anzahl | Bisherige Schwierigkeit |
| --- | --- | --- | --- | --- | --- |
| 1 | Grundlagen | A001–A005 | G001–G005 | 10 | 6 × 1, 4 × 2 |
| 2 | Funktionen & Vektoren | A006–A010 | G006–G010 | 10 | 6 × 1, 4 × 2 |
| 3 | Regeln anwenden | A011–A015 | G011–G015 | 10 | 6 × 1, 4 × 2 |
| 4 | Verfahren verstehen | A016–A020 | G016–G020 | 10 | 6 × 1, 4 × 2 |
| 5 | Ableitung & Winkel | A021–A025 | G021–G025 | 10 | 6 × 1, 4 × 2 |
| 6 | Verfahren kombinieren | A026–A030 | G026–G030 | 10 | 6 × 1, 4 × 2 |
| 7 | Zusammenhänge | A031–A035 | G031–G035 | 10 | 6 × 1, 4 × 2 |
| 8 | Integral & Ebene | A036–A040 | G036–G040 | 10 | 6 × 1, 4 × 2 |
| 9 | Modelle & Schnittpunkte | A041–A045 | G041–G045 | 10 | 6 × 1, 4 × 2 |
| 10 | Prüfungsausblick | A046–A050, F001–F003 | G046–G050, F004–F006 | 16 | 6 × 1, 4 × 2, 6 × 3 |

Aktiv: 106 Aufgaben. Inaktiv und erhalten: P001–P050, F007–F009. Keine Grundlage, Deck 8/9 bereits als durchgängig anspruchsvoll oder Deck 10 als vollständige mündliche Abiturprüfung zu bezeichnen.

Review-Snapshots zählen Versuche geplanter Einheiten; alle Antwortversuche einschließlich freien Trainings bleiben in der Einheitenhistorie. Die sechs übernommenen Abschlussfragen geben wie bisher keine XP. Neue Fragen müssen stabile IDs erhalten und explizit einem Deck zugeordnet werden; vorhandene Zuordnungen nicht still ändern.
