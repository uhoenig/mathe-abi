/* Kompetenznachweise, Fragenfortschritt und dauerhaft offene Decks bleiben getrennt. */
(function(root){
'use strict';
const CONFIG=Object.freeze({deckVersion:1,intervalDays:Object.freeze([1,3,7,14,30,60]),lapseDays:1});
const metadata=root.MQ_QUESTION_METADATA;
const questions=[...root.MQ_QUESTIONS,...root.MQ_FINAL_QUESTIONS,...root.MQ_EXTRA_QUESTIONS];
for(const q of questions)Object.assign(q,metadata[q.id]);
const questionById=Object.freeze(Object.fromEntries(questions.map(q=>[q.id,q])));
const decks=Object.freeze(root.MQ_DECK_MANIFEST.map(d=>Object.freeze({...d,questionIds:Object.freeze([...d.questionIds]),requiredCompetencies:Object.freeze([...d.requiredCompetencies])})));
const questionIds=Object.freeze(decks.flatMap(d=>d.questionIds));
const deckFor=Object.freeze(Object.fromEntries(decks.flatMap(d=>d.questionIds.map(id=>[id,d.id]))));
function fresh(){return {deckVersion:CONFIG.deckVersion,unlockedDecks:[1],currentDeck:1,newPerDay:null,reviews:{},daily:{}};}
function progress(sessions,solutions,manifest=decks){
 const correctQuestions=new Set(),evidence=new Set();
 for(const s of sessions)for(let i=0;i<s.ids.length;i++){
  const id=s.ids[i],q=questionById[id];
  if(s.answers[i]===null||!solutions[id]||s.answers[i]!==solutions[id].correct)continue;
  correctQuestions.add(id);
  if(q?.unlockEligible&&!s.guessed?.[i])for(const cid of q.competencies)evidence.add(cid);
 }
 return manifest.map(d=>{
  const required=d.requiredCompetencies||[],covered=required.filter(cid=>evidence.has(cid));
  return {id:d.id,total:d.questionIds.length,correct:d.questionIds.filter(id=>correctQuestions.has(id)).length,required:required.length,covered:covered.length,requiredCompetencies:[...required],coveredCompetencies:covered,missingCompetencies:required.filter(cid=>!evidence.has(cid)),complete:required.length>0&&covered.length===required.length};
 });
}
function reconcile(learning,sessions,solutions,manifest=decks){
 const stats=progress(sessions,solutions,manifest),unlocked=new Set(learning.unlockedDecks),added=[];
 if(manifest.length)unlocked.add(manifest[0].id);
 for(let i=0;i<manifest.length-1;i++)if(unlocked.has(manifest[i].id)&&manifest[i].questionIds.length>0&&stats[i].complete&&manifest[i+1].questionIds.length>0&&!unlocked.has(manifest[i+1].id)){unlocked.add(manifest[i+1].id);added.push(manifest[i+1].id);}
 const opened=[...unlocked].filter(id=>manifest.some(d=>d.id===id)).sort((a,b)=>a-b);
 const current=added.length?added.at(-1):opened.includes(learning.currentDeck)?learning.currentDeck:opened[0];
 return {stats,unlockedDecks:opened,currentDeck:current,added};
}
function mixVariants(ids){
 const groups=new Map();
 for(const id of ids){const key=questionById[id]?.competency||id;if(!groups.has(key))groups.set(key,[]);groups.get(key).push(id);}
 const out=[];
 while(groups.size)for(const [key,group]of groups){out.push(group.shift());if(!group.length)groups.delete(key);}
 return out;
}
root.MQ_JOURNEY=Object.freeze({CONFIG,decks,questionIds,deckFor,questionById,fresh,progress,reconcile,mixVariants});
})(typeof window==='undefined'?globalThis:window);
