"""Reproduzierbarer, redaktioneller Aufgabenpool. Keine Laufzeit-Abhängigkeit."""
import json
from final_questions import ROWS as FINAL_ROWS
from pathlib import Path
ROOT = Path(__file__).resolve().parent.parent
AREAS = [
('analysis','Analysis','Funktionen verstehen. Veränderungen beschreiben.',[
('Algebraische Grundlagen',['Terme vereinfachen','Potenz- und Wurzelgesetze','Gleichungen lösen']),
('Funktionen',['Funktionswerte','Definitions- und Wertebereich','Graphen interpretieren']),
('Funktionstypen',['Lineare und quadratische Funktionen','Potenz- und Wurzelfunktionen','Exponential- und Logarithmusfunktionen']),
('Funktionstransformationen',['Verschiebungen','Streckungen und Spiegelungen','Parameterinterpretation']),
('Ableitungsgrundlagen',['Änderungsrate und Tangente','Potenzregel','Summen- und Faktorregel']),
('Erweiterte Ableitungen',['Produktregel','Quotientenregel','Kettenregel']),
('Kurvendiskussion',['Nullstellen und Monotonie','Extrempunkte','Wendepunkte']),
('Integralrechnung',['Stammfunktionen','Bestimmte Integrale','Flächen und Bestandsänderungen']),
('Exponentialmodelle',['Wachstums- und Zerfallsprozesse','Parameter bestimmen','Modelle interpretieren']),
('Anwendungen und Modellierung',['Sachaufgaben','Optimierungsprobleme','Ergebnisse beurteilen'])]),
('geometry','Geometrie','Räume entdecken. Zusammenhänge erkennen.',[
('Koordinatensysteme',['Koordinaten ablesen','Punkte im Raum','Koordinatenebenen']),
('Punkte und Vektoren',['Orts- und Verbindungsvektoren','Gleiche Vektoren','Mittelpunkte']),
('Vektoroperationen',['Vektoren addieren','Skalarmultiplikation','Linearkombinationen']),
('Längen und Abstände',['Vektorbetrag','Abstand zweier Punkte','Abstand zu Ebenen']),
('Skalarprodukt und Winkel',['Skalarprodukt berechnen','Orthogonalität','Winkel bestimmen']),
('Geradengleichungen',['Stütz- und Richtungsvektor','Punktprobe','Geraden aufstellen']),
('Lagebeziehungen von Geraden',['Parallelität und Identität','Schnittpunkte','Windschiefe Geraden']),
('Ebenengleichungen',['Parameterform','Normalen- und Koordinatenform','Punktprobe in Ebenen']),
('Lagebeziehungen und Schnittpunkte',['Gerade und Ebene','Schnitt zweier Ebenen','Spurpunkte']),
('Geometrische Modellierung',['Geometrische Figuren','Modelle im Raum','Ergebnisse im Kontext'])]),
('probability','Stochastik','Zufall verstehen. Sicher entscheiden.',[
('Zufallsexperimente und Ereignisse',['Ergebnismengen','Ereignisse beschreiben','Gegenereignisse']),
('Grundlegende Wahrscheinlichkeiten',['Laplace-Wahrscheinlichkeit','Additionsregel','Komplementregel']),
('Baumdiagramme und Pfadregeln',['Pfadwahrscheinlichkeiten','Pfade addieren','Ziehen ohne Zurücklegen']),
('Kombinatorik',['Anordnungen','Auswahlen ohne Reihenfolge','Auswahlen mit Reihenfolge']),
('Bedingte Wahrscheinlichkeit',['Bedingungen verstehen','Vierfeldertafeln','Satz von Bayes']),
('Stochastische Unabhängigkeit',['Unabhängigkeit prüfen','Unabhängige Wiederholungen','Abhängigkeit erkennen']),
('Zufallsvariablen',['Zufallsvariablen definieren','Verteilungen lesen','Wahrscheinlichkeiten bestimmen']),
('Erwartungswert und Streuung',['Erwartungswert berechnen','Varianz und Standardabweichung','Faire Spiele']),
('Binomialverteilung',['Bernoulli-Ketten','Binomialwahrscheinlichkeiten','Erwartungswert und Streuung']),
('Hypothesentests und Interpretation',['Hypothesen formulieren','Ablehnungsbereich','Fehler und Signifikanz'])])]
# Pro Bereich fünf verschiedene Konzepte; je Eintrag: Teilkompetenz, Frage,
# richtige Antwort, zwei Distraktoren, Lösungsweg, mündlicher Impuls, Denkfehler.
A = [
[
[0,'Vereinfache 3x + 2x − 4.','5x − 4','5x − 2','6x − 4','Fasse die gleichartigen Terme zusammen: 3x + 2x = 5x.|Die Konstante −4 bleibt erhalten.','Warum darfst du x-Terme und Konstanten nicht einfach zusammenzählen?','Ungleichartige Terme zusammenfassen.'],
[0,'Löse die Klammer auf: 2(x + 3).','2x + 6','2x + 3','x + 6','Multipliziere beide Summanden mit 2.|Es ergibt sich 2x + 6.','Erkläre das Distributivgesetz an diesem Beispiel.','Nur den ersten Summanden multiplizieren.'],
[1,'Für x ≠ 0 gilt: x³ · x² = …','x⁵','x⁶','2x⁵','Bei gleicher Basis werden beim Multiplizieren die Exponenten addiert.|3 + 2 = 5.','Wie verändert sich die Regel beim Dividieren?','Exponenten multiplizieren statt addieren.'],
[1,'Wie groß ist √49?','7','±7','24,5','Die Quadratwurzel bezeichnet die nichtnegative Zahl, deren Quadrat 49 ist.|7² = 49, also √49 = 7.','Was ist der Unterschied zu den Lösungen von x² = 49?','Wurzelwert mit beiden Gleichungslösungen verwechseln.'],
[2,'Löse 3x − 6 = 9.','x = 5','x = 1','x = 3','Addiere 6: 3x = 15.|Teile durch 3: x = 5.','Wie prüfst du deine Lösung?','Die Konstante mit falschem Vorzeichen verschieben.']
],[
[0,'Für f(x) = x² − 1 ist f(3) = …','8','5','9','Setze 3 für x ein: 3² − 1.|9 − 1 = 8.','Was beschreiben x und f(x) im Graphen?','Das Quadrat oder die Konstante vergessen.'],
[0,'Für f(x) = 2x + 1 ist f(−2) = …','−3','−5','5','Setze −2 ein: 2 · (−2) + 1.|−4 + 1 = −3.','Warum sind Klammern beim Einsetzen negativer Zahlen hilfreich?','Vorzeichen beim Einsetzen verlieren.'],
[1,'Was ist der größtmögliche reelle Definitionsbereich von f(x) = 1/(x − 2)?','ℝ ohne 2','Alle reellen Zahlen','Nur x > 2','Ein Nenner darf nicht 0 sein.|x − 2 = 0 gilt genau für x = 2; dieser Wert ist ausgeschlossen.','Warum ist ein negativer Nenner erlaubt?','Negative Nenner mit verbotenen Nennern verwechseln.'],
[1,'Welchen Wertebereich hat f(x) = x² für x ∈ ℝ?','[0; ∞)','ℝ','(0; ∞)','Quadrate reeller Zahlen sind nichtnegativ.|0 wird bei x = 0 angenommen; jeder positive Wert ist möglich.','Woran erkennst du den Wertebereich im Graphen?','Den Wert 0 ausschließen.'],
[2,'Ein Graph steigt von links nach rechts. Was bedeutet das auf diesem Abschnitt?','Größere x-Werte haben größere Funktionswerte.','Alle Funktionswerte sind positiv.','Der Graph muss eine Gerade sein.','Steigen beschreibt die Reihenfolge der Funktionswerte.|Auch unterhalb der x-Achse und bei gekrümmten Graphen ist das möglich.','Kann ein Graph steigen und trotzdem negative Werte haben?','Steigung und Vorzeichen der Funktionswerte verwechseln.']
],[
[0,'Welche Steigung hat f(x) = −2x + 5?','−2','5','2','Die Form einer linearen Funktion ist mx + b.|Der Koeffizient m = −2 ist die Steigung.','Was sagt die 5 über den Graphen aus?','Achsenabschnitt und Steigung vertauschen.'],
[0,'Wo liegt der Scheitelpunkt von f(x) = (x − 2)² + 3?','S(2|3)','S(−2|3)','S(2|−3)','Die Scheitelform lautet (x − h)² + k.|Lies h = 2 und k = 3 ab.','Warum steht in der Klammer ein Minuszeichen?','Das Vorzeichen der horizontalen Verschiebung falsch lesen.'],
[1,'Wie groß ist f(9) für f(x) = √x?','3','81','±3','Gesucht ist die nichtnegative Quadratwurzel von 9.|3² = 9, daher f(9) = 3.','Warum ist √x für negative x nicht reell definiert?','Die Wurzelfunktion mit dem Quadrieren verwechseln.'],
[1,'Welche Funktion ist für x > 0 streng fallend?','f(x) = 1/x','f(x) = x²','f(x) = √x','Für positive x wird 1/x bei größerem Nenner kleiner.|x² und √x wachsen dagegen auf x > 0.','Wie kannst du die Aussage mit einer Ableitung begründen?','Eigenschaften verschiedener Potenzfunktionen gleichsetzen.'],
[2,'Löse 2ˣ = 8 über ℝ.','x = 3','x = 4','x = 6','Schreibe 8 = 2³.|Bei gleicher Basis 2 müssen die Exponenten übereinstimmen.','Wie würdest du 2ˣ = 10 lösen?','Basis und Exponent verwechseln.']
],[
[0,'Wie entsteht g(x) = f(x) + 3 aus dem Graphen von f?','3 Einheiten nach oben','3 Einheiten nach rechts','Streckung um Faktor 3','Die Addition erfolgt außerhalb von f.|Jeder y-Wert wird um 3 größer.','Wie sähe eine Verschiebung nach unten aus?','Vertikale und horizontale Verschiebung verwechseln.'],
[0,'Wie entsteht g(x) = f(x − 2)?','2 Einheiten nach rechts','2 Einheiten nach links','2 Einheiten nach unten','Der alte Funktionswert an der Stelle u wird bei x = u + 2 erreicht.|Der Graph verschiebt sich nach rechts.','Veranschauliche das mit f(x) = x².','Das Vorzeichen in der Klammer direkt übernehmen.'],
[1,'Was bewirkt g(x) = −f(x)?','Spiegelung an der x-Achse','Spiegelung an der y-Achse','Verschiebung um 1 nach unten','Jeder Funktionswert wechselt sein Vorzeichen.|Aus (x|y) wird (x|−y).','Welche Formel beschreibt die Spiegelung an der y-Achse?','−f(x) und f(−x) verwechseln.'],
[1,'Was bewirkt g(x) = 2f(x)?','Alle y-Werte werden verdoppelt.','Alle x-Werte werden verdoppelt.','Alle y-Werte werden um 2 erhöht.','Der Faktor 2 steht vor dem Funktionswert.|Jeder Punkt (x|y) wird zu (x|2y).','Was passiert mit den Nullstellen?','Multiplikation und Addition verwechseln.'],
[2,'Was bestimmt c in f(x) = x² + c?','Die vertikale Lage des Scheitelpunkts','Die Öffnungsweite der Parabel','Die horizontale Lage des Scheitelpunkts','Der quadratische Term bleibt unverändert.|Der Scheitelpunkt liegt bei (0|c).','Welche Änderung würde die Parabel schmaler machen?','Verschiebungs- und Streckungsparameter verwechseln.']
],[
[0,'Was beschreibt f′(a) geometrisch?','Die Tangentensteigung bei x = a','Die Höhe f(a)','Den Flächeninhalt unter f','Die Ableitung beschreibt die lokale Änderungsrate.|Geometrisch ist das die Steigung der Tangente an der Stelle a.','Worin unterscheiden sich Sekanten- und Tangentensteigung?','Funktionswert und Ableitungswert verwechseln.'],
[0,'f(1) = 2 und f(3) = 8. Wie groß ist die mittlere Änderungsrate auf [1; 3]?','3','6','4','Bilde die Wertdifferenz 8 − 2 = 6.|Teile durch die Stellenänderung 3 − 1 = 2: 6/2 = 3.','Warum ist das im Allgemeinen keine Tangentensteigung?','Die Änderung nicht durch die Intervalllänge teilen.'],
[1,'Was ist die Ableitung von f(x) = x⁵?','5x⁴','x⁴','5x⁵','Verwende (xⁿ)′ = n·xⁿ⁻¹.|Mit n = 5 ergibt sich 5x⁴.','Erkläre die beiden Änderungen am Potenzterm.','Den Exponenten nicht um 1 vermindern.'],
[1,'Was ist die Ableitung von f(x) = x?','1','0','x','Schreibe x als x¹.|Die Potenzregel liefert 1·x⁰ = 1.','Wie passt die Ableitung zur Steigung des Graphen?','Eine lineare Funktion als Konstante behandeln.'],
[2,'Leite f(x) = 3x² + 4x − 7 ab.','6x + 4','6x + 4 − 7','3x + 4','Leite die Summanden einzeln ab: (3x²)′ = 6x und (4x)′ = 4.|Die Konstante −7 hat die Ableitung 0.','Warum verschwindet eine additive Konstante?','Konstanten beim Ableiten stehen lassen.']
],[
[0,'Welche Formel ist die Produktregel?','(uv)′ = u′v + uv′','(uv)′ = u′v′','(uv)′ = u′ + v′','In jedem Summanden wird genau einer der Faktoren abgeleitet.|Addiere u′v und uv′.','Warum funktioniert das bloße Multiplizieren der Ableitungen nicht?','Beide Faktoren gleichzeitig ableiten.'],
[0,'Leite f(x) = x·eˣ ab.','eˣ + x·eˣ','eˣ','x·eˣ','Setze u = x und v = eˣ, also u′ = 1 und v′ = eˣ.|Die Produktregel ergibt eˣ + x·eˣ.','Wie könntest du das Ergebnis ausklammern?','Einen Summanden der Produktregel vergessen.'],
[1,'Welche Formel gilt für (u/v)′, wenn v ≠ 0?','(u′v − uv′)/v²','(u′v + uv′)/v²','u′/v′','Bilde im Zähler u′v − uv′.|Teile durch das Quadrat des ursprünglichen Nenners.','Welche Rolle spielt die Reihenfolge im Zähler?','Das Minuszeichen durch ein Plus ersetzen.'],
[1,'Leite f(x) = x/(x + 1) für x ≠ −1 ab.','1/(x + 1)²','−1/(x + 1)²','1','Die Quotientenregel ergibt ((x + 1) − x)/(x + 1)².|Im Zähler bleibt 1.','Kannst du die Funktion vorher umformen?','Die Ableitungen von Zähler und Nenner dividieren.'],
[2,'Leite f(x) = (2x + 1)³ ab.','6(2x + 1)²','3(2x + 1)²','6(2x + 1)³','Die äußere Ableitung ergibt 3(2x + 1)².|Multipliziere mit der inneren Ableitung 2.','Warum braucht man den zusätzlichen Faktor 2?','Die innere Ableitung vergessen.']
],[
[0,'Welche reellen Nullstellen hat f(x) = x² − 4?','x = −2 und x = 2','Nur x = 2','x = −4 und x = 4','Setze x² − 4 = 0, also x² = 4.|Beide Zahlen −2 und 2 erfüllen die Gleichung.','Wie kannst du den Term faktorisieren?','Die negative Lösung beim Wurzelziehen verlieren.'],
[0,'Auf einem Intervall gilt überall f′(x) > 0. Was folgt?','f ist dort streng monoton steigend.','f ist dort überall positiv.','f hat dort einen Hochpunkt.','Eine positive Ableitung bedeutet positive Tangentensteigung.|Daraus folgt strenges Steigen auf dem Intervall.','Kann f dabei unterhalb der x-Achse verlaufen?','Vorzeichen von f und f′ verwechseln.'],
[1,'Für f(x) = x² gilt f′(0) = 0 und f″(0) = 2. Was liegt bei x = 0 vor?','Ein Tiefpunkt','Ein Hochpunkt','Ein Wendepunkt','f′(0) = 0 liefert eine stationäre Stelle.|f″(0) > 0 bestätigt einen Tiefpunkt.','Was sagt das Vorzeichen der zweiten Ableitung?','Positive Krümmung als Hochpunkt deuten.'],
[1,'Reicht f′(a) = 0 allein zum Nachweis einer Extremstelle?','Nein, zum Beispiel bei f(x) = x³ und a = 0.','Ja, immer.','Ja, wenn zusätzlich f(a) = 0 ist.','Bei x³ ist die Ableitung an 0 gleich 0.|Die Funktion steigt aber auf beiden Seiten; es gibt kein Extremum.','Welches zusätzliche Kriterium könntest du verwenden?','Notwendige und hinreichende Bedingungen gleichsetzen.'],
[2,'Wo hat f(x) = x³ einen Wendepunkt?','W(0|0)','W(1|1)','Es gibt keinen Wendepunkt.','f″(x) = 6x ist bei 0 gleich 0 und wechselt dort das Vorzeichen.|Mit f(0) = 0 folgt W(0|0).','Warum ist f″(a) = 0 allein im Allgemeinen nicht genug?','Eine Nullstelle der zweiten Ableitung ohne Vorzeichenprüfung verwenden.']
],[
[0,'Welche Funktion ist eine Stammfunktion von f(x) = 2x?','F(x) = x²','F(x) = 2','F(x) = 2x²','Eine Stammfunktion hat als Ableitung f.|Die Ableitung von x² ist 2x.','Warum gibt es unendlich viele Stammfunktionen?','Ableiten und Integrieren verwechseln.'],
[0,'Welche Familie umfasst alle Stammfunktionen von f(x) = 3?','F(x) = 3x + C','F(x) = 3 + C','F(x) = x³ + C','Eine Stammfunktion der Konstanten 3 ist 3x.|Additive Konstanten verschwinden beim Ableiten.','Wie bestimmt man C mit einem gegebenen Punkt?','Die Integrationskonstante vergessen.'],
[1,'Berechne ∫₀² x dx.','2','4','1','Verwende F(x) = x²/2.|F(2) − F(0) = 4/2 − 0 = 2.','Wie lässt sich das Ergebnis geometrisch begründen?','Die obere Grenze direkt in den Integranden einsetzen.'],
[1,'Berechne ∫₁³ 2 dx.','4','6','2','Die konstante Höhe ist 2, die Intervalllänge ist 3 − 1 = 2.|Der Integralwert beträgt 2·2 = 4.','Warum muss man die untere Grenze berücksichtigen?','Nur die obere Grenze verwenden.'],
[2,'Eine Rate beträgt konstant −3 Liter pro Minute. Wie ändert sich der Bestand in 4 Minuten?','Er nimmt um 12 Liter ab.','Er nimmt um 12 Liter zu.','Er nimmt um 7 Liter ab.','Multipliziere die Rate mit der Zeit: −3·4 = −12 Liter.|Das Minuszeichen bedeutet eine Bestandsabnahme.','Wie unterscheidet sich eine Bestandsänderung vom Endbestand?','Rate und Bestand oder Vorzeichen verwechseln.']
],[
[0,'Ein Bestand wächst pro Jahr um 5 %. Welcher jährliche Faktor gehört dazu?','1,05','0,05','5','Der alte Bestand entspricht 100 %.|Mit 5 % Zuwachs ergeben sich 105 % = 1,05.','Wie sähe der Faktor bei 5 % Abnahme aus?','Prozentsatz und Wachstumsfaktor gleichsetzen.'],
[0,'Welcher Faktor beschreibt eine Abnahme um 20 % pro Schritt?','0,8','0,2','1,2','Nach der Abnahme bleiben 80 % des Bestands.|80 % entsprechen dem Faktor 0,8.','Warum bleibt der Bestand bei diesem Modell positiv?','Den abgenommenen Anteil als verbleibenden Anteil verwenden.'],
[1,'B(t) = 100·1,1ᵗ. Welcher Anfangsbestand liegt vor?','100','110','1,1','Der Anfangszeitpunkt ist t = 0.|Weil 1,1⁰ = 1, gilt B(0) = 100.','Welche Bedeutung hat der Faktor 1,1?','Anfangswert und Wert nach einem Schritt verwechseln.'],
[1,'B(t) = B₀·qᵗ und B(1) = 2B₀ bei B₀ > 0. Wie groß ist q?','2','0,5','1','Setze t = 1: B₀·q = 2B₀.|Teile durch den positiven Anfangsbestand B₀.','Welche zusätzliche Annahme erlaubt die Prognose für t = 2?','Verdopplung mit 100 % des alten Bestands verwechseln.'],
[2,'Ein Modell sagt langfristig unbegrenztes exponentielles Wachstum einer Bakterienkultur voraus. Wie ist das zu bewerten?','Ressourcenknappheit kann die langfristige Gültigkeit begrenzen.','Das Modell gilt deshalb zwingend für alle Zeiten.','Der Anfangsbestand muss negativ sein.','Exponentielle Modelle nehmen einen konstanten relativen Zuwachs an.|Begrenzte Nährstoffe können diese Annahme verletzen.','Welches Modell könnte eine Sättigung berücksichtigen?','Eine Modellprognose als unbegrenzt gültige Realität behandeln.']
],[
[0,'Ein Taxi kostet 4 € Grundpreis und 2 € je Kilometer. Welche Funktion beschreibt den Preis für x ≥ 0?','K(x) = 4 + 2x','K(x) = 4x + 2','K(x) = 6x','Der Grundpreis fällt unabhängig von der Strecke an.|Addiere 2x Euro für x Kilometer.','Welche Bedeutung haben Steigung und Achsenabschnitt?','Festen und variablen Kostenanteil vertauschen.'],
[0,'s(t) = 3t beschreibt eine Strecke in Metern bei Zeit t in Sekunden. Was bedeutet die 3?','Eine konstante Geschwindigkeit von 3 m/s','Eine Anfangsstrecke von 3 m','Eine Beschleunigung von 3 m/s²','Die Strecke wächst je Sekunde um 3 Meter.|Der Koeffizient hat die Einheit Meter pro Sekunde.','Wie würde eine Anfangsstrecke von 5 m in der Formel erscheinen?','Die Einheit der Änderungsrate falsch zuordnen.'],
[1,'Ein Rechteck hat Umfang 20 cm. Eine Seite ist x cm lang. Wie lautet die Fläche?','A(x) = x(10 − x)','A(x) = x(20 − x)','A(x) = 20x','Aus 2x + 2y = 20 folgt y = 10 − x.|Mit A = xy folgt A(x) = x(10 − x), 0 < x < 10.','Warum muss man den Definitionsbereich einschränken?','Den halben Umfang mit dem ganzen Umfang verwechseln.'],
[1,'Für A(x) = x(10 − x), 0 < x < 10, wo liegt das Maximum?','Bei x = 5','Bei x = 10','Bei x = 0','A′(x) = 10 − 2x ist bei x = 5 gleich 0.|A″(x) = −2 < 0 bestätigt das Maximum.','Welche Form hat das optimale Rechteck?','Randwerte ohne geometrische Prüfung wählen.'],
[2,'Ein Modell liefert für die Anzahl von Personen den Wert −2. Was ist sinnvoll?','Definitionsbereich und Modellannahmen prüfen.','−2 Personen als reale Anzahl übernehmen.','Das Minuszeichen ohne Begründung entfernen.','Eine reale Personenanzahl kann nicht negativ sein.|Das Ergebnis weist auf eine unpassende Anwendung oder Modellgrenze hin.','Wann sind negative Werte in einem Sachkontext sinnvoll?','Ein Rechenergebnis ungeprüft in den Kontext übernehmen.']
]]
G = [
[
[0,'Welche x-Koordinate hat P(2|−3|4)?','2','−3','4','Die Koordinaten stehen in der Reihenfolge x, y, z.|Die erste Koordinate ist 2.','Wie liest du die y- und z-Koordinate ab?','Die Reihenfolge der Koordinaten vertauschen.'],
[0,'Wo liegt der Punkt P(0|0|0)?','Im Ursprung','Auf keinem Koordinatensystem','Eine Einheit über dem Ursprung','Alle drei Koordinaten sind 0.|Das ist der gemeinsame Ursprung der Achsen.','Welche Koordinaten haben Punkte auf der z-Achse?','Die Rolle des Ursprungs verwechseln.'],
[1,'Welcher Punkt liegt auf der z-Achse?','(0|0|5)','(5|0|0)','(0|5|0)','Auf der z-Achse sind x und y gleich 0.|Nur die z-Koordinate darf beliebig sein.','Liegt der Ursprung auch auf der z-Achse?','Die Achsen vertauschen.'],
[1,'Welcher Punkt entsteht aus P(2|3|4) durch Spiegelung an der xy-Ebene?','(2|3|−4)','(−2|−3|4)','(−2|−3|−4)','Die xy-Ebene hat die Gleichung z = 0.|Bei der Spiegelung ändert nur die z-Koordinate das Vorzeichen.','Wie spiegelt man an der yz-Ebene?','Alle Vorzeichen ändern statt nur der senkrechten Koordinate.'],
[2,'Welche Gleichung beschreibt die xy-Ebene?','z = 0','x = 0','y = 0','In der xy-Ebene können x und y frei gewählt werden.|Die Höhe z ist überall 0.','Was beschreibt die Gleichung x = 0?','Die Namen der Ebene als Nullkoordinaten lesen.']
],[
[0,'A(1|2), B(4|6): Welcher Vektor ist AB?','(3|4)','(5|8)','(−3|−4)','Ein Verbindungsvektor ist Zielpunkt minus Startpunkt.|B − A = (4 − 1|6 − 2) = (3|4).','Wie verändert sich der Vektor, wenn du A und B vertauschst?','Startpunkt minus Zielpunkt rechnen.'],
[0,'Welcher Ortsvektor gehört zum Punkt P(2|−1|3)?','(2|−1|3)','(−2|1|−3)','(0|0|0)','Der Ortsvektor führt vom Ursprung zu P.|P − O hat dieselben Koordinaten wie P.','Was unterscheidet einen Ortsvektor von einem beliebigen Verbindungsvektor?','Den Gegenvektor als Ortsvektor wählen.'],
[1,'Wann sind zwei freie Vektoren gleich?','Wenn alle entsprechenden Komponenten übereinstimmen.','Wenn sie nur dieselbe Länge haben.','Wenn sie nur parallel sind.','Gleiche Komponenten bedeuten gleiche Richtung und gleiche Länge.|Der Angriffspunkt eines freien Vektors ist unerheblich.','Sind entgegengesetzte Vektoren gleicher Länge gleich?','Gleiche Länge als einziges Kriterium ansehen.'],
[1,'Welche Vektoren sind gleich?','(2|−1) und (2|−1)','(2|−1) und (−2|1)','(2|−1) und (4|−2)','Vergleiche die Komponenten an derselben Position.|Nur im ersten Paar sind beide Komponenten jeweils gleich.','Welcher Zusammenhang besteht im dritten Paar?','Ein Vielfaches mit demselben Vektor verwechseln.'],
[2,'Was ist der Mittelpunkt von A(0|2) und B(4|6)?','M(2|4)','M(4|8)','M(2|2)','Bilde die Mittelwerte der entsprechenden Koordinaten.|M = ((0 + 4)/2|(2 + 6)/2) = (2|4).','Warum liegt der Mittelpunkt auf der Verbindungsstrecke?','Die Koordinatensummen nicht halbieren.']
],[
[0,'Berechne (1|2) + (3|−1).','(4|1)','(3|−2)','(4|3)','Addiere komponentenweise.|1 + 3 = 4 und 2 + (−1) = 1.','Wie zeigt man die Addition mit einem Pfeildiagramm?','Vektoren komponentenweise multiplizieren.'],
[0,'Berechne (3|4) − (1|6).','(2|−2)','(4|10)','(2|2)','Subtrahiere die jeweiligen Komponenten.|3 − 1 = 2 und 4 − 6 = −2.','Wie hängt Subtraktion mit Addition des Gegenvektors zusammen?','Das Vorzeichen der zweiten Differenz verlieren.'],
[1,'Berechne 3·(2|−1|0).','(6|−3|0)','(5|2|3)','(6|−1|0)','Multipliziere jede Komponente mit 3.|Das ergibt (6|−3|0).','Wie verändert sich die Länge des Vektors?','Nur die erste Komponente multiplizieren.'],
[1,'Was bewirkt Multiplikation eines von 0 verschiedenen Vektors mit −1?','Gleiche Länge, entgegengesetzte Richtung','Doppelte Länge, gleiche Richtung','Der Nullvektor entsteht.','Alle Komponenten wechseln das Vorzeichen.|Der Betrag bleibt gleich, die Richtung kehrt sich um.','Was bewirkt stattdessen die Multiplikation mit 0?','Negativen Faktor mit kürzerer Länge gleichsetzen.'],
[2,'u = (1|0), v = (0|1). Was ist 2u + 3v?','(2|3)','(3|2)','(5|5)','2u = (2|0) und 3v = (0|3).|Die Summe ist (2|3).','Warum können diese beiden Vektoren jeden Vektor in der Ebene darstellen?','Die Koeffizienten vertauschen.']
],[
[0,'Wie lang ist der Vektor (3|4)?','5','7','25','Berechne den Betrag mit dem Satz des Pythagoras.|√(3² + 4²) = √25 = 5.','Warum addiert man die Komponenten nicht einfach?','Die Wurzel nach der Quadratsumme vergessen.'],
[0,'Wie lang ist der Vektor (0|0|−2)?','2','−2','4','Die Länge ist √(0² + 0² + (−2)²).|√4 = 2; eine Länge ist nichtnegativ.','Welche Eigenschaft teilen v und −v?','Eine negative Komponente als negative Länge lesen.'],
[1,'A(1|2) und B(4|2): Wie groß ist ihr Abstand?','3','2','5','Der Verbindungsvektor ist (3|0).|Sein Betrag ist √9 = 3.','Warum spielt die gemeinsame y-Koordinate hier keine Rolle?','Koordinaten statt Koordinatendifferenzen verwenden.'],
[1,'Wie groß ist der Abstand von A(0|0|0) zu B(1|2|2)?','3','5','9','Bilde die Quadratsumme: 1 + 4 + 4 = 9.|Ziehe die Wurzel: √9 = 3.','Wie erweitert man den Satz des Pythagoras auf drei Dimensionen?','Die Quadratsumme als Abstand verwenden.'],
[2,'Wie groß ist der Abstand von P(2|−1|5) zur Ebene z = 2?','3','5','7','Die Ebene ist parallel zur xy-Ebene.|Der senkrechte Abstand ist |5 − 2| = 3.','Warum spielen x und y hier keine Rolle?','Abstand zum Ursprung statt zur Ebene berechnen.']
],[
[0,'Berechne das Skalarprodukt (1|2) · (3|4).','11','(3|8)','10','Multipliziere entsprechende Komponenten und addiere.|1·3 + 2·4 = 11.','Warum ist das Ergebnis eine Zahl und kein Vektor?','Komponentenprodukte ohne Summe als Vektor stehen lassen.'],
[0,'Welches Skalarprodukt hat v = (2|−1) mit sich selbst?','5','1','√5','v·v = 2² + (−1)².|Das ergibt 4 + 1 = 5.','Wie hängt v·v mit dem Betrag von v zusammen?','Den Betrag mit seinem Quadrat verwechseln.'],
[1,'Was folgt aus u·v = 0 für zwei von 0 verschiedene Vektoren?','Sie sind orthogonal.','Sie sind parallel.','Sie sind gleich.','Es gilt u·v = |u|·|v|·cos(α).|Bei von 0 verschiedenen Vektoren folgt cos(α) = 0, also α = 90°.','Warum werden Nullvektoren in dieser Winkelaussage ausgeschlossen?','Skalarprodukt 0 als Parallelitätskriterium verwenden.'],
[1,'Welcher Vektor ist orthogonal zu (1|2)?','(2|−1)','(2|1)','(1|2)','Prüfe das Skalarprodukt.|1·2 + 2·(−1) = 0.','Kannst du einen weiteren orthogonalen Vektor nennen?','Das Vorzeichen bei der Orthogonalitätsprüfung übersehen.'],
[2,'Welchen Winkel schließen (1|0) und (1|1) ein?','45°','90°','0°','Der Kosinus ist 1/(1·√2) = 1/√2.|Dazu gehört ein Winkel von 45°.','Wie lässt sich das auch an einer Zeichnung erkennen?','Den Kosinuswert als Winkel interpretieren.']
],[
[0,'g: x = (1|2|3) + t(0|1|0). Was ist ein Stützvektor?','(1|2|3)','(0|1|0)','(1|3|3)','In der Form x = a + tv ist a ein Stützvektor.|Hier ist a = (1|2|3).','Ist ein Stützvektor eindeutig festgelegt?','Stütz- und Richtungsvektor vertauschen.'],
[0,'g: x = (1|2|3) + t(0|1|0). Welche Koordinate verändert sich mit t?','Nur y','Nur x','Nur z','Nur die zweite Komponente des Richtungsvektors ist von 0 verschieden.|Die Punkte haben die Form (1|2 + t|3).','Zu welcher Koordinatenachse ist die Gerade parallel?','Die Position der von 0 verschiedenen Komponente falsch lesen.'],
[1,'Liegt P(1|5|3) auf g: x = (1|2|3) + t(0|1|0)?','Ja, für t = 3','Ja, für t = 5','Nein','Die erste und dritte Koordinate stimmen für jedes t.|Aus 2 + t = 5 folgt t = 3.','Warum muss derselbe Parameter alle drei Koordinaten erfüllen?','Punktkoordinate und Parameter gleichsetzen.'],
[1,'Liegt P(2|5|3) auf g: x = (1|2|3) + t(0|1|0)?','Nein, die x-Koordinate ist immer 1.','Ja, für t = 3','Ja, für t = 1','Auf der Geraden gilt unabhängig von t stets x = 1.|P hat x = 2 und kann deshalb nicht auf g liegen.','Reicht die Prüfung einer einzelnen passenden Koordinate?','Nur die veränderliche Koordinate prüfen.'],
[2,'Welche Gerade verläuft durch A(0|0) und B(2|4)?','x = (0|0) + t(1|2)','x = (0|0) + t(2|1)','x = (2|4) + t(0|0)','AB = (2|4), also ist auch (1|2) ein Richtungsvektor.|Für t = 0 erhält man A und für t = 2 den Punkt B.','Warum darf man den Richtungsvektor durch 2 teilen?','Jeden Verbindungsvektor nur in seiner ursprünglichen Länge zulassen.']
],[
[0,'u = (1|2|3), v = (2|4|6). Was folgt für Geraden mit diesen Richtungsvektoren?','Sie sind parallel oder identisch.','Sie schneiden sich zwingend genau einmal.','Sie sind zwingend windschief.','Es gilt v = 2u.|Kollineare Richtungsvektoren erlauben parallele oder identische Geraden.','Wie unterscheidest du anschließend parallel von identisch?','Aus gleichen Richtungen sofort identische Geraden folgern.'],
[0,'g: x = t(1|0|0), h: x = (0|1|0) + s(1|0|0). Wie liegen sie?','Echt parallel','Identisch','Sie schneiden sich.','Die Richtungsvektoren stimmen überein.|Auf g gilt y = 0, auf h gilt y = 1; sie haben keinen gemeinsamen Punkt.','Welche Punktprobe würde Identität ausschließen?','Gleiche Richtungsvektoren mit identischen Geraden gleichsetzen.'],
[1,'Wo schneiden sich die x- und die y-Achse im Raum?','Im Ursprung (0|0|0)','In (1|1|0)','Sie schneiden sich nicht.','Auf der x-Achse gilt y = z = 0, auf der y-Achse gilt x = z = 0.|Alle Bedingungen gelten gemeinsam nur im Ursprung.','Warum sind diese Achsen nicht windschief?','Geraden mit verschiedenen Richtungen als windschief ansehen.'],
[1,'g: x = (t|0|0), h: x = (1|s|0). Wo schneiden sie sich?','(1|0|0)','(0|1|0)','(1|1|0)','Setze die Koordinaten gleich: t = 1 und s = 0.|Der gemeinsame Punkt ist (1|0|0).','Warum dürfen die Parameter t und s verschieden sein?','Für beide Geraden denselben Parameterwert verlangen.'],
[2,'Zwei Geraden im Raum sind nicht parallel und haben keinen Schnittpunkt. Sie sind …','windschief','identisch','orthogonal mit Schnittpunkt','Im Raum können nicht parallele Geraden in verschiedenen Ebenen verlaufen.|Ohne gemeinsamen Punkt nennt man sie windschief.','Warum gibt es diese Lage in der Ebene nicht?','Eigenschaften der Ebene ungeprüft auf den Raum übertragen.']
],[
[0,'Wie viele linear unabhängige Spannvektoren braucht eine Ebene in Parameterform?','2','1','3','Eine Ebene hat zwei unabhängige Richtungen.|Zusammen mit einem Stützvektor ergeben sie x = a + ru + sv.','Was entsteht bei nur einer unabhängigen Richtung?','Raumdimension und Anzahl der Ebenenrichtungen gleichsetzen.'],
[0,'Welche Spannvektoren können eine Ebene aufspannen?','(1|0|0) und (0|1|0)','(1|0|0) und (2|0|0)','(0|0|0) und (1|1|1)','Die ersten beiden Vektoren sind nicht kollinear.|Die anderen Paare haben jeweils höchstens eine unabhängige Richtung.','Woran erkennst du Kollinearität?','Zwei Vektoren unabhängig von ihrer Richtung als ausreichend ansehen.'],
[1,'Welcher Normalenvektor gehört zu E: 2x − y + 3z = 6?','(2|−1|3)','(2|1|3)','(6|6|6)','Die Koeffizienten von x, y und z bilden einen Normalenvektor.|Daher ist n = (2|−1|3).','Warum ist auch das Doppelte dieses Vektors ein Normalenvektor?','Das Vorzeichen eines Koeffizienten verlieren.'],
[1,'Welche Gleichung beschreibt eine Ebene parallel zur xy-Ebene in Höhe 4?','z = 4','x + y = 4','x = 4','Eine zur xy-Ebene parallele Ebene hat konstante z-Koordinate.|Die Höhe 4 bedeutet z = 4.','Welcher Normalenvektor passt dazu?','Die Ebene mit einer senkrechten Koordinatenebene verwechseln.'],
[2,'Liegt P(1|2|3) auf E: x + y + z = 6?','Ja','Nein, die Summe ist 5.','Nein, alle Koordinaten müssten 6 sein.','Setze die Koordinaten ein.|1 + 2 + 3 = 6 erfüllt die Gleichung.','Wie würdest du eine Punktprobe in Parameterform durchführen?','Die rechte Seite für jede Koordinate einzeln verlangen.']
],[
[0,'g: x = (0|0|1) + t(0|0|1), E: z = 3. Für welches t liegt der Schnittpunkt vor?','t = 2','t = 3','t = 1','Auf der Geraden gilt z = 1 + t.|Setze 1 + t = 3 und löse t = 2.','Wie lauten die Koordinaten des Schnittpunkts?','Stützkoordinate beim Einsetzen vergessen.'],
[0,'g: x = (0|0|1) + t(1|0|0), E: z = 0. Welche Lage liegt vor?','g ist echt parallel zu E.','g liegt vollständig in E.','g schneidet E genau einmal.','Auf g gilt immer z = 1.|Die Ebene verlangt z = 0; ein Schnitt ist ausgeschlossen.','Was müsste sich am Stützpunkt ändern, damit g in E liegt?','Parallele Richtung als Enthaltensein deuten.'],
[1,'Was ist die Schnittmenge der Ebenen x = 0 und y = 0?','Die z-Achse','Nur der Ursprung','Die xy-Ebene','Beide Bedingungen zusammen ergeben Punkte (0|0|z).|z ist frei; das ist die z-Achse.','Welche Schnittgerade ergeben x = 0 und z = 0?','Eine freie Koordinate übersehen.'],
[1,'Wie liegen E: z = 1 und F: z = 2?','Echt parallel','Identisch','Sie schneiden sich in einer Geraden.','Die Normalenvektoren sind gleich.|Die unterschiedlichen konstanten z-Werte schließen gemeinsame Punkte aus.','Was bedeutet das für den Abstand der Ebenen?','Gleiche Normalenvektoren als Identität deuten.'],
[2,'Wo schneidet E: x + y + z = 6 die x-Achse?','(6|0|0)','(0|6|0)','(2|2|2)','Auf der x-Achse gilt y = z = 0.|Damit wird die Ebenengleichung zu x = 6.','Wie bestimmst du die anderen beiden Achsenschnittpunkte?','Einen beliebigen Ebenenpunkt als Achsenschnittpunkt wählen.']
],[
[0,'A(0|0), B(3|0), C(0|4). Wie groß ist der Flächeninhalt des Dreiecks ABC?','6','12','7','Die Seiten AB und AC stehen senkrecht und sind 3 bzw. 4 lang.|Der Flächeninhalt ist ½·3·4 = 6.','Wie würdest du die Rechtwinkligkeit mit Vektoren prüfen?','Den Faktor ½ bei Dreiecken vergessen.'],
[0,'Ein Quader hat Kantenlängen 2, 3 und 4. Wie groß ist sein Volumen?','24','9','52','Das Volumen eines Quaders ist Länge mal Breite mal Höhe.|2·3·4 = 24.','Welche Einheit hat das Volumen bei Kanten in Metern?','Kantenlängen addieren statt multiplizieren.'],
[1,'Eine Drohne fliegt von A(0|0|2) nach B(3|4|2). Wie lang ist der direkte Weg?','5','7','√29','Der Verbindungsvektor ist (3|4|0).|Sein Betrag ist √(9 + 16) = 5.','Warum geht die absolute Flughöhe nicht in diese Weglänge ein?','Ortskoordinaten statt Differenzen quadrieren.'],
[1,'Ein Weg wird durch P(t) = (0|0|0) + t(2|0|0), t in Sekunden und Koordinaten in Metern, beschrieben. Wie groß ist die Geschwindigkeit?','2 m/s','1 m/s','4 m/s','Pro Sekunde ändert sich der Ort um (2|0|0) Meter.|Der Betrag des Geschwindigkeitsvektors ist 2 m/s.','Welche Rolle spielt die Einheit des Parameters?','Parameter und zurückgelegte Strecke gleichsetzen.'],
[2,'Ein Modell einer Flugbahn ergibt einen Schnittpunkt mit dem Boden bei t = −3 s. Für den Flug gilt t ≥ 0. Was bedeutet das?','Der Schnittpunkt gehört nicht zum betrachteten Flugabschnitt.','Die Drohne landet in 3 Sekunden.','Eine negative Höhe ist automatisch der Boden.','Der Parameter −3 liegt außerhalb des vorgegebenen Zeitbereichs.|Die unbeschränkte Gerade und die reale Flugbahn sind zu unterscheiden.','Warum muss man bei Geradenmodellen Parameterbereiche prüfen?','Einen negativen Parameter ohne Kontextprüfung positiv machen.']
]]
S = [
[
[0,'Welche Ergebnismenge passt zu einem einmaligen Münzwurf mit Kopf oder Zahl?','{Kopf, Zahl}','{1, 2, 3, 4, 5, 6}','{Kopf}','Die möglichen Ergebnisse heißen Kopf und Zahl.|Beide gehören in die Ergebnismenge.','Wie ändert sich die Ergebnismenge bei zwei Würfen?','Ergebnismenge und einzelnes Ereignis verwechseln.'],
[0,'Wie viele geordnete Ergebnisse hat das zweimalige Werfen einer Münze mit Kopf und Zahl?','4','2','3','Die Ergebnisse sind KK, KZ, ZK und ZZ.|Die Reihenfolge unterscheidet KZ von ZK.','Warum muss man die Reihenfolge hier berücksichtigen?','KZ und ZK als dasselbe Ergebnis zählen.'],
[1,'Welches Ereignis beschreibt eine gerade Augenzahl beim sechsseitigen Würfel?','{2, 4, 6}','{1, 3, 5}','{2, 3, 4}','Gerade Augenzahlen sind durch 2 teilbar.|Unter 1 bis 6 sind das 2, 4 und 6.','Was ist das Gegenereignis?','Ereignis und Gegenereignis vertauschen.'],
[1,'Beim Würfeln sei A = {5, 6}. Was bedeutet A?','Eine Augenzahl größer als 4','Eine Augenzahl mindestens 4','Eine Augenzahl kleiner als 5','Die Menge enthält genau 5 und 6.|Das ist das Ereignis „größer als 4“.','Wie würdest du „mindestens 4“ als Menge schreiben?','Strikte und nichtstrikte Ungleichungen verwechseln.'],
[2,'A ist „mindestens ein Kopf“ bei zwei Münzwürfen. Was ist das Gegenereignis?','Kein Kopf, also zweimal Zahl','Genau einmal Kopf','Zweimal Kopf','Das Gegenereignis umfasst alle Ergebnisse, die nicht zu A gehören.|Nur ZZ enthält keinen Kopf.','Warum ist „höchstens ein Kopf“ nicht das Gegenereignis?','„Mindestens“ durch „genau“ verneinen.']
],[
[0,'Wie groß ist die Wahrscheinlichkeit einer 6 beim fairen sechsseitigen Würfel?','1/6','1/2','1/3','Sechs gleich wahrscheinliche Ergebnisse sind möglich.|Genau eines ist günstig: P = 1/6.','Welche Annahme steckt im Wort „fair“?','Günstige und mögliche Ergebnisse falsch zählen.'],
[0,'Ein fairer sechsseitiger Würfel wird geworfen. Wie wahrscheinlich ist eine gerade Zahl?','1/2','1/3','2/3','Günstig sind 2, 4 und 6, also drei Ergebnisse.|3/6 = 1/2.','Warum darf man hier die Laplace-Regel verwenden?','Die Anzahl der günstigen Ergebnisse mit der Wahrscheinlichkeit verwechseln.'],
[1,'A und B sind disjunkt, P(A) = 0,2 und P(B) = 0,3. Wie groß ist P(A ∪ B)?','0,5','0,06','0,1','Disjunkte Ereignisse überschneiden sich nicht.|Deshalb gilt P(A ∪ B) = 0,2 + 0,3 = 0,5.','Was muss man bei überlappenden Ereignissen abziehen?','Additions- und Multiplikationsregel verwechseln.'],
[1,'P(A) = 0,6, P(B) = 0,5 und P(A ∩ B) = 0,2. Wie groß ist P(A ∪ B)?','0,9','1,1','0,3','Verwende P(A ∪ B) = P(A) + P(B) − P(A ∩ B).|0,6 + 0,5 − 0,2 = 0,9.','Warum wird die Schnittwahrscheinlichkeit einmal abgezogen?','Die Überschneidung doppelt zählen.'],
[2,'P(A) = 0,7. Wie groß ist P(nicht A)?','0,3','0,7','1,7','Ein Ereignis und sein Gegenereignis haben zusammen Wahrscheinlichkeit 1.|1 − 0,7 = 0,3.','Welche Werte kann eine Wahrscheinlichkeit grundsätzlich annehmen?','Das Gegenereignis mit dem ursprünglichen Ereignis verwechseln.']
],[
[0,'Zwei unabhängige faire Münzwürfe: Wie wahrscheinlich ist zweimal Kopf?','1/4','1/2','1','Multipliziere die Wahrscheinlichkeiten entlang des Pfades KK.|½·½ = ¼.','Warum darf man die Wahrscheinlichkeiten hier multiplizieren?','Die Wahrscheinlichkeit nur eines Wurfes übernehmen.'],
[0,'Ein Pfad hat nacheinander die Wahrscheinlichkeiten 0,3 und 0,4. Wie wahrscheinlich ist der vollständige Pfad?','0,12','0,7','0,1','Entlang eines Pfades werden die bedingten Zweigwahrscheinlichkeiten multipliziert.|0,3·0,4 = 0,12.','Was müssen die Zweige an jedem Knoten zusammen ergeben?','Zweigwahrscheinlichkeiten entlang des Pfades addieren.'],
[1,'Zwei unabhängige faire Münzwürfe: Wie wahrscheinlich ist genau einmal Kopf?','1/2','1/4','3/4','Die günstigen Pfade sind KZ und ZK mit je ¼.|Addiere ¼ + ¼ = ½.','Wie unterscheidet sich „genau einmal“ von „mindestens einmal“?','Einen günstigen Pfad vergessen.'],
[1,'Zwei disjunkte Pfade haben die Wahrscheinlichkeiten 0,12 und 0,18. Wie wahrscheinlich ist ihr gemeinsames Ereignis?','0,30','0,0216','0,06','Verschiedene vollständige Pfade sind disjunkt.|Ihre Wahrscheinlichkeiten werden addiert: 0,12 + 0,18 = 0,30.','Wie unterscheiden sich erste und zweite Pfadregel?','Wahrscheinlichkeiten verschiedener Pfade multiplizieren.'],
[2,'In einer Urne liegen 3 rote und 2 blaue Kugeln. Zwei Züge ohne Zurücklegen: P(zweimal rot)?','3/10','9/25','1/5','Erster Zug rot: 3/5; danach bleiben 2 rote unter 4 Kugeln.|3/5 · 2/4 = 3/10.','Was ändert sich beim Ziehen mit Zurücklegen?','Beim zweiten Zug die ursprüngliche Wahrscheinlichkeit verwenden.']
],[
[0,'Drei verschiedene Bücher werden in einer Reihe angeordnet. Wie viele Reihenfolgen gibt es?','6','3','9','Für die Plätze gibt es nacheinander 3, 2 und 1 Möglichkeiten.|3! = 3·2·1 = 6.','Wie verändert sich die Rechnung bei vier verschiedenen Büchern?','Anzahl der Bücher statt der Anordnungen zählen.'],
[0,'Wie viele geordnete Ergebnisse gibt es beim Werfen zweier unterscheidbarer sechsseitiger Würfel?','36','12','21','Jeder der sechs Werte des ersten Würfels lässt sich mit sechs Werten des zweiten kombinieren.|6·6 = 36.','Warum müssen die Würfel unterscheidbar sein?','Die Möglichkeiten addieren statt multiplizieren.'],
[1,'Aus 4 Personen wird ein Zweierteam ohne Rollen ausgewählt. Wie viele Teams sind möglich?','6','12','16','Es gibt zunächst 4·3 geordnete Auswahlen.|Jedes Team wird zweimal gezählt: 12/2 = 6.','Warum ist die Reihenfolge für ein Team ohne Rollen irrelevant?','Geordnete Auswahlen ohne Korrektur zählen.'],
[1,'Aus 5 Personen wird eine Person ausgewählt. Wie viele Möglichkeiten gibt es?','5','10','25','Jede der fünf Personen kann einzeln gewählt werden.|Daher ist der Binomialkoeffizient (5 über 1) gleich 5.','Was wäre bei einer Auswahl aller fünf Personen anders?','Eine unnötige zweite Auswahl einführen.'],
[2,'Aus 4 Personen werden Vorsitz und Stellvertretung besetzt, ohne Doppelbesetzung. Wie viele Möglichkeiten gibt es?','12','6','16','Für den Vorsitz gibt es 4 Möglichkeiten.|Danach bleiben 3 für die Stellvertretung: 4·3 = 12.','Warum teilt man hier nicht durch 2?','Rollenbesetzung wie eine ungeordnete Teamauswahl zählen.']
],[
[0,'Was bedeutet P(A | B), falls P(B) > 0?','Die Wahrscheinlichkeit von A unter der Bedingung B','Die Wahrscheinlichkeit von B unter der Bedingung A','Immer das Produkt P(A)·P(B)','Die Information B schränkt die betrachtete Ergebnismenge ein.|Innerhalb dieser Menge wird der Anteil von A bestimmt.','Warum ist die Reihenfolge von A und B wichtig?','Bedingung und Zielereignis vertauschen.'],
[0,'P(A ∩ B) = 0,2 und P(B) = 0,5. Wie groß ist P(A | B)?','0,4','0,1','0,7','P(A | B) = P(A ∩ B)/P(B).|0,2/0,5 = 0,4.','Warum steht P(B) im Nenner?','Die Schnittwahrscheinlichkeit mit P(B) multiplizieren.'],
[1,'Von 10 Personen mit Brille spielen 4 Tennis. Wie groß ist P(Tennis | Brille) in dieser Gruppe?','4/10','10/4','4/6','Die Bedingung beschränkt die Gruppe auf die 10 Brillentragenden.|4 von 10 spielen Tennis, also 4/10.','Welche Information bräuchtest du für P(Brille | Tennis)?','Die Grundgesamtheit der Bedingung falsch wählen.'],
[1,'In einer Gruppe von 20 sind 12 in A, 8 in B und 5 in A ∩ B. Wie viele sind weder in A noch in B?','5','0','3','In A ∪ B sind 12 + 8 − 5 = 15 Personen.|Außerhalb bleiben 20 − 15 = 5.','Wie würdest du das in einer Vierfeldertafel eintragen?','Die Schnittmenge doppelt zählen.'],
[2,'P(A) = 1/2, P(B | A) = 1/2 und P(B) = 1/4. Wie groß ist P(A | B)?','1','1/4','1/2','Bayes: P(A | B) = P(B | A)·P(A)/P(B).|(1/2 · 1/2)/(1/4) = 1.','Wie kann eine bedingte Wahrscheinlichkeit gleich 1 sein, obwohl P(A) kleiner ist?','Die beiden bedingten Wahrscheinlichkeiten gleichsetzen.']
],[
[0,'P(A) = 0,5, P(B) = 0,4 und P(A ∩ B) = 0,2. Sind A und B unabhängig?','Ja, denn 0,5·0,4 = 0,2.','Nein, weil 0,5 ≠ 0,4.','Nein, weil sie sich überschneiden.','Unabhängigkeit verlangt P(A ∩ B) = P(A)·P(B).|0,5·0,4 = 0,2 erfüllt das Kriterium.','Warum bedeutet unabhängig nicht disjunkt?','Unabhängigkeit mit gleichen Einzelwahrscheinlichkeiten verwechseln.'],
[0,'A und B sind unabhängig mit P(A) = 0,3 und P(B) = 0,2. Wie groß ist P(A ∩ B)?','0,06','0,5','0,1','Bei unabhängigen Ereignissen gilt die Produktformel.|0,3·0,2 = 0,06.','Würde die Rechnung ohne die Annahme der Unabhängigkeit gelten?','Einzelwahrscheinlichkeiten addieren.'],
[1,'Nach fünfmal Kopf bei unabhängigen fairen Münzwürfen: Wie wahrscheinlich ist Kopf beim nächsten Wurf?','1/2','1/6','0','Der nächste Wurf ist von den bisherigen unabhängig.|Die Kopf-Wahrscheinlichkeit bleibt 1/2.','Was ist der Irrtum des Spielers?','Einen kurzfristigen Ausgleich des Zufalls erwarten.'],
[1,'Zwei unabhängige Versuche gelingen jeweils mit Wahrscheinlichkeit 0,8. Wie wahrscheinlich gelingen beide?','0,64','0,8','1,6','Multipliziere die Wahrscheinlichkeiten beider Erfolge.|0,8·0,8 = 0,64.','Wie wahrscheinlich ist mindestens ein Misserfolg?','Die gemeinsame Wahrscheinlichkeit mit der Einzelwahrscheinlichkeit gleichsetzen.'],
[2,'A und B sind disjunkt und haben beide positive Wahrscheinlichkeit. Können sie unabhängig sein?','Nein','Ja, immer','Nur wenn P(A) = P(B)','Disjunkt bedeutet P(A ∩ B) = 0.|Das Produkt P(A)·P(B) ist aber positiv, also keine Unabhängigkeit.','Welche Rolle spielt die Voraussetzung positiver Wahrscheinlichkeiten?','Unabhängigkeit und gegenseitigen Ausschluss gleichsetzen.']
],[
[0,'Eine Zufallsvariable ordnet jedem Ergebnis …','eine reelle Zahl zu.','zwingend dieselbe Wahrscheinlichkeit zu.','ein neues Zufallsexperiment zu.','Eine Zufallsvariable ist eine zahlenwertige Abbildung auf der Ergebnismenge.|Beispielsweise zählt X die Zahl der Köpfe.','Wie unterscheidet sich ein Ergebnis von seinem X-Wert?','Zufallsvariable und Wahrscheinlichkeit verwechseln.'],
[0,'X zählt Köpfe bei zwei Münzwürfen. Welche Werte sind möglich?','0, 1, 2','1, 2','0, 1, 2, 3, 4','Kein Kopf, genau ein Kopf oder zwei Köpfe sind möglich.|Mehr als zwei Köpfe können bei zwei Würfen nicht auftreten.','Welche Ergebnisse führen beide zu X = 1?','Anzahl der Ergebnisse mit möglichen X-Werten verwechseln.'],
[1,'X nimmt nur 0 und 1 an, mit P(X = 0) = 0,7. Wie groß ist P(X = 1)?','0,3','0,7','1,7','Alle Wahrscheinlichkeiten einer vollständigen Verteilung summieren sich zu 1.|1 − 0,7 = 0,3.','Warum muss die Summe 1 ergeben?','Die Vollständigkeit der Verteilung übersehen.'],
[1,'Welche Liste kann eine vollständige Wahrscheinlichkeitsverteilung für drei Werte sein?','0,2; 0,3; 0,5','0,2; 0,3; 0,6','−0,1; 0,4; 0,7','Alle Einträge müssen nichtnegativ sein und sich zu 1 addieren.|Nur 0,2 + 0,3 + 0,5 = 1 erfüllt beides.','Warum reicht eine Summe von 1 allein nicht aus?','Negative Wahrscheinlichkeiten zulassen.'],
[2,'X hat P(X = 0) = 0,2, P(X = 1) = 0,5, P(X = 2) = 0,3. Wie groß ist P(X ≥ 1)?','0,8','0,5','0,3','Addiere die Wahrscheinlichkeiten für 1 und 2.|0,5 + 0,3 = 0,8.','Wie kannst du mit dem Gegenereignis rechnen?','≥ mit > verwechseln.']
],[
[0,'X ist 0 oder 2, jeweils mit Wahrscheinlichkeit 1/2. Was ist E(X)?','1','2','0','Multipliziere jeden Wert mit seiner Wahrscheinlichkeit.|0·1/2 + 2·1/2 = 1.','Muss der Erwartungswert als einzelnes Ergebnis auftreten können?','Erwartungswert mit einem zwingend möglichen Ergebnis gleichsetzen.'],
[0,'Wie groß ist der Erwartungswert der Augenzahl eines fairen sechsseitigen Würfels?','3,5','3','6','Alle sechs Werte sind gleich wahrscheinlich.|(1 + 2 + 3 + 4 + 5 + 6)/6 = 21/6 = 3,5.','Was bedeutet der Erwartungswert bei vielen Würfen?','Auf eine ganze Augenzahl runden.'],
[1,'Eine Zufallsvariable hat Varianz 9. Wie groß ist ihre Standardabweichung?','3','81','9','Die Standardabweichung ist die nichtnegative Quadratwurzel der Varianz.|√9 = 3.','Welche Einheit hat die Standardabweichung im Vergleich zu X?','Varianz und Standardabweichung gleichsetzen.'],
[1,'X nimmt immer den Wert 4 an. Wie groß ist Var(X)?','0','4','16','Der Erwartungswert ist ebenfalls 4.|Jede Abweichung von E(X) ist 0, daher ist auch die Varianz 0.','Kann ein positiver Erwartungswert mit Streuung 0 zusammenpassen?','Größe der Werte und Streuung verwechseln.'],
[2,'Ein Spiel zahlt mit Wahrscheinlichkeit 1/4 genau 8 €, sonst 0 €. Welcher Einsatz macht den erwarteten Nettogewinn 0?','2 €','4 €','8 €','Die erwartete Auszahlung ist 8·1/4 + 0·3/4 = 2 €.|Bei 2 € Einsatz ist der erwartete Nettogewinn 0.','Garantiert ein faires Spiel, dass man kein Geld verliert?','Auszahlung und Nettogewinn verwechseln.']
],[
[0,'Welche Voraussetzung gehört zu einer Bernoulli-Kette?','Unabhängige Versuche mit gleicher Erfolgswahrscheinlichkeit','Eine Erfolgswahrscheinlichkeit, die jedes Mal steigt','Genau ein Erfolg insgesamt','Jeder Versuch hat die zwei Kategorien Erfolg und Misserfolg.|Die Versuche sind unabhängig und haben konstantes p.','Warum ist Ziehen ohne Zurücklegen im Allgemeinen keine Bernoulli-Kette?','Konstantes p trotz veränderter Zusammensetzung annehmen.'],
[0,'X zählt Erfolge in 10 unabhängigen Versuchen mit p = 0,3. Welche Verteilung hat X?','B(10; 0,3)','B(3; 10)','Gleichverteilung auf 0 bis 10','Die Zahl der Versuche ist n = 10 und die Erfolgswahrscheinlichkeit p = 0,3.|Die Erfolgsanzahl ist binomialverteilt: X ~ B(10; 0,3).','Was unterscheidet p von E(X)?','Versuchsanzahl und Erfolgswahrscheinlichkeit vertauschen.'],
[1,'X ~ B(3; 1/2). Wie groß ist P(X = 0)?','1/8','1/2','3/8','Kein Erfolg heißt drei Misserfolge.|(1/2)³ = 1/8.','Warum ist hier kein zusätzlicher Faktor 3 nötig?','Einen unpassenden Kombinationsfaktor einsetzen.'],
[1,'X ~ B(3; 1/2). Wie groß ist P(X = 1)?','3/8','1/8','1/2','Genau ein Erfolg kann an drei Positionen stehen.|3·(1/2)·(1/2)² = 3/8.','Welche Rolle spielt der Binomialkoeffizient?','Nur eine mögliche Erfolgsposition zählen.'],
[2,'X ~ B(20; 0,25). Wie groß ist E(X)?','5','15','0,25','Für die Binomialverteilung gilt E(X) = np.|20·0,25 = 5.','Wie würdest du die Standardabweichung bestimmen?','n mit 1 − p multiplizieren statt mit p.']
],[
[0,'Eine Münze soll auf Fairness geprüft werden. Welche Nullhypothese passt für die Kopf-Wahrscheinlichkeit p?','H₀: p = 0,5','H₀: p = 2','H₀: Es fällt genau einmal Kopf.','Eine Hypothese betrifft einen Parameter der Verteilung.|Bei einer fairen Münze gilt p = 0,5.','Was wäre eine passende zweiseitige Alternative?','Hypothese und einzelnes Versuchsergebnis verwechseln.'],
[0,'Was bedeutet die Alternative H₁: p > 0,5?','Die Erfolgswahrscheinlichkeit liegt über 0,5.','Bei jedem Versuch tritt ein Erfolg ein.','Die beobachtete Erfolgszahl muss 0,5 sein.','p ist die unbekannte Erfolgswahrscheinlichkeit.|Die Alternative beschreibt ihre möglichen Werte oberhalb von 0,5.','Warum ist p kein beobachteter Zählwert?','Parameter mit Versuchsergebnis gleichsetzen.'],
[1,'Ein Test verwirft H₀ bei X ≥ 8. Was passiert bei X = 7?','H₀ wird nicht verworfen.','H₀ wird verworfen.','H₀ ist damit bewiesen.','7 gehört nicht zum Ablehnungsbereich {8, 9, …}.|Daher wird H₀ nicht verworfen, aber auch nicht bewiesen.','Warum ist Nichtverwerfen kein Beweis für H₀?','Nichtverwerfen als Beweis auffassen.'],
[1,'Ein rechtsseitiger Test verwendet einen großen Erfolgszählwert als Hinweis gegen H₀. Wo liegt sein Ablehnungsbereich?','Bei großen Werten von X','Bei kleinen Werten von X','Immer nur bei X = 0','Die Alternative vermutet eine größere Erfolgswahrscheinlichkeit.|Entsprechend sprechen große Erfolgsanzahlen gegen H₀.','Wie wäre das bei einer linksseitigen Alternative?','Die Richtung der Alternative umkehren.'],
[2,'Was ist ein Fehler 1. Art?','Eine wahre Nullhypothese wird verworfen.','Eine falsche Nullhypothese wird nicht verworfen.','Eine wahre Nullhypothese wird nicht verworfen.','Beim Fehler 1. Art gilt H₀ in Wirklichkeit.|Der Test entscheidet dennoch für das Verwerfen von H₀.','Was begrenzt das Signifikanzniveau α?','Fehler 1. und 2. Art vertauschen.']
]]

BACKGROUNDS = {'analysis': ['Gleichartige Terme lassen sich zusammenfassen. Das Distributivgesetz lautet a(b+c)=ab+ac. Für '
              'gleiche Basen gilt xᵐ·xⁿ=xᵐ⁺ⁿ. Äquivalenzumformungen erhalten die Lösungsmenge; die '
              'Quadratwurzel ist per Definition nichtnegativ.',
              'Eine Funktion ordnet jedem Element des Definitionsbereichs genau einen Funktionswert zu. Der '
              'Wertebereich umfasst alle angenommenen Werte. Nenner dürfen nicht null sein. Monotonie '
              'beschreibt die Veränderung der Werte und nicht deren Vorzeichen.',
              'Lineare Funktionen haben die Form mx+b. Bei einer Parabel in Scheitelform a(x−h)²+k liegt der '
              'Scheitel bei (h|k). Potenz-, Wurzel-, Exponential- und Logarithmusfunktionen haben '
              'unterschiedliche Definitionsbereiche und Wachstumseigenschaften.',
              'Bei g(x)=a·f(x−h)+k beschreibt h die Verschiebung nach rechts und k nach oben. Der Faktor a '
              'streckt in y-Richtung; ein negatives a spiegelt zusätzlich an der x-Achse. Veränderungen im '
              'Argument wirken auf die x-Richtung.',
              'Die mittlere Änderungsrate ist Δy/Δx und entspricht einer Sekantensteigung. Die Ableitung ist '
              'der Grenzwert dieser Quotienten und liefert die Tangentensteigung. Es gelten Potenz-, Summen- '
              'und Faktorregel; Konstanten haben Ableitung null.',
              'Die Produktregel lautet (uv)′=u′v+uv′. Für v≠0 gilt die Quotientenregel (u/v)′=(u′v−uv′)/v². '
              'Bei verketteten Funktionen wird die äußere Ableitung mit der inneren Ableitung multipliziert.',
              'Nullstellen lösen f(x)=0. Das Vorzeichen von f′ beschreibt die Monotonie. Bei '
              'differenzierbaren Funktionen im Inneren gilt an Extremstellen f′=0; ein Vorzeichenwechsel '
              'oder ein geeignetes Kriterium mit f″ sichert den Nachweis. Wendepunkte erfordern einen '
              'Krümmungswechsel.',
              'Eine Stammfunktion F erfüllt F′=f. Stetigkeit von f auf [a;b] erlaubt ∫ₐᵇ f(x)dx=F(b)−F(a). '
              'Integrale von Raten geben orientierte Bestandsänderungen; geometrische Flächen müssen '
              'gegebenenfalls an Nullstellen aufgeteilt werden.',
              'Ein diskretes Exponentialmodell hat die Form B(t)=B₀qᵗ mit B₀>0 und q>0. Bei relativer '
              'Zunahme r gilt q=1+r, bei Abnahme q=1−r. Die Annahme eines konstanten relativen Faktors muss '
              'im Sachkontext geprüft werden.',
              'Modellierung übersetzt eine Situation in Variablen, Beziehungen und einen sinnvollen '
              'Definitionsbereich. Bei Optimierung sind stationäre Stellen und mögliche Randwerte zu prüfen. '
              'Einheit, Vorzeichen und Größenordnung müssen zur Ausgangsfrage passen.'],
 'geometry': ['Im kartesischen Raum wird ein Punkt durch (x|y|z) beschrieben. Eine Koordinatenebene entsteht '
              'durch Nullsetzen der dazu senkrechten Koordinate. Bei einer Spiegelung an ihr wechselt nur '
              'diese Koordinate das Vorzeichen.',
              'Der Ortsvektor führt vom Ursprung zu einem Punkt. Der Verbindungsvektor AB ist B−A. Freie '
              'Vektoren sind bei gleichen Komponenten gleich, unabhängig vom Angriffspunkt. Der Mittelpunkt '
              'hat die gemittelten Koordinaten der Endpunkte.',
              'Vektoren werden komponentenweise addiert und subtrahiert. Ein Skalar multipliziert jede '
              'Komponente; der Betrag der Länge wächst um den Betrag des Skalars. Negative Faktoren kehren '
              'die Richtung um. Linearkombinationen gewichten und addieren Vektoren.',
              'Der euklidische Vektorbetrag ist √(v₁²+v₂²+v₃²). Punktabstände sind Beträge von '
              'Verbindungsvektoren. Für E: ax+by+cz=d ist der Punkt-Ebene-Abstand '
              '|ax₀+by₀+cz₀−d|/√(a²+b²+c²).',
              'Das Skalarprodukt ist die Summe entsprechender Komponentenprodukte. Es gilt u·v=|u||v|cos(α). '
              'Für zwei Vektoren ungleich null ist u·v=0 genau das Kriterium für Orthogonalität. Der Winkel '
              'folgt mit dem Arkuskosinus.',
              'Eine Gerade hat die Parameterform x=a+tv mit v≠0. a ist der Ortsvektor eines Geradenpunkts '
              'und v beschreibt die Richtung. Bei einer Punktprobe muss ein gemeinsamer Parameter sämtliche '
              'Koordinatengleichungen erfüllen.',
              'Kollineare Richtungsvektoren bedeuten parallele oder identische Geraden; eine Punktprobe '
              'unterscheidet beide Fälle. Bei nicht parallelen Richtungen entscheidet das Gleichungssystem '
              'über einen Schnitt. Nicht parallele Geraden ohne Schnittpunkt sind im Raum windschief.',
              'Eine Ebene in Parameterform benötigt einen Stützvektor und zwei unabhängige Spannvektoren. In '
              'ax+by+cz=d ist (a|b|c) ein Normalenvektor ungleich null. Ein Punkt gehört zur Ebene, wenn '
              'seine Koordinaten die Gleichung erfüllen.',
              'Die Lage einer Geraden zu einer Ebene ergibt sich durch Einsetzen der Geraden in die '
              'Ebenengleichung: eine Lösung, keine Lösung oder eine Identität. Zwei verschiedene nicht '
              'parallele Ebenen schneiden sich in einer Geraden. Achsenschnittpunkte erhält man durch '
              'Nullsetzen zweier Koordinaten.',
              'Geometrische Modelle verbinden Koordinaten mit realen Größen und Einheiten. Vektorbeträge '
              'liefern Weglängen und Geschwindigkeitsbeträge. Parameterbereiche beschränken eine '
              'mathematische Gerade auf einen realen Zeit- oder Streckenabschnitt.'],
 'probability': ['Die Ergebnismenge Ω enthält alle möglichen Einzelergebnisse. Ein Ereignis ist eine '
                 'Teilmenge von Ω. Das Gegenereignis enthält genau die nicht zum Ereignis gehörenden '
                 'Ergebnisse. Bei geordneten Experimenten kann die Reihenfolge Ergebnisse unterscheiden.',
                 'Bei gleich wahrscheinlichen Ergebnissen gilt P(A)=Anzahl günstig/Anzahl möglich. Allgemein '
                 'ist P(A∪B)=P(A)+P(B)−P(A∩B). Gegenereignisse erfüllen P(nicht A)=1−P(A); '
                 'Wahrscheinlichkeiten liegen zwischen 0 und 1.',
                 'Im Baumdiagramm multipliziert man die bedingten Wahrscheinlichkeiten entlang eines '
                 'vollständigen Pfades. Die Wahrscheinlichkeiten disjunkter günstiger Pfade werden addiert. '
                 'Ohne Zurücklegen ändern sich Zusammensetzung und Zweigwahrscheinlichkeiten.',
                 'Für Anordnungen verschiedener Objekte gibt es n! Möglichkeiten. Ungeordnete k-Auswahlen '
                 'aus n Objekten werden mit n!/(k!(n−k)!) gezählt. Geordnete Auswahlen ohne Wiederholung '
                 'haben n!/(n−k)! Möglichkeiten.',
                 'Für P(B)>0 gilt P(A|B)=P(A∩B)/P(B). Bedingung und Ziel sind nicht austauschbar. '
                 'Vierfeldertafeln ordnen Schnittmengen und Randhäufigkeiten. Der Satz von Bayes lautet '
                 'P(A|B)=P(B|A)P(A)/P(B).',
                 'A und B sind unabhängig, wenn P(A∩B)=P(A)P(B). Bei positiver Bedingungswahrscheinlichkeit '
                 'ist dann P(A|B)=P(A). Unabhängige Versuche beeinflussen einander nicht; vergangene Erfolge '
                 'erzwingen keinen Ausgleich im nächsten Versuch.',
                 'Eine Zufallsvariable ist eine reellwertige Funktion auf der Ergebnismenge. Ihre Verteilung '
                 'ordnet möglichen Werten Wahrscheinlichkeiten zu. Diese sind nichtnegativ und summieren '
                 'sich bei einer vollständigen diskreten Verteilung zu 1.',
                 'Für eine diskrete Zufallsvariable gilt E(X)=Σx·P(X=x) und Var(X)=Σ(x−E(X))²P(X=x). Die '
                 'Standardabweichung ist √Var(X). Ein faires Spiel hat erwarteten Nettogewinn null, '
                 'garantiert aber keinen einzelnen ausgeglichenen Ausgang.',
                 'Bei n unabhängigen Bernoulli-Versuchen mit konstantem p zählt X die Erfolge: X~B(n;p). Es '
                 'gilt P(X=k)=(n über k)pᵏ(1−p)ⁿ⁻ᵏ, E(X)=np und σ=√(np(1−p)). Der Kombinationsfaktor zählt '
                 'die möglichen Erfolgspositionen.',
                 'Ein Hypothesentest prüft eine Nullhypothese anhand eines zuvor festgelegten '
                 'Ablehnungsbereichs. Ein Fehler 1. Art verwirft eine wahre H₀, ein Fehler 2. Art verwirft '
                 'eine falsche H₀ nicht. Das Signifikanzniveau begrenzt die Wahrscheinlichkeit des Fehlers '
                 '1. Art unter H₀; Nichtverwerfen beweist H₀ nicht.']}
def build():
    domains=[]; questions=[]; solutions={}
    for (domain_id,name,description,areas), bank in zip(AREAS,[A,G,S]):
        assert len(areas)==len(bank)==10
        skills=[]
        for i,((title,subs),rows) in enumerate(zip(areas,bank)):
            sid=f'{domain_id}-{i+1:02}'
            skills.append(dict(id=sid,name=title,subskills=[dict(id=f'{sid}-{j+1}',name=sub) for j,sub in enumerate(subs)]))
            assert len(rows)==5
            for j,(sub,prompt,answer,bad1,bad2,work,oral,mistake) in enumerate(rows):
                qid=f'{domain_id[0].upper()}{i*5+j+1:03}'
                # Korrekte Position rotiert; keine erkennbare feste Antwortposition.
                options=[answer,bad1,bad2]; rotation=(i+j)%3
                options=options[rotation:]+options[:rotation]
                steps=work.split('|')
                questions.append(dict(id=qid,domain=domain_id,skill=sid,subskill=f'{sid}-{sub+1}',difficulty=1 if j<3 else 2,prompt=prompt,options=options))
                solutions[qid]=dict(correct=options.index(answer),explanation=' '.join(steps),steps=steps,background=BACKGROUNDS[domain_id][i],misconception=mistake,oral=oral)
        domains.append(dict(id=domain_id,name=name,description=description,skills=skills))
    assert len(questions)==150 and len(solutions)==150
    assert len({q['id'] for q in questions})==150
    for q in questions:
        assert len(set(q['options']))==3
        assert 0<=solutions[q['id']]['correct']<3
    # Redaktionelle, jugendgerechte Lösungswege zentral pflegen; alle Karten abdecken.
    revised=json.loads((ROOT/'tools'/'solution_steps.json').read_text())
    expected={q['id'] for q in questions} | {f'F{n:03}' for n in range(1,len(FINAL_ROWS)+1)}
    assert set(revised)==expected
    for qid,solution in solutions.items():
        solution['steps']=revised[qid]
        solution['explanation']=' '.join(revised[qid])
    dump=lambda obj:json.dumps(obj,ensure_ascii=False,indent=2)
    (ROOT/'questions.js').write_text('// Öffentliche Aufgaben und Kompetenzstruktur. Keine Lösungen.\nwindow.MQ_DOMAINS = '+dump(domains)+';\nwindow.MQ_QUESTIONS = '+dump(questions)+';\n')
    final=[]
    for n,(domain,area,sub,prompt,answer,bad1,bad2,work,oral,mistake) in enumerate(FINAL_ROWS,1):
        qid=f'F{n:03}';sid=f'{domain}-{area:02}'
        options=[answer,bad1,bad2];rotation=n%3;options=options[rotation:]+options[:rotation]
        final.append(dict(id=qid,domain=domain,skill=sid,subskill=f'{sid}-{sub}',difficulty=3,prompt=prompt,options=options))
        steps=revised[qid]
        solutions[qid]=dict(correct=options.index(answer),explanation=' '.join(steps),steps=steps,background=BACKGROUNDS[domain][area-1],misconception=mistake,oral=oral)
    (ROOT/'final-questions.js').write_text('// Neun zusätzliche Level-60-Aufgaben; keine Lösungsschlüssel.\nwindow.MQ_FINAL_QUESTIONS = '+dump(final)+';\n')
    from build_expansion import build_expansion
    _,extra_solutions,_,_=build_expansion()
    solutions.update(extra_solutions)
    (ROOT/'solutions.js').write_text('// Separater Lösungsschlüssel. Wird für Sofortfeedback nach einer Antwort bzw. im freigegebenen Lernmodus geladen.\n// Lokal keine echte Zugriffssicherung: diese Datei bleibt einsehbar.\nwindow.MQ_SOLUTIONS = '+dump(solutions)+';\n')
    from math_text import build as build_math
    build_math()
    print('Erstellt: 3 Gebiete, 30 Bereiche, 90 Teilkompetenzen, 150 Einstiegsaufgaben + 9 Level-60-Aufgaben mit Lösungen.')
if __name__=='__main__': build()
