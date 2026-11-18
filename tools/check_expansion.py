"""Prüft ausgelieferte Daten, Mathematikmodelle, Metadaten und Altbestand.

Aufruf mit SymPy: python tools/check_expansion.py
Die Berichte werden ausschließlich aus dem tatsächlich ausgelieferten Pool erzeugt.
"""
import collections
import hashlib
import json
import re
from pathlib import Path
import sympy as S
from build_expansion import read
ROOT=Path(__file__).resolve().parent.parent
x=S.Symbol('x',positive=True)

def validate(write=True):
    baseline=json.loads((ROOT/'data/question_baseline.json').read_text())
    matrix=json.loads((ROOT/'data/competency_matrix.json').read_text())
    base=read('questions.js','window.MQ_QUESTIONS = ')+read('final-questions.js','window.MQ_FINAL_QUESTIONS = ')
    extra=read('expanded-questions.js','window.MQ_EXTRA_QUESTIONS = ')
    solutions=read('solutions.js','window.MQ_SOLUTIONS = ')
    js=(ROOT/'competencies.js').read_text()
    metadata=json.loads(js.split('window.MQ_QUESTION_METADATA = ')[1].split(';\nwindow.MQ_DECK_MANIFEST')[0])
    decks=json.loads(js.split('window.MQ_DECK_MANIFEST = ')[1].rsplit(';',1)[0])
    checks=json.loads((ROOT/'data/expansion_validation.json').read_text())
    comps={c['id']:c for c in matrix['competencies']}
    # Originale einschließlich Aufgaben, Distraktoren und Reihenfolge bleiben byteinhaltlich gleich.
    assert base==baseline['originals'],'Vorhandene Fragen wurden verändert.'
    allq=[{**q,**metadata[q['id']]} for q in base]+extra
    byid={q['id']:q for q in allq}
    assert len(byid)==len(allq)==555
    active=[q for q in allq if q['domain']!='probability']
    assert len(active)==502 and len(extra)==396
    assert sum(q['domain']=='probability' for q in allq)==53
    assert len(set(q['prompt'] for q in allq))==len(allq),'Identische Aufgabenstellung'
    assert set(byid)==set(solutions)==set(metadata)
    for q in allq:
        sol=solutions[q['id']]
        assert len(q['options'])==len(set(q['options']))==3,q['id']
        assert type(sol['correct']) is int and sol['correct'] in range(3)
        assert len(sol['steps'])>=2 and all(sol['steps']) and sol['explanation'],q['id']
        assert q['mainTopic'] and q['subtopic'] and q['competencies'] and q['variantFamily'],q['id']
        assert q['difficulty'] in [1,2,3]
        assert q['validationStatus'] in ['automatically_validated','manually_reviewed','review_pending']
        if q['domain']=='probability':assert q['deck'] is None and not q['unlockEligible'];continue
        assert q['competency'] in comps
        assert q['domain']==comps[q['competency']]['domain']
        assert q['deck'] in range(1,11)
        assert all(p in comps for p in q['prerequisites'])
    assigned=[qid for d in decks for qid in d['questionIds']]
    assert len(assigned)==len(set(assigned))==len(active)
    assert set(assigned)=={q['id'] for q in active}
    # Lehrzielgraph darf keine zyklischen oder zeitlich unmöglichen Voraussetzungen enthalten.
    def walk(cid,stack):
        assert cid not in stack,('Zyklus',cid)
        for pre in comps[cid]['prerequisites']:
            assert comps[pre]['deck']<=comps[cid]['deck'],(cid,pre)
            walk(pre,stack|{cid})
    for cid in comps:walk(cid,set())
    for d in decks:
        assert d['requiredCompetencies']
        for cid in d['requiredCompetencies']:
            assert cid in comps and comps[cid]['required']
            proofs=[byid[qid] for qid in d['questionIds'] if byid[qid]['competency']==cid and byid[qid]['unlockEligible']]
            assert len(proofs)>=2 and all(q['difficulty']==1 for q in proofs)
    verified=0
    for q in extra:
        info=checks[q['id']];assert info['status']==q['validationStatus']
        method=info['method'];sol=solutions[q['id']]
        if method['kind']=='editorial':
            assert method['proof']==sol['steps'] and len(method['proof'])>=2
            continue
        source=S.sympify(method['source'],locals={'x':x})
        values=[S.sympify(v,locals={'x':x}) for v in method['answers']]
        target=S.diff(source,x) if method['kind']=='derivative' else S.integrate(source,x) if method['kind']=='primitive' else source
        delta=S.simplify(target-values[0])
        zero=S.zeros(*delta.shape) if isinstance(delta,S.MatrixBase) else 0
        assert delta==zero,(q['id'],'Lösung',delta)
        # Die Antwort selbst muss dem geprüften Modell entsprechen, nicht nur ein internes Feld.
        latex=lambda value:r'\('+S.latex(value).replace(r'\log',r'\ln')+r'\)'
        assert q['options'][sol['correct']]==latex(S.simplify(values[0])),q['id']
        assert set(q['options'])=={latex(S.simplify(v)) for v in values},q['id']
        for a in range(3):
            for b in range(a):
                diff=S.simplify(values[a]-values[b])
                assert diff!=(S.zeros(*diff.shape) if isinstance(diff,S.MatrixBase) else 0),(q['id'],'äquivalente Optionen')
                # Nicht bloß bei einer Nullstelle verschieden: mehrere reguläre positive Proben.
                if not isinstance(diff,S.MatrixBase) and diff.has(x):
                    assert any(abs(complex(S.N(diff.subs(x,p))))>1e-10 for p in [R for R in [S.Rational(1,2),S.Rational(4,3),2,3]]),(q['id'],'Distraktorprobe')
        verified+=1
    assert set(checks)=={q['id'] for q in extra}
    family=collections.Counter(q['variantFamily'] for q in extra)
    assert max(family.values())==2
    # Verschiedene Schwierigkeitsstufen sind tatsächliche Daten, keine bloßen Decklabels.
    coverage=[]
    for cid,c in comps.items():
        questions=[q for q in active if q['competency']==cid]
        counts=dict(collections.Counter(q['difficulty'] for q in questions))
        assert all(counts.get(d,0)>=2 for d in [1,2,3]),cid
        coverage.append({**c,'questionIds':[q['id'] for q in questions],'questionCount':len(questions),'byDifficulty':counts,'covered':True})
    # Normalisierte Fingerprints dienen dem manuellen Blick auf nahe Varianten, nicht als Beweis von Duplikaten.
    near=collections.defaultdict(list)
    for q in extra:near[re.sub(r'\d+(?:[.,]\d+)?','#',q['prompt'])].append(q['id'])
    near=[ids for ids in near.values() if len(ids)>1]
    manual=[dict(id=q['id'],competency=q['competency'],reason='Konzeptionelle Begründung: unabhängige Fachsichtung ausstehend.') for q in extra if q['validationStatus']=='manually_reviewed']
    pending=[dict(id=q['id'],reason='Altbestand: vorhandene Rechentests prüfen Teilmengen; keine neue vollständige mathematische Einzelvalidierung.') for q in active if q['validationStatus']=='review_pending']
    report=dict(generated='2026-11-18',activeTotal=len(active),existingActive=106,newActive=len(extra),inactiveStochastics=53,totalPreserved=159,byDomain=dict(collections.Counter(q['domain'] for q in active)),byDifficulty=dict(collections.Counter(q['difficulty'] for q in active)),byDeck=[{**d,'count':len(d['questionIds'])} for d in decks],competencyCoverage=coverage,fullyCoveredCompetencies=len(coverage),competenciesWithoutQuestions=[],curriculumAssumptions=matrix['scopeAssumptions'],curriculumGaps=matrix['additionalGaps'],validation=dict(automaticallyValidatedNew=verified,editoriallyReviewedNew=len(manual),pendingActiveLegacy=len(pending),independentTeacherReview=False,scope='Rechenmodelle symbolisch/exakt auf Lösung und Distraktoren geprüft; sprachliche Interpretation und konzeptionelle Aussagen redaktionell, nicht extern fachlich freigegeben.'),manualReview=manual,pendingReview=pending,exactPromptDuplicates=[],nearVariantGroups=near,sourceLinks=matrix['sources'])
    if write:
        (ROOT/'question_coverage.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
        (ROOT/'MANUAL_REVIEW.md').write_text('# Fachliche Nachprüfung\n\nKeine unabhängige Lehrkraftfreigabe. Die folgenden neuen konzeptionellen Aufgaben sind anhand ihrer Begründungen redaktionell gesichtet, aber nicht symbolisch beweisvalidiert. Danach folgen vorhandene Aufgaben ohne neue vollständige Einzelvalidierung.\n\n'+''.join(f"- {r['id']}: {r.get('competency','Altbestand')} – {r['reason']}\n" for r in manual+pending))
    print('OK',len(active),'aktive Fragen,',len(extra),'neu,',len(comps),'Kompetenzen,',verified,'symbolisch/exakt geprüft,',len(manual),'redaktionell,',len(pending),'Altbestand mit ausstehender Einzelprüfung.')
    return report
if __name__=='__main__':validate()
