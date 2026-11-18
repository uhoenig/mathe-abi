/* Einfache Zeitplanung mit gespeicherten Snapshots. Freies Training verändert keine Termine. */
(function(root){
'use strict';
const DAY=86400000;
function dayKey(time){const p=new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Berlin',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date(time));const part=t=>p.find(x=>x.type===t).value;return `${part('year')}-${part('month')}-${part('day')}`;}
const clone=value=>JSON.parse(JSON.stringify(value));
function apply(learning,session,solutions,allowed,config=root.MQ_JOURNEY.CONFIG){
 const next=clone(learning);if(session.mode!=='daily')return next;
 const time=Date.parse(session.date),day=dayKey(time),daily=next.daily[day]||(next.daily[day]={newIds:[],answered:0,sessions:[]});
 if(daily.sessions.includes(session.id))return next;
 daily.sessions.push(session.id);
 session.ids.forEach((id,i)=>{
  const answer=session.answers[i];if(answer===null||!allowed.includes(id))return;
  let card=next.reviews[id];const isNew=!card,correct=answer===solutions[id].correct;
  if(!card)card=next.reviews[id]={attempts:0,correct:0,firstAt:session.date,lastAt:session.date,dueAt:null,intervalDays:0,step:-1};
  card.attempts++;if(correct)card.correct++;card.lastAt=session.date;daily.answered++;
  if(isNew&&!daily.newIds.includes(id))daily.newIds.push(id);
  if(!correct||session.guessed?.[i]){card.step=-1;card.intervalDays=config.lapseDays;card.dueAt=new Date(time+config.lapseDays*DAY).toISOString();return;}
  if(card.dueAt&&time<Date.parse(card.dueAt))return;
  card.step=Math.min(card.step+1,config.intervalDays.length-1);card.intervalDays=config.intervalDays[card.step];card.dueAt=new Date(time+card.intervalDays*DAY).toISOString();
 });
 return next;
}
function plan(learning,decks,now=Date.now(),config=root.MQ_JOURNEY.CONFIG){
 const ids=decks.filter(d=>learning.unlockedDecks.includes(d.id)).flatMap(d=>d.questionIds),today=learning.daily[dayKey(now)]||{newIds:[],answered:0,sessions:[]};
 const due=ids.filter(id=>learning.reviews[id]?.dueAt&&Date.parse(learning.reviews[id].dueAt)<=now).sort((a,b)=>Date.parse(learning.reviews[a].dueAt)-Date.parse(learning.reviews[b].dueAt));
 const later=ids.filter(id=>learning.reviews[id]?.dueAt&&Date.parse(learning.reviews[id].dueAt)>now).sort((a,b)=>Date.parse(learning.reviews[a].dueAt)-Date.parse(learning.reviews[b].dueAt));
 const current=decks.find(d=>d.id===learning.currentDeck);
 const mix=root.MQ_JOURNEY.mixVariants||((ids)=>ids);
 const newIds=mix((current?.questionIds||[]).filter(id=>!learning.reviews[id]).sort((a,b)=>(root.MQ_JOURNEY.questionById?.[a]?.difficulty||1)-(root.MQ_JOURNEY.questionById?.[b]?.difficulty||1)));
 return {due,later,newIds,today,queue:[...mix(due),...newIds],nextDue:later.length?learning.reviews[later[0]].dueAt:null};
}
function migrate(sessions,solutions,allowed){let learning=root.MQ_JOURNEY.fresh();for(const s of [...sessions].sort((a,b)=>Date.parse(a.date)-Date.parse(b.date)))learning=apply(learning,{...s,mode:'daily'},solutions,allowed);return learning;}
root.MQ_REVIEW=Object.freeze({dayKey,apply,plan,migrate});
})(typeof window==='undefined'?globalThis:window);
