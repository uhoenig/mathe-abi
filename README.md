# MatheQuest

MatheQuest 2.0 ist ein minimalistischer Lerntrainer für Analysis und analytische Geometrie zur Vorbereitung auf das mündliche Mathematik-Abitur. Das Projekt befindet sich in der Beta-Phase.

## Funktionen

- Zehn aufeinander aufbauende Decks mit 502 Aufgaben aus Analysis und analytischer Geometrie.
- Antwort anklicken und sofort Lösung und Erklärung sehen; zusätzliche Auswahl „Weiß nicht“.
- Deckübergreifende Wiederholungen und neue Fragen ohne Tages- oder Rundenlimit; jederzeit weiterüben.
- LaTeX-Darstellung von Formeln mit lokal eingebundenem KaTeX, auch offline.
- Themenkarten für Analysis und analytische Geometrie mit Schwierigkeitsstufen und sichtbarer Freischaltung.
- Kompetenzbasierte Deckfreischaltung: je ein Grundnachweis pro Pflichtkompetenz öffnet dauerhaft das nächste Deck. Mittlere und schwere Varianten sind Vertiefung.
- Lösungswege und Anregungen zum mündlichen Erklären.
- Helle und dunkle Darstellung; auf Handys und Touch-Geräten direkt über die Tasten „Hell“ und „Dunkel“ wählbar. Die Auswahl bleibt nach dem Neuladen erhalten.
- Entwicklermodus unter Einstellungen: alle Decks direkt prüfen, schwere Aufgaben zuerst und ein separat gespeicherter Testlernstand. Beim Ausschalten kehrt der reguläre Lernstand zurück.
- Raumlabor als spielerische Lernreise: sieben Etappen mit 42 kurzen Schritten, beweglichen Zeichnungen, eigenen Recheneingaben und 14 abschließenden Missionen.
- Tagesmission, Entdeckerlevel, Meilensteine und sichtbare Grundnachweise auf der Lernreise.

## Geraden und Ebenen im Raumlabor

Das Raumlabor erklärt Geradenparameter, die drei Ebenenformen, Punktproben, Schnittpunkte von Geraden, Gerade–Ebene-Schnitte, Schnittgeraden zweier Ebenen und Lagebeziehungen. Jede Etappe beginnt mit einer Erkundung in der Zeichnung. Anschließend leitest du die Lösung in kleinen Schritten selbst her: passende Ausdrücke wählen, Lücken füllen, rechnen und prüfen. Pro Bildschirm erscheint genau eine Frage. Tipps und direktes Feedback helfen beim nächsten Versuch. Zwei abschließende Missionen und eine Erfolgsansicht runden jede Etappe ab. Die sieben Etappen sind über eine Lernkarte direkt zugänglich; der Regler bewegt einen Punkt in der räumlichen Skizze. Ebenen sind als Ausschnitte gezeichnet. Bereits gelöste Missionen bleiben erhalten. Während die Seite offen ist, kannst du auch einen begonnenen Rechenweg fortsetzen.

Passende Suchlinks zu **Mathe by Daniel Jung** ergänzen die eigenen Erklärungen. Sie öffnen auf Klick seinen YouTube-Kanal in einem neuen Tab. Es werden keine Videos oder Vorschaubilder automatisch geladen. Die App und ihre Zeichnungen funktionieren weiterhin offline; nur die externen Videos benötigen Internet.

Gelöste Raumlabor-Missionen werden unabhängig vom Multiple-Choice-Lernstand auf diesem Gerät gespeichert, im Entwicklermodus nochmals separat. Sie sind derzeit nicht im JSON-Export des Multiple-Choice-Lernstands enthalten. Ein richtig gelöstes Beispiel markiert eine Übung als gelöst; es ist kein automatischer Kompetenznachweis für die Deckfreischaltung.

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

Der Pool umfasst 502 aktive Aufgaben und 66 Kompetenzen. Die [Deckbelegung](DECKS.md), der [Ausbaubericht](COVERAGE.md) und die [fachliche Nachprüfliste](MANUAL_REVIEW.md) dokumentieren Umfang, Prüfstatus und Grenzen. Stochastik bleibt erhalten, ist aber derzeit inaktiv. Die Multiple-Choice-Ergebnisse ersetzen weder einen mündlichen Verständnisnachweis noch eine vollständige Prüfungsvorbereitung.

## Datenschutz-Hinweis

Die App speichert Antworten, Lernverlauf und Einstellungen lokal und verwendet keine eigenen Analyse- oder Trackingdienste. Exportdateien enthalten Lerndaten und sollten nur bewusst weitergegeben und nicht ins öffentliche Repository hochgeladen werden.

Beim Aufruf über GitHub Pages verarbeitet GitHub Verbindungsdaten, darunter die IP-Adresse. Weitere Informationen: [GitHub Pages und Datenerfassung](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages#data-collection).
