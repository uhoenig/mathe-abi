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
