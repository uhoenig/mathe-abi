"""Kompetenzkatalog, Metadaten und Erweiterung reproduzierbar ausliefern."""
import collections
import json
from pathlib import Path
from expanded_bank import build,COMP,CAT
ROOT=Path(__file__).resolve().parent.parent

def read(name,marker):return json.loads((ROOT/name).read_text().split(marker)[1].rsplit(';',1)[0])
def dump(v):return json.dumps(v,ensure_ascii=False,indent=2)
def build_expansion():
    qs,ss,checks=build()
    old=read('questions.js','window.MQ_QUESTIONS = ')+read('final-questions.js','window.MQ_FINAL_QUESTIONS = ')
    metadata={}
    vector_answers={'G006','G007','G009','G011','G012','G013','G015','G021','G024','G026','G030','G037','G038'}
    for q in old:
        cid=CAT['legacyCompetencies'].get(q['id'])
        active=q['domain']!='probability'
        if cid:
            c=COMP[cid]
            deck=(int(q['id'][1:])-1)//5+1 if q['id'][0] in 'AG' else 10
            metadata[q['id']]=dict(competency=cid,competencies=[cid],mainTopic=c['mainTopic'],subtopic=c['subtopic'],deck=deck,unlockEligible=q['difficulty']==1,prerequisites=c['prerequisites'],variantFamily='legacy-'+q['subskill'],validationStatus='review_pending',active=True)
        else:
            cid='P'+q['skill'][-2:]
            metadata[q['id']]=dict(competency=cid,competencies=[cid],mainTopic='Stochastik (inaktiv)',subtopic=q['subskill'],deck=None,unlockEligible=False,prerequisites=[],variantFamily='legacy-'+q['subskill'],validationStatus='review_pending',active=False)
    for q in old:
        metadata[q['id']]['answerNotation']='column-vector' if q['id'] in vector_answers else 'standard'
    for q in qs:metadata[q['id']]={k:q[k] for k in ['competency','competencies','mainTopic','subtopic','deck','unlockEligible','prerequisites','variantFamily','validationStatus']};metadata[q['id']]['active']=True
    names=['Grundlagen','Funktionen & Vektoren','Transformationen & Winkel','Ableitungen & Geraden','Rechenregeln & Lagebeziehungen','Funktionen & Ebenen','Kurven & Schnitte','Integrale & Abstände','Modelle & Raumgeometrie','Vernetzen & Begründen']
    desc=['Sicher rechnen, Punkte und Vektoren verstehen.','Funktionsklassen, Definitionsbereiche und Vektorlängen erkunden.','Transformationen, Logarithmen und Skalarprodukte verbinden.','Änderungsraten und Geraden mit LGS untersuchen.','Ableitungsregeln und Geradenlagen anwenden.','Weitere Funktionen und Ebenendarstellungen nutzen.','Tangenten, Kurven und geometrische Schnitte verknüpfen.','Integrale, Flächen und metrische Geometrie einsetzen.','Bestandsmodelle und räumliche Situationen interpretieren.','Optimieren, projizieren und mathematische Argumente prüfen.']
    decks=[]
    allq=[{**q,**metadata[q['id']]} for q in old]+qs
    for i,name in enumerate(names,1):
        comps=[c for c in CAT['competencies'] if c['deck']==i]
        ids=[q['id'] for q in allq if q.get('deck')==i]
        required=[c['id'] for c in comps if c['required']]
        assert required and all(any(q['competency']==cid and q['unlockEligible'] for q in allq if q['id'] in ids) for cid in required)
        decks.append(dict(id=i,name=name,description=desc[i-1],level='Leicht · Mittel · Schwer',format='multiple-choice',questionIds=ids,competencyIds=[c['id'] for c in comps],requiredCompetencies=required,prerequisites=[] if i==1 else [i-1],difficultyDistribution=dict(collections.Counter(q['difficulty'] for q in allq if q['id'] in ids))))
    # Eigene Datei: Originalfragen und ihre Antwortreihenfolgen bleiben bytegleich.
    js='// Erzeugter Kompetenzkatalog und stabile Metadaten. Keine Lösungen.\nwindow.MQ_COMPETENCIES = '+dump(CAT['competencies'])+';\nwindow.MQ_QUESTION_METADATA = '+dump(metadata)+';\nwindow.MQ_DECK_MANIFEST = '+dump(decks)+';\n'
    (ROOT/'competencies.js').write_text(js)
    (ROOT/'expanded-questions.js').write_text('// Kompetenzorientierte Erweiterung; keine Lösungsschlüssel.\nwindow.MQ_EXTRA_QUESTIONS = '+dump(qs)+';\n')
    (ROOT/'data/expansion_validation.json').write_text(dump(checks)+'\n')
    return qs,ss,metadata,decks
if __name__=='__main__':
    qs,ss,metadata,decks=build_expansion()
    solutions=read('solutions.js','window.MQ_SOLUTIONS = ')
    solutions.update(ss)
    (ROOT/'solutions.js').write_text('// Separater Lösungsschlüssel. Lokal einsehbar.\nwindow.MQ_SOLUTIONS = '+dump(solutions)+';\n')
    from math_text import build as math_build
    math_build()
    print('Erweitert um',len(qs),'Aufgaben; Deckgrößen:',[len(d['questionIds']) for d in decks])
