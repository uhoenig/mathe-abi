# Decks und Kompetenzarchitektur

Stand: 18. November 2026, develop. Der Ausbau und alle Prüfgrenzen sind in [COVERAGE.md](COVERAGE.md) beschrieben. Die ursprüngliche Analyse steht in [ANALYSIS.md](ANALYSIS.md).

## Zentrale Quellen

- `data/competency_matrix.json`: 66 hierarchisch geordnete Kompetenzen mit Lernziel, Voraussetzungen, Einführungsdeck, Pflichtstatus und Quellenannahmen.
- `tools/expanded_bank.py`: 396 redaktionelle Varianten in drei Schwierigkeitsgraden. IDs A101–A298 und G101–G298 bleiben dauerhaft an ihre Aufgabe gebunden.
- `competencies.js`: daraus erzeugte Metadaten und Deckbelegung für den Browser.
- `expanded-questions.js`: neue Aufgaben ohne Lösungen.
- `questions.js`, `final-questions.js`: alle 159 bisherigen Aufgaben mit unveränderten Texten, IDs und Antwortreihenfolgen.
- `solutions.js`: separat geladene Lösungen für alle 555 erhaltenen und ergänzten Aufgaben.
- `math-content.js`: erzeugte LaTeX-Darstellung; lokale KaTeX-Dateien, keine externen Laufzeitdienste.

Die 502 aktiven Fragen enthalten je 251 Aufgaben aus Analysis und analytischer Geometrie. Die 53 Stochastikfragen bleiben erhalten und inaktiv. Aufgaben besitzen Hauptthema, Unterthema, Kompetenz-ID, Schwierigkeit, Deck, Freischalteignung, Voraussetzungen, Variantenfamilie und Prüfstatus. Der korrekte Antwortindex bleibt im vorhandenen separaten Lösungsschlüssel.

## Decks

| Deck | Konzepte | Fragen |
| --- | --- | ---: |
| 1 | Rechengrundlagen, Koordinaten, Vektoroperationen | 52 |
| 2 | Funktionen, Definitionsbereiche, Längen, Abhängigkeit | 40 |
| 3 | Transformationen, Logarithmen, Skalarprodukt, Winkel | 46 |
| 4 | Ableitungsbegriff, Grundregeln, Geraden, LGS | 46 |
| 5 | Ableitungsregeln und Geradenlagen | 52 |
| 6 | Weitere Funktionen und Ebenendarstellungen | 58 |
| 7 | Tangenten, Monotonie, Extrema, Krümmung, Schnitte | 52 |
| 8 | Integrale, Flächen, Winkel und Abstände | 58 |
| 9 | Wachstum, Bestände, Modellierung und Raumgeometrie | 52 |
| 10 | Optimierung, Parameter, Projektion und Begründungen | 46 |

Alle Decks enthalten leichte, mittlere und schwere Aufgaben. Die Reihenfolge führt Begriffe ein und ist keine bloße Schwierigkeitstreppe. Bestehende Fragen behalten aus Kompatibilitätsgründen ihre alten Decks; einzelne frühere Vorgriffe bleiben daher möglich.

## Kompetenzbasierte Freischaltung

Die alte Quote von 80 % aller Fragen ist ersetzt. Jedes Deck benennt explizite Pflichtkompetenzen. Je ein korrekt gelöster geeigneter leichter Nachweis pro Pflichtkompetenz öffnet das folgende Deck. Varianten derselben Kompetenz werden nicht als mehrere Kompetenzen gezählt. Vertiefungen und optionale Kompetenzen blockieren nicht. XP führen nicht zur Freischaltung. Früher ausdrücklich als geraten markierte Antworten zählen nicht als Grundnachweis.

Bereits offene Decks bleiben dauerhaft offen. Zusätzliche Aufgaben erhöhen keine absolute Freischaltschwelle. Leere Decks öffnen keine Folge. Nachweise werden in `journey.js` aus der Antwortgeschichte hergeleitet; die Wiederholungsstufe einer Frage ist dafür keine Ersatzgröße.

Nach den Grundnachweisen kann eine laufende Runde im bisherigen Buttonstil vorzeitig abgeschlossen werden. Unbeantwortete Vertiefungsfragen bleiben ohne Wertung. Die Freischaltung erfolgt beim Abschluss; Antworten, Verlauf und Termine werden dabei konsistent gespeichert.

## Wiederholungsplanung

`review.js` plant weiterhin 1/3/7/14/30/60 Tage, Fehler und Weiß nicht am Folgetag. Ein frühes richtiges Zusatztraining verlängert kein noch laufendes Intervall. Fällige Fragen aller offenen Decks kommen vor neuen Fragen des aktuellen Decks. Neue Varianten erben keinen Status. Kompetenzen werden in der Warteschlange abwechselnd angeboten, bei neuen Aufgaben beginnen leichtere Varianten. Tages- und Rundenlimits bleiben entfernt.

## Speicherung und Rückwärtskompatibilität

`mathequest.v1`, version 1, progressVersion 3 und deckVersion 1 bleiben unverändert. Die Erweiterung ist additiv: alte IDs, Antwortreihenfolgen, Deckzuordnungen und Termine werden nicht umgedeutet. Auch alte laufende Runden bleiben gültig. Deshalb ist keine neue Migration oder automatische Rücksetzung nötig. Der alte Schutz vor unbekannten IDs und Datenversionen bleibt erhalten.

Version 1/2 wird weiterhin erst nach bestätigter Übernahme in Version 3 geschrieben. Originalbackup, archivierter Entwurf und alte Stochastikdaten bleiben erhalten. JSON-Export/-Import umfasst den gesamten Lernstand. Alte App-Stände ohne die neuen IDs können neue Exporte nicht lesen und sollen sie geschützt ablehnen.

## Qualitätsstatus und Grenzen

217 neue Aufgaben werden symbolisch/exakt geprüft, 179 neue konzeptionelle Aufgaben redaktionell. Eine unabhängige fachliche Freigabe steht aus. Der aktive Altbestand hat keine neue vollständige Einzelvalidierung; vorhandene Rechentests prüfen Teilmengen. Die Liste in [MANUAL_REVIEW.md](MANUAL_REVIEW.md) und die Statusfelder in [question_coverage.json](question_coverage.json) machen diese Grenze explizit.

Keine vollständige Lehrplanabdeckung oder freie mündliche Kompetenzbewertung. Kursniveau und persönliche Prüfungsabsprache sind nicht bekannt. Keine Frameworks, Datenbanken, Konten oder Änderung der Pages-Veröffentlichung. Oberfläche und Abenteuerkarte bleiben erhalten; die Fortschrittsseite bleibt entfernt.

## Reproduktion

Die Website braucht keinen Build und keine Python-Installation. Nur zur redaktionellen Neuerzeugung und Prüfung werden die Pakete aus `tools/requirements.txt` benötigt:

```sh
python tools/build_questions.py
python tools/check_expansion.py
python3 -B tests/content.py
node tests/review.cjs
node tests/competencies.cjs
```

Die weiteren Browserprüfungen stehen unter `tests/`. Entwicklung erfolgt auf develop; Commit, Push und Merge erfolgen nur nach ausdrücklicher Freigabe.
