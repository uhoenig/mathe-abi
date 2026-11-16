# MatheQuest

MatheQuest 2.0 ist ein minimalistischer Lerntrainer für Analysis und analytische Geometrie zur Vorbereitung auf das mündliche Mathematik-Abitur. Das Projekt befindet sich in der Beta-Phase.

## Funktionen

- Zehn aufeinander aufbauende Decks mit 106 vorhandenen Aufgaben aus Analysis und analytischer Geometrie.
- Antwort auswählen und bestätigen, anschließend Lösung und Erklärung; zusätzliche Auswahl „Weiß nicht“.
- Deckübergreifende Wiederholungen, kurze tägliche Runden und ein einstellbares Tageslimit neuer Fragen.
- Freies Training nach offenem Deck, Fachgebiet und Unterthema, ohne Änderung der Wiederholungstermine.
- Reduzierte Deck-Journey: 80 % verschiedener Fragen einmal richtig öffnen dauerhaft das nächste Deck.
- Lösungswege und Anregungen zum mündlichen Erklären.
- Helle und dunkle Darstellung sowie anpassbare Ansichten für unterschiedliche Bildschirmgrößen.

## Anwendung starten

**[MatheQuest auf GitHub Pages öffnen](https://uhoenig.github.io/mathe-abi/)**

Es sind keine Installation und kein Benutzerkonto erforderlich. Zum Laden der veröffentlichten Anwendung ist eine Internetverbindung nötig.

Alternativ den vollständigen Projektordner herunterladen und `index.html` in einem geeigneten Browser öffnen. Alle zugehörigen Dateien müssen zusammenbleiben; die HTML-Vorschau eines Dateimanagers ersetzt keinen Browser.

## Lernfortschritt und lokale Speicherung

Der Lernstand wird automatisch im `localStorage` des verwendeten Browsers gespeichert. Derselbe Browser kann ihn beim erneuten Öffnen der gleichen Website wiederherstellen. Ein Geräte- oder Browserwechsel übernimmt den Stand nicht automatisch.

Unter **Einstellungen & Daten** lässt sich der vollständige Lernstand als JSON exportieren und importieren. Ein Import ersetzt den bisherigen Stand erst nach Prüfung und Bestätigung. Ältere Spielstände benötigen eine bestätigte Übernahme; Original-Backups und alte Entwürfe bleiben dabei erhalten. Regelmäßige Exporte dienen als Sicherung: Gelöschte Browserdaten oder privates Surfen können zum Verlust des lokalen Lernstands führen.

Es gibt keine automatische Synchronisierung oder Übermittlung von Lernständen an den Betreiber.

## Entwicklung und Projektstatus

Die Anwendung verwendet HTML, CSS und Vanilla JavaScript ohne erforderlichen Build-Schritt oder eigenes Backend. `develop` dient der Entwicklung; GitHub Pages veröffentlicht `main`.

Der Starterpool ist noch kleiner und leichter als die langfristig geplanten etwa 500 Aufgaben. Die [Deckbelegung und Architekturentscheidungen](DECKS.md) dokumentieren Umfang und Grenzen. Stochastik bleibt erhalten, ist aber derzeit inaktiv. Die Multiple-Choice-Ergebnisse ersetzen weder einen mündlichen Verständnisnachweis noch eine vollständige Prüfungsvorbereitung.

## Datenschutz-Hinweis

Die App speichert Antworten, Lernverlauf und Einstellungen lokal und verwendet keine eigenen Analyse- oder Trackingdienste. Exportdateien enthalten Lerndaten und sollten nur bewusst weitergegeben und nicht ins öffentliche Repository hochgeladen werden.

Beim Aufruf über GitHub Pages verarbeitet GitHub Verbindungsdaten, darunter die IP-Adresse. Weitere Informationen: [GitHub Pages und Datenerfassung](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages#data-collection).
