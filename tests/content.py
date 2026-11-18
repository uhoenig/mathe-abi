"""Inhalts- und Rechenprüfungen; ausschließlich Python-Standardbibliothek."""
import sys, json, math, re
from fractions import Fraction as F
from collections import Counter
from pathlib import Path
ROOT=Path(__file__).resolve().parent.parent
sys.path.insert(0,str(ROOT/'tools'))
import build_questions as source
# Lese die erzeugten Dateien, nicht die im Browser bearbeiteten Objekte.
qtext=(ROOT/'questions.js').read_text()
domains=json.loads(qtext.split('window.MQ_DOMAINS = ')[1].split(';\nwindow.MQ_QUESTIONS')[0])
questions=json.loads(qtext.split('window.MQ_QUESTIONS = ')[1].rsplit(';',1)[0])
solutions=json.loads((ROOT/'solutions.js').read_text().split('window.MQ_SOLUTIONS = ')[1].rsplit(';',1)[0])
qmap={q['id']:q for q in questions}
assert len(domains)==3 and sum(len(d['skills']) for d in domains)==30
assert sum(len(s['subskills']) for d in domains for s in d['skills'])==90
assert len(questions)==len(qmap)==150
assert len(solutions)==555
assert set(Counter(q['domain'] for q in questions).values())=={50}
assert set(Counter(q['skill'] for q in questions).values())=={5}
assert len({q['subskill'] for q in questions})==90
valid_subs={sub['id'] for d in domains for s in d['skills'] for sub in s['subskills']}
for q in questions:
 assert len(q['options'])==len(set(q['options']))==3
 assert q['subskill'] in valid_subs
 assert q['difficulty'] in [1,2,3]
 a=solutions[q['id']]
 assert type(a['correct']) is int and 0<=a['correct']<=2
 assert len(a['steps'])>=2 and len(a['background'])>100
 assert a['explanation'] and a['oral'] and a['misconception']
revised=json.loads((ROOT/'tools/solution_steps.json').read_text())
assert set(revised)<=set(solutions)
for qid,steps in revised.items():
 assert len(steps)>=3 and len(steps)==len(set(steps)),qid
 assert solutions[qid]['steps']==steps,qid
# Alle 150 Lösungsschlüssel gegen die ursprüngliche fachliche Redaktion prüfen.
for prefix,bank in [('A',source.A),('G',source.G),('P',source.S)]:
 for i,rows in enumerate(bank):
  for j,row in enumerate(rows):
   qid=f'{prefix}{i*5+j+1:03}'
   assert qmap[qid]['options'][solutions[qid]['correct']]==row[2],qid
print('OK: 150 Datensätze, je 3 eindeutige Optionen, genau ein Lösungsschlüssel, 3/30/90 Kompetenzstruktur.')
# Unabhängige numerische Nachrechnung der arithmetischen Aufgaben.
# Antwortformatierung mit Dezimalkomma und exakten Brüchen statt Rundungsvergleichen.
expected={
 'A004':math.isqrt(49),'A006':3**2-1,'A007':2*(-2)+1,
 'A013':math.isqrt(9),'A015':math.log2(8),'A022':F(8-2,3-1),
 'A038':F(2**2,2)-F(0**2,2),'A039':2*(3-1),
 'A041':F(105,100),'A042':F(80,100),'A043':100*F(11,10)**0,'A044':F(2,1),
 'G001':2,'G011':(1+3,2-1),'G012':(3-1,4-6),'G013':(3*2,3*(-1),3*0),'G015':(2,3),
 'G016':math.isqrt(3**2+4**2),'G017':abs(-2),'G018':abs(4-1),'G019':math.isqrt(1+4+4),'G020':abs(5-2),
 'G021':1*3+2*4,'G022':2**2+(-1)**2,'G025':45,
 'G046':F(3*4,2),'G047':2*3*4,'G048':math.isqrt(3**2+4**2),'G049':2,
 'P002':2**2,'P006':F(1,6),'P007':F(3,6),'P008':F(2,10)+F(3,10),
 'P009':F(6,10)+F(5,10)-F(2,10),'P010':1-F(7,10),
 'P011':F(1,2)**2,'P012':F(3,10)*F(4,10),'P013':2*F(1,2)**2,
 'P014':F(12,100)+F(18,100),'P015':F(3,5)*F(2,4),
 'P016':math.factorial(3),'P017':6**2,'P018':math.comb(4,2),'P019':math.comb(5,1),'P020':4*3,
 'P022':F(2,10)/F(5,10),'P023':F(4,10),'P024':20-(12+8-5),'P025':F(1,2)*F(1,2)/F(1,4),
 'P027':F(3,10)*F(2,10),'P028':F(1,2),'P029':F(8,10)**2,
 'P033':1-F(7,10),'P035':F(5,10)+F(3,10),'P036':0*F(1,2)+2*F(1,2),
 'P037':F(sum(range(1,7)),6),'P038':math.isqrt(9),'P039':0,'P040':8*F(1,4),
 'P043':F(1,2)**3,'P044':math.comb(3,1)*F(1,2)**3,'P045':20*F(25,100)
}
def parse_numeric(text):
 text=text.removeprefix('x = ').removesuffix(' €').removesuffix(' m/s').removesuffix('°').strip()
 if text.startswith('(') and text.endswith(')') and '|' in text:
  return tuple(F(v.replace('−','-')) for v in text[1:-1].split('|'))
 try:return F(text.replace('−','-').replace(',','.'))
 except ValueError:return None
for qid,value in expected.items():
 options=qmap[qid]['options'];matches=[i for i,text in enumerate(options) if parse_numeric(text)==value]
 assert matches==[solutions[qid]['correct']],(qid,value,matches,options)
print(f'OK: {len(expected)} Aufgaben unabhängig numerisch nachgerechnet, je genau eine passende Option.')
# Symbolische Stichproben zu zentralen Regeln, mit Auswertung mehrerer Testpunkte.
def single(qid,functions,expected_function):
 matches=[i for i,fn in enumerate(functions) if all(abs(fn(x)-expected_function(x))<1e-9 for x in [0.5,1,2,3])]
 # Funktionen sind in der ursprünglichen Reihenfolge richtig / Distraktor / Distraktor.
 original=([source.A,source.G,source.S][['A','G','P'].index(qid[0])])[(int(qid[1:])-1)//5][(int(qid[1:])-1)%5]
 assert matches==[0],qid
 assert qmap[qid]['options'][solutions[qid]['correct']]==original[2]
single('A023',[lambda x:5*x**4,lambda x:x**4,lambda x:5*x**5],lambda x:5*x**4)
single('A025',[lambda x:6*x+4,lambda x:6*x+4-7,lambda x:3*x+4],lambda x:6*x+4)
single('A027',[lambda x:math.exp(x)*(1+x),lambda x:math.exp(x),lambda x:x*math.exp(x)],lambda x:math.exp(x)+x*math.exp(x))
single('A029',[lambda x:1/(x+1)**2,lambda x:-1/(x+1)**2,lambda x:1],lambda x:((x+1)-x)/(x+1)**2)
single('A030',[lambda x:6*(2*x+1)**2,lambda x:3*(2*x+1)**2,lambda x:6*(2*x+1)**3],lambda x:3*(2*x+1)**2*2)
assert 2**2-4==(-2)**2-4==0
assert sum(a*b for a,b in zip((1,2),(2,-1)))==0
assert sum(a*b for a,b in zip((1,2),(2,1)))!=0
assert 12+8-5<=20
assert F(1,2)*F(1,2)==F(1,4) # Bayes-Aufgabe: konsistente Randwahrscheinlichkeit
assert all(0<=a['correct']<3 for a in solutions.values())
print('OK: Potenz-, Summen-, Produkt-, Quotienten- und Kettenregel sowie zentrale Geometrie-/Wahrscheinlichkeitsbeziehungen.')
# Offline-Vertrag: klassische relative Skripte, keine Module und kein fetch.
html=(ROOT/'index.html').read_text();app=(ROOT/'app.js').read_text();css=(ROOT/'style.css').read_text()
assert 'type="module"' not in html
assert not re.search(r'(?:src|href)="https?://',html)
assert not re.search(r'https?://',(app+css).replace('http://www.w3.org/2000/svg',''))
assert 'fetch(' not in app and '@import' not in css
assert 'MQ_SOLUTIONS' not in qtext
print('OK: keine externen Laufzeitressourcen, separater Lösungsschlüssel, file://-kompatible Skripte.')

# Abschlussaufgaben: Datenzuordnung und unabhängige Nachrechnungen.
final=json.loads((ROOT/'final-questions.js').read_text().split('window.MQ_FINAL_QUESTIONS = ')[1].rsplit(';',1)[0])
assert len(final)==9 and len({q['id'] for q in final})==9
assert Counter(q['domain'] for q in final)=={'analysis':3,'geometry':3,'probability':3}
for q,row in zip(final,source.FINAL_ROWS):
 assert len(set(q['options']))==3 and q['difficulty']==3
 assert q['subskill'] in valid_subs and q['options'][solutions[q['id']]['correct']]==row[4]
assert (-1)**3-3*(-1)==2 and 1**3-3==-2
assert F(2,3)-F(-2,3)==F(4,3)
assert 2*2*(12-2**2)==32 and 24-6*2**2==0
assert F(abs(2-2+6-1),math.isqrt(4+1+4))==F(5,3)
assert F(1,math.isqrt(1+4+4))==F(1,3)
assert tuple(p-2*n for p,n in zip((3,1,2),(1,2,2)))==(1,-3,-2)
assert (1*2+2*(-1)+2*0)==0 # Lotfuß auf der Ebene
assert (F(1,100)*F(99,100))/(F(1,100)*F(99,100)+F(99,100)*F(5,100))==F(1,6)
assert sum(F(math.comb(10,k))*F(1,5)**k*F(4,5)**(10-k) for k in range(2,11))==1-F(4,5)**10-10*F(1,5)*F(4,5)**9
assert F(11,1024)<F(5,100)<F(56,1024)
print('OK: 9 schwierigere Abschlussaufgaben und deren Rechenwege unabhängig überprüft.')

# LaTeX-Umsetzung muss die Struktur der Mathematik erhalten, nicht nur parsebar sein.
from math_text import parts as math_parts
tex=lambda text:' '.join(value for kind,value in math_parts(text) if kind=='math')
assert tex('P(A ∩ B)/P(B)')==r'\frac{P\left(A \cap  B\right)}{P\left(B\right)}'
assert tex('x/(x + 1)²')==r'\frac{x}{\left(x + 1\right)^{2}}'
assert r'\int _{-1}^{1}' in tex('∫₋₁¹ (1 − x²) dx')
assert tex('(uv)′')==r"\left(uv\right)'"
print('OK: LaTeX erhält Funktionsargumente in Brüchen, Nennerpotenzen, Ableitungen und negative Integralgrenzen.')

assert math_parts('Leite f(x) = x/(x + 1) für x ≠ −1 ab.')[-1]==['text',' ab.']
