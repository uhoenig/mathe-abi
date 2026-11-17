/* Stabile Deckbelegung. Fragen und Lösungsschlüssel bleiben in ihren bisherigen Dateien. */
(function(root){
'use strict';
const CONFIG=Object.freeze({deckVersion:1,intervalDays:Object.freeze([1,3,7,14,30,60]),lapseDays:1});
const names=['Grundlagen','Funktionen & Vektoren','Regeln anwenden','Verfahren verstehen','Ableitung & Winkel','Verfahren kombinieren','Zusammenhänge','Integral & Ebene','Modelle & Schnittpunkte','Prüfungsausblick'];
const levels=['Sehr leicht','Leicht','Leicht','Leicht–mittel','Mittel','Mittel','Mittel','Mittel','Mittel','Mittel–schwer'];
const range=(prefix,start,end)=>Array.from({length:end-start+1},(_,i)=>prefix+String(start+i).padStart(3,'0'));
const decks=names.map((name,i)=>Object.freeze({id:i+1,name,level:levels[i],format:'multiple-choice',targetCount:50,questionIds:Object.freeze([...range('A',i*5+1,i*5+5),...range('G',i*5+1,i*5+5),...(i===9?range('F',1,6):[])])}));
const questionIds=Object.freeze(decks.flatMap(d=>d.questionIds));
const deckFor=Object.freeze(Object.fromEntries(decks.flatMap(d=>d.questionIds.map(id=>[id,d.id]))));
function fresh(){return {deckVersion:CONFIG.deckVersion,unlockedDecks:[1],currentDeck:1,newPerDay:null,reviews:{},daily:{}};}
function progress(sessions,solutions,manifest=decks){
 const correct=new Set();for(const s of sessions)for(let i=0;i<s.ids.length;i++)if(s.answers[i]!==null&&s.answers[i]===solutions[s.ids[i]]?.correct)correct.add(s.ids[i]);
 return manifest.map(d=>({id:d.id,total:d.questionIds.length,correct:d.questionIds.filter(id=>correct.has(id)).length,required:Math.ceil(d.questionIds.length*.8),complete:d.questionIds.length>0&&d.questionIds.filter(id=>correct.has(id)).length>=Math.ceil(d.questionIds.length*.8)}));
}
function reconcile(learning,sessions,solutions,manifest=decks){
 const stats=progress(sessions,solutions,manifest),unlocked=new Set(learning.unlockedDecks),added=[];if(manifest.length)unlocked.add(manifest[0].id);
 for(let i=0;i<manifest.length-1;i++)if(unlocked.has(manifest[i].id)&&stats[i].complete&&manifest[i+1].questionIds.length>0&&!unlocked.has(manifest[i+1].id)){unlocked.add(manifest[i+1].id);added.push(manifest[i+1].id);}
 const opened=[...unlocked].filter(id=>manifest.some(d=>d.id===id)).sort((a,b)=>a-b);
 const current=added.length?added.at(-1):opened.includes(learning.currentDeck)?learning.currentDeck:opened[0];
 return {stats,unlockedDecks:opened,currentDeck:current,added};
}
root.MQ_JOURNEY=Object.freeze({CONFIG,decks:Object.freeze(decks),questionIds,deckFor,fresh,progress,reconcile});
})(typeof window==='undefined'?globalThis:window);
