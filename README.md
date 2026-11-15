# MatheQuest

Ein vollständig lokaler Lernprototyp für die Vorbereitung auf das mündliche Mathematik-Abitur in Hamburg. Vanilla JavaScript, HTML und CSS; keine Installation, Anmeldung, Datenbank oder Internetverbindung erforderlich.

## Starten

1. Den vollständigen Projektordner auf dem Gerät speichern.
2. **`index.html` im Browser öffnen.** Alle relativen Dateien müssen zusammenbleiben.
3. Mit „Lernreise starten“ die erste Diagnose beginnen oder ein Fachgebiet wählen.

Optional lässt sich der Ordner mit `python3 -m http.server 8080` unter `http://localhost:8080` öffnen. Ein Webserver ist für die Anwendung nicht nötig. Auf Smartphones ist ein lokaler statischer Webserver oft praktischer als ein Dateimanager, der HTML nur in einer Vorschau öffnet.

## Enthalten

- **150 Einstiegsaufgaben plus 9 schwierigere Level-60-Aufgaben.** Die Einstiegsaufgaben umfassen je 50 Analysis, Geometrie und Stochastik, genau fünf pro Kompetenzbereich, drei Optionen je Aufgabe.
- **3 Fachgebiete, 30 Kompetenzbereiche, 90 Teilkompetenzen** als aufklappbarer Baum.
- **Diagnose:** 30 zufällige Fragen, eine aus jedem Bereich, zehn je Gebiet.
- **Gebietstraining:** zehn zufällige Fragen aus einem Gebiet, eine pro Bereich.
- **Skill-Training:** alle fünf Aufgaben eines gezielt ausgewählten Bereichs.
- Interaktive Weltkarte mit 30 Kompetenzländern auf drei Kontinenten und einer Level-60-Zitadelle.
- Vorwärts-/Rückwärtsnavigation, Fragenübersicht, gespeicherte Auswahl und Wiederaufnahme eines laufenden Trainings. Nach jeder Antwort erscheinen Richtig/Falsch, die markierte richtige Lösung und eine Kurzerklärung. Die erste Antwort bleibt für diese Einheit gesperrt und zählt für die Wertung. Der Gesamtbericht und XP folgen nach der Abgabe. Bei fehlenden Antworten gibt es eine Bestätigung mit den offenen Fragennummern.
- Ergebnisberichte mit Gesamtquote, Bereichsergebnissen, Fehlerliste, Wiederholungsempfehlungen, XP und Level. JSON-Bericht sowie Drucken/PDF über den Browser.
- Level 1–60, animierter Levelaufstieg, sieben Erfolge, persönliche Gebietstrainings-Bestleistungen und Einheitenverlauf.
- Getrennter Lernmodus mit Antwort, Erklärung, Lösungsweg, Hintergrund, Denkfehler und mündlicher Verständnisfrage. Die Einschätzung „Ja / Teilweise / Nein“ der Lehrkraft wird separat gespeichert.
- Automatisches Speichern über `localStorage`, vollständiger JSON-Export und geprüfter Import mit Bestätigung vor dem Ersetzen.
- Responsives dunkles Dashboard, eigene lokale SVG-Illustrationen, Tastaturbedienung, Fokusmarkierungen und reduzierte Animationen bei entsprechender Systemeinstellung.

## XP und Kompetenz

**XP:** Eine richtige Antwort im ersten tatsächlichen Versuch gibt 10 XP. Danach gibt jede richtige Wiederholung 5 XP, solange die Frage insgesamt noch keine 20 XP eingebracht hat. Falsche und unbeantwortete Aufgaben geben keine XP. Unbeantwortete Fragen zählen im Bericht als falsch, erhöhen aber nicht den Zähler tatsächlicher Antwortversuche. Einheiten werden genau einmal gewertet. Nach eingeblendetem Sofortfeedback lässt sich die erste Antwort in dieser Einheit nicht mehr ändern; auch nach Neuladen, Navigation oder Export/Import bleibt sie erhalten.

Je 50 XP steigt das Level; ab 2.950 XP gilt Level 60. Bei allen 150 Aufgaben können insgesamt höchstens 3.000 XP erreicht werden. Importierte XP-Werte werden nicht übernommen: Auswertung und XP entstehen aus dem Antwortverlauf erneut.

**Kompetenz:** XP und Kompetenz sind unabhängig. Pro Bereich gelten folgende MC-Indikatoren:

| Status | Kriterien |
| --- | --- |
| Nicht geprüft | Keine tatsächlich beantwortete Aufgabe |
| Unsicher | Bereits beantwortet, aber Kriterien darunter noch nicht erfüllt |
| Teilweise beherrscht | Mindestens drei unterschiedliche Aufgaben; mindestens 60 % der jeweils letzten Antworten richtig |
| Sicher beherrscht | Alle fünf unterschiedlichen Aufgaben; mindestens 80 % der letzten Antworten richtig; mindestens 80 % aller tatsächlichen Versuche richtig; Antworten in mindestens zwei abgeschlossenen Einheiten |

Die Matrix zeigt zusätzlich verschiedene Aufgaben, tatsächliche Antwortversuche, richtige Antworten, Gesamttrefferquote und Wiederholungsbedarf. Wiederholungen derselben Frage erhöhen nicht die Zahl unterschiedlicher Aufgaben. Ein einzelner Glückstreffer kann keinen sicheren Status erzeugen. Auch diese Kriterien ersetzen keinen mündlichen Verständnisnachweis. Die mündliche Bewertung beeinflusst die MC-Ergebnisse nicht.

## Lösungen und pädagogische Freigabe

`questions.js` enthält ausschließlich Fragen und Kompetenzdaten. `solutions.js` enthält die Antwortschlüssel und Erklärungen. Sie wird bei der ersten Antwort für das Sofortfeedback, zur Rekonstruktion gespeicherter Antworten und Ergebnisse oder nach bestätigter Freigabe des vollständigen Lernmodus geladen. Vor dem Antworten wird die Lösung der jeweiligen Frage nicht angezeigt.

Der Lernmodus verlangt eine Bestätigung, dass die Lehrkraft die Lösungen freigegeben hat. Während eines laufenden Quiz ist er gesperrt; bei Beginn eines neuen Trainings wird die Freigabe geschlossen. Die Freigabe wird nicht dauerhaft gespeichert.

**Dies ist kein technischer Zugriffsschutz.** Die lokale Lösungsdatei und bereits geladene Daten bleiben für Gerätebenutzer einsehbar. Eine echte spätere Prüfungsumgebung müsste die Datei nur auf dem Lehrkraftgerät bereitstellen bzw. Lösungen nach authentifizierter Freigabe serverseitig ausliefern. Die vorhandene Trennung in Fragen und Lösungen und die Funktion `loadSolutions()` bilden dafür die Austauschstelle. Fehlt die Lösungsdatei, bleiben die Quizantworten erhalten und die Anwendung meldet den Ladefehler.

## Daten mitnehmen

Unter **Einstellungen & Daten** lässt sich der gesamte Lernstand exportieren. Er enthält Einheiten und Antworten, ein laufendes Training sowie mündliche Bewertungen. Beim Import werden Formatversion, IDs, Antwortwerte, Datentypen, Größen und Doppelteinheiten geprüft. Erst eine zusätzliche Bestätigung ersetzt den Stand. Ungültige Dateien verändern ihn nicht.

Ein **einzelner Ergebnisbericht** enthält Aufgaben und gewählte Antworten, Gesamtpunktzahl und Quote, Gebiet-/Kompetenzergebnisse, falsche und unbeantwortete Fragen, Wiederholungsthemen, XP und Level sowie vorhandene mündliche Bewertungen. Er ist für die Nachhilfelehrkraft gedacht und wird beim Lernstandimport ausdrücklich als Bericht erkannt.

Browserdaten, privater Modus, Dateipfad und Browser können die Verfügbarkeit von `localStorage` beeinflussen. Regelmäßig JSON exportieren. Bei nicht verfügbarem Speicher zeigt die Anwendung eine Meldung. Ein beschädigter gespeicherter Stand wird nicht stillschweigend überschrieben. Es werden keine Daten übertragen.

## Dateien

```text
index.html              Einstieg und Navigation
style.css               Dashboard, Quiz, Smartphone und Druckansicht
app.js                  Quiz, Auswertung, Zustand, XP, Import/Export
questions.js            150 öffentliche Aufgaben + Kompetenzlandkarte
solutions.js            Separater Lösungsschlüssel und Lerninhalte
final-questions.js      Neun schwierigere Abschlussaufgaben
assets/                 Lokale SVG-Grafiken
README.md               Diese Anleitung
tools/build_questions.py Redaktionelle Quelldaten + reproduzierbarer Generator
tests/content.py        Struktur-, Rechen- und Offline-Ressourcenprüfung
tests/browser.cjs       Optionale automatisierte Chromium-Browsertests
QA.md                   Prüfumfang und Grenzen
```

`questions.js` und `solutions.js` sind bereits erzeugt; Python ist nur für redaktionelle Änderungen nötig. Neu erzeugen mit `python3 tools/build_questions.py`. Der Generator verteilt die korrekte Antwort über alle drei Positionen.

## Fachlicher Rahmen

Der Einstieg beginnt bei einfachen Algebra-, Funktions-, Vektor- und Wahrscheinlichkeitskonzepten. Oberstufeninhalte wie Kettenregel, Ebenen und Hypothesentests werden zunächst begrifflich und rechnerisch niedrigschwellig geprüft. Fünf Aufgaben je Bereich sind ein Starterpool, kein vollständiger Abituraufgabenkatalog. Dieser Prototyp ersetzt insbesondere noch keine freie mündliche Prüfungssimulation.

Orientierung: [Hamburger Richtlinie Mathematik, Anlage 27, Abschnitt „Mündliche Prüfung“](https://www.hamburg.de/resource/blob/123292/33b306f4845a852f93340513681e2025/27-mathematik-arl-2021-data.pdf) und [Hamburger Landesinstitut: Mathematik Sekundarstufen](https://li.hamburg.de/qualitaetsentwicklung-von-unterricht-und-schule/faecher-lernbereiche/mint/mathematik/sekundarstufen-650104), eingesehen am 15. November 2026. Die endgültige Prüfungsrelevanz hängt vom tatsächlich behandelten Stoff, dem belegten Niveau und den aktuellen offiziellen Vorgaben der Schule und des Prüfungsjahres ab. MatheQuest ist kein amtliches Prüfungsangebot.

## Qualität prüfen

Die Anwendung selbst braucht keinerlei Pakete. Die Inhaltsprüfung läuft mit:

```sh
python3 tests/content.py
```

Für die zusätzlichen Entwicklungstests ist Playwright in der Testumgebung erforderlich. Nach Installation von Playwright und Chromium den lokalen Webserver starten und ausführen:

```sh
node tests/browser.cjs
```

Optional: `MQ_URL` für eine andere lokale Adresse und `MQ_BROWSER` für den Pfad zu einem vorhandenen Chromium-/Brave-Browser. Der Test erzeugt Desktop-/Smartphone-Screenshots, einen PDF-Bericht und eine JSON-Roundtrip-Datei in `tests/`. Diese Dateien sind Testdaten; sie gehören nicht zum Lernstand der Nutzerin.

## Länder erobern und Level-60-Zitadelle

Die Weltkarte auf der Startseite ersetzt die allgemeinen Fortschrittsbalken. Analysis, Geometrie und Stochastik bilden drei Kontinente mit jeweils zehn Ländern. Ein Land entspricht einem Kompetenzbereich und lässt sich per Klick oder mit Tab/Enter auswählen. Seine drei Teilkompetenzen, Fortschrittsdaten und der Trainingsbutton erscheinen unter der Karte. Auf kleinen Bildschirmen lässt sich die Karte seitlich verschieben.

Unentdeckte Länder sind dunkel, erkundete eingefärbt; sicher beherrschte Länder erhalten eine goldene Flagge. Die Eroberung beruht auf den oben beschriebenen Kompetenzkriterien und entsteht aus vorhandenen Antwortverläufen – auch nach Import älterer Lernstände. Werden die Kriterien bei späterem Üben unterschritten, braucht das Land wieder Sicherung. Es gibt keinen zusätzlichen, widersprüchlichen Eroberungsspeicher.

Die Richtlevel 1, 6, 12, 18, 24, 30, 36, 42, 48 und 55 dienen je Kontinent zur Orientierung; alle normalen Länder bleiben für gezielte Nachhilfe direkt spielbar. Level allein erobert kein Land.

Die **Zitadelle der Meisterschaft** ist das 31. Gebiet und öffnet sich erst, wenn Level 60 erreicht ist und alle 30 Länder sicher beherrscht werden. Sie enthält neun zusätzliche schwierigere Aufgaben: je drei Analysis, Geometrie und Stochastik, darunter Optimierung, Ebenenspiegelung, Bayes und die Bestimmung eines Ablehnungsbereichs. Mindestens **8 von 9** richtigen Erstantworten in einer abgeschlossenen Zitadellenrunde erobern dieses letzte Gebiet. Die Runde gibt keine zusätzlichen XP und zählt nicht als Ersatz für die Grundlagen-Kompetenznachweise. Sofortfeedback und Ergebnisbericht funktionieren wie in den anderen Modi. Die abgeschlossene Runde wird mit dem Lernstand exportiert und importiert.

## Phase A: Entwicklung und Spielstände in der Beta

Die Entwicklung erfolgt lokal auf **`develop`**. **`main` bleibt die freigegebene Schülerversion.** Die Änderungen aus Phase A sind bis zu einem ausdrücklich freigegebenen Commit und einer späteren Veröffentlichung nur im Arbeitsstand vorhanden. Ein Commit auf `develop` allein veröffentlicht nichts. Ein Push, ein Merge nach `main` und eine Veröffentlichung benötigen jeweils die entsprechende Freigabe.

GitHub Pages bleibt auf der bestehenden Veröffentlichung eingerichtet. Am 15. November 2026 wurde lesend bestätigt, dass die Umgebung `github-pages` aktive benutzerdefinierte Branch-Regeln hat und ausschließlich den Branch `main` zulässt. Der erfolgreiche Pages-Lauf veröffentlicht Commit `72a7ae9def7b0618640886a15c37d552d7609d45` von `main`. Es wurde keine Pages-Einstellung geändert und kein Deployment angestoßen. Die Website lautet **https://uhoenig.github.io/mathe-abi/** (kleingeschriebener Pfad).

Vor einem Branch-Wechsel offene Änderungen auf `develop` nach Freigabe committen oder anderweitig sichern: Uncommittete Arbeitsdateien sind nicht automatisch zwischen Branches isoliert. Für die Anwendung wird weiterhin keine neue Software oder Laufzeitbibliothek benötigt.

### Speicherung und Versionsregeln

Der vorhandene Schlüssel **`mathequest.v1`** und das Datenformat `version: 1` bleiben erhalten. Zusätzlich gibt es **`progressVersion: 1`**. Bereits vorhandene Stände ohne dieses Feld gehören zum unveränderten Altbestand und werden als Fortschrittsversion 1 gelesen. Beim nächsten regulären Speichern oder Exportieren wird das Feld ergänzt; Antworten, Bewertungen und laufende Trainings bleiben erhalten.

Bei künftigen inkompatiblen Änderungen an Aufgaben-IDs, Bedeutung/Reihenfolge von Antwortoptionen, Lösungsschlüsseln oder XP-Regeln muss `PROGRESS_VERSION` in `app.js` bewusst erhöht werden. Reine Layoutänderungen benötigen keine Erhöhung. Diese Beta-Lösung erkennt ausdrücklich versionierte Inkompatibilitäten; sie erkennt inhaltliche Änderungen nicht automatisch und enthält keine komplexen Migrationen.

Automatisch gespeichert werden Trainingsstart, Antwort, Fragenposition, Abschluss und mündliche Bewertung. Import und Reset schreiben erst nach Bestätigung. Ein laufendes Training hat eine stabile Kennung, die beim Abschluss übernommen wird. XP werden weiterhin ausschließlich aus den abgeschlossenen Antworten berechnet; Fragen und XP-Regeln wurden nicht geändert.

### Fehler und Wiederherstellung

- **Inkompatibler oder beschädigter gespeicherter Stand:** Die normale Bearbeitung wird gesperrt. Der unveränderte Rohstand kann heruntergeladen werden. Ein passender JSON-Import oder ein bestätigter Reset ist möglich; es wird nichts automatisch gelöscht.
- **Speicher nicht verfügbar oder voll:** Ein sofort sichtbarer Hinweis erklärt, dass Änderungen nur im Arbeitsspeicher dieser Sitzung vorliegen. Nicht neu laden oder schließen, bevor der Sitzungsstand exportiert oder „Speichern erneut versuchen“ erfolgreich war.
- **Import/Reset schlägt beim Schreiben fehl:** Der bisherige Speicher- und Sitzungsstand bleibt erhalten, der Bestätigungsdialog bleibt geöffnet, es erscheint keine Erfolgsmeldung. Nach Beheben des Fehlers kann erneut bestätigt werden.
- **Ein anderer Tab ändert oder löscht den Stand:** Weitere automatische Schreibvorgänge werden blockiert. Beide Stände können separat gesichert werden; es gibt keine automatische Zusammenführung. Pro Gerät am besten nur einen aktiven Lern-Tab verwenden.
- **5.000 abgeschlossene Einheiten:** Weitere Trainings werden vor Überschreiten der bestehenden Ladegrenze blockiert. Vor einem bestätigten Reset den vollständigen Stand exportieren.

JSON-Exporte enthalten `progressVersion`. Inkompatible Importdateien ersetzen keinen vorhandenen Stand. Der Download „Gespeicherten Rohstand sichern“ erhält auch beschädigte Inhalte unverändert; er dient der Sicherung für eine spätere Prüfung.

### Speicherprüfungen ausführen

Zusätzlich zur Inhaltsprüfung und zur bestehenden Browser-Suite gibt es:

```sh
node tests/storage.cjs
```

Es gelten dieselben optionalen Playwright-/Chromium-Voraussetzungen und `MQ_BROWSER` wie bei `tests/browser.cjs`. Die Speicher-Suite stellt die lokalen Dateien direkt in isolierten Browserkontexten bereit, benötigt keinen laufenden Webserver, schreibt keine Testartefakte und berührt keinen echten Lernstand. Sie prüft zwölf Fallgruppen einschließlich Speicherfehlern, Versionskonflikten, Reset und wiederholter Abgabe.

Die vollständigen Ergebnisse und die Grenzen der Prüfung stehen in `QA.md`. Eine echte iPad-Safari-Abnahme wird durch Chromium-Tests weiterhin nicht ersetzt.
