# Ausbau auf 502 Fragen – Abschlussbericht

Stand: 18. November 2026. Ausschließlich lokal auf develop; keine Commits, Pushes, Merges oder Änderungen an GitHub Pages. Das vorhandene Design mit Abenteuerkarte und LaTeX bleibt erhalten. Die Fortschrittsseite bleibt entfernt.

## Umfang

- 159 Originalfragen erhalten, davon 106 aktiv und 53 Stochastik weiterhin inaktiv. IDs, Originaltexte, Antwortmöglichkeiten und ihre Reihenfolge bleiben unverändert.
- 396 neue Aufgaben, insgesamt **502 aktiv**: **251 Analysis**, **251 analytische Geometrie**.
- **192 leichte**, **172 mittlere**, **138 schwere** Aufgaben. Die Schwierigkeit ist didaktisch eingeschätzt, nicht empirisch kalibriert.
- **66 konkrete Kompetenzen**, davon **62 Pflichtkompetenzen**. Jede Kompetenz hat mindestens zwei Aufgaben je Schwierigkeitsgrad. Das ist Abdeckung des deklarierten Rasters, kein Nachweis vollständiger Lehrplanabdeckung.

## Deckverteilung

| Deck | Name | Aufgaben | Leicht | Mittel | Schwer | Pflichtkompetenzen |
| --- | --- | ---: | ---: | ---: | ---: | ---: |
| 1 | Grundlagen | 52 | 20 | 18 | 14 | 7 |
| 2 | Funktionen & Vektoren | 40 | 16 | 14 | 10 | 5 |
| 3 | Transformationen & Winkel | 46 | 18 | 16 | 12 | 5 |
| 4 | Ableitungen & Geraden | 46 | 18 | 16 | 12 | 6 |
| 5 | Rechenregeln & Lagebeziehungen | 52 | 20 | 18 | 14 | 7 |
| 6 | Funktionen & Ebenen | 58 | 22 | 20 | 16 | 6 |
| 7 | Kurven & Schnitte | 52 | 20 | 18 | 14 | 7 |
| 8 | Integrale & Abstände | 58 | 22 | 20 | 16 | 8 |
| 9 | Modelle & Raumgeometrie | 52 | 20 | 18 | 14 | 7 |
| 10 | Vernetzen & Begründen | 46 | 16 | 14 | 16 | 4 |

Neue Konzepte folgen den Voraussetzungen in der Kompetenzmatrix. Bisherige Fragen behalten ihre alten Decks, damit bestehende Runden gültig bleiben. Die neuen IDs A101–A298 und G101–G298 sind stabil. Pro Kompetenz gibt es drei Aufgabenfamilien mit jeweils zwei Varianten; ähnliche Mathematik in unterschiedlichen Kontexten kann bewusst wiederkehren.

## Fachlicher Bezug und Lücken

Arbeitsannahme ist die Hamburger Studienstufe mit Analysis und dem Modul Analytische Geometrie. Die Themenauswahl orientiert sich am [Bildungsplan Mathematik 2022](https://www.hamburg.de/resource/blob/123074/23276415bdfb32ba8bb652f7c1998a4c/mathematik-gyo-2022-data.pdf) und an der [Abiturrichtlinie Mathematik](https://dokumente.hamburg.de/resource/blob/123292/33b306f4845a852f93340513681e2025/27-mathematik-arl-2021-data.pdf), Seiten 12–13. Die persönliche Themenabsprache und das Kursniveau sind unbekannt. Die Quellen begründen die Auswahl, keine Garantie für den individuellen Prüfungsumfang.

Offene Inhalte und Grenzen:

- Uneigentliche Integrale und vertiefte Integrationsverfahren sind noch nicht als eigene geprüfte Familien erfasst. Rotationsvolumen und Funktionsmittelwerte sind mit ersten Beispielen vertreten, aber nicht in voller struktureller Breite.
- Das alternative Modul Lineare Algebra mit Matrizen, Zustandsmodellen und Fixvektoren ist nicht der gewählte Schwerpunkt.
- Trigonometrie und spezielle kombinierte Regeln sind kursabhängige Ergänzungen. Fortgeschrittene Abstands- und Ebenenverfahren können über den individuellen Grundkursumfang hinausgehen.
- Skizzen, freier Vortrag und offene Beweise sind durch Multiple Choice nicht vollständig prüfbar. Eine richtige Auswahl ist kein Nachweis langfristiger Beherrschung.

## Mathematische Qualitätssicherung

**217 neue Aufgaben** werden mit SymPy 1.14.0 symbolisch beziehungsweise exakt gegen das gespeicherte Rechenmodell und beide Distraktoren geprüft. Bei Ableitungen und Stammfunktionen werden die Operationen erneut durchgeführt. Nichtkonstante Alternativen werden zusätzlich an regulären positiven Stellen unterschieden. Rationale Rechnungen und Vektoren bleiben exakt. Die angegebenen Bereiche werden berücksichtigt, insbesondere x > 0 bei Wurzel-/Logarithmusableitungen und Bogenmaß bei trigonometrischen Ableitungen.

**179 neue konzeptionelle Aufgaben** sind anhand ihrer ausgeführten Begründungen vom Aufgabenautor redaktionell gesichtet. Das ist keine formale Beweisvalidierung und keine unabhängige Freigabe durch eine Mathematiklehrkraft. **106 aktive Altfragen** bleiben hinsichtlich einer neuen vollständigen mathematischen Einzelprüfung ausdrücklich ausstehend; vorhandene Rechentests prüfen Teilmengen und erhaltene Lösungsschlüssel. Die 53 inaktiven Stochastikfragen bleiben erhalten.

[MANUAL_REVIEW.md](MANUAL_REVIEW.md) listet alle **285 aktiven Aufgaben** für eine unabhängige fachliche Nachprüfung. Jede Aufgabe hat einen Prüfstatus. Eine vollständige mathematische Validierung des gesamten Pools wird nicht behauptet.

Für den gesamten Pool geprüft: eindeutige IDs, vollständige Zuordnungen, gültige Kompetenzen und Voraussetzungen, drei verschiedene Antworttexte, vorhandene Lösungswege, geeignete Nachweise für jede Pflichtkompetenz sowie alle drei Schwierigkeitsgrade. Keine identischen Aufgabenstellungen. Normalisierte Ähnlichkeitsgruppen stehen zur Sichtung im JSON; Zahlenvarianten werden ausdrücklich als verwandte Aufgaben geführt. Bei der Erzeugung erkannte äquivalente Distraktoren wurden korrigiert, etwa die zufällige Gleichheit einer Umfangsformel mit einer Kreisfläche bei Radius 2.

## Freischaltung und Wiederholung

Die frühere 80-%-Fragenquote entfällt. Ein geeigneter leichter Nachweis je expliziter Pflichtkompetenz genügt. Mehrere Varianten derselben Kompetenz ersetzen keine fehlende andere Kompetenz. Optionale, mittlere und schwere Aufgaben blockieren nicht. Bereits offene Decks bleiben offen; XP führen nicht zur Freischaltung. Nachweise werden aus der Antwortgeschichte abgeleitet.

Nach den Grundnachweisen steht im vorhandenen Buttonstil „Runde abschließen“ zur Verfügung. So dürfen die restlichen Vertiefungsfragen unbeantwortet bleiben. Das nächste Deck öffnet beim Abschluss; der bestehende Dialog weist auf unbeantwortete Fragen hin. Diese kleine Bedienergänzung verhindert, dass der größere Pool faktisch alle schweren Aufgaben zur Voraussetzung macht. Auf schmalen Bildschirmen dürfen die Buttons umbrechen.

Spaced Repetition bleibt fragenbezogen: Eine neue Variante erbt weder Antworten noch Termine. Fällige Fragen aller offenen Decks kommen vor neuen Fragen des aktuellen Decks. Innerhalb der Warteschlangen wechseln sich Kompetenzen ab, und leichtere neue Varianten kommen zuerst. Intervalle 1/3/7/14/30/60 Tage, Fehler am Folgetag, unveränderte Termine bei frühen richtigen Zusatzwiederholungen und unbegrenztes Weiterüben bleiben erhalten.

## Datenmodell und Spielstände

Die Erweiterung ist additiv. Version 1, progressVersion 3, deckVersion 1 und der Speicherschlüssel bleiben erhalten. Alle bisherigen IDs, Antwortreihenfolgen und Deckzuordnungen gelten unverändert. Es ist keine automatische Migration oder Rücksetzung nötig. Eine schon laufende alte Zehn-Fragen-Runde wurde ausdrücklich getestet. Exporte enthalten weiterhin Historie, Entwurf, offene Decks, Einzeltermine und Darstellung. Eine ältere App ohne die Erweiterung muss Exporte mit unbekannten neuen IDs wie bisher geschützt ablehnen.

Neue Metadaten: Hauptthema, Unterthema, Kompetenz-IDs, Voraussetzungen, Deck, Freischalteignung, Variantenfamilie und Prüfstatus. Kompetenznachweis und Deckfreischaltung werden aus Antworten berechnet. Der Einzelkarten-Wiederholungsplan bleibt ein eigener Zustand.

## Tests

Erfolgreich ausgeführt:

- `python3 -B tests/content.py`: Originalfragen, Schlüssel, Struktur, unabhängige Rechenprüfungen und mathematische LaTeX-Strukturen.
- `python tools/check_expansion.py` mit SymPy: kompletter ausgelieferter Pool, Kompetenzabdeckung, Voraussetzungengraph, geeignete Pflichtnachweise und 217 Rechenmodelle mit Distraktoren.
- `node tests/review.cjs`: Kompetenzschwelle, fehlende Grundlagen, Varianten, schwere Aufgaben, XP-Unabhängigkeit, dauerhaft offene Decks, leere Decks und Wiederholungsintervalle.
- `node tests/competencies.cjs`: früher Abschluss nach Grundnachweisen, unbeantwortete Vertiefung, alter Stand beim Laden bytegleich, alte aktive Runde, Termine und Export.
- Workflow-, Speicher-, Tablet-/Mobil-, Theme-, allgemeine Browser- und LaTeX-Suites: Lernabläufe, Import/Export, Speicherfehler, Deckauswahl, Offline-Dateistart und Pages-Unterpfad.
- Erzeugte LaTeX-Abschnitte ohne Parsefehler; eine neue verschachtelte Formel samt Erklärung bei vier Bildschirmbreiten. Syntaxprüfungen und `git diff --check` erfolgreich.

Browsergrenze: Chromium/Brave mit Touch-Simulation, kein realer iPad-Safari-Test. Fachliche Schwierigkeit und mündliche Eignung benötigen eine unabhängige Lehrkraftsichtung.

## Wartung und Artefakte

Die zentrale Matrix steht in [data/competency_matrix.json](data/competency_matrix.json), neue redaktionelle Familien in `tools/expanded_bank.py`. `competencies.js`, `expanded-questions.js`, `solutions.js` und `math-content.js` werden reproduzierbar erzeugt. Ausgangsanalyse: [ANALYSIS.md](ANALYSIS.md) und `data/question_baseline.json`. Aktueller maschinenlesbarer Bericht: [question_coverage.json](question_coverage.json).

Entwicklungsabhängigkeiten stehen in `tools/requirements.txt`. Erzeugung: `python tools/build_questions.py`, anschließend `python tools/check_expansion.py`, jeweils in einer Python-Umgebung mit diesen Paketen. Die Website benötigt weiterhin keine Installation und kein Backend.

## Kompetenzmatrix

Die folgende Tabelle zeigt die Abdeckung des vereinbarten Rasters; die oben genannten Lehrplanlücken bleiben davon unberührt.

| ID | Fach | Konkrete Kompetenz | Deck | Leicht/Mittel/Schwer | Pflicht |
| --- | --- | --- | ---: | --- | --- |
| A01 | analysis | Brüche und Terme | 1 | 4/2/2 | Ja |
| A02 | analysis | Potenzgesetze | 1 | 3/2/2 | Ja |
| A03 | analysis | Wurzeln und rationale Exponenten | 1 | 3/3/2 | Ja |
| A04 | analysis | Logarithmen | 3 | 2/3/2 | Ja |
| A05 | analysis | Gleichungen | 1 | 2/3/2 | Ja |
| A06 | analysis | Definitions- und Wertebereich | 2 | 3/3/2 | Ja |
| A07 | analysis | Funktionsklassen | 2 | 6/4/2 | Ja |
| A08 | analysis | Sinus und Kosinus | 3 | 2/2/2 | Optional |
| A09 | analysis | Transformationen | 3 | 5/4/2 | Ja |
| A10 | analysis | Nullstellen und Symmetrie | 2 | 3/2/2 | Ja |
| A11 | analysis | Ableitungsbegriff | 4 | 4/2/2 | Ja |
| A12 | analysis | Potenz-, Faktor- und Summenregel | 4 | 3/4/2 | Ja |
| A13 | analysis | Wurzel- und Potenzableitungen | 4 | 2/2/2 | Ja |
| A14 | analysis | Produktregel | 5 | 4/2/2 | Ja |
| A15 | analysis | Quotientenregel | 5 | 3/3/2 | Ja |
| A16 | analysis | Kettenregel | 5 | 2/3/2 | Ja |
| A17 | analysis | Exponentialableitungen | 6 | 2/2/2 | Ja |
| A18 | analysis | Logarithmusableitungen | 6 | 2/2/2 | Ja |
| A19 | analysis | Trigonometrische Ableitungen | 6 | 2/2/2 | Optional |
| A20 | analysis | Kombinierte Regeln | 6 | 2/2/2 | Optional |
| A21 | analysis | Tangenten und Normalen | 7 | 2/2/2 | Ja |
| A22 | analysis | Monotonie | 7 | 3/2/2 | Ja |
| A23 | analysis | Extrema | 7 | 3/3/3 | Ja |
| A24 | analysis | Krümmung und Wenden | 7 | 2/3/2 | Ja |
| A25 | analysis | Kurvendiskussion und Parameter | 10 | 2/2/2 | Ja |
| A26 | analysis | Stammfunktionen | 8 | 4/2/2 | Ja |
| A27 | analysis | Bestimmte Integrale und Hauptsatz | 8 | 3/3/2 | Ja |
| A28 | analysis | Orientierte und geometrische Fläche | 8 | 2/2/3 | Ja |
| A29 | analysis | Flächen zwischen Graphen | 8 | 2/2/2 | Ja |
| A30 | analysis | Bestand und Änderungsrate | 9 | 2/3/2 | Ja |
| A31 | analysis | Wachstum und Zerfall | 9 | 5/3/2 | Ja |
| A32 | analysis | Optimierung | 10 | 3/3/3 | Ja |
| A33 | analysis | Modellierung und Interpretation | 9 | 4/4/2 | Ja |
| G01 | geometry | Koordinaten und Spiegelungen | 1 | 5/4/2 | Ja |
| G02 | geometry | Orts-, Verbindungsvektor und Mittelpunkt | 1 | 5/4/2 | Ja |
| G03 | geometry | Vektoroperationen | 1 | 5/4/2 | Ja |
| G04 | geometry | Längen und Punktabstände | 2 | 5/4/2 | Ja |
| G05 | geometry | Lineare Abhängigkeit | 2 | 2/2/2 | Ja |
| G06 | geometry | Berechnung und Deutung | 3 | 4/2/2 | Ja |
| G07 | geometry | Orthogonalität | 3 | 3/3/2 | Ja |
| G08 | geometry | Vektorwinkel | 3 | 2/3/2 | Ja |
| G09 | geometry | Parameterform | 4 | 4/3/2 | Ja |
| G10 | geometry | Punktprobe und Spurpunkte | 4 | 3/3/2 | Ja |
| G11 | geometry | Parallelität und Identität | 5 | 4/2/2 | Ja |
| G12 | geometry | Schnittpunkte | 5 | 3/3/2 | Ja |
| G13 | geometry | Windschiefe Geraden | 5 | 2/3/2 | Ja |
| G14 | geometry | Geradenwinkel | 5 | 2/2/2 | Ja |
| G15 | geometry | Lineare Gleichungssysteme | 4 | 2/2/2 | Ja |
| G16 | geometry | Parameterform | 6 | 4/2/2 | Ja |
| G17 | geometry | Normalenvektor und Normalenform | 6 | 3/2/2 | Ja |
| G18 | geometry | Koordinatenform und Umformung | 6 | 2/3/2 | Ja |
| G19 | geometry | Punktprobe und Spurpunkte | 6 | 2/4/2 | Ja |
| G20 | geometry | Gerade-Ebene-Schnitt | 7 | 3/2/2 | Ja |
| G21 | geometry | Gerade-Ebene-Lage | 7 | 3/2/2 | Ja |
| G22 | geometry | Zwei Ebenen | 7 | 3/3/2 | Ja |
| G23 | geometry | Ebenenwinkel | 8 | 2/2/2 | Ja |
| G24 | geometry | Gerade-Ebene-Winkel | 8 | 2/2/3 | Ja |
| G25 | geometry | Punkt-Gerade-Abstand | 8 | 2/2/2 | Ja |
| G26 | geometry | Punkt-Ebene-Abstand | 8 | 2/2/3 | Ja |
| G27 | geometry | Parallele Ebenen | 9 | 2/2/2 | Ja |
| G28 | geometry | Geradenabstände | 10 | 2/2/2 | Optional |
| G29 | geometry | Flächen | 9 | 3/2/2 | Ja |
| G30 | geometry | Volumen | 9 | 3/2/2 | Ja |
| G31 | geometry | Projektion und Spiegelung | 10 | 2/2/3 | Ja |
| G32 | geometry | Räumliche Modelle | 9 | 3/4/2 | Ja |
| G33 | geometry | Begründen und Fehleranalyse | 10 | 2/2/2 | Ja |
