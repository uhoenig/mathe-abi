/* Eigenständige Lernwerkstatt: feste Beispiele, räumliche Skizzen und eigene Eingaben. */
(() => {
'use strict';
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const tex=s=>window.katex.renderToString(s,{throwOnError:true,trust:false,strict:'error',output:'htmlAndMathml'});
const m=s=>`<span class="lab-math">${tex(s)}</span>`;
const v=(...xs)=>String.raw`\begin{pmatrix}${xs.join(String.raw`\\`)}\end{pmatrix}`;
const g=String.raw`g:\;\vec x=${v(1,0,1)}+t${v(1,1,0)},\quad t\in\mathbb R`;
const vectorFields=['x','y','z'];
const coordinate=(id,prompt,values,hint,solution)=>({id,prompt,fields:vectorFields,values,hint,solution});
const number=(id,prompt,label,value,hint,solution)=>({id,prompt,fields:[label],values:[value],hint,solution});
const choice=(id,prompt,options,value,hint,solution)=>({id,prompt,options,value,hint,solution});
const lessons=[
 {id:'geraden',title:'Eine Gerade ist ein Weg',short:'Geraden',subtitle:'Startpunkt + Laufrichtung × Schrittweite',icon:'arrow',
  intro:'Stell dir eine unendlich lange, gerade Schiene im Raum vor. Du kennst einen Punkt auf der Schiene und weißt, in welche Richtung sie läuft. Genau diese beiden Informationen stecken in einer Geradengleichung.',
  formula:g,
  facts:[['Stützvektor',`${m(v(1,0,1))} führt vom Ursprung zum Startpunkt A(1|0|1).`],['Richtungsvektor',`${m(v(1,1,0))} bedeutet: 1 in x-Richtung, 1 in y-Richtung, keine Änderung in z.`],['Parameter t','Die Zahl t sagt, wie oft du den Richtungsvektor gehst. Negative Werte führen in die Gegenrichtung.'] ],
  example:'Wo bist du für t = 2?',steps:[`Multipliziere den Richtungsvektor mit 2: ${m(`2${v(1,1,0)}=${v(2,2,0)}`)}.`,`Addiere den Stützvektor: ${m(`${v(1,0,1)}+${v(2,2,0)}=${v(3,2,1)}`)}.`,`Der Punkt P(3|2|1) liegt auf g. Für jeden anderen t-Wert erhältst du einen weiteren Punkt.`],
  trap:'Der Richtungsvektor ist kein zweiter Punkt. Sind A und B gegeben, erhältst du eine Richtung durch B − A. Der Richtungsvektor darf nicht der Nullvektor sein.',
  oral:'Warum beschreiben doppelt so lange Richtungsvektoren dieselbe Gerade?',oralAnswer:'Weil t jede reelle Zahl sein darf. Die doppelte Richtung wird durch den halben Parameter ausgeglichen; die Menge der Punkte bleibt gleich.',
  video:'Geradengleichung Parameterform Stützvektor Richtungsvektor',
  tasks:[coordinate('g-punkt','Bestimme den Punkt auf g für t = −1.',[0,-1,1],'Setze −1 für t ein. Rechne in jeder Zeile Start + t · Richtung.',`${m(`${v(1,0,1)}-${v(1,1,0)}=${v(0,-1,1)}`)}. Also P(0|−1|1).`),coordinate('g-richtung','A(1|0|1) und B(3|2|1): Berechne den Verbindungsvektor B − A.',[2,2,0],'Ziehe in jeder Komponente die Koordinate von A von der Koordinate von B ab.',`${m(`${v(3,2,1)}-${v(1,0,1)}=${v(2,2,0)}`)}. Mit A als Stützpunkt liefert das eine Gleichung derselben Geraden.`)]},
 {id:'ebenen',title:'Eine Ebene braucht zwei Richtungen',short:'Ebenengleichungen',subtitle:'Ein Startpunkt, zwei unabhängige Wege',icon:'layers',
  intro:'Eine Gerade bietet dir eine Laufrichtung. Auf einer Ebene kannst du zusätzlich seitwärts gehen – wie auf einem unendlich großen Blatt Papier. Deshalb brauchst du zwei Richtungsvektoren, die nicht parallel sind.',
  formula:String.raw`E:\;\vec x=${v(1,0,1)}+r${v(1,0,0)}+s${v(0,1,0)},\quad r,s\in\mathbb R`,
  facts:[['Parameterform','A ist der Startpunkt. Mit r läufst du in die erste, mit s in die zweite Richtung. Beide Parameter sind frei wählbar.'],['Normalenform',`${m(String.raw`\vec n\cdot(\vec x-\vec a)=0`)}: Der Normalenvektor steht senkrecht auf beiden Richtungen der Ebene.`],['Koordinatenform',`${m('ax+by+cz=d')}: Hier ist ${m(String.raw`\vec n=${v('a','b','c')}`)} eine Normale. Für unser Beispiel gilt z = 1.`]],
  example:'Drei Formen, dieselbe Ebene',steps:['In beiden Richtungsvektoren ist die z-Komponente 0. Jeder erreichbare Punkt behält deshalb die Höhe z = 1.',`Eine Normale ist ${m(v(0,0,1))}. Die Normalenform lautet ${m(String.raw`${v(0,0,1)}\cdot(\vec x-${v(1,0,1)})=0`)}.`,`Ausmultipliziert: ${m('z-1=0')}, also ${m('z=1')}. In der Koordinatenform erkennst du die feste Höhe besonders schnell.`],
  trap:'Zwei parallele Spannvektoren erzeugen nur eine Gerade. Bei a x + b y + c z = d ist (a|b|c) eine Normale, kein Stützpunkt.',
  oral:'Warum ist (0|0|1) senkrecht zu dieser Ebene?',oralAnswer:'Die Ebene enthält nur Bewegungen in x- und y-Richtung. Die Normale zeigt ausschließlich in z-Richtung. Ihr Skalarprodukt mit beiden Spannvektoren ist 0.',
  video:'Ebenen Parameterform Normalenform Koordinatenform',
  tasks:[coordinate('e-punkt','Berechne den Ebenenpunkt für r = 2 und s = −1.',[3,-1,1],'Setze beide Parameter ein: (1|0|1) + 2(1|0|0) − (0|1|0).',`Du erhältst ${m(v(3,-1,1))}. Die Höhe bleibt 1.`),coordinate('e-normale','Für F: 2x − y + 3z = 6: Lies die Normale direkt aus den Koeffizienten ab.',[2,-1,3],'Die Faktoren vor x, y und z sind die Komponenten der gesuchten Normalen.',`${m(String.raw`\vec n=${v(2,-1,3)}`)}. Die 6 gehört zur Lage der Ebene, nicht zur Normalen.`)]},
 {id:'punktprobe',title:'Passt der Punkt wirklich?',short:'Punktprobe',subtitle:'Alle Koordinaten müssen gleichzeitig stimmen',icon:'target',
  intro:'Eine Punktprobe ist wie ein gemeinsamer Schlüssel für drei Schlösser: Bei einer Geraden muss derselbe Parameter alle drei Koordinatengleichungen erfüllen. Eine passende x-Koordinate allein reicht nicht.',
  formula:g,
  facts:[['Gerade','Setze den Punkt ein und bestimme t aus einer geeigneten Koordinate. Prüfe diesen Wert anschließend in allen anderen Zeilen.'],['Ebene','Bei einer Koordinatenform setzt du x, y und z ein. Ist die Gleichung wahr, liegt der Punkt in der Ebene.'],['Achtung bei 0','Eine Zeile ohne Parameter kann ihn nicht bestimmen. Sie ist eine zusätzliche Bedingung, die trotzdem erfüllt sein muss.']],
  example:'Liegt Q(3|1|1) auf g?',steps:[`Aus der x-Zeile folgt ${m('3=1+t')}, also ${m('t=2')}.`,`Die y-Zeile fordert ${m('1=t')}. Sie wäre nur für t = 1 erfüllt.`,`Kein gemeinsamer Parameter: Q liegt nicht auf g. Die passende Höhe z = 1 ändert daran nichts.`],
  trap:'Du darfst nicht für jede Koordinate einen anderen Parameter wählen. t beschreibt einen einzigen Punkt auf der Geraden.',
  oral:'Warum genügt bei der Ebenenform x + y + z = 4 eine einzige Rechnung?',oralAnswer:'Diese eine Gleichung ist bereits die vollständige Bedingung an alle Punkte der Ebene. In einer Geradenparameterform müssen dagegen drei Zeilen mit demselben t erfüllt sein.',
  video:'Punktprobe Gerade Ebene',
  tasks:[number('p-gerade','P(4|3|1) liegt auf g. Für welchen Parameter t?', 't',3,'Nutze 4 = 1 + t. Prüfe danach y und z.',`t = 3 ergibt ${m(v(4,3,1))}. Alle drei Koordinaten stimmen.`),choice('p-ebene','Liegt Q(2|1|2) in E: x + y + z = 4?',['Ja, Q liegt in E.','Nein, Q liegt außerhalb.'],1,'Setze 2 + 1 + 2 ein und vergleiche mit 4.','2 + 1 + 2 = 5, nicht 4. Daher liegt Q nicht in E.')]},
 {id:'gerade-gerade',title:'Wo treffen sich zwei Geraden?',short:'Gerade ∩ Gerade',subtitle:'Gleichsetzen, lösen, kontrollieren',icon:'tree',
  intro:'Am Schnittpunkt kommen zwei Wege am selben Ort an. Ihre Schrittweiten können verschieden sein: Die erste Gerade bekommt t, die zweite s. Du suchst einen gemeinsamen Punkt, nicht denselben Parameter.',
  formula:String.raw`${g}\qquad h:\;\vec x=${v(3,0,1)}+s${v(-1,1,0)}`,
  facts:[['1 · Gleichsetzen',`${m(String.raw`\vec a+t\vec u=\vec b+s\vec v`)} liefert drei Gleichungen für zwei Unbekannte.`],['2 · Lösen','Löse zwei geeignete Zeilen. Die dritte Zeile ist eine notwendige Kontrolle.'],['3 · Einsetzen','Setze t in g oder s in h ein. Gib den Schnittpunkt mit seinen drei Koordinaten an.']],
  example:'Schnittpunkt von g und h',steps:[`Die Zeilen lauten ${m('1+t=3-s')}, ${m('t=s')} und ${m('1=1')}.`,`Setze s = t in die erste Zeile: ${m('1+t=3-t')}. Damit ${m('t=1')} und ${m('s=1')}.`,`Die dritte Zeile stimmt. Einsetzen ergibt ${m(String.raw`S=${v(2,1,1)}`)}. Auch h liefert (2|1|1).`],
  trap:'Zwei nicht parallele Geraden im Raum müssen sich nicht schneiden. Die dritte Gleichung kann widersprechen: Dann sind sie windschief.',
  oral:'Wozu brauchst du den zweiten Parameter s?',oralAnswer:'Jede Gerade hat ihren eigenen Start und ihre eigene Richtung. Derselbe Schnittpunkt kann deshalb für unterschiedliche Parameterwerte erreicht werden. t = s darf man nur verwenden, wenn es aus den Gleichungen folgt.',
  video:'Schnittpunkt zwei Geraden Raum gleichsetzen',
  tasks:[number('gg-parameter','Welche Schrittweite t erreicht den Schnittpunkt auf g?', 't',1,'Aus t = s und 1 + t = 3 − s entsteht 2t = 2.','t = 1. Hier ergibt sich auch s = 1; das ist ein Ergebnis, keine Voraussetzung.'),coordinate('gg-punkt','Gib den Schnittpunkt S von g und h an.',[2,1,1],'Setze t = 1 in g ein. Addiere die drei Komponenten.',`S(2|1|1), denn ${m(`${v(1,0,1)}+${v(1,1,0)}=${v(2,1,1)}`)}.`)]},
 {id:'gerade-ebene',title:'Eine Gerade trifft eine Ebene',short:'Gerade ∩ Ebene',subtitle:'Den Weg in die Ebenenbedingung einsetzen',icon:'layers',
  intro:'Stell dir einen Lichtstrahl vor, der auf ein Blatt Papier trifft. Du suchst die Stelle auf dem Strahl, die gleichzeitig zur Ebene gehört. In Koordinatenform lässt sich das besonders direkt rechnen.',
  formula:String.raw`${g}\qquad E:\;x+y+z=4`,
  facts:[['Koordinaten ablesen',`${m('x=1+t')}, ${m('y=t')}, ${m('z=1')}.`],['In E einsetzen','Ersetze x, y und z in der Ebenengleichung durch diese Ausdrücke. Jetzt bleibt nur t übrig.'],['Schnittpunkt prüfen','Setze den gefundenen Parameter zurück in die Gerade und prüfe den Punkt in E.']],
  example:'Der Strahl erreicht die Ebene für t = 1',steps:[`Einsetzen: ${m('(1+t)+t+1=4')}.`,`Zusammenfassen: ${m('2+2t=4')}, also ${m('t=1')}.`,`Gerade: ${m(String.raw`S=${v(1,0,1)}+1${v(1,1,0)}=${v(2,1,1)}`)}. Kontrolle in E: ${m('2+1+1=4')}.`],
  trap:'Ein Parameterwert ist noch kein Schnittpunkt. Erst das Einsetzen in die Gerade liefert S(x|y|z). Bei einer Strecke oder einem Strahl musst du zusätzlich den erlaubten Parameterbereich prüfen.',
  oral:'Was bedeutet eine Gleichung wie 0t = 0 oder 0t = 2?',oralAnswer:'0t = 0 gilt für jedes t: Die ganze Gerade liegt in der Ebene. 0t = 2 ist unmöglich: Die Gerade verläuft echt parallel zur Ebene und hat keinen Schnittpunkt.',
  video:'Schnittpunkt Gerade Ebene Koordinatenform',
  tasks:[number('ge-parameter','Für g und E aus dem Beispiel: Welcher Parameter t liefert den Schnittpunkt?', 't',1,'Löse 2 + 2t = 4.','2t = 2, deshalb t = 1. In g ergibt das S(2|1|1).'),coordinate('ge-transfer','k hat den Stützpunkt O(0|0|0) und die Richtung (1|1|1). Bestimme den Schnittpunkt mit F: x + y + z = 6.',[2,2,2],'Setze x = y = z = t ein: 3t = 6. Berechne danach den Punkt auf k.',`t = 2 und damit ${m(String.raw`S=2${v(1,1,1)}=${v(2,2,2)}`)}. Kontrolle: 2 + 2 + 2 = 6.`)]},
 {id:'ebene-ebene',title:'Zwei Ebenen, eine Schnittgerade',short:'Ebene ∩ Ebene',subtitle:'Eine Variable bleibt frei',icon:'tree',
  intro:'Zwei Blätter Papier treffen sich normalerweise entlang einer Linie. Rechnerisch hast du zwei Gleichungen, aber drei Koordinaten. Eine Koordinate kannst du frei wählen: Sie wird zum Parameter der Schnittgeraden.',
  formula:String.raw`E_1:\;x+y+z=4\qquad E_2:\;x-y=0`,
  facts:[['Gleichungssystem','Beide Ebenengleichungen müssen gleichzeitig erfüllt sein. Aus E₂ folgt x = y.'],['Freie Variable','Setze x = r. Dann ist y = r und aus E₁ folgt z = 4 − 2r.'],['Als Gerade schreiben',`${m(String.raw`\vec x=${v(0,0,4)}+r${v(1,1,-2)}`)} beschreibt alle gemeinsamen Punkte.`]],
  example:'Die Schnittgerade aus beiden Bedingungen gewinnen',steps:[`E₂ liefert ${m('y=x')}. Setze in E₁ ein: ${m('2x+z=4')}.`,`Wähle ${m('x=r')}. Dann ${m('y=r')} und ${m('z=4-2r')}.`,`Fasse zusammen: ${m(String.raw`\vec x=${v('r','r','4-2r')}=${v(0,0,4)}+r${v(1,1,-2)}`)}. Für r = 1 liegt P(1|1|2) in beiden Ebenen.`],
  trap:'Ein einzelner gefundener Punkt ist nicht die ganze Schnittmenge. Die freie Variable muss im Ergebnis erhalten bleiben.',
  oral:'Woran erkennst du parallele oder identische Ebenen?',oralAnswer:'Ihre Normalen sind parallel. Prüfe dann einen Punkt der einen Ebene in der anderen: Liegt er auch dort, sind die Ebenen identisch; sonst sind sie echt parallel.',
  video:'Schnittgerade zwei Ebenen Koordinatenform',
  tasks:[coordinate('ee-punkt','Berechne den Punkt auf der Schnittgeraden für r = 1.',[1,1,2],'Setze r = 1 in (r|r|4 − 2r) ein.',`P(1|1|2) erfüllt beide Ebenen: ${m('1+1+2=4')} und ${m('1-1=0')}.`),coordinate('ee-richtung','Lies den Richtungsvektor der angegebenen Schnittgeraden ab.',[1,1,-2],'Der Vektor vor dem Parameter r ist die Richtung.',`${m(v(1,1,-2))}. Er ist senkrecht zu beiden Normalen (1|1|1) und (1|−1|0).`)]},
 {id:'lagebeziehungen',title:'Treffen, parallel oder windschief?',short:'Lagebeziehungen',subtitle:'Die Rechnung erzählt dir, wie es im Raum aussieht',icon:'target',
  intro:'Ein Bild hilft beim Verstehen, aber der Blickwinkel kann täuschen. Im Raum können sich zwei Geraden in der Zeichnung kreuzen, obwohl sie auf verschiedenen Höhen verlaufen. Die Gleichungen entscheiden.',
  formula:String.raw`g:\;\vec x=t${v(1,0,0)}\qquad h:\;\vec x=${v(0,0,1)}+s${v(0,1,0)}`,
  facts:[['Gerade – Gerade','Parallele Richtungen: identisch oder echt parallel, durch Punktprobe unterscheiden. Nicht parallele Richtungen: ein Schnittpunkt oder windschief.'],['Gerade – Ebene','Einsetzen ergibt genau einen Parameter: Schnittpunkt. Widerspruch: echt parallel. Immer wahre Aussage: Gerade liegt in der Ebene.'],['Ebene – Ebene','Nicht parallele Normalen: Schnittgerade. Parallele Normalen: identisch oder echt parallel. Zwei Ebenen schneiden sich nie nur in einem einzelnen Punkt.']],
  example:'Diese Geraden sind windschief',steps:['Die Richtungen (1|0|0) und (0|1|0) sind keine Vielfachen. Die Geraden sind also nicht parallel.',`Gleichsetzen verlangt in der z-Zeile ${m('0=1')}. Das ist unmöglich. Es gibt keinen Schnittpunkt.`,'Nicht parallel und ohne Schnittpunkt: windschief. In der Zeichnung siehst du eine Gerade auf Höhe z = 0, die andere auf Höhe z = 1.'],
  trap:'„Keine Lösung“ bedeutet bei zwei Geraden nicht automatisch parallel. Prüfe immer zuerst die Richtungsvektoren.',
  oral:'Kann es bei zwei Geraden genau zwei Schnittpunkte geben?',oralAnswer:'Nein. Zwei verschiedene gemeinsame Punkte legen bereits dieselbe Gerade fest. Es gibt keinen, genau einen oder unendlich viele gemeinsame Punkte.',
  video:'Lagebeziehungen Geraden Ebenen windschief parallel identisch',
  tasks:[choice('lage-windschief','Wie liegen g und h aus diesem Beispiel zueinander?',['Sie schneiden sich.','Sie sind echt parallel.','Sie sind windschief.','Sie sind identisch.'],2,'Die Richtungen sind nicht parallel. Trotzdem widerspricht sich die z-Koordinate.','Sie sind windschief: nicht parallel und kein gemeinsamer Punkt.'),choice('lage-enthalten','k geht durch A(0|0|1) in Richtung (1|0|0). Wie liegt k zu E: z = 1?',['Ein Schnittpunkt.','k liegt vollständig in E.','k ist echt parallel zu E.'],1,'Die z-Komponente ist für jeden Wert von t gleich 1.','Jeder Punkt auf k hat z = 1. Einsetzen ergibt 1 = 1 für alle t: k liegt in E.')]}
];
// Jede Runde führt von einer Beobachtung über Zwischenschritte zu den beiden Missionen.
const pick=(title,options,answer,hint,solution,formula='')=>({title,options,answer,hint,solution,formula,type:'pick'});
const fill=(title,expression,labels,values,hint,solution)=>({title,formula:expression,fields:labels,values,hint,solution,type:'fill'});
const explore=(title,text,goal)=>({title,text,goal,type:'explore'});
const taskStep=task=>({...task,title:task.prompt,type:task.options?'pick':'fill',answer:task.value,mission:true});
const plans=[
 [explore('Ein Punkt geht auf Reisen.','A ist dein Start. Mit t bestimmst du, wie weit P läuft. Schiebe den Regler auf t = 2.',2),
  pick('Wo startet dein Weg?', ['A(1|0|1)','A(1|1|0)','A(0|0|0)'],0,'Für t = 0 bleibt nur der erste Vektor übrig.','Genau. Der erste Vektor bringt dich zum Startpunkt A(1|0|1).',g),
  pick('Was ändert ein Schritt?', ['x + 1, y + 1, z bleibt gleich','x + 1, y bleibt gleich, z + 1','Alle Koordinaten werden verdoppelt'],0,'Lies den Vektor hinter t zeilenweise.','Du gehst 1 in x- und 1 in y-Richtung. Die Höhe bleibt gleich.',m(String.raw`\vec u=${v(1,1,0)}`)),
  fill('Erst die Schrittweite: Verdopple die Richtung.',`2${v(1,1,0)}=${v('?','?','?')}`,vectorFields,[2,2,0],'Multipliziere jede Komponente mit 2.','Richtig: zwei Schritte ergeben die Verschiebung (2|2|0).'),
  fill('Jetzt den Start dazunehmen.',`${v(1,0,1)}+${v(2,2,0)}=${v('?','?','?')}`,vectorFields,[3,2,1],'Addiere jeweils erste zu erster, zweite zu zweiter und dritte zu dritter Komponente.','P(3|2|1). Du hast den Punkt selbst aus Start und Verschiebung gebaut.'),
  ...lessons[0].tasks.map(taskStep)],
 [explore('Ein Weg nach vorn. Einer zur Seite.','Auf einer Ebene kannst du in zwei unabhängige Richtungen laufen. Hier bleibt s = 1. Bewege r auf 2.',2),
  pick('Wie viele freie Richtungen braucht die Ebene?', ['Eine','Zwei, die nicht parallel sind','Drei, die gleich sind'],1,'Eine Richtung ergibt nur eine Gerade.','Zwei nicht parallele Richtungen spannen die Ebene auf.'),
  fill('Welche Höhe bleibt immer gleich?',String.raw`z=1+r\cdot0+s\cdot0`,['z'],[1],'Beide Richtungen ändern z um 0.','Deshalb lautet die Koordinatenform dieser Ebene z = 1.'),
  pick('Welche Normale passt zu z = 1?', ['(1|0|0)','(0|1|0)','(0|0|1)'],2,'Eine Normale steht senkrecht auf der ganzen Ebene. Hier zeigt sie nach oben.','Die z-Richtung steht senkrecht auf den beiden Richtungen in der Ebene.'),
  ...lessons[1].tasks.map(taskStep)],
 [explore('Ein Schlüssel für drei Koordinaten.','Q(3|1|1) soll auf g liegen. Bewege P auf die x-Koordinate 3: Stelle t = 2 ein.',2),
  fill('Die x-Koordinate liefert einen Kandidaten.', '3=1+t', ['t'],[2],'Ziehe auf beiden Seiten 1 ab.','t = 2 passt zur x-Koordinate. Jetzt müssen auch y und z passen.'),
  fill('Welche y-Koordinate liefert dieses t?', String.raw`y=t,\quad t=2`,['y'],[2],'Setze denselben Parameter 2 in die y-Zeile ein.','Der Geradenpunkt hat y = 2. Q hat aber y = 1.'),
  pick('Liegt Q(3|1|1) auf g?', ['Ja, die x-Koordinate passt.','Nein, die y-Koordinate widerspricht.'],1,'Alle drei Koordinaten müssen mit demselben t stimmen.','Richtig. Eine passende Koordinate allein genügt nicht.'),
  ...lessons[2].tasks.map(taskStep)],
 [explore('Zwei Wege. Ein Treffpunkt.','Die violette Gerade ist g, die blaue h. Bewege P zu t = 1 und beobachte den gemeinsamen Punkt.',1),
  pick('Was muss am Treffpunkt gelten?', ['Die Punkte auf g und h sind gleich.','Die Parameter müssen immer gleich sein.','Die Richtungen müssen gleich sein.'],0,'Ein Treffpunkt beschreibt denselben Ort, unabhängig von der Schrittweite.','Genau. Deshalb setzt du die beiden Geradengleichungen gleich.'),
  pick('Aus der y-Zeile folgt t = s. Setze es in die x-Zeile ein.',[m('1+t=3-t'),m('1+t=3+t'),m('t=3')],0,'Ersetze in 1 + t = 3 − s das s durch t.','So wird aus zwei Unbekannten eine: 1 + t = 3 − t.'),
  fill('Sammle t auf einer Seite.', String.raw`1+t=3-t\quad\Longrightarrow\quad 2t=\square`,['rechte Seite'],[2],'Addiere t und ziehe 1 auf beiden Seiten ab.','Jetzt steht 2t = 2. Nur noch durch 2 teilen.'),
  ...lessons[3].tasks.map(taskStep)],
 [explore('Trifft der Weg das Blatt?', 'g ist dein Weg, E das Blatt im Raum. Stelle t = 1 ein: P liegt jetzt auf beiden.',1),
  pick('Lies die Koordinaten aus g ab.',[m(String.raw`x=1+t,\quad y=t,\quad z=1`),m(String.raw`x=t,\quad y=1+t,\quad z=0`),m(String.raw`x=1,\quad y=1,\quad z=t`)],0,'Rechne Start + t · Richtung in jeder Zeile.','Genau diese drei Ausdrücke setzt du jetzt in die Ebene ein.',g),
  pick('Baue daraus die Ebenengleichung.',[m('(1+t)+t+1=4'),m('(1+t)+t=4'),m('1+t+1=4')],0,'Ersetze x, y und z in x + y + z = 4. Lass keine Koordinate aus.','Alle drei Koordinaten stehen jetzt in einer einzigen Gleichung.'),
  fill('Fasse die beiden t zusammen.',String.raw`(1+t)+t+1=4\quad\Longrightarrow\quad2+\square\,t=4`,['Faktor vor t'],[2],'t + t ist 2t. Die beiden Einsen ergeben 2.','Damit hast du 2 + 2t = 4 hergeleitet.'),
  ...lessons[4].tasks.map(taskStep)],
 [explore('Zwei Blätter teilen sich einen Weg.','Der violette Weg liegt in beiden Ebenen. Stelle r = 1 ein und beobachte P.',1),
  pick('Was verrät dir die zweite Ebene?', [m('y=x'),m('y=-x'),m('z=0')],0,'Forme x − y = 0 nach y um.','Die x- und y-Koordinate müssen immer gleich sein.',String.raw`E_2:\;x-y=0`),
  fill('Setze y = x in die erste Ebene ein.',String.raw`x+y+z=4\quad\Longrightarrow\quad\square\,x+z=4`,['Faktor vor x'],[2],'Aus x + y wird x + x.','Es bleibt 2x + z = 4.'),
  pick('Du wählst x = r frei. Was ist dann z?', [m('z=4-2r'),m('z=4+2r'),m('z=2r-4')],0,'Ziehe 2r auf beiden Seiten ab.','Zusammen ergibt das (r|r|4 − 2r): eine ganze Schnittgerade.'),
  ...lessons[5].tasks.map(taskStep)],
 [explore('Ein Kreuz im Bild ist noch kein Treffen.','g liegt auf Höhe 0, h auf Höhe 1. Bewege P zu t = 0. Die Geraden bleiben getrennt.',0),
  pick('Sind (1|0|0) und (0|1|0) parallel?', ['Ja, beide sind Richtungsvektoren.','Nein, sie sind keine Vielfachen.'],1,'Kein Faktor verwandelt die erste Richtung in die zweite.','Die Geraden sind nicht parallel. Jetzt prüfst du, ob sie sich schneiden.'),
  pick('Was sagt dir die z-Zeile beim Gleichsetzen?', [m('0=1'),m('0=0'),m('t=s')],0,'Auf g ist z immer 0. Auf h ist z immer 1.','0 = 1 ist unmöglich. Es gibt also keinen gemeinsamen Punkt.'),
  ...lessons[6].tasks.map(taskStep)]
];
let selected=0,parameter=0,screen='map';
const runs=new Map();
const run=()=>{if(!runs.has(selected))runs.set(selected,{index:0,results:new Map()});return runs.get(selected);};
const dev=()=>{try{return localStorage.getItem('mathequest.developer.enabled')==='1';}catch{return false;}};
const storageKey=()=>dev()?'mathequest.developer.raumlabor.v1':'mathequest.raumlabor.v1';
const taskIds=new Set(lessons.flatMap(l=>l.tasks.map(t=>t.id)));
let completed=new Set(),storageProblem=false;
function readProgress(){
 completed=new Set();storageProblem=false;
 try{const raw=localStorage.getItem(storageKey());if(raw===null)return;const data=JSON.parse(raw);if(data.version!==1||!Array.isArray(data.completed)||data.completed.some(id=>!taskIds.has(id)))throw Error();completed=new Set(data.completed);}
 catch{storageProblem=true;}
}
readProgress();
function remember(id){
 completed.add(id);
 if(storageProblem)return false;
 try{
  const raw=localStorage.getItem(storageKey()),existing=raw===null?{version:1,completed:[]}:JSON.parse(raw);
  if(existing.version!==1||!Array.isArray(existing.completed)||existing.completed.some(id=>!taskIds.has(id)))throw Error();
  existing.completed.forEach(id=>completed.add(id));
  localStorage.setItem(storageKey(),JSON.stringify({version:1,completed:[...completed]}));return true;
 }catch{storageProblem=true;return false;}
}
const isDone=l=>l.tasks.every(t=>completed.has(t.id));
const project=p=>[245+37*p[0]-29*p[1],244-15*p[0]-16*p[1]-38*p[2]];
const xy=p=>project(p).join(',');
function line(a,b,cls){return `<line x1="${project(a)[0]}" y1="${project(a)[1]}" x2="${project(b)[0]}" y2="${project(b)[1]}" class="${cls}"/>`;}
function dot(p,label,cls='lab-point',offset=[9,-9]){const [x,y]=project(p);return `<g class="${cls}"><circle cx="${x}" cy="${y}" r="5"/><text x="${x+offset[0]}" y="${y+offset[1]}">${esc(label)}</text></g>`;}
function diagram(){
 const id=lessons[selected].id,t=parameter;
 const axes=[line([0,0,0],[5.1,0,0],'lab-axis'),line([0,0,0],[0,5.1,0],'lab-axis'),line([0,0,0],[0,0,5.1],'lab-axis')];
 const labels=[[ [5.25,0,0],'x'],[[0,5.25,0],'y'],[[0,0,5.25],'z']].map(([p,label])=>`<text x="${project(p)[0]}" y="${project(p)[1]}" class="lab-axis-label">${label}</text>`).join('');
 const plane=points=>`<polygon points="${points.map(xy).join(' ')}" class="lab-plane"/>`;
 let shapes='',point,caption;
 if(id==='lagebeziehungen'){
  shapes=line([-1.5,0,0],[4.5,0,0],'lab-line')+line([0,-1.5,1],[0,4.5,1],'lab-line lab-line-second');point=[t,0,0];caption=`P(${t}|0|0) auf g · h bleibt auf Höhe z = 1.`;
 }else if(id==='ebenen'){
  shapes=plane([[-1,-1,1],[4,-1,1],[4,4,1],[-1,4,1]])+line([1,0,1],[3,0,1],'lab-line')+line([1,0,1],[1,2,1],'lab-line lab-line-second')+dot([1,0,1],'A');point=[1+t,1,1];caption=`r = ${t}, s = 1 → P(${1+t}|1|1) · jeder Punkt bleibt auf z = 1.`;
 }else if(id==='ebene-ebene'){
  shapes=plane([[4,0,0],[0,4,0],[0,0,4]])+`<polygon points="${[[0,0,-.5],[3,3,-.5],[3,3,4],[0,0,4]].map(xy).join(' ')}" class="lab-plane lab-plane-second"/>`+line([-.3,-.3,4.6],[2.3,2.3,-.6],'lab-line');point=[t,t,4-2*t];caption=`r = ${t} → P(${t}|${t}|${4-2*t}) erfüllt x + y + z = 4 und x − y = 0.`;
 }else{
  if(id==='gerade-ebene')shapes+=plane([[4,0,0],[0,4,0],[0,0,4]]);
  shapes+=line([-.5,-1.5,1],[5,4,1],'lab-line')+dot([1,0,1],'A', 'lab-point lab-start',[10,17]);
  if(id==='gerade-gerade')shapes+=line([4.5,-1.5,1],[-1,4,1],'lab-line lab-line-second')+dot([2,1,1],'S(2|1|1)','lab-point lab-intersection',[-83,-16]);
  if(id==='punktprobe')shapes+=dot([3,1,1],'Q(3|1|1)','lab-point lab-outside',[9,-9]);
  point=[1+t,t,1];caption=`t = ${t} → P(${1+t}|${t}|1)${id==='gerade-ebene'?(t===1?' liegt jetzt in E.':' · für den Schnittpunkt muss x + y + z = 4 gelten.') :''}`;
 }
 const grid=Array.from({length:5},(_,i)=>line([i,0,0],[i,4,0],'lab-grid')+line([0,i,0],[4,i,0],'lab-grid')).join('');
 return `<svg class="lab-scene" viewBox="0 0 510 370" role="img" aria-label="Räumliche Skizze: ${esc(caption)}"><title>${esc(lessons[selected].short)}: interaktive räumliche Skizze</title>${grid}${axes.join('')}${labels}<text x="239" y="262" class="lab-axis-label">O</text>${shapes}${line([point[0],point[1],0],point,'lab-guide')}${dot(point,'P','lab-point lab-moving')}</svg><p class="lab-coordinate" aria-live="polite">${esc(caption)}</p>`;
}
const mascot=(happy=false)=>`<svg class="geo-buddy ${happy?'happy':''}" viewBox="0 0 110 110" aria-hidden="true"><path class="buddy-shadow" d="m24 91 31-11 32 11-32 12Z"/><path class="buddy-top" d="m18 30 37-18 37 18-37 19Z"/><path class="buddy-side" d="M55 49v43l37-19V30Z"/><path class="buddy-front" d="M18 30v43l37 19V49Z"/><path class="buddy-arm" d="m17 55-9 8m85-10 9-9"/><ellipse cx="64" cy="59" rx="3" ry="5"/><ellipse cx="81" cy="51" rx="3" ry="5"/><path class="buddy-smile" d="m67 70 7 2 7-9"/></svg>`;
const mathMarkup=source=>source?.startsWith('<span class="lab-math">')?source:m(source||'');
function storageNote(){return `<p class="lab-storage-note">${storageProblem?'Dein Fortschritt bleibt gerade nur in dieser Sitzung. Vorhandene unbekannte Daten werden nicht überschrieben.':`${dev()?'Testmodus · ':''}Gelöste Missionen bleiben auf diesem Gerät gespeichert.`}</p>`;}
function renderMap(){
 const next=lessons.findIndex(l=>!isDone(l)),suggested=next===-1?0:next;
 return `<div class="space-lab lab-game"><header class="geo-map-header"><div><span class="eyebrow">Deine Reise durch den Raum</span><h1 tabindex="-1">Ein kleiner Schritt.<br>Ein neues Aha.</h1><p>Baue Geraden und Ebenen selbst zusammen.</p></div>${mascot()}</header><div class="geo-map-summary"><span><svg aria-hidden="true"><use href="#i-trophy"/></svg> ${lessons.filter(isDone).length} von 7 Etappen geschafft</span><span>${completed.size} / 14 Missionen</span></div><section class="geo-start"><div><span class="eyebrow">${next===-1?'Alles entdeckt? Noch einmal üben.':'Deine nächste Etappe'}</span><h2>${esc(lessons[suggested].title)}</h2><p>Entdecken · kleine Rechenschritte · selbst lösen</p></div><button class="btn geo-primary" data-lab-lesson="${suggested}">${runs.has(suggested)&&runFor(suggested).index>0?'Weiterlernen':'Los geht’s'} <span aria-hidden="true">→</span></button></section><ol class="geo-path" aria-label="Die sieben Etappen im Raumlabor">${lessons.map((l,i)=>`<li class="geo-path-stop ${isDone(l)?'complete':''} ${i===suggested?'recommended':''}" style="--path-shift:${[0,55,0,-55,0,55,0][i]}px"><button class="lab-chapter geo-node" data-lab-lesson="${i}" aria-label="Etappe ${i+1}: ${esc(l.short)}${isDone(l)?', geschafft':''}"><span aria-hidden="true">${isDone(l)?'<svg><use href="#i-check"/></svg>':`<svg><use href="#i-${l.icon}"/></svg>`}</span></button><div><span class="geo-path-index">ETAPPE ${i+1}${isDone(l)?' · GESCHAFFT':''}</span><h2>${esc(l.short)}</h2><p>${esc(l.subtitle)}</p></div></li>`).join('')}</ol>${storageNote()}</div>`;
}
function runFor(i){return runs.get(i)||{index:0,results:new Map()};}
function stepInput(step,result){
 if(step.type==='pick')return `<input type="hidden" name="choice" value="${result?.choice??''}"><div class="geo-options" role="group" aria-label="Deine Antwort">${step.options.map((option,i)=>`<button type="button" class="geo-option ${String(result?.choice)===String(i)?'chosen':''}" data-geo-option="${i}" aria-pressed="${String(result?.choice)===String(i)}" ${result?.correct?'disabled':''}><span class="geo-option-key" aria-hidden="true">${i+1}</span><span>${option.startsWith('<span class="lab-math">')?option:esc(option)}</span></button>`).join('')}</div>`;
 return `<div class="lab-inputs geo-inputs">${step.fields.map((field,i)=>`<label for="geo-answer-${i}">${esc(field)}<input id="geo-answer-${i}" name="answer-${i}" type="text" inputmode="decimal" autocomplete="off" spellcheck="false" placeholder="?" value="${esc(result?.values?.[i]??'')}" ${result?.correct?'disabled':''}><button type="button" class="geo-sign" data-geo-sign="geo-answer-${i}" aria-label="Vorzeichen für ${esc(field)} wechseln" ${result?.correct?'disabled':''}>±</button></label>`).join('')}</div>`;
}
function renderRound(){
 const r=run(),steps=plans[selected],step=steps[r.index],result=r.results.get(r.index),l=lessons[selected];
 const progress=(r.index+(result?.correct?1:0))/steps.length*100,exploring=step.type==='explore';
 const formula=step.formula||(exploring||step.mission?l.formula:'');
 return `<div class="space-lab lab-game geo-round"><header class="geo-round-top"><button class="icon-btn" data-geo-command="map" aria-label="Zur Etappenkarte">×</button><div class="geo-round-progress"><div class="geo-round-meta"><span>${esc(l.short)}</span><span>Schritt ${r.index+1} / ${steps.length}</span></div><div class="progress-track" role="progressbar" aria-label="Lektionsfortschritt" aria-valuemin="0" aria-valuemax="${steps.length}" aria-valuenow="${r.index+(result?.correct?1:0)}"><span style="width:${progress}%"></span></div></div></header><section class="geo-card" aria-labelledby="geo-question"><div class="geo-coach">${mascot(!!result?.correct)}<span>${step.mission?'Du kannst das. Jetzt selbst anwenden.':exploring?'Probier es aus. Du darfst neugierig sein.':'Ein Gedanke. Ein kleiner Schritt.'}</span></div><span class="geo-step-tag">${step.mission?'DEINE MISSION':exploring?'ENTDECKEN':'GEMEINSAM HERLEITEN'}</span><h1 id="geo-question" tabindex="-1">${esc(step.title)}</h1>${step.text?`<p class="geo-question-text">${esc(step.text)}</p>`:''}${formula?`<div class="geo-formula">${mathMarkup(formula)}</div>`:''}${exploring?`<div class="geo-playground"><div id="lab-drawing">${diagram()}</div><label class="lab-slider-label" for="lab-parameter">${['ebenen','ebene-ebene'].includes(l.id)?'Parameter r':'Parameter t'}<output id="lab-parameter-value" for="lab-parameter">${parameter}</output></label><input id="lab-parameter" type="range" min="-1" max="3" step="0.5" value="${parameter}"><span class="geo-target ${parameter===step.goal?'reached':''}">${parameter===step.goal?'✓ Entdeckt!':`Dein Ziel: ${step.goal}`}</span></div>`:`<form id="geo-answer" class="geo-answer" novalidate>${stepInput(step,result)}</form>`}${!exploring&&!result?.correct?`<details class="geo-hint"><summary>Gib mir einen kleinen Tipp</summary><p>${esc(step.hint)}</p></details>`:''}</section><div class="geo-footer"><div class="geo-feedback ${result?.correct?'correct':result?.message?'incorrect':''}" role="status">${result?.message?`<strong>${result.correct?'✓ Genau so!':'Noch ein Versuch.'}</strong><p>${result.message}</p>`:''}</div><div class="geo-footer-actions"><button class="btn btn-ghost geo-back" data-geo-command="back" ${r.index===0?'disabled':''}>Zurück</button>${exploring?`<button class="btn geo-primary" data-geo-command="next" ${parameter!==step.goal?'disabled':''}>Entdeckt! Weiter →</button>`:result?.correct?'<button class="btn geo-primary" data-geo-command="next">Weiter →</button>':'<button class="btn geo-primary geo-check" type="submit" form="geo-answer">Prüfen</button>'}</div></div>${storageProblem?storageNote():''}</div>`;
}
function renderReward(){
 const l=lessons[selected];
 return `<div class="space-lab lab-game geo-reward"><div class="geo-reward-stars" aria-hidden="true">✦ <span>✧</span> ✦</div>${mascot(true)}<span class="eyebrow">Etappe ${selected+1} geschafft</span><h1 tabindex="-1">Selbst hergeleitet.<br>Gut gemacht!</h1><p>Du hast ${esc(l.short)} Schritt für Schritt geknackt und beide Missionen gelöst.</p><div class="geo-reward-score"><span><b>${plans[selected].length}</b> kleine Schritte</span><span><b>2</b> Missionen gelöst</span></div><div class="geo-reward-actions">${selected<lessons.length-1?`<button class="btn geo-primary" data-lab-lesson="${selected+1}">Nächste Etappe →</button>`:'<button class="btn geo-primary" data-geo-command="map">Deine Reise ansehen →</button>'}<button class="btn btn-ghost" data-geo-command="map">Zur Etappenkarte</button></div><details class="geo-recap"><summary>Das nimmst du mit</summary><p>${esc(l.trap)}</p><h2>Für die mündliche Prüfung</h2><p>${esc(l.oral)}</p><p>${esc(l.oralAnswer)}</p><a class="lab-video" href="https://www.youtube.com/@mathebydanieljung/search?query=${encodeURIComponent(l.video)}" target="_blank" rel="noopener noreferrer">Passende Erklärung bei Daniel Jung suchen ↗</a></details>${storageNote()}</div>`;
}
function render(){return screen==='map'?renderMap():screen==='reward'?renderReward():renderRound();}
function repaint(focus=true){
 const host=document.querySelector('.space-lab');if(!host)return;host.outerHTML=render();
 if(focus){document.querySelector('.space-lab h1')?.focus({preventScroll:true});document.querySelector('.space-lab')?.scrollIntoView({block:'start',behavior:'instant'});}
}
function parseNumber(raw){
 const value=raw.trim().replace(/−/g,'-').replace(',','.');
 if(!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:\s*\/\s*[+-]?\d+(?:\.\d*)?)?$/.test(value))return null;
 const parts=value.split('/').map(Number),n=parts.length===2?parts[0]/parts[1]:parts[0];return Number.isFinite(n)?n:null;
}
document.addEventListener('click',event=>{
 const host=event.target.closest('.space-lab');if(!host)return;
 const sign=event.target.closest('[data-geo-sign]');
 if(sign){const input=document.getElementById(sign.dataset.geoSign);if(input.disabled)return;input.value=/^[-−]/.test(input.value)?input.value.slice(1):'-'+input.value;input.focus({preventScroll:true});return;}
 const lesson=event.target.closest('[data-lab-lesson]');
 if(lesson){const i=Number(lesson.dataset.labLesson);if(!Number.isInteger(i)||!lessons[i])return;selected=i;if(run().index>=plans[i].length)runs.delete(i);parameter=0;screen='round';repaint();return;}
 const option=event.target.closest('[data-geo-option]');
 if(option){if(option.disabled)return;const form=document.getElementById('geo-answer');form.elements.choice.value=option.dataset.geoOption;host.querySelectorAll('[data-geo-option]').forEach(button=>{const chosen=button===option;button.classList.toggle('chosen',chosen);button.setAttribute('aria-pressed',String(chosen));});return;}
 const button=event.target.closest('[data-geo-command]');if(!button||button.disabled)return;
 const command=button.dataset.geoCommand;
 if(command==='map'){screen='map';repaint();return;}
 const r=run(),step=plans[selected][r.index];
 if(command==='back'){r.index=Math.max(0,r.index-1);parameter=0;repaint();return;}
 if(command==='next'){
  if(step.type==='explore'){if(parameter!==step.goal)return;r.results.set(r.index,{correct:true});}
  else if(!r.results.get(r.index)?.correct)return;
  r.index++;parameter=0;if(r.index===plans[selected].length)screen='reward';repaint();
 }
});
document.addEventListener('input',event=>{
 if(event.target.id!=='lab-parameter')return;
 parameter=Number(event.target.value);document.getElementById('lab-drawing').innerHTML=diagram();document.getElementById('lab-parameter-value').textContent=parameter;
 const goal=plans[selected][run().index].goal;document.querySelector('.geo-target').classList.toggle('reached',parameter===goal);document.querySelector('.geo-target').textContent=parameter===goal?'✓ Entdeckt!':`Dein Ziel: ${goal}`;
 document.querySelector('[data-geo-command="next"]').disabled=parameter!==goal;
});
document.addEventListener('submit',event=>{
 const form=event.target;if(form.id!=='geo-answer')return;event.preventDefault();
 const r=run(),step=plans[selected][r.index];if(r.results.get(r.index)?.correct)return;
 let correct=false,result={};
 if(step.type==='pick'){
  const value=form.elements.choice.value;
  if(value===''){document.querySelector('.geo-feedback').innerHTML='<p>Tippe zuerst auf eine Antwort.</p>';return;}
  result.choice=value;correct=Number(value)===step.answer;
 }else{
  const inputs=step.fields.map((_,i)=>form.elements.namedItem(`answer-${i}`));result.values=inputs.map(input=>input.value);const values=result.values.map(parseNumber),invalid=values.findIndex(value=>value===null);
  if(invalid!==-1){document.querySelector('.geo-feedback').innerHTML='<p>Trag eine Zahl ein, z. B. −1, 0,5 oder 1/2.</p>';inputs[invalid].focus();return;}
  correct=values.every((value,i)=>Math.abs(value-step.values[i])<1e-9);
 }
 result.correct=correct;result.message=correct?step.solution:esc(step.hint);
 if(correct&&step.mission&&!remember(step.id))result.message+='<br>Dein Erfolg bleibt gerade nur in dieser Sitzung.';
 r.results.set(r.index,result);repaint(false);
 document.querySelector('.geo-feedback').scrollIntoView({block:'nearest',behavior:'instant'});
 if(correct)document.querySelector('[data-geo-command="next"]')?.focus({preventScroll:true});
 else document.querySelector('.geo-option.chosen,.geo-inputs input')?.focus({preventScroll:true});
});
window.MQ_RAUM=Object.freeze({render,parseNumber});
})();
