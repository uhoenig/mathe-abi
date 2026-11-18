# Ausbau: Analyse und Kompetenzplan

Stand 18. November 2026, Branch develop. Oberfläche, Abenteuerkarte, lokale Speicherung und unbegrenztes Lernen bleiben erhalten. Die entfernte Fortschrittsseite wird nicht wieder eingeführt.

## Ausgangslage

159 vorhandene Aufgaben: 53 Analysis, 53 analytische Geometrie und 53 deaktivierte Stochastik. Die 106 aktiven Aufgaben verteilen sich mit zehn Aufgaben auf Deck 1–9 und 16 auf Deck 10. Von den aktiven Aufgaben sind 60 leicht, 40 mittel und sechs schwer. Echte Mehrschrittaufgaben stehen bisher fast nur im letzten Deck. Die bisherigen 90 Unterthemen sind ein Lernzielraster, keine einzeln gepflegten Kompetenznachweise. Der maschinenlesbare Ausgangsbefund einschließlich aller Originalfragen liegt in `data/question_baseline.json`.

Wesentliche Lücken: Bruchrechnung, negative/gebrochene Potenzen, Logarithmen und ihre Ableitung, trigonometrische Funktionen, kombinierte Ableitungen, Normalen, Flächen zwischen Graphen, verschiedene LGS-Lösungsfälle, Ebenenumformungen sowie Abstandsverfahren. Wiederholte Grundaufgaben werden bislang stärker belohnt als eine breite Kompetenzabdeckung: Die Freischaltung fordert 80 % aller Deckfragen und wächst mit jeder Poolerweiterung.

## Fachliche Grundlage und Grenzen

Als Arbeitsannahme gilt die Hamburger Studienstufe mit Analysis und dem Modul Analytische Geometrie. Der [Bildungsplan Mathematik 2022](https://www.hamburg.de/resource/blob/123074/23276415bdfb32ba8bb652f7c1998a4c/mathematik-gyo-2022-data.pdf) nennt diese Themen und unterscheidet das Anforderungsniveau. Die [Abiturrichtlinie, Anlage 27](https://dokumente.hamburg.de/resource/blob/123292/33b306f4845a852f93340513681e2025/27-mathematik-arl-2021-data.pdf), Seiten 12–13, verlangt in der mündlichen Prüfung vernetztes Erklären in zwei Inhaltsbereichen. Ein MC-Pool kann den freien Vortrag nicht ersetzen. Ein persönlicher Themenkatalog oder das genaue Kursniveau ist nicht bekannt. Auswahlthemen und Lücken werden ausdrücklich ausgewiesen; keine Behauptung vollständiger Lehrplanabdeckung.

## Kompetenz- und Deckplan

`data/competency_matrix.json` beschreibt 66 konkrete Kompetenzen, jeweils 33 pro Fachgebiet, mit Hauptthema, Unterthema, Lernziel, Voraussetzungen, Einführungsdeck und Pflichtstatus. Ziel sind je sechs ergänzende Aufgaben pro Kompetenz mit je zwei leichten, mittleren und schweren Varianten; insgesamt 396 neue und 502 aktive Aufgaben. Jeweils nur zwei Aufgaben dürfen dieselbe Struktur mit anderen Parametern verwenden. Schwierige Varianten müssen zusätzlich eine Umformung, einen Verfahrenswechsel oder eine konzeptionelle Prüfung verlangen.

Die zehn Decks führen schrittweise Grundlagen, Funktionen und Vektoren, Transformationen/Skalarprodukt, Ableitungen/Geraden, Regeln/Lagebeziehungen, weitere Funktionen/Ebenen, Kurven/Schnitte, Integrale/Abstände, Modelle/Raumgeometrie und schließlich vernetztes Begründen ein. Bereits vorhandene Frage-IDs und Deckbelegungen bleiben erhalten, damit gespeicherte aktive Runden gültig bleiben. Ergänzungen haben neue IDs.

Die nächste Station öffnet nach einem korrekten geeigneten Grundnachweis je expliziter Pflichtkompetenz. Es ist keine bestimmte Anzahl Varianten nötig. Vertiefungsaufgaben und optionale Kompetenzen blockieren nicht. Bereits offene Decks bleiben offen. Nachweise werden aus der Antwortgeschichte abgeleitet; Wiederholungstermine bleiben weiterhin pro Frage gespeichert. Eine neue Variante erbt keinen Wiederholungsstatus von einer anderen Aufgabe derselben Kompetenz.

## Prüfansatz

Symbolische Rechenaufgaben werden unabhängig mit SymPy gegen die richtige Antwort und beide Distraktoren geprüft, inklusive Definitionsbereichen. Geometrische Rechnungen verwenden exakte rationale Vektoren und Matrizen. Konzeptionelle Aufgaben brauchen einen dokumentierten Gegenbeispiel-/Begründungscheck; eine formale Strukturprüfung allein zählt nicht als mathematische Validierung. Der Abschlussbericht muss automatisierte Prüfungen, redaktionelle Sichtung und noch erforderliche unabhängige fachliche Kontrolle getrennt ausweisen.
