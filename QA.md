# Prüfumfang – 15. November 2026

## Daten und Fachinhalte

Alle 150 Aufgaben wurden bei der Erstellung rechnerisch bzw. anhand ihrer mathematischen Definitionen und Voraussetzungen durchgesehen. Geprüft wurden Antwort, beide Distraktoren, Erklärung, Lösungsweg und mündlicher Impuls. Die Strukturprüfung erfasst alle 150 Aufgaben und deren Zuordnung zu 90 Teilkompetenzen. Genau fünf Aufgaben gehören zu jedem Kompetenzbereich; jeder Bereich enthält drei abgedeckte Teilkompetenzen.

`tests/content.py` prüft zusätzlich 62 arithmetische Aufgaben unabhängig numerisch mit exakten Brüchen bzw. ganzzahligen Wurzeln. Bei jeder davon muss genau eine Antwort dem nachgerechneten Ergebnis entsprechen. Weitere Prüfungen behandeln Potenz-, Summen-, Produkt-, Quotienten- und Kettenregel, Orthogonalität, Nullstellen und konsistente Wahrscheinlichkeiten. Bei konzeptionellen Fragen erfolgt die Eindeutigkeitsprüfung redaktionell; ein automatischer Parser kann keine vollständige didaktische Begutachtung leisten. Eine unabhängige fachliche Abnahme durch eine Mathematiklehrkraft steht aus.

## Browserprüfung

Automatisiert in einem separaten Chromium-basierten Brave-Browser geprüft:

- Dashboard und drei Fachgebietskarten bei 1440 Pixel Breite.
- Diagnose mit genau 30 Fragen und drei Optionen pro Frage; genau zehn Fragen je Gebiet.
- Navigation vorwärts, rückwärts und per Fragenübersicht.
- Auswahl und aktuelle Position nach Neuladen wiederhergestellt.
- Kein Lösungsskript vor der ersten Antwort. Nach der Antwort: Richtig/Falsch, markierte korrekte Option und Kurzerklärung in allen drei Modi. Bei falscher Auswahl bleibt die erste Antwort auch nach Neuladen gespeichert und gesperrt. Unbeantwortete Fragen zeigen keine Lösung.
- Bestätigung mit Liste offener Fragen vor unvollständiger Abgabe.
- Vollständig richtige Diagnose: 30/30, 100 %, 300 XP, Level 7.
- Falsche und unbeantwortete Antworten: 0 Punkte und 0 XP.
- Kompetenzbaum, Teilkompetenzen und Trennung von XP und Kompetenz.
- Keine sichere Kompetenz nach einer einzelnen Antwort; sichere Kompetenz erst bei genügend verschiedenen Aufgaben und Wiederholung.
- Wiederholung desselben Skills: je Frage höchstens 20 XP, später 0 zusätzliche XP.
- Gesamtstand mit 3.000 XP: Levelobergrenze 60, voller XP-Balken.
- Lernmodus nur nach Bestätigung; im laufenden Quiz gesperrt.
- 150 aufklappbare Lösungen, Textsuche, Fachfilter und separat gespeicherte mündliche Einschätzung.
- Tatsächlicher JSON-Download, Zurücksetzen, Import, Antwortverlauf und mündliche Bewertung identisch wiederhergestellt.
- Ungültiges JSON und unbekannte Aufgaben-IDs abgelehnt, bestehender Stand erhalten.
- Druckansicht als A4-PDF erzeugt.
- Alle sieben Hauptansichten bei 390 Pixel Breite ohne horizontalen Seitenüberlauf; mobiles Menü und Quiz bedienbar.
- Direkter `file://`-Start bei deaktiviertem Netzwerk, einschließlich Quizabgabe und nachgeladenem Lösungsschlüssel.
- Keine JavaScript-Laufzeitfehler in den geprüften Abläufen.

Die erzeugten Screenshots und der PDF-Bericht liegen nach einem Testlauf in `tests/`. Die Oberfläche wurde anhand der Desktop- und Smartphone-Screenshots visuell geprüft. Andere Browser und echte iOS-/Android-Geräte wurden in dieser Umgebung nicht separat getestet; die Smartphone-Prüfung nutzt ein verkleinertes Chromium-Fenster.

## Umsetzung der Phasen

1. Projektstruktur, Kompetenzlandkarte, 150 Aufgaben und getrennte Lösungen vorhanden.
2. Alle drei Trainingsmodi und Ergebnisbericht vorhanden.
3. XP, Level, Anti-Farming, Erfolge und Kompetenzdiagnose vorhanden.
4. Lernmodus, Lehrkraftbewertung, JSON-Import/-Export und Druck vorhanden.
5. Daten-, Rechen-, Bedienungs-, Speicher-, Offline- und responsive Prüfungen durchgeführt.

## Weltkarte und Abschlussgebiet

30 Kompetenzländer und eine Zitadelle sind als interaktive SVG-Karte eingebaut. Eroberungen werden aus den bestehenden Kompetenzdaten berechnet; XP und fachliche Beherrschung bleiben getrennt. Alle normalen Länder können ungeachtet der Richtlevel gezielt trainiert werden. Die Zitadelle verlangt Level 60 und 30 sichere Kompetenzbereiche. Sie zählt erst bei mindestens 8/9 richtigen Erstantworten in einer abgeschlossenen Runde als erobert. Ihre neun zusätzlichen Aufgaben wurden unabhängig numerisch bzw. mit den betreffenden Formeln nachgerechnet; die Prüfungen sind in `tests/content.py` enthalten.

Automatisiert bestätigt: 31 auswählbare Gebiete und Tastaturbedienung; Zitadelle zu Beginn gesperrt; 30 sichere Länder und Level 60 schalten sie frei; 7/9 reichen nicht, genau 8/9 erobern sie. Keine zusätzlichen Zitadellen-XP. Die abgeschlossenen Abschlussrunden und alle 31 Eroberungen werden nach JSON-Import wiederhergestellt. Desktop- und Smartphone-Kartendarstellung wurden visuell anhand der erzeugten Screenshots geprüft.

## Phase A – Speicherabsicherung auf develop (15. November 2026)

Ausgangslage: sauberer Branch `main`, Commit `72a7ae9def7b0618640886a15c37d552d7609d45`. Lokal wurde `develop` angelegt und ausgecheckt. Keine Commits, Pushes, Änderungen an `main` oder Remote-Konfiguration vorgenommen. Fragen, Lösungsschlüssel, XP-Regeln und Kompetenzregeln sind unverändert.

### Erfolgreich ausgeführte Prüfungen

| Prüfung | Ergebnis |
| --- | --- |
| `python3 -B tests/content.py` | Alle Inhalts-, Struktur-, Rechen- und Offline-Ressourcenprüfungen erfolgreich |
| `node --check app.js` | JavaScript-Syntax gültig |
| `node --check tests/storage.cjs` | JavaScript-Syntax gültig |
| `node tests/storage.cjs` | Alle zwölf Fallgruppen erfolgreich, keine JavaScript-Laufzeitfehler |
| `node tests/browser.cjs` | Vollständige bestehende Browser-Suite erfolgreich, einschließlich Quiz, Sofortfeedback, XP-Grenze, Level 60, Eroberungen, JSON, Druck, Smartphone und direktem Offline-Dateistart |

Die Node-Prüfungen nutzten das in dieser Umgebung vorhandene Node unter `/Applications/ChatGPT.app/Contents/Resources/cua_node/bin/node`; Playwright und ein separater, unsichtbarer Brave-/Chromium-Browser waren bereits vorhanden. Es wurden keine neuen Laufzeitabhängigkeiten für MatheQuest installiert. Die Speicher-Suite erzeugt keine Dateien; die bestehende Browser-Suite aktualisiert nur ihre bereits ignorierten Testartefakte.

### Zwölf Speicher-Fallgruppen

1. Automatisches Speichern von Trainingsstart, Antwort und Position; Wiederherstellung nach Neuladen; doppelte Abgabe erzeugt nur eine Einheit mit derselben Trainingskennung und einmaligen XP.
2. Alter kompatibler Stand ohne `progressVersion`: Antworten, mündliche Bewertung und laufendes Training bleiben erhalten; die Version wird beim nächsten Speichern ergänzt.
3. Inkompatible Version: kein Überschreiben, unveränderter Rohdaten-Download, Reset-Abbruch ohne Wirkung und Reset erst nach Bestätigung.
4. Beschädigtes JSON: unverändert erhalten und sicherbar; Wiederherstellung durch bestätigten gültigen Import.
5. Ungültige Versionen (`null`, Zeichenkette, Boolean, 0 und unbekannte Version): gesperrt, ohne Datenverlust.
6. JSON-Import: Versionsprüfung, Abbruch und Bestätigung; wiederholter Import erhöht keine XP; doppelte Einheiten-IDs werden abgewiesen.
7. Schreibfehler: sofortiger Hinweis, Antworten im Sitzungs-Export vorhanden, erfolgreiche Wiederholung und Wiederherstellung nach Neuladen.
8. Schreibfehler nach Quizabgabe: auch nach doppeltem Klick und erneutem Speichern genau eine Einheit und einmalige XP.
9. Fehlgeschlagener Import/Reset: weder gespeicherter noch aktueller Sitzungsstand wird ersetzt; keine Erfolgsmeldung, Dialog bleibt geöffnet.
10. Lesefehler: verständlicher Hinweis; später wieder lesbarer Altstand wird nicht versehentlich überschrieben.
11. Mehrere Tabs: Änderungen werden per Speicherereignis erkannt; auch bei absichtlich unterdrücktem Ereignis verhindert der Vergleich mit dem zuletzt gelesenen Stand ein veraltetes Überschreiben.
12. 5.000 Einheiten: weiteres Training wird vor Überschreiten der bestehenden Ladegrenze blockiert.

### Veröffentlichung unverändert

Öffentliche GitHub-API, ausschließlich lesend geprüft:

- `environments/github-pages`: `custom_branch_policies: true`, aktive Regel vom Typ `branch_policy`.
- `environments/github-pages/deployment-branch-policies`: genau eine Regel, `name: main`, `type: branch`.
- Letzter Pages-Workflow: `pages build and deployment`, Branch `main`, Commit `72a7ae9def7b0618640886a15c37d552d7609d45`, Status `completed`, Ergebnis `success`.
- Remote-Branch `main` zeigt unverändert auf denselben Commit.

Damit ist die aktive Pages-Umgebung weiterhin auf `main` beschränkt. Es wurde weder ein Workflow noch eine Veröffentlichung hinzugefügt. Der direkte Pages-Einstellungsendpunkt `/pages` war ohne Authentifizierung nicht lesbar; die aktive Branch-Beschränkung und der erfolgreiche Deployment-Branch wurden über die oben genannten öffentlichen Endpunkte unabhängig bestätigt.

### Bewusste Grenzen

Keine automatischen inhaltlichen Migrationen, kein Backend und kein Geräte-Merge. `PROGRESS_VERSION` muss bei inkompatiblen Aufgaben-/Regeländerungen bewusst erhöht werden. Browserdaten können weiterhin außerhalb der Anwendung gelöscht werden; JSON-Sicherungen bleiben wichtig. Die Tests liefen in Chromium, nicht auf einem echten iPad. Die Änderungen wurden noch nicht auf `main` übernommen und stehen der Schülerin deshalb noch nicht zur Verfügung.

## iPad-Optimierung auf develop

Geändert wurden Kartenbedienung, Tablet-Navigation und Touch-Darstellung. Es wurden keine Fragen, Lösungen, XP-/Kompetenzregeln oder Speicher-Versionen geändert. Die folgenden Prüfungen wurden vor Commit und Push durchgeführt. Eine Veröffentlichung auf main ist nicht Bestandteil dieser Anpassung.

Erfolgreich geprüft:

| Prüfung | Ergebnis |
| --- | --- |
| `node tests/ipad.cjs` | Neun Fenstergrößen für Hochformat, Querformat und schmale Ansichten: 768×1024, 820×1180, 834×1194, 1024×768, 1180×820, 1194×834, 744×1133, 520×1024 und 390×844 |
| Kartenlesbarkeit und Touch-Ziele | Levelschrift mindestens ca. 13 px; Kartenländer mindestens ca. 64×55 px; geprüfte Menü-, Quiz- und Tab-Elemente mindestens 44×44 px |
| Kartenauswahl | Scrollposition und tatsächliche SVG-/Scrollcontainer-Knoten bleiben bei Klick und Tastaturauswahl erhalten |
| Länderliste | Alle 31 Gebiete wählbar; Auswahl, Informationsfeld und Kartenmarkierung synchron; Zentrierung und Auswahl nach Größenwechsel geprüft |
| Navigation | Öffnen/Schließen, passender zugänglicher Buttonname, Escape mit Fokus-Rückgabe, Schließen nach Seitenwechsel und Klick außerhalb |
| Quiz und Speicherung | Sofortfeedback, Navigation, gespeicherte Antwort nach Neuladen und unveränderte `progressVersion: 1` bestätigt |
| Hauptansichten | Alle sieben Ansichten im Tablet-Hochformat ohne horizontalen Seitenüberlauf oder JavaScript-Fehler |
| `node tests/storage.cjs` | Alle zwölf Speicher-Fallgruppen weiterhin erfolgreich |
| `node tests/browser.cjs` | Vollständige bestehende Anwendungstests weiterhin erfolgreich, einschließlich Smartphone, JSON und Offline-Dateistart |
| `python3 -B tests/content.py` | Inhalts-, Rechen-, Struktur- und Ressourcenprüfungen erfolgreich |

Die neuen iPad-Tests liefen mit Touch-Unterstützung in einem isolierten Brave-/Chromium-Browser. Playwright-WebKit ist in dieser Umgebung nicht installiert; es wurde nichts dafür nachinstalliert. Die erzeugten Tablet-Screenshots wurden visuell kontrolliert. Diese Prüfung ist keine echte iPad-Safari-Abnahme.

Vor einer Freigabe auf dem echten iPad kurz prüfen: Karte seitlich verschieben und ein Land antippen; Länderliste und Zentrierung bedienen; Hoch-/Querformat wechseln; Menü bedienen; Quizantwort geben, Seite neu laden und den JSON-Export über die Dateien-App speichern. Für diesen UI-Stand ist kein Spielstandreset vorgesehen.
