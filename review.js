/* Einfache, deterministische Wiederholungsplanung. Kein FSRS und keine Abhängigkeiten. */
(function(root){
'use strict';
const MINUTE=60000,DAY=86400000,INTERVALS=[1,3,7,14,30,60,90],NEW_PER_DAY=5,BATCH_SIZE=5;
const dayKey=time=>new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Berlin',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date(time));
function build(sessions,questions,solutions,now=Date.now()){
 const cards=Object.fromEntries(questions.map(q=>[q.id,{id:q.id,domain:q.domain,dueAt:null,step:-1,firstAt:null,lastAt:null,unknown:0,wrong:0,guessed:0}]));
 const today=dayKey(now);
 // Gleiche Zeitstempel behalten die gespeicherte Reihenfolge. Einheiten-IDs sind im Speicher bereits eindeutig.
 for(const session of [...sessions].sort((a,b)=>Date.parse(a.date)-Date.parse(b.date))){
  const time=Date.parse(session.date);
  session.ids.forEach((id,i)=>{
   const card=cards[id],answer=session.answers[i];if(!card||answer===null)return;
   const guessed=!!session.guessed?.[i],correct=answer===solutions[id].correct;
   if(card.firstAt===null)card.firstAt=time;
   card.lastAt=time;
   if(answer===-1)card.unknown++;
   else if(!correct)card.wrong++;
   if(guessed)card.guessed++;
   if(!correct||guessed){card.step=-1;card.dueAt=time+(answer===-1?5:10)*MINUTE;return;}
   // Frühes freiwilliges Üben verlängert ein noch laufendes Intervall nicht.
   if(card.dueAt!==null&&time<card.dueAt)return;
   card.step=Math.min(card.step+1,INTERVALS.length-1);card.dueAt=time+INTERVALS[card.step]*DAY;
  });
 }
 const all=questions.map(q=>cards[q.id]);
 const introducedToday=all.filter(c=>c.firstAt!==null&&dayKey(c.firstAt)===today).length;
 const remainingNew=Math.max(0,NEW_PER_DAY-introducedToday);
 const due=all.filter(c=>c.dueAt!==null&&c.dueAt<=now).sort((a,b)=>a.dueAt-b.dueAt);
 const unseen=all.filter(c=>c.firstAt===null),later=all.filter(c=>c.dueAt!==null&&c.dueAt>now).sort((a,b)=>a.dueAt-b.dueAt);
 function queue(domain){
  const matches=c=>!domain||c.domain===domain;
  const reviews=due.filter(matches).slice(0,BATCH_SIZE);
  // Neue Aufgaben mischen die drei Gebiete; ein einzelner Stapel bleibt fachbezogen.
  const groups=[...new Set(questions.map(q=>q.domain))].map(d=>unseen.filter(c=>c.domain===d&&matches(c)));
  const fresh=[];for(let i=0;groups.some(g=>g[i]);i++)for(const group of groups)if(group[i])fresh.push(group[i]);
  return [...reviews,...fresh.slice(0,Math.min(remainingNew,BATCH_SIZE-reviews.length))].map(c=>c.id);
 }
 return {cards,due,unseen,later,remainingNew,introducedToday,queue,nextDue:later[0]?.dueAt??null};
}
root.MQ_REVIEW=Object.freeze({build,dayKey,INTERVALS:Object.freeze(INTERVALS),NEW_PER_DAY,BATCH_SIZE});
})(typeof window==='undefined'?globalThis:window);
