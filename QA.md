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

## Darstellung: Hell / Dunkel / System auf develop

Neu: `theme.js` mit frühem Laden im HTML-Kopf und `theme.css` mit semantischen Farbvariablen für beide Darstellungen. Der Umschalter steht oben auf allen Seiten und zusätzlich in den Einstellungen zur Verfügung. Die Einstellung nutzt einen separaten Speicherschlüssel und verändert weder Lernstand noch Fragen, XP-Regeln oder Fortschrittsversion. In der Druckregel wurde eine ungültige CSS-Deklaration auf Ebene von `@media print` korrigiert, damit der Seitenhintergrund tatsächlich weiß wird.

`tests/theme.cjs` prüft acht Fallgruppen:

1. System als Voreinstellung und unmittelbare Übernahme geänderter Gerätepräferenz.
2. Manuelle Auswahl nach Neuladen; manuelle Einstellung überstimmt die Gerätepräferenz; Browserleistenfarbe passt sich an.
3. Synchronisierung der beiden Bedienelemente; Lernstand bleibt beim Umschalten bytegleich; Reset und JSON-Import ändern die Darstellung nicht.
4. SVG, Kartenposition, Quizantwort und geöffnete Lösungsabschnitte bleiben beim Umschalten erhalten.
5. Theme-Änderungen werden in anderen Tabs übernommen, ohne einen Lernstandkonflikt auszulösen.
6. Unbekannte Einstellung fällt auf System zurück; nicht verfügbarer Speicher verhindert den Darstellungswechsel nicht und erzeugt einen Hinweis.
7. Alle sieben Hauptansichten in Hell und Dunkel bei 1440, 768, 390 und 320 Pixel Breite ohne Seitenüberlauf. Ausgewählte Text-, Button- und Kartenkontraste erreichen mindestens 4,5:1.
8. Richtige/falsche Antworten, Erklärungen, eroberte Länder und Dialoge bleiben lesbar; Druckansicht in beiden Darstellungen mit weißem Hintergrund und ohne Theme-Umschalter.

Die Kontrastprüfung misst die gewählten Stellen nach Abschluss laufender CSS-Farbübergänge. Sie ist kein vollständiges WCAG-Audit. Die Screenshots für helle und dunkle Ansichten wurden visuell geprüft. Getestet wurde in isolierten Chromium-Kontexten; ein echter iPad-Safari-Test ist weiterhin vor der Freigabe sinnvoll.

Die bestehenden Speicher- und iPad-Suites sowie die Inhaltsprüfungen bestehen auch mit den neuen Theme-Ressourcen. Die erlaubten Ressourcenlisten der isolierten Tests wurden um `theme.js` und `theme.css` ergänzt. Die bestehende Anwendungssuite wartet bei asynchronen Importfehlern jetzt ausdrücklich auf die Fehlermeldung, statt einen noch unveränderten vorherigen Meldungstext zu prüfen.

Keine neuen Laufzeitabhängigkeiten, keine Commits, Pushes oder Veröffentlichung im Rahmen dieser Implementierung. Die neuen Dateien müssen bei einer später freigegebenen Veröffentlichung zusammen mit `index.html` und den geänderten Dateien übernommen werden.

## Vereinfachter Lernablauf auf develop – 15. November 2026

Umgesetzt: Hauptnavigation Heute/Weltkarte/Fortschritt, direkter Fünf-Fragen-Einstieg oder Fortsetzen auf Heute, begründete Empfehlung aus vorhandenen Ergebnissen, kompakte Gebietskarten mit gezielter Themenwahl, Lernstandsübersicht, separate Weltkarte (`#world`), ruhiger Quizmodus mit einem Hauptbutton, aufklappbare Fragenübersicht/vorzeitige Abgabe, Kurzbericht und aufklappbare Nachhilfedetails. Die letzten drei Einheiten und der vollständige Export sind unter Fortschritt direkt erreichbar. Die vollständige Diagnose, Gebietstrainings, mündliche Übungen und Importe bleiben erreichbar. Bestehende Nebenrouten bleiben gültig.

Die Kennenlernrunde ist das vorhandene Skilltraining mit fünf unveränderten Fragen zu einem Grundlagenthema, keine Gesamtdiagnose. Empfehlungen sind einfache, nachvollziehbare Regeln; es wurde keine Wiederholungsplanung mit Zeitintervallen eingeführt. Kompetenzkriterien, Fragen, Lösungsschlüssel, XP-Regeln und `progressVersion: 1` bleiben unverändert. Bestehende Spielstände benötigen keinen Reset.

| Prüfung | Ergebnis |
| --- | --- |
| `python3 -B tests/content.py` | 150 Basisfragen, 62 unabhängige numerische Nachrechnungen, Kompetenzstruktur und neun Abschlussaufgaben erfolgreich |
| `node --check app.js` und geänderte Tests | Syntax gültig |
| `node tests/workflow.cjs` | Vier Fallgruppen erfolgreich: drei Navigationsziele; Startbutton bei 1440×1100, 768×1024, 390×844 und 320×700 vollständig im ersten Bildschirm; kein Seitenüberlauf oder abgeschnittener Einstieg; fünf Fragen, Sofortfeedback, Pause/Neuladen/Fortsetzen; Fokus auf neuer Frage; 4/5 ergeben unverändert 40 XP; Kurzbericht; Öffnen und Wiederherstellen von Druckdetails; Empfehlung; Themenwahl; Weltkarte; letzte Einheiten; vollständiger Export; optionale 30-Fragen-Diagnose |
| `node tests/storage.cjs` | Alle zwölf Speicher-Fallgruppen erfolgreich, einschließlich Ausfällen, Versionsschutz, Mehrfachabgabe, Import/Reset und Tabkonflikten |
| `node tests/ipad.cjs` | Alle neun Fenstergrößen und Bedienprüfungen erfolgreich; Karten-Scrollposition, Touch-Ziele und Entwurfswiederherstellung erhalten |
| `node tests/theme.cjs` | Alle acht Fallgruppen erfolgreich: System/Hell/Dunkel, Speichern, Tabs, Ausfälle, Kontraste, Feedback, Karten und Druck |
| `node tests/browser.cjs` | Vollständige Anwendungssuite erfolgreich: Diagnose, Kompetenzkriterien, gedeckelte XP, Lösungen, JSON, Druck, Smartphone, Level 60, Zitadelle und direkter Offline-Dateistart |
| `git diff --check` | Erfolgreich |

Die bestehenden Browserprüfungen wurden an die eigene Kartenroute, aufklappbare Details und die asynchrone Seitennavigation angepasst. Beim Start/Fortsetzen wurde ein redundanter zweiter Seitenaufbau entfernt. Die allgemeine Browser-Suite kann wie die übrigen isolierten Suites jetzt ohne zusätzlichen HTTP-Server laufen; `MQ_URL` bleibt optional möglich. Screenshots liegen als ignorierte Testartefakte unter `tests/workflow-*.png`; die mobile Startseite wurde visuell geprüft.

Getestet mit vorhandenem Node, Playwright und Brave/Chromium. Keine neuen App-Abhängigkeiten. Keine echte iPad-Safari-Abnahme und kein beobachteter Nutzungstest mit der Schülerin; die Erreichbarkeit des Startbuttons ist gemessen, eine Verbesserung des Lernerfolgs wurde nicht behauptet. Keine Commits, Pushes, Änderungen an main oder Veröffentlichungen. Die bereits vorhandenen uncommitteten Theme-Änderungen wurden weiterverwendet und erhalten.

## Lernstapel, Weiß nicht und Wiederholungsplanung – 15. November 2026

Diese Erweiterung ersetzt die vorherige statische Startempfehlung durch eine echte lokale Zeitplanung je Basisaufgabe. Die Startseite zeigt einen gemeinsamen Einstieg und drei fachbezogene Stapel mit den Zählern fällig/neu/später. Fällige Aufgaben kommen zuerst; pro Runde maximal fünf Aufgaben, insgesamt maximal fünf neue Aufgaben pro Berliner Kalendertag. Freies Üben bleibt über den aufklappbaren Bereich erreichbar. Aus der Seitenleiste wurden Motto-, Profil- und Abiturboxen entfernt; Logo, drei Hauptziele und Einstellungen bleiben. Weltkarte und bisherige Nebenrouten bleiben erhalten.

`review.js` rekonstruiert die Planung aus den abgeschlossenen Einheiten. Weiß nicht wird nach fünf Minuten, falsch/geraten nach zehn Minuten erneut fällig. Richtige, nicht als geraten markierte Antworten bei Fälligkeit führen zu Intervallen von 1/3/7/14/30/60/90 Tagen. Frühes Extraüben verlängert kein laufendes Intervall; Fehler setzen es zurück. Diese Werte sind einfache Beta-Vorgaben, keine Umsetzung oder Optimierung von FSRS. Die Abschlussaufgaben sind ausgenommen. Ein aktives Training hat Vorrang und bleibt fortsetzbar; Termine beginnen nach Abschluss. Die sichtbare Warteschlange wird bei geänderter Fälligkeit auch im offenen Tab aktualisiert.

Neue Antwortdaten: `-1` bedeutet Weiß nicht, `null` bleibt ausgelassen. Die freiwillige Markierung `guessed` unterscheidet ausdrücklich als geraten bezeichnete Antworten; unmarkiertes Raten lässt sich nicht erkennen. Antwort und Markierung sind nach der Antwort gesperrt. Weiß nicht entfernt eine vorher gesetzte Ratemarkierung. Nicht beantwortete Fragen verlieren ihre vorläufige Ratemarkierung bei Abgabe. Berichte und JSON-Exporte enthalten die getrennten Angaben. Die ursprüngliche XP-Formel bleibt erhalten; Weiß nicht bringt keine XP und zählt als tatsächlicher Versuch. Als geraten markierte aktuelle Antworten gelten nicht als sicher beim Kompetenzindikator, auch wenn die gewählte Option richtig war. Frühere unmarkierte Antworten behalten ihre Bewertung.

**Fortschrittsversion 2:** Stände mit Fortschrittsversion 1 oder ohne Versionsfeld werden ohne Reset übernommen. Einheiten, Antworten, laufende Trainings und mündliche Bewertungen bleiben erhalten; der nächste reguläre Schreibvorgang/Export nutzt Version 2. Beim bloßen Laden wird nichts überschrieben. Unbekannte Versionen bleiben geschützt. Neue Version-2-Exporte können in älteren App-Versionen nicht verwendet werden. Der Speichername `mathequest.v1` und `version: 1` bleiben unverändert. Die Planung ist aus den exportierten Daten rekonstruierbar; es gibt keine zweite, ungesicherte Speicherquelle.

| Prüfung | Ergebnis |
| --- | --- |
| `node tests/review.cjs` | Zehn Fallgruppen erfolgreich: Intervalle und exakte Zeitgrenzen, kurze Fehler-/Unwissen-/Rateintervalle, Zurücksetzen, frühes Üben, ausgelassene Fragen, globale Tagesgrenze, Berliner Tageswechsel, gemischte/fachbezogene Reihenfolge, maximal fünf Aufgaben, fällig vor neu, zeitlich sortierte Importdaten und identischer JSON-Roundtrip |
| `node tests/storage.cjs` | Alle 16 Fallgruppen erfolgreich; zusätzlich neue Antworttypen, Version-2-Roundtrip, Ratemarkierung vor Antwort und nach Neuladen, ungültige Metadaten/Antwortwerte, Schutz alter Versionsangaben, Kompetenz bei geratener richtiger Auswahl sowie Bereinigung übersprungener Ratemarkierungen bei Abgabe |
| `node tests/workflow.cjs` | Alle Fallgruppen erfolgreich: schlanke Navigation, drei Stapel, Einstieg bei vier Fenstergrößen im ersten Bildschirm, Weiß nicht/geraten und Feedback, Pause/Neuladen/Fortsetzen, Ergebnis mit getrennter Zählung, Tageslimit, Import und erneute fällige Aufgabe mit korrekten Wiederholungs-XP, vollständiger Export und optionale Diagnose |
| `node tests/browser.cjs` | Vollständige Anwendungssuite erfolgreich; Fragen, bestehende XP-Grenzen, Level 60, Kompetenzkriterien ohne Ratemarkierung, Lösungen, JSON, Druck, Smartphone, Weltkarte/Zitadelle und direkter Offline-Dateistart funktionieren weiterhin |
| `node tests/theme.cjs` | Alle acht Fallgruppen erfolgreich, einschließlich Hell/Dunkel/System, Tabs, Fehlern, Feedback, Karten, Kontrasten und Druck |
| `node tests/ipad.cjs` | Alle neun Fenstergrößen und Bedienprüfungen erfolgreich; echte iPad-Safari-Prüfung weiterhin ausstehend |
| `python3 -B tests/content.py` | Vollständig erfolgreich, einschließlich 62 numerischer Nachrechnungen und neun Abschlussaufgaben |
| Syntax und `git diff --check` | Erfolgreich |

Die isolierten Ressourcenlisten enthalten nun `review.js`. Geprüfte Screenshots zeigen die kürzere Startseite auf Desktop und Smartphone. Fragen, Lösungsschlüssel und Abschlussaufgaben wurden nicht verändert. Keine zusätzliche Laufzeitsoftware, kein Backend, keine Anmeldung. Keine Commits/Pushes, kein Wechsel von develop und keine Änderung oder Veröffentlichung der Schülerversion auf main. Die bereits uncommitteten Theme- und Workflow-Arbeiten bleiben erhalten.

### Vereinfachung: nur Weiß nicht als Zusatzantwort

„Ich rate gerade“ wurde auf Wunsch aus dem Quiz entfernt, einschließlich Änderungshandler und zugehöriger Styles. Neue Trainings erzeugen keine Ratemarkierungen; die normale Auswertung zeigt keinen leeren Ratezähler. Bereits gespeicherte historische Markierungen bleiben importierbar und lesbar. Vorläufige Markierungen in alten Entwürfen werden bei einer neuen Antwort entfernt, abgeschlossene Antworten bleiben erhalten. Weiß nicht und Wiederholungsplanung funktionieren unverändert. Speicherformat und Fortschrittsversion bleiben bei 2.

Geprüft: `node --check app.js`, `git diff --check`, alle Workflow-Prüfungen einschließlich fehlender Rateauswahl und alle 16 Speicher-Fallgruppen einschließlich alter Entwürfe und JSON-Roundtrip erfolgreich. Keine Commits, Pushes oder Veröffentlichung.

## Repository-, Security- und Privacy-Audit – 16. November 2026

### Umfang und Bestandsaufnahme

- Startzustand: `develop` bei `eb627f9`, Arbeitsbaum sauber; Prüfung ohne Branchwechsel und ohne Änderungen an main.
- Alle 23 versionierten Textdateien wurden in die statischen Prüfungen einbezogen: HTML, drei Laufzeitskripte plus Fragen/Lösungen, beide CSS-Dateien, zwei SVGs, sieben Testdateien, zwei Generatoren und Dokumentation/Ignore-Regeln. Kritische Datenflüsse in DOM-Ausgabe, JSON-Import, localStorage und Export wurden manuell geprüft.
- Musterscan auf gängige Token-/API-Key-Formate, private Schlüssel, Passwortzuweisungen, Zugangsdaten in URLs, E-Mail-Adressen, private Nutzerverzeichnisse und personenbezogene Feldbezeichnungen. Ergänzend Suche nach Telefonmustern, Tracking, externen Skripten und gefährlicher Codeauswertung.
- Historie: vier lokal vorhandene Commits, 39 eindeutige historische Dateiinhalte und die Pfade sämtlicher lokaler Commit-Bäume geprüft. Die öffentliche GitHub-Historie enthält sieben Commits; alle sieben Dateibäume entsprechen exakt einem der vier lokal geprüften Stände. Die zusätzlichen drei Commits sind Zusammenführungen ohne weitere Dateiinhalte. Beide öffentlichen Branches und die Köpfe der drei geschlossenen Pull Requests sind damit abgedeckt; keine Tags vorhanden. Sieben öffentliche Commit-Nachrichten wurden zusätzlich gescannt. Die zwei unterschiedlichen E-Mail-Adressen in den öffentlichen Autoren-/Committermetadaten sind GitHub-noreply-Adressen; Werte werden hier nicht wiedergegeben.
- Keine `.env`-, Schlüssel-, Export-, JSON-Spielstands- oder binären Artefaktdateien in den geprüften versionierten Pfaden oder ihrer erreichbaren Historie gefunden. `.env`-Inhalte wurden gemäß Arbeitsvorgabe nicht geöffnet; online wurde ausschließlich HEAD für den Pfad `.env` verwendet.

### Ergebnis und Einstufung

| Einstufung | Feststellung und verbleibende Maßnahmen |
| --- | --- |
| Kritisch / hoch | Keine bestätigten Zugangsdaten-Leaks, privaten Schlüssel, personenbezogenen Schülerdaten oder ausführbaren Import-XSS-Payloads gefunden. Das ist ein Prüfresultat, keine Garantie gegen beliebige unbekannte Schwachstellen oder nicht erkannte Datenmuster. |
| Mittel – Datenschutz, erwartete Architekturgrenze | Lernstände und JSON-Exporte enthalten Antworten, Verlauf und Zeitstempel ohne anwendungseigene Verschlüsselung oder Benutzerkonten. Personen mit Zugriff auf Browser/Dateien können sie einsehen. localStorage gehört zur Origin, nicht zum Projektpfad; andere Skripte derselben Origin könnten auf dieselben Daten zugreifen. Für gemeinsam genutzte Geräte getrennte Browserprofile und bewusstes Weitergeben der Exporte vorsehen. Es wurde keine automatische Übertragung der Lerndaten festgestellt. |
| Niedrig – Veröffentlichung / Wartung | Tests, Python-Generatoren sowie README und QA werden zusätzlich zur App öffentlich über Pages ausgeliefert. In den geprüften Inhalten keine vertraulichen Daten; die zusätzliche Bereitstellung ist unnötig, aber kein Nachweis einer Codeausführung auf dem Server. |
| Niedrig – reproduzierbare Robustheitslücke | `app.js`, Funktion `render()`: Bei der Hashroute `#__proto__` greift die Routenprüfung auf geerbte Objekteigenschaften zu. Reproduzierbar ist ein JavaScript-Fehler und eine gestörte Ansicht. Kein XSS, Datenabfluss oder Speicherverlust im Test. Spätere Korrektur mit expliziter Prüfung eigener Routeneinträge empfehlen; Produktivcode wurde nicht verändert. |
| Niedrig – zusätzliche Absicherung | Im geprüften HTML keine CSP und in den geprüften Pages-Antworten kein CSP-Header. `innerHTML`, `outerHTML` und `insertAdjacentHTML` bleiben sorgfältig zu pflegende Ausgabestellen. Importierte Titel werden mit `esc()` ausgegeben; IDs sind eingeschränkt und Fragen-IDs gegen vorhandene Einträge geprüft. Die getesteten Payloads wurden als Text behandelt oder abgewiesen. CSP wäre zusätzliche Absicherung und benötigt eine separat freigegebene Code-/Deploymentänderung. |
| Niedrig – Datenschutzkommunikation / Wartung | Die frühere README-Aussage „keine Datenübertragung“ wurde präzisiert: App-Lerndaten bleiben lokal, beim Hosting entstehen Verbindungsdaten. Der Produkttext in den Einstellungen enthält weiterhin eine pauschale Aussage zu Netzwerkanfragen; dessen Präzisierung steht wegen des Änderungsverbots für Produktivcode aus. Maschinenabhängige Installationspfade in Testwerkzeugen sind Portabilitätsthemen; keine privaten Nutzerverzeichnisse gefunden. |
| Unbedenklich im Projektzweck | Öffentliche Fragen, Lösungen, lokale SVG-Grafiken, synthetische Testzustände und erwartete öffentliche Git-Autorenmetadaten. Die Lösungssammlung ist absichtlich öffentlich erreichbar. Die pädagogische Freigabe und die lokal bearbeitbaren Spielstände bieten keine Prüfungs- oder Manipulationssicherheit; für eine Lern-Beta ist das eine bekannte Grenze. |

### Tatsächlich ausgeführte Sicherheitsprüfungen

- Isolierter Chromium-/Brave-Browser mit lokalen App-Dateien und ausschließlich synthetischen Lernständen: Import erst nach Bestätigung; HTML-/Eventhandler-Payloads in importierten Titeln auf Startseite, Verlauf, Bericht und im Quiz ohne HTML-Ausführung; schädliche Einheiten-IDs, unbekannte Fragen-IDs und unbekannte Versionen abgewiesen; zusätzliche `__proto__`-/`constructor`-JSON-Felder ohne globale Prototype-Pollution; Dateien über 5 MiB vor dem Parsen abgewiesen.
- In diesem geprüften Ablauf ausschließlich App-Ressourcen derselben Test-Origin und GET-Anfragen beobachtet, keine Drittanbieteranfragen oder Daten-POSTs. Keine externen Skripte, Tracker, Fonts oder Netzwerkschnittstellen im Laufzeitcode gefunden. Dies ist kein Mitschnitt eines echten Schülergeräts.
- Die Hashrouten-Robustheitslücke wurde separat reproduziert und dokumentiert, nicht behoben.
- `node tests/storage.cjs`: alle 16 Fallgruppen erfolgreich, einschließlich Versionsschutz, Reset, Import, Speicherfehlern, Tabkonflikten und alten Antwortmetadaten.
- `node tests/review.cjs`: alle zehn Fallgruppen erfolgreich. `python3 -B tests/content.py`: vollständig erfolgreich, einschließlich Struktur-/Ressourcenprüfung und unabhängiger Rechenprüfungen.
- Ignore-Regeln mit repräsentativen Konfigurations-, Schlüssel-, Export- und Artefaktpfaden geprüft. Normale JSON-Testfixtures bleiben möglich; keine bestehende versionierte Datei wird durch die neuen Regeln verdeckt. `git diff --check` erfolgreich.

### GitHub Pages: überprüfter öffentlicher Zustand

Die öffentliche Website ist unter https://uhoenig.github.io/mathe-abi/ erreichbar. Die GitHub-Umgebung `github-pages` erlaubt über ihre benutzerdefinierte Branch-Regel ausschließlich `main`. Der jüngste erfolgreiche Pages-Lauf veröffentlicht `528777a5` von main; dessen Dateibaum ist identisch mit dem geprüften develop-Stand `eb627f9`. Die Bytes von HTML, app.js, review.js, theme.js, einem Test und einem Generator wurden live mit dem lokalen Commit verglichen und stimmen überein. Kein Fetch war dafür erforderlich.

HEAD-Prüfung aller 23 versionierten Pfade und sieben zusätzlicher Kandidaten:

- HTTP 200: elf App-/Assetdateien, README, QA, alle sieben Dateien unter `tests/` und beide Python-Dateien unter `tools/`.
- HTTP 404: `.gitignore`, `tests/roundtrip.json`, `tests/desktop.png`, `tests/report.pdf`, `.git/config`, `.env`, `node_modules/` und der zusätzliche Dokumentationskandidat `SECURITY-AUDIT.md`.
- Die direkt administrierte Pages-API antwortet ohne Authentifizierung mit 404; die exakte Source-Folder-Einstellung wurde deshalb nicht in den Kontoeinstellungen eingesehen. Die tatsächliche Root-Auslieferung, erfolgreiche main-Deployments und main-Beschränkung der Umgebung sind öffentlich belegt.

Empfehlung: Bei einer später freigegebenen Deploymentänderung nur `index.html`, die benötigten JS-/CSS-Dateien und `assets/` in ein Pages-Artefakt kopieren. Ein GitHub-Actions-Workflow mit Trigger ausschließlich auf main, eingeschränkten Berechtigungen und der bestehenden main-beschränkten Umgebung vermeidet doppelte App-Quellen. Alternativ unterstützt branchbasiertes Pages einen dedizierten `/docs`-Ordner; dessen zusätzliche Kopien müssten zuverlässig gepflegt werden. Ein beliebiger `/dist`-Ordner ist kein direkt auswählbarer branchbasierter Pages-Quellordner, kann aber als Actions-Artefakt dienen. Hier wurde keine dieser Varianten umgesetzt.

Diese Trennung verkleinert die Website, macht Dateien im öffentlichen Repository aber nicht privat. `.gitignore` verhindert weder die Veröffentlichung bereits versionierter Dateien noch die Erreichbarkeit früherer Commits. Es gab keinen Anlass für eine Historienumschreibung oder Zugangsdatenrotation.

### Durchgeführte Änderungen und Grenzen

README von 229 auf 41 Zeilen gekürzt, mit sechs gewünschten Abschnitten, bestätigten Funktionen, aktuellem Pages-Link, Sicherungshinweisen und Hosting-Datenschutzhinweis. Alte Entwicklungsanweisungen, Testdetails und redundante Beschreibungen entfernt. `.gitignore` um lokale Konfigurationen/Schlüssel, App-Exporte, Sicherungen und Testartefakte ergänzt. Bestehende Test- und Entwicklungsdokumentation wegen ihres bekannten Zwecks erhalten; dieser Audit wurde hier ergänzt. Keine Produktivdatei geändert, keine Datei gelöscht und keine Git-Historie verändert.

Nicht geprüft: Inhalte von `.env`-Dateien, nicht versionierte private Benutzerdateien, nicht erreichbare/gelöschte Git-Objekte, fremde Forks/Clones/Caches, vertrauliche Repository-Einstellungen und Secrets, echte Endgeräte/Safari, Browsererweiterungen oder andere Anwendungen auf derselben Origin. Kein vollständiges Fuzzing, kein automatischer Gitleaks-/TruffleHog-Lauf und keine rechtliche Datenschutzprüfung. Die vollständigen allgemeinen UI-/iPad-/Theme-Suites wurden für die reinen Dokumentationsänderungen nicht erneut ausgeführt.

Einschätzung: Für die öffentliche Nutzung als Lern-Beta aus technischer Sicht geeignet, unter den beschriebenen Grenzen lokaler Speicherung und ohne Anspruch auf sichere Prüfungsbewertung. Empfohlene nächste Arbeiten sind die kleine Routenabsicherung, ein Veröffentlichungsartefakt mit ausschließlich App-Dateien und präzisere Hosting-Texte; jeweils separat freigeben. README-/Ignore-/Auditänderungen werden nach ausdrücklicher Freigabe auf develop committet und gepusht. Eine Übernahme nach main oder eine Veröffentlichung auf Pages gehört nicht zu diesem Audit.

Quellen: [GitHub Pages – Datenerfassung](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages#data-collection), [Pages-Veröffentlichungsquellen](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site), [GitHub – Ignore-Regeln](https://docs.github.com/en/get-started/git-basics/ignoring-files), [Entfernung vertraulicher Daten](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository), [MDN – innerHTML](https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML), [MDN – localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage). Öffentliche Nachweise: [Pages-Lauf](https://github.com/uhoenig/mathe-abi/actions/runs/43731461076), [Branch-Regeln der Pages-Umgebung](https://api.github.com/repos/uhoenig/mathe-abi/environments/github-pages/deployment-branch-policies).
