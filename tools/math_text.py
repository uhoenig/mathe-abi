"""Übersetzt die vorhandene Textnotation in geprüfte LaTeX-Abschnitte.

Fragen, Antwortschlüssel und Klartext bleiben unverändert. Die Ausgabe enthält
nur Darstellungsdaten; KaTeX rendert diese lokal und ohne vertrauenswürdige Befehle.
"""
import json
import re
from pathlib import Path
ROOT = Path(__file__).resolve().parent.parent
SUP = str.maketrans('⁰¹²³⁴⁵⁶⁷⁸⁹ⁿᵐˣᵗ⁻⁺', '0123456789nmxt-+')
SUB = str.maketrans('₀₁₂₃₄₅₆₇₈₉₋', '0123456789-')
# Wortgrenzen verhindern, dass Buchstaben aus deutschen Wörtern Formeln werden.
TOKEN = re.compile(r'u′v′|u′v|uv′|\([a-zA-Z0-9]+ über [a-zA-Z0-9]+\)|(?<![\w])(?:arcsin|arccos|cos|sin|Var|np|uv|ab|ac|mx|tv|ru|sv|xy|dx|dy|dt|[A-Za-zαβσℝ])(?:[′″]|[₀-₉₋]+|[⁰¹²³⁴⁵⁶⁷⁸⁹ⁿᵐˣᵗ⁻⁺]+)*(?![a-zA-ZäöüÄÖÜß])|(?<![a-zA-ZäöüÄÖÜß])\d+(?:,\d+)?(?:[⁰¹²³⁴⁵⁶⁷⁸⁹ⁿᵐˣᵗ⁻⁺]+)?|[+−\-·×/=<≤≥>≠∈∪∩∞±√∫½¼σℝα]|[()[\]{}|;]|[₀-₉₋⁰¹²³⁴⁵⁶⁷⁸⁹]+|[′″%°]')
# x direkt nach einer Zahl ist ebenfalls eine Variable (3x, 2xy).
ADJACENT = re.compile(r'[A-Za-z](?:[′″]|[₀-₉₋]+|[⁰¹²³⁴⁵⁶⁷⁸⁹ⁿᵐˣᵗ⁻⁺]+)*(?![a-zA-ZäöüÄÖÜß])')
SYMBOL = {'−':'-', '·':r'\cdot ', '×':r'\times ', '≤':r'\le ', '≥':r'\ge ', '≠':r'\ne ', '∈':r'\in ', '∪':r'\cup ', '∩':r'\cap ', '∞':r'\infty ', '±':r'\pm ', '∫':r'\int ', '½':r'\frac{1}{2}', '¼':r'\frac{1}{4}', 'σ':r'\sigma ', 'α':r'\alpha ', 'β':r'\beta ', 'ℝ':r'\mathbb{R}', '%':r'\%', '°':r'{}^\circ', '|':r'\mid ', ';':r';\,', 'dx':r'\,\mathrm{d}x', 'Var':r'\operatorname{Var}', 'arcsin':r'\arcsin ', 'arccos':r'\arccos ', 'sin':r'\sin ', 'cos':r'\cos '}
OPERATORS = set('+-−·×/=<>≤≥≠∈∪∩|;±')

def token_tex(token):
    choose=re.fullmatch(r'\(([a-zA-Z0-9]+) über ([a-zA-Z0-9]+)\)',token)
    if choose:return r'\binom{'+choose[1]+'}{'+choose[2]+'}'
    if token in SYMBOL:
        return SYMBOL[token]
    token = re.sub(r'[⁰¹²³⁴⁵⁶⁷⁸⁹ⁿᵐˣᵗ⁻⁺]+', lambda m:'^{'+m[0].translate(SUP)+'}', token)
    token = re.sub(r'[₀-₉₋]+', lambda m:'_{'+m[0].translate(SUB)+'}', token)
    return token.replace('′', "'").replace('″', "''").replace(',', '{,}')

def latex(tokens):
    """Gruppen und Wurzeln bilden Atome; / wird zum echten Bruch."""
    def group(pos, nested=False):
        atoms=[]
        while pos<len(tokens):
            token=tokens[pos]
            if token in ')]}':
                if nested:
                    return atoms,pos+1,token
                atoms.append((token_tex(token),False));pos+=1;continue
            if re.fullmatch(r"(?:f|g|h|F|A|B|K|s|P|E|Var|sin|cos|arcsin|arccos)(?:[′″])?",token) and pos+1<len(tokens) and tokens[pos+1]=='(':
                inner,pos,closing=group(pos+2,True)
                atoms.append((token_tex(token)+r'\left('+combine(inner)+r'\right'+closing,True));continue
            if token in '([{':
                inner,pos,closing=group(pos+1,True)
                left=r'\{' if token=='{' else token
                right=r'\}' if closing=='}' else closing
                atoms.append((r'\left'+left+combine(inner)+r'\right'+right,True));continue
            atoms.append((token_tex(token), token not in OPERATORS and token!='√'))
            pos+=1
        return atoms,pos,''
    def combine(atoms):
        # Beträge bündeln; einzelne Striche in Koordinaten oder P(A | B) bleiben Trenner.
        i=0
        while i<len(atoms):
            if atoms[i][0]==r'\mid ' and (i==0 or not atoms[i-1][1] or atoms[i-1][0].endswith(r'\right|')):
                j=next((j for j in range(i+1,len(atoms)) if atoms[j][0]==r'\mid '),None)
                if j is not None:
                    atoms[i:j+1]=[(r'\left|'+combine(atoms[i+1:j])+r'\right|',True)]
            i+=1
        # Ein Exponent nach einer Klammer gehört zu dieser Klammer, auch im Nenner.
        i=1
        while i<len(atoms):
            if atoms[i][0].startswith(('^{','_{')) or atoms[i][0] in ("'","''"):
                atoms[i-1:i+1]=[(atoms[i-1][0]+atoms[i][0],True)]
            else:i+=1
        # Wurzeln binden das folgende Atom, etwa √(x² + 1) oder √49.
        i=0
        while i<len(atoms)-1:
            if atoms[i][0]=='√' and atoms[i+1][1]:
                atoms[i:i+2]=[(r'\sqrt{'+atoms[i+1][0]+'}',True)]
            else:i+=1
        i=1
        while i<len(atoms)-1:
            if atoms[i][0]=='/' and atoms[i-1][1] and atoms[i+1][1]:
                atoms[i-1:i+2]=[(r'\frac{'+atoms[i-1][0]+'}{'+atoms[i+1][0]+'}',True)];i=max(1,i-1)
            else:i+=1
        return ' '.join(a[0] for a in atoms)
    # Integrale tragen in der Quellnotation untere und obere Grenzen am Zeichen.
    out=combine(group(0)[0])
    out=re.sub(r'\\int\s+_\{([^}]+)\}\s+\^\{([^}]+)\}', r'\\int_{\1}^{\2}', out)
    return out

def parts(text):
    if r'\(' in text:
        out=[];cursor=0
        for match in re.finditer(r'\\\((.*?)\\\)',text):
            if match.start()>cursor:out.extend(parts(text[cursor:match.start()]))
            out.append(['math',match[1]]);cursor=match.end()
        if cursor:
            if cursor<len(text):out.extend(parts(text[cursor:]))
            return out
    matches=[];pos=0
    while pos<len(text):
        m=TOKEN.match(text,pos)
        if not m and pos and (text[pos-1].isdigit() or text[pos-1] in '⁰¹²³⁴⁵⁶⁷⁸⁹'):
            m=ADJACENT.match(text,pos)
        if m and m[0]=='ab':
            left=text[:pos].rstrip();right=text[m.end():].lstrip()
            if not (left and left[-1] in '=+−-·/(' or right and right[0] in '=+−-·/)'):m=None
        if m:matches.append((m.start(),m.end(),m[0]));pos=m.end()
        else:pos+=1
    runs=[]
    for token in matches:
        if runs and not text[runs[-1][-1][1]:token[0]].strip():runs[-1].append(token)
        else:runs.append([token])
    result=[];cursor=0
    for run in runs:
        # Eine Klammer um deutschen Text gehört zum Text und nicht zur Formel.
        balance=0;end=len(run)
        for i,(_,_,t) in enumerate(run):
            if len(t)==1 and t in '([{':balance+=1
            elif len(t)==1 and t in ')]}':
                if balance==0:
                    if i==0:continue
                    end=i;break
                balance-=1
        run=run[:end]
        while run and run[0][2] in ')]};':run=run[1:]
        while run and (run[-1][2] in (OPERATORS-{'|'}) or run[-1][2] in '([{√∫'):run.pop()
        # Nicht geschlossene Gruppen am Ende lassen wir im Klartext stehen.
        while run:
            depth=0;unclosed=[]
            for i,(_,_,t) in enumerate(run):
                if len(t)==1 and t in '([{':unclosed.append(i)
                elif t in ')]}' and unclosed:unclosed.pop()
            if not unclosed:break
            run=run[:unclosed[0]]
        if not run or not any(re.search(r'[\wℝα∞½¼]',t) for _,_,t in run):continue
        a,b=run[0][0],run[-1][1]
        if a>cursor:result.append(['text',text[cursor:a]])
        result.append(['math',latex([t for _,_,t in run])]);cursor=b
    if cursor<len(text):result.append(['text',text[cursor:]])
    return result

def build():
    def read(name,marker):return json.loads((ROOT/name).read_text().split(marker)[1].rsplit(';',1)[0])
    questions=read('questions.js','window.MQ_QUESTIONS = ')+read('final-questions.js','window.MQ_FINAL_QUESTIONS = ')
    extra=ROOT/'expanded-questions.js'
    if extra.exists():questions+=read('expanded-questions.js','window.MQ_EXTRA_QUESTIONS = ')
    solutions=read('solutions.js','window.MQ_SOLUTIONS = ')
    texts=set()
    for q in questions:texts.update([q['prompt'],*q['options']])
    for a in solutions.values():texts.update([a['explanation'],*a['steps'],a['background'],a['misconception'],a['oral']])
    data={text:parts(text) for text in sorted(texts)}
    data={text:p for text,p in data.items() if any(kind=='math' for kind,_ in p)}
    (ROOT/'math-content.js').write_text('// Aus den Fragen und Lösungswegen erzeugte LaTeX-Darstellung.\nwindow.MQ_MATH_CONTENT = '+json.dumps(data,ensure_ascii=False,separators=(',',':'))+';\n')
    print(f'LaTeX-Darstellung für {len(data)} Texte erstellt.')
    return data
if __name__=='__main__':build()
