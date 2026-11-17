/* MatheQuest – ohne Build-Schritt, Backend oder Netzwerkanfragen. */
(() => {
'use strict';
const D = window.MQ_DOMAINS, CORE = window.MQ_QUESTIONS, FINAL = window.MQ_FINAL_QUESTIONS;
const Q = [...CORE,...FINAL];
const questionById = Object.fromEntries(Q.map(q => [q.id,q]));
const skills = D.flatMap(d => d.skills.map(s => ({...s,domain:d.id})));
const skillById = Object.fromEntries(skills.map(s => [s.id,s]));
const domainById = Object.fromEntries(D.map(d => [d.id,d]));
// Bei inkompatiblen Änderungen an Aufgaben, Antwortreihenfolge oder XP-Regeln erhöhen.
// Fehlendes progressVersion gehört ausschließlich zum unveränderten Altbestand (1).
const J=window.MQ_JOURNEY,R=window.MQ_REVIEW,ACTIVE_IDS=J.questionIds,ACTIVE=Q.filter(q=>ACTIVE_IDS.includes(q.id));
const KEY='mathequest.v1', PROGRESS_VERSION=3, MAX_SESSIONS=5000;
const $=s=>document.querySelector(s);
const esc=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const icon=(name,cls='')=>`<svg class="${cls}" aria-hidden="true"><use href="#i-${name}"/></svg>`;
const button=(text,action,cls='',more='')=>`<button class="btn ${cls}" data-action="${action}" ${more}>${text}</button>`;
const percent=(n,d)=>d?Math.round(100*n/d):0;
const date=d=>new Intl.DateTimeFormat('de-DE',{day:'2-digit',month:'short',year:'numeric',timeZone:'Europe/Berlin'}).format(new Date(d));
const newId=()=>crypto.randomUUID?crypto.randomUUID():String(Date.now())+Math.random().toString(36).slice(2);
const fresh=()=>({app:'MatheQuest',version:1,progressVersion:PROGRESS_VERSION,sessions:[],active:null,archivedActive:null,oral:{},learning:J.fresh(),themePreference:window.MQ_THEME?.getPreference()||'light'});
let state=fresh(), storageFailed=false, saveError='', storageMessage='', storedRaw=null, lastPersisted=null, tabDomain='analysis', solutionsOpen=false, solutionFilter='all', solutionSearch='', solutionsPromise=null, pendingImport=null,legacyCandidate=null;
const labels={dashboard:'Heute',decks:'Decks',progress:'Fortschritt',settings:'Einstellungen',quiz:'Lernen',report:'Ergebnis',solutions:'Lösungswege'};
function validAnswer(a){return a===null||Number.isInteger(a)&&a>=-1&&a<=2;}
function validPool(mode,ids){if(['daily','free'].includes(mode))return ids.length<=J.CONFIG.batchSize&&ids.every(id=>ACTIVE_IDS.includes(id));if(mode==='review')return ids.length<=5&&ids.every(id=>CORE.some(q=>q.id===id));return mode==='final'?ids.length===9&&ids.every(id=>FINAL.some(q=>q.id===id)):ids.every(id=>CORE.some(q=>q.id===id));}
function copyGuessed(source,target,pending=false){
 if(source.guessed===undefined)return;
 if(!Array.isArray(source.guessed)||source.guessed.length!==source.ids.length||!source.guessed.every((value,i)=>typeof value==='boolean'&&(!value||Number.isInteger(source.answers[i])&&source.answers[i]>=0||pending&&source.answers[i]===null)))throw Error('Die Markierungen für geratene Antworten sind ungültig.');
 target.guessed=[...source.guessed];
}
function validate(raw){
 if(!raw||raw.app!=='MatheQuest'||raw.version!==1||!Array.isArray(raw.sessions)||raw.sessions.length>MAX_SESSIONS)throw Error('Kein unterstützter MatheQuest-Lernstand.');
 const version=Object.hasOwn(raw,'progressVersion')?raw.progressVersion:1;
 if(![1,2,PROGRESS_VERSION].includes(version))throw Error('Inkompatible Fortschrittsversion. Der bisherige Stand bleibt geschützt.');
 const result=fresh(),seen=new Set();result.progressVersion=version;
 const modes=version<3?['diagnostic','domain','skill','review','final']:['diagnostic','domain','skill','review','final','daily','free'];
 function validIds(a){return Array.isArray(a.ids)&&a.ids.length>0&&a.ids.length<=50&&new Set(a.ids).size===a.ids.length&&a.ids.every(id=>typeof id==='string'&&Object.hasOwn(questionById,id))&&Array.isArray(a.answers)&&a.answers.length===a.ids.length&&a.answers.every(validAnswer)&&modes.includes(a.mode)&&validPool(a.mode,a.ids)&&typeof a.title==='string'&&a.title.length<=150;}
 function validId(id){return typeof id==='string'&&/^[a-zA-Z0-9_-]{1,100}$/.test(id)&&!Object.hasOwn(Object.prototype,id)&&!seen.has(id);}
 for(const a of raw.sessions){
  if(!a||!validId(a.id)||!Number.isFinite(Date.parse(a.date))||!validIds(a))throw Error('Ungültige Trainingseinheit. Die vorhandenen Daten bleiben erhalten.');
  if(version===1&&(a.mode==='review'||a.answers.includes(-1)||a.guessed!==undefined))throw Error('Diese Antworten benötigen mindestens Fortschrittsversion 2.');
  const entry={id:a.id,date:new Date(a.date).toISOString(),mode:a.mode,title:a.title,ids:[...a.ids],answers:[...a.answers]};copyGuessed(a,entry);result.sessions.push(entry);seen.add(a.id);
 }
 if(raw.oral&&typeof raw.oral==='object'&&!Array.isArray(raw.oral))for(const [id,value]of Object.entries(raw.oral))if(Object.hasOwn(questionById,id)&&['yes','partial','no'].includes(value))result.oral[id]=value;
 function active(a,archive=false){
  if(!a)return null;
  if(!validIds(a)||!Number.isInteger(a.index)||a.index<0||a.index>=a.ids.length||!Number.isFinite(Date.parse(a.startedAt))||(a.id!==undefined&&!validId(a.id)))throw Error('Das gespeicherte Training ist ungültig.');
  if(version===3&&!archive&&!['daily','free'].includes(a.mode))throw Error('Ein älterer Trainingsentwurf muss zuerst archiviert übernommen werden.');
  if(version===1&&(a.mode==='review'||a.answers.includes(-1)||a.guessed!==undefined))throw Error('Diese Antworten benötigen mindestens Fortschrittsversion 2.');
  if(a.selection!==undefined&&!validAnswer(a.selection))throw Error('Ungültige Antwortauswahl.');
  const copy={id:a.id||newId(),mode:a.mode,title:a.title,ids:[...a.ids],answers:[...a.answers],index:a.index,selection:a.selection??null,startedAt:new Date(a.startedAt).toISOString()};copyGuessed(a,copy,true);return copy;
 }
 result.active=active(raw.active);result.archivedActive=active(raw.archivedActive,true);
 if(raw.themePreference!==undefined){if(!['system','light','dark'].includes(raw.themePreference))throw Error('Ungültige Darstellungseinstellung.');result.themePreference=raw.themePreference==='system'?(window.MQ_THEME?.getPreference()||'light'):raw.themePreference;}
 if(version===3){
  const l=raw.learning,integer=(v,min,max)=>Number.isSafeInteger(v)&&v>=min&&v<=max;
  if(!l||l.deckVersion!==J.CONFIG.deckVersion)throw Error('Unbekannte Deckbelegung. Bitte Originalstand sichern; kein automatischer Reset.');
  if(!Array.isArray(l.unlockedDecks)||!l.unlockedDecks.length||l.unlockedDecks.some((id,i)=>id!==i+1)||l.unlockedDecks.length>J.decks.length||!l.unlockedDecks.includes(l.currentDeck)||!integer(l.newPerDay,0,30))throw Error('Ungültiger Deck- oder Tagesstatus.');
  result.learning={...J.fresh(),unlockedDecks:[...l.unlockedDecks],currentDeck:l.currentDeck,newPerDay:l.newPerDay};
  if(!l.reviews||typeof l.reviews!=='object'||Array.isArray(l.reviews)||!l.daily||typeof l.daily!=='object'||Array.isArray(l.daily))throw Error('Ungültiger Wiederholungsplan.');
  for(const [id,c]of Object.entries(l.reviews)){
   if(!ACTIVE_IDS.includes(id)||!c||!integer(c.attempts,1,250000)||!integer(c.correct,0,c.attempts)||!integer(c.step,-1,100)||!integer(c.intervalDays,1,36500)||![c.firstAt,c.lastAt,c.dueAt].every(d=>typeof d==='string'&&Number.isFinite(Date.parse(d))))throw Error('Ungültiger Wiederholungsstatus einer Aufgabe.');
   result.learning.reviews[id]={attempts:c.attempts,correct:c.correct,step:c.step,intervalDays:c.intervalDays,firstAt:c.firstAt,lastAt:c.lastAt,dueAt:c.dueAt};
  }
  for(const [day,d]of Object.entries(l.daily)){
   if(!/^\d{4}-\d{2}-\d{2}$/.test(day)||!d||!Array.isArray(d.newIds)||new Set(d.newIds).size!==d.newIds.length||d.newIds.some(id=>!ACTIVE_IDS.includes(id))||!integer(d.answered,0,250000)||!Array.isArray(d.sessions)||d.sessions.length>MAX_SESSIONS||new Set(d.sessions).size!==d.sessions.length||d.sessions.some(id=>!seen.has(id)))throw Error('Ungültiger Tagesfortschritt.');
   result.learning.daily[day]={newIds:[...d.newIds],answered:d.answered,sessions:[...d.sessions]};
  }
  if(result.active&&result.active.ids.some(id=>!l.unlockedDecks.includes(J.deckFor[id])))throw Error('Das laufende Training enthält ein gesperrtes Deck.');
 }
 return result;
}
async function upgrade(old){
 await loadSolutions();const next={...old,progressVersion:PROGRESS_VERSION,learning:R.migrate(old.sessions,window.MQ_SOLUTIONS,ACTIVE_IDS),archivedActive:old.active||old.archivedActive||null,active:null};
 const journey=J.reconcile(next.learning,next.sessions,window.MQ_SOLUTIONS);next.learning.unlockedDecks=journey.unlockedDecks;next.learning.currentDeck=journey.currentDeck;return next;
}

try{
 lastPersisted=localStorage.getItem(KEY);
 if(lastPersisted!==null){
  storedRaw=lastPersisted;
  try{const loaded=validate(JSON.parse(storedRaw));if(loaded.progressVersion<3){legacyCandidate=loaded;saveError='Ein älterer Lernstand wurde gefunden. Bitte bestätige die Übernahme in MatheQuest 2.0.';}else{state=loaded;storedRaw=null;}}
  catch(e){saveError=e instanceof SyntaxError?'Der gespeicherte Lernstand enthält ungültiges JSON. Er wurde nicht überschrieben.':e.message;}
 }
}catch(e){storageFailed=true;storageMessage='Der Browser erlaubt gerade keinen Zugriff auf den Lernstand. Neue Antworten bleiben vorerst nur in dieser Sitzung. Exportiere sie vor dem Schließen als JSON.';}
function storageNotice(){
 if(!storageFailed&&!saveError)return '';
 return `<div id="storage-notice" class="save-warning" role="alert"><p>${esc(saveError||storageMessage)}</p>${saveError?'':button('Speichern erneut versuchen','retry-save')} ${button('Sitzungsstand exportieren','export-all')}</div>`;
}
function updateStorageNotice(){
 $('#storage-notice')?.remove();
 if($('#main')&&!saveError)$('#main').insertAdjacentHTML('afterbegin',storageNotice());
}
function storageFailure(){
 storageFailed=true;
 storageMessage='Automatisches Speichern ist fehlgeschlagen. Deine Änderungen sind nur in dieser Sitzung vorhanden. Bitte nicht neu laden: Exportiere den Lernstand als JSON oder versuche das Speichern erneut.';
 updateStorageNotice();
}
function save(){
 if(saveError)return false;
 try{
  const current=localStorage.getItem(KEY);
  if(current!==lastPersisted){
   storedRaw=current;saveError='Der gespeicherte Lernstand wurde in einem anderen Tab geändert. Deine Sitzung hat ihn nicht überschrieben. Sichere deine Sitzung vor dem Neuladen.';render();return false;
  }
  const serialized=JSON.stringify(state);
  localStorage.setItem(KEY,serialized);lastPersisted=serialized;
  storageFailed=false;storageMessage='';updateStorageNotice();return true;
 }catch(e){storageFailure();return false;}
}
// Import und Reset ersetzen den Zustand erst nach Bestätigung UND erfolgreichem Schreiben.
function replaceState(next){
 try{const serialized=JSON.stringify(next);localStorage.setItem(KEY,serialized);lastPersisted=serialized;}
 catch(e){storageFailure();toast('Der Lernstand konnte nicht gespeichert werden. Der bisherige Stand bleibt erhalten.');return false;}
 state=next;window.MQ_THEME?.setPreference(state.themePreference);storedRaw=null;legacyCandidate=null;saveError='';storageFailed=false;storageMessage='';solutionsOpen=false;return true;
}
function recovery(){
 return `${heading('Deinen Lernstand schützen','Es wurde nichts automatisch gelöscht oder ersetzt.')}<section class="panel"><p role="alert">${esc(saveError)}</p><p>Du kannst den gespeicherten Rohstand sichern, einen passenden JSON-Lernstand importieren oder nach Rückfrage neu beginnen.</p><div class="button-row">${legacyCandidate?button('In MatheQuest 2.0 übernehmen','upgrade','btn-primary'):''}${storedRaw!==null?button('Gespeicherten Rohstand sichern','export-stored','btn-primary'):''}${button('Sitzungsstand exportieren','export-all')}${button('JSON-Datei auswählen','import')}${button('Seite neu laden','reload')}${button('Lernstand zurücksetzen','reset','btn-danger')}</div><input type="file" id="import-file" accept="application/json,.json" hidden></section>`;
}
function toast(message){$('#toast').textContent=message;$('#toast').classList.add('visible');clearTimeout(toast.timer);toast.timer=setTimeout(()=>$('#toast').classList.remove('visible'),4000);}
function loadSolutions(){
 if(window.MQ_SOLUTIONS)return Promise.resolve(window.MQ_SOLUTIONS);
 if(!solutionsPromise)solutionsPromise=new Promise((resolve,reject)=>{const script=document.createElement('script');script.src='solutions.js';script.onload=()=>window.MQ_SOLUTIONS?resolve(window.MQ_SOLUTIONS):reject(Error('Der Lösungsschlüssel ist ungültig.'));script.onerror=()=>{solutionsPromise=null;script.remove();reject(Error('solutions.js konnte nicht geladen werden. Bitte prüfe, ob alle Projektdateien im selben Ordner liegen.'));};document.head.append(script);});
 return solutionsPromise;
}
function shuffle(array){const a=[...array];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
const level=xp=>Math.min(60,1+Math.floor(xp/50));
function compute(){
 const histories={}, reports={};let xp=0,totalCorrect=0,totalAnswered=0;
 const key=window.MQ_SOLUTIONS;
 for(const s of state.sessions){let score=0,earned=0;const byDomain={},bySkill={};
  s.ids.forEach((id,i)=>{const q=questionById[id],answer=s.answers[i],answered=answer!==null,correct=!!key&&answered&&answer===key[id].correct;
   if(!histories[id])histories[id]={attempts:0,correct:0,xp:0,latest:false,sessions:new Set()};
   const h=histories[id];
   for(const [group,name]of [[byDomain,q.domain],[bySkill,q.skill]]){if(!group[name])group[name]={total:0,correct:0,answered:0};group[name].total++;if(answered)group[name].answered++;if(correct)group[name].correct++;}
   if(correct){const reward=FINAL.some(q=>q.id===id)?0:Math.min(h.attempts===0?10:5,20-h.xp);h.xp+=reward;earned+=reward;h.correct++;score++;totalCorrect++;}
   if(answered){h.attempts++;h.latest=correct&&!s.guessed?.[i];h.sessions.add(s.id);totalAnswered++;}
  });
  xp+=earned;reports[s.id]={score,xp:earned,byDomain,bySkill,level:level(xp),unknown:s.answers.filter(a=>a===-1).length,guessed:s.guessed?.filter(Boolean).length||0};
 }
 const competency={};
 for(const s of skills){const ids=CORE.filter(q=>q.skill===s.id).map(q=>q.id), hs=ids.map(id=>histories[id]).filter(h=>h&&h.attempts>0);const unique=hs.length,correct=hs.filter(h=>h.latest).length,attempts=hs.reduce((sum,h)=>sum+h.attempts,0),hits=hs.reduce((sum,h)=>sum+h.correct,0),sessions=new Set(hs.flatMap(h=>[...h.sessions])).size;
  let status='untested';if(unique){status='uncertain';if(unique>=3&&correct/unique>=.6)status='partial';if(unique===5&&correct/unique>=.8&&hits/attempts>=.8&&sessions>=2)status='secure';}
  competency[s.id]={status,unique,correct,attempts,hits,rate:percent(hits,attempts),sessions};
 }
 return{histories,reports,xp,level:level(xp),totalCorrect,totalAnswered,competency,unique:CORE.filter(q=>histories[q.id]?.attempts>0).length};
}
let computed=compute();
function refresh(){computed=compute();const journey=J.reconcile(state.learning,state.sessions,window.MQ_SOLUTIONS||{});state.learning.unlockedDecks=journey.unlockedDecks;state.learning.currentDeck=journey.currentDeck;$('#header-level').textContent=`${computed.xp} XP`;}
const statusNames={untested:'Noch offen',uncertain:'Im Aufbau',partial:'Teilweise sicher',secure:'Sicher geübt'};
function statusBadge(value){return `<span class="status ${value}"><span class="live-dot" style="background:var(--status-${value});width:4px;height:4px"></span>${statusNames[value]}</span>`;}
function heading(title,subtitle,extra=''){return `<div class="page-heading"><div><h1>${title}</h1><p>${subtitle}</p></div>${extra}</div>`;}
function examNote(){return `<div class="exam-note">${icon('info')}<span>Für die Hamburger Oberstufe · Die konkrete Prüfungsrelevanz richtet sich nach deinem Unterricht und den offiziellen Vorgaben. XP zeigen deinen Einsatz; Kompetenz wird getrennt bewertet.</span></div>`;}
function progressBar(p){return `<div class="progress-track" role="progressbar" aria-valuenow="${p}" aria-valuemin="0" aria-valuemax="100"><span style="width:${p}%"></span></div>`;}
function reviewPlan(){return R.plan(state.learning,J.decks);}
function dueLabel(time){return new Intl.DateTimeFormat('de-DE',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit',timeZone:'Europe/Berlin'}).format(new Date(time));}
function answerLabel(q,answer,guessed=false){return answer===null?'Ausgelassen':answer===-1?'Weiß nicht':q.options[answer]+(guessed?' (historisch als geraten markiert)':'');}
function setMenuOpen(open){$('#sidebar').classList.toggle('open',open);$('#menu-button').setAttribute('aria-expanded',String(open));$('#menu-button').setAttribute('aria-label',open?'Menü schließen':'Menü öffnen');}
let freeDeck=1,freeDomain='all',freeTopic='all',lastUnlocks=[],lastUnlockSession='';
function deckStats(){return J.progress(state.sessions,window.MQ_SOLUTIONS||{});}
function dashboard(){
 const plan=reviewPlan(),a=state.active,deck=J.decks.find(d=>d.id===state.learning.currentDeck),ready=plan.queue.length;
 dashboard.signature=JSON.stringify([plan.queue,plan.newIds.length,plan.due.length]);
 const done=plan.nextDue?`Die nächste Wiederholung ist am ${dueLabel(plan.nextDue)} fällig.`:state.learning.newPerDay===0?'Neue Fragen sind in den Einstellungen ausgeschaltet.':'Deine Tagesaufgaben sind erledigt. Neue Fragen gibt es wieder morgen oder in einem anderen offenen Deck.';
 return `${heading('Heute lernen','Analysis und analytische Geometrie. Ein kleiner Schritt nach dem anderen.')}
 <section class="daily-card" aria-labelledby="daily-title"><div class="eyebrow">${a?'DEIN GESPEICHERTER ZWISCHENSTAND':ready?`DECK ${deck.id} · ${esc(deck.name)}`:'FÜR HEUTE ERLEDIGT'}</div><h2 id="daily-title">${a?'Weiter, wo du warst.':ready?'Bereit für deine nächste Runde?':'Gut für heute.'}</h2><p>${a?`${a.answers.filter(x=>x!==null).length} von ${a.ids.length} Fragen beantwortet. Dein Training bleibt gespeichert.`:ready?'Zuerst fällige Wiederholungen aus allen offenen Decks, danach Neues aus deinem aktuellen Deck.':esc(done)}</p>${a||ready?button(`${a?'Fortsetzen':`Lernrunde starten · ${ready}`} ${icon('arrow')}`,a?'resume':'start-daily','btn-primary'):''}<a class="text-link" href="#decks">${ready?'Decks & freies Training':'Freies Training öffnen'} ${icon('arrow')}</a></section>
 <div class="daily-counts" aria-label="Deine Tagesaufgaben"><div><strong>${plan.due.length}</strong><span>Wiederholungen fällig</span></div><div><strong>${plan.newIds.length}</strong><span>Neue Fragen verfügbar</span></div><div><strong>${plan.today.answered}</strong><span>Heute beantwortet</span></div></div>
 <p class="quiet-note">Bis zu ${J.CONFIG.batchSize} Fragen pro Runde · Tageslimit: ${state.learning.newPerDay} neue Fragen · Freies Training verändert keine Wiederholungstermine.</p>`;
}
function decks(){
 if(freeDeck!==0&&!state.learning.unlockedDecks.includes(freeDeck))freeDeck=state.learning.currentDeck;
 const stats=deckStats(),available=ACTIVE.filter(q=>(!freeDeck||J.deckFor[q.id]===freeDeck)&&state.learning.unlockedDecks.includes(J.deckFor[q.id])&&(freeDomain==='all'||q.domain===freeDomain));
 const topics=skills.filter(s=>available.some(q=>q.skill===s.id));if(!topics.some(s=>s.id===freeTopic))freeTopic='all';
 return `${heading('Deine zehn Decks','Von den Grundlagen zu Zusammenhängen und einem ersten Prüfungsausblick.')}
 <ol class="deck-journey" aria-label="Lernreise mit zehn Decks">${J.decks.map((d,i)=>{const st=stats[i],open=state.learning.unlockedDecks.includes(d.id),current=d.id===state.learning.currentDeck;return `<li class="journey-station ${open?'unlocked':'locked'} ${current?'current':''}"><div class="station-top"><span class="station-number">${String(d.id).padStart(2,'0')}</span><span class="station-status">${!open?'Gesperrt':st.complete?'Abgeschlossen':current?'Aktuelles Deck':'Freigeschaltet'}</span></div><h2>${d.name}</h2><p>${d.level}</p><div class="station-evidence">${st.correct}/${st.total} einmal richtig · Ziel ${st.required}</div>${progressBar(percent(st.correct,st.total))}${button(open?'Deck auswählen':`Nach Deck ${d.id-1}`,'choose-deck','btn-ghost',`data-deck="${d.id}" ${open?'':'disabled'}`)}</li>`;}).join('')}</ol>
 <p class="quiet-note">80 % verschiedener Aufgaben einmal richtig schalten das nächste Deck frei. Einmal offen bleibt offen. Das ist eine Fortschrittsmechanik, kein Kompetenznachweis.</p>
 <section class="panel free-training" id="free-training"><div class="section-heading"><div><h2>Freies Training</h2><p>Übe ein offenes Deck oder gezielt ein Thema. Deine Wiederholungstermine bleiben unverändert.</p></div></div><div class="free-filters"><label>Deck<select id="free-deck"><option value="0" ${freeDeck===0?'selected':''}>Alle offenen Decks</option>${J.decks.filter(d=>state.learning.unlockedDecks.includes(d.id)).map(d=>`<option value="${d.id}" ${freeDeck===d.id?'selected':''}>${d.id} · ${d.name}</option>`).join('')}</select></label><label>Fachgebiet<select id="free-domain"><option value="all">Beide Gebiete</option><option value="analysis" ${freeDomain==='analysis'?'selected':''}>Analysis</option><option value="geometry" ${freeDomain==='geometry'?'selected':''}>Analytische Geometrie</option></select></label><label>Unterthema<select id="free-topic"><option value="all">Alle Themen</option>${topics.map(s=>`<option value="${s.id}" ${freeTopic===s.id?'selected':''}>${s.name}</option>`).join('')}</select></label></div>${button('Freies Training starten','start-free','btn-primary',available.length?'':'disabled')}</section>
 <p class="quiet-note">Beta-Starterpool: ${ACTIVE.length} Aufgaben statt der langfristig geplanten 500. Die höheren Decks sind noch nicht durchgängig anspruchsvoll. Die Lernreise wird fachlich weiter ausgebaut.</p>`;
}
function makeSession(mode){
 let ids,title;if(mode==='daily'){ids=reviewPlan().queue;title=`Heute · Deck ${state.learning.currentDeck}`;}else{ids=shuffle(ACTIVE.filter(q=>(!freeDeck||J.deckFor[q.id]===freeDeck)&&state.learning.unlockedDecks.includes(J.deckFor[q.id])&&(freeDomain==='all'||q.domain===freeDomain)&&(freeTopic==='all'||q.skill===freeTopic))).slice(0,J.CONFIG.batchSize).map(q=>q.id);title=freeDeck?`Freies Training · Deck ${freeDeck}`:'Freies Training · offene Decks';}
 return {id:newId(),mode,title,ids,answers:ids.map(()=>null),index:0,selection:null,startedAt:new Date().toISOString()};
}
function start(mode){
 if(saveError)return;if(state.sessions.length>=MAX_SESSIONS){toast('Die Grenze von 5.000 Einheiten ist erreicht. Bitte sichere deinen Lernstand.');return;}
 if(state.active){showDialog('Training wechseln?',`<p>Dein laufendes Training bleibt beim Fortsetzen erhalten. Ein neuer Start ersetzt nur diesen noch nicht abgeschlossenen Durchlauf.</p><div class="button-row">${button('Fortsetzen','resume','btn-primary')}${button('Neues Training starten','confirm-start','',`data-mode="${mode}"`)}</div>`);return;}
 const next=makeSession(mode);if(!next.ids.length){toast('Gerade sind keine passenden Aufgaben verfügbar.');render();return;}state.active=next;save();go('quiz');
}
function quiz(){
 const a=state.active;if(!a)return `${heading('Kein laufendes Training','Starte deine nächste Runde auf Heute.')}<a class="btn btn-primary" href="#dashboard">Zu Heute</a>`;
 const q=questionById[a.ids[a.index]],chosen=a.answers[a.index],selection=chosen===null?a.selection:chosen,answered=a.answers.filter(x=>x!==null).length,solution=chosen!==null?window.MQ_SOLUTIONS?.[q.id]:null,correct=solution&&chosen===solution.correct;
 const feedback=solution?`<div id="answer-feedback" class="answer-feedback ${chosen===-1?'unknown':correct?'correct':'incorrect'}" role="status" tabindex="-1"><strong>${icon(chosen===-1?'info':correct?'check':'close')}${chosen===-1?'Weiß nicht – hier ist die Erklärung.':correct?'Richtig!':'Noch nicht richtig.'}</strong>${!correct?`<p>Richtige Antwort: <b>${esc(q.options[solution.correct])}</b></p>`:''}<p>${esc(solution.explanation)}</p><small>${a.mode==='free'?'Freies Training: Deine Wiederholungstermine bleiben unverändert.':correct?'Nach Abschluss wird der nächste Wiederholungstermin gespeichert.':'Nach Abschluss wird diese Aufgabe für morgen eingeplant.'}</small><details class="feedback-steps"><summary>Lösungsweg ansehen</summary><ol>${solution.steps.map(step=>`<li>${esc(step)}</li>`).join('')}</ol></details></div>`:'';
 return `<div class="quiz-wrap"><div class="quiz-topline"><span>${esc(a.title)}</span><a href="#dashboard" class="text-link">Pause · gespeichert ${icon('close')}</a></div><div class="quiz-progress"><div class="quiz-progress-text"><span>Frage ${a.index+1} von ${a.ids.length}</span><span>${answered} beantwortet</span></div>${progressBar(percent(answered,a.ids.length))}</div><section class="question-card"><div class="question-meta"><span class="tag">${q.domain==='analysis'?'Analysis':'Analytische Geometrie'}</span><span>${esc(skillById[q.skill].name)}</span><span>Deck ${J.deckFor[q.id]}</span></div><h1 class="question-title" tabindex="-1">${esc(q.prompt)}</h1><div class="answer-options" role="group" aria-label="Antwort auswählen">${q.options.map((option,i)=>`<button class="answer-option ${selection===i?'selected':''} ${solution&&i===solution.correct?'answer-correct':''} ${solution&&i===chosen&&!correct?'answer-incorrect':''}" aria-pressed="${selection===i}" data-action="answer" data-answer="${i}" ${chosen!==null?'disabled':''}><span class="answer-key">${'ABC'[i]}</span><span>${esc(option)}</span>${solution&&i===solution.correct?`<span class="answer-result">${icon('check')}Richtig</span>`:''}</button>`).join('')}</div>${button('Weiß nicht','answer',`btn-ghost unknown-answer ${selection===-1?'selected':''}`,`data-answer="-1" aria-pressed="${selection===-1}" ${chosen!==null?'disabled':''}`)}${feedback}<p class="question-note">${chosen===null?'Klicke eine Antwort an. Du siehst direkt die Lösung und Erklärung.':'Antwort gespeichert.'}</p></section><div class="quiz-nav">${button('Zurück','quiz-prev','btn-ghost',a.index===0?'disabled':'')}${a.index<a.ids.length-1?button(`Nächste Frage ${icon('arrow')}`,'quiz-next','btn-primary',chosen===null?'disabled':''):button('Ergebnis ansehen','submit','btn-primary',chosen===null?'disabled':'')}</div><details class="disclosure quiz-extras"><summary>Fragenübersicht & Abschluss</summary><div class="disclosure-body"><div class="question-dots">${a.ids.map((id,i)=>`<button data-action="quiz-jump" data-index="${i}" class="${i===a.index?'current':''} ${a.answers[i]!==null?'answered':''}" aria-label="Frage ${i+1}">${i+1}</button>`).join('')}</div>${button('Runde jetzt auswerten','submit','btn-ghost')}</div></details></div>`;
}
function showDialog(title,content){$('#modal-content').innerHTML=`<div class="dialog-content"><h2>${title}</h2>${content}</div>`;if(!$('#modal').open)$('#modal').showModal();}
function closeDialog(){if($('#modal').open)$('#modal').close();}
async function submit(confirmed=false){
 const a=state.active;if(!a||submit.busy||saveError)return;if(state.sessions.length>=MAX_SESSIONS){toast('Die Grenze von 5.000 Einheiten ist erreicht.');return;}
 const missing=a.answers.filter(x=>x===null).length;if(missing&&!confirmed){showDialog('Runde vorzeitig abschließen?',`<p>${missing} Fragen sind noch nicht beantwortet. Sie bleiben ohne Antwort und geben keine XP.</p><div class="button-row">${button('Weiterlernen','close-dialog','btn-primary')}${button('Jetzt auswerten','confirm-submit')}</div>`);return;}
 submit.busy=true;closeDialog();try{
  await loadSolutions();if(state.active!==a||saveError)return;
  const entry={id:a.id,mode:a.mode,title:a.title,date:new Date().toISOString(),ids:[...a.ids],answers:[...a.answers]},before=[...state.learning.unlockedDecks];
  state.sessions.push(entry);state.active=null;state.learning=R.apply(state.learning,entry,window.MQ_SOLUTIONS,ACTIVE_IDS);refresh();lastUnlocks=state.learning.unlockedDecks.filter(id=>!before.includes(id));lastUnlockSession=entry.id;save();go(`report/${entry.id}`);
 }catch(e){toast(e.message);}finally{submit.busy=false;}
}
function report(id){
 const s=state.sessions.find(s=>s.id===id);if(!s)return `${heading('Ergebnis nicht gefunden','Diese Einheit ist nicht in deinem Lernstand enthalten.')}<a href="#progress" class="btn">Zum Fortschritt</a>`;
 const r=computed.reports[id];return `${heading('Ein Schritt weiter.','Deine Runde ist abgeschlossen.')}${lastUnlocks.length&&lastUnlockSession===id?`<section class="unlock-notice" role="status">${icon('check')}<div><strong>${lastUnlocks.map(n=>`Deck ${n}`).join(', ')} freigeschaltet</strong><p>Du kannst dort neue Fragen lernen oder frei trainieren.</p></div></section>`:''}<section class="panel report-hero"><div class="score-ring" style="--score:${percent(r.score,s.ids.length)}%"><div><strong>${r.score}/${s.ids.length}</strong><small>RICHTIG</small></div></div><div><h2>${r.score===s.ids.length?'Alles richtig. Gut geübt!':'So geht es weiter.'}</h2><p class="answer-breakdown">${r.unknown} × Weiß nicht · +${r.xp} XP</p><p>${s.mode==='free'?'Freies Training: Der Wiederholungsplan ist unverändert.':'Die Antworten und Wiederholungstermine sind gespeichert.'}</p></div><div class="report-rewards"><strong>+${r.xp} XP</strong></div></section><div class="report-next"><a href="#dashboard" class="btn btn-primary">Zu Heute ${icon('arrow')}</a><a href="#decks" class="btn btn-ghost">Decks ansehen</a></div><details class="disclosure report-details"><summary>Antworten & Bericht</summary><div class="disclosure-body">${s.ids.map((qid,i)=>{const q=questionById[qid],solution=window.MQ_SOLUTIONS[qid];return `<article class="report-question"><h3>${esc(q.prompt)}</h3><p>Deine Antwort: ${esc(answerLabel(q,s.answers[i],s.guessed?.[i]))}</p><p>Richtig: ${esc(q.options[solution.correct])}</p><p>${esc(solution.explanation)}</p></article>`;}).join('')}<div class="button-row">${button('Bericht als JSON','export-report','',`data-session="${s.id}"`)}${button('Drucken / PDF','print')}</div></div></details>`;
}
function progress(){
 const plan=reviewPlan(),stats=deckStats(),answered=ACTIVE.filter(q=>computed.histories[q.id]?.attempts).length,history=state.sessions.filter(s=>['daily','free'].includes(s.mode)),now=Date.now();
 const days=Array.from({length:14},(_,i)=>{const time=now-(13-i)*86400000,key=R.dayKey(time);return {key,count:history.filter(s=>R.dayKey(s.date)===key).reduce((n,s)=>n+s.answers.filter(a=>a!==null).length,0)};}),max=Math.max(1,...days.map(d=>d.count));
 return `${heading('Dein Fortschritt','Was du bearbeitet hast und wann du wiederholst.')}<div class="learning-metrics"><div><strong>${answered}/${ACTIVE.length}</strong><span>Aufgaben bearbeitet</span></div><div><strong>${state.learning.unlockedDecks.length}/10</strong><span>Decks freigeschaltet</span></div><div><strong>${plan.due.length}</strong><span>Jetzt fällig</span></div><div><strong>${Object.values(state.learning.reviews).filter(c=>c.intervalDays>=30).length}</strong><span>Intervall ab 30 Tagen</span></div></div><section class="panel activity-panel"><h2>Deine letzten 14 Tage</h2><ol class="activity-chart" aria-label="Beantwortete Fragen pro Tag">${days.map(d=>`<li><span class="activity-bar" style="height:${Math.max(3,100*d.count/max)}%" aria-hidden="true"></span><span class="visually-hidden">${d.key}: ${d.count} Antworten</span><small aria-hidden="true">${d.key.slice(-2)}</small></li>`).join('')}</ol><p class="quiet-note">Tägliches Lernen und freies Training · ${computed.xp} XP insgesamt, einschließlich übernommener früherer Einheiten.</p></section><section class="panel progress-decks"><h2>Deine Decks</h2>${J.decks.map((d,i)=>`<div class="deck-progress-row"><span>${d.id} · ${d.name}</span><span>${stats[i].correct}/${stats[i].total} einmal richtig</span><span>${state.learning.unlockedDecks.includes(d.id)?'Offen':'Gesperrt'}</span></div>`).join('')}</section><section class="recent-practice"><h2>Letzte Runden</h2>${history.slice(-5).reverse().map(s=>`<div class="history-row"><div><strong>${esc(s.title)}</strong><small>${date(s.date)} · ${computed.reports[s.id].score}/${s.ids.length} richtig</small></div><a class="btn btn-ghost" href="#report/${s.id}">Ergebnis</a></div>`).join('')||'<p>Noch keine abgeschlossene Runde.</p>'}</section><div class="button-row">${button('Lernstand exportieren','export-all')}<a href="#settings" class="btn btn-ghost">Einstellungen & Archiv</a></div><p class="quiet-note">Einmal richtig und freigeschaltet bedeutet nicht automatisch langfristig beherrscht. Übe zusätzlich, deinen Rechenweg laut zu erklären.</p>`;
}

function solutionMarkup(q){const a=window.MQ_SOLUTIONS[q.id];return `<details class="solution-item"><summary><span>${q.id}</span>${esc(q.prompt)}</summary><div class="solution-body"><h4>Richtige Antwort</h4><div class="solution-answer">${esc(q.options[a.correct])}</div><h4>Erklärung</h4><p>${esc(a.explanation)}</p><h4>Schritt für Schritt</h4><ol>${a.steps.map(step=>`<li>${esc(step)}</li>`).join('')}</ol><h4>Mathematischer Hintergrund</h4><p>${esc(a.background)}</p><h4>Typischer Denkfehler</h4><p>${esc(a.misconception)}</p><h4 class="oral-label">Zum Laut-Erklären</h4><p>${esc(a.oral)}</p><div class="teacher-field"><label for="oral-${q.id}">Einschätzung der Lehrkraft: Konnte die Schülerin ihre Antwort mathematisch begründen?</label><select id="oral-${q.id}" data-oral="${q.id}"><option value="">Noch nicht bewertet</option><option value="yes" ${state.oral[q.id]==='yes'?'selected':''}>Ja</option><option value="partial" ${state.oral[q.id]==='partial'?'selected':''}>Teilweise</option><option value="no" ${state.oral[q.id]==='no'?'selected':''}>Nein</option></select></div></div></details>`;}
function solutions(){
 const pool=ACTIVE.filter(q=>state.learning.unlockedDecks.includes(J.deckFor[q.id]));
 return `${heading('Lösungswege & Erklären','Aufgaben aus deinen offenen Decks. Erkläre die Schritte zusätzlich laut.')}<div class="button-row"><a href="#settings" class="btn btn-ghost">Zurück zu Einstellungen</a></div>${pool.map(solutionMarkup).join('')}`;
}
function themeSettings(){
 const preference=window.MQ_THEME?.getPreference()||'light';
 return `<section class="panel theme-settings"><h2>Deine Darstellung</h2><p>Wähle Hell oder Dunkel. Deine Auswahl bleibt auf diesem Gerät gespeichert.</p><label for="theme-setting">Farbschema</label><select id="theme-setting" data-theme-choice><option value="light" ${preference==='light'?'selected':''}>Hell</option><option value="dark" ${preference==='dark'?'selected':''}>Dunkel</option></select><p class="storage-note">Die Darstellung bleibt bei einem Lernstandreset erhalten.</p></section>`;
}

function settings(){return `${heading('Einstellungen & Daten','Dein Lernstand bleibt in diesem Browser.')}<div class="settings-grid">${themeSettings()}<section class="panel"><h2>Dein Lerntempo</h2><label for="daily-limit">Neue Fragen pro Tag</label><input id="daily-limit" type="number" inputmode="numeric" min="0" max="30" step="1" value="${state.learning.newPerDay}"><p>0 bis 30 · Fällige Wiederholungen bleiben unabhängig davon verfügbar. Eine laufende Runde bleibt erhalten.</p></section><section class="panel"><h2>Lernstand sichern</h2><p>JSON enthält Antworten, offene Decks, Wiederholungstermine, Tagesfortschritt, Entwurf und Darstellung. Keine automatische Synchronisierung.</p>${button('Lernstand exportieren','export-all','btn-primary')}</section><section class="panel"><h2>Lernstand importieren</h2><p>Die Datei wird geprüft und ersetzt deinen Stand erst nach Bestätigung. Ältere Stände benötigen eine bestätigte Übernahme.</p>${button('JSON-Datei auswählen','import')}<input type="file" id="import-file" accept="application/json,.json" hidden></section><section class="panel"><h2>Verstehen & mündlich üben</h2><p>Lösungswege und Erklärimpulse zu deinen offenen Decks.</p><a class="btn" href="#solutions">Lösungswege öffnen</a></section><section class="panel"><h2>Übernommene Daten</h2><p>${state.sessions.filter(s=>!['daily','free'].includes(s.mode)).length} frühere Einheiten bleiben im vollständigen Export erhalten. ${state.archivedActive?'Ein alter Trainingsentwurf ist ebenfalls archiviert.':''} Stochastik ist derzeit nicht im aktiven Lernprogramm.</p><p>Neue Fragen und Designupdates behalten deinen Stand. Unbekannte Datenversionen werden geschützt abgewiesen.</p></section><section class="panel"><h2>Speicherung & Datenschutz</h2><p>Browserdaten löschen und privates Surfen können Lernstände entfernen. Exportiere regelmäßig eine Sicherung. Exporte enthalten Lerndaten.</p><p>Die App sendet Antworten nicht an den Betreiber. Beim Laden über GitHub Pages verarbeitet der Hostinganbieter Verbindungsdaten.</p></section><section class="panel"><h2>Beta-Starterpool</h2><p>${ACTIVE.length} aktive Aufgaben in zehn Decks. Umfang und Schwierigkeit werden ausgebaut. XP bleiben eine dezente Begleitung und schalten keine Decks frei.</p></section></div><section class="panel reset-panel"><h2>Neuanfang</h2><p>Alle lokalen Lerndaten werden erst nach deiner Bestätigung gelöscht. Sichere den Stand vorher als JSON.</p>${button('Lernstand zurücksetzen','reset','btn-danger')}</section>`;}

function download(data,filename,raw=false){const blob=new Blob([raw?data:JSON.stringify(data,null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=filename;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);toast('Deine JSON-Datei wurde zum Download bereitgestellt.');}
function exportAll(){download({...state,themePreference:window.MQ_THEME?.getPreference()||state.themePreference,exportedAt:new Date().toISOString()},`MatheQuest-Lernstand-${new Date().toISOString().slice(0,10)}.json`);}
async function importFile(file){if(!file)return;try{if(file.size>5*1024*1024)throw Error('Die Datei ist zu groß (maximal 5 MB).');const raw=JSON.parse(await file.text());if(raw?.kind==='report')throw Error('Dies ist ein einzelner Ergebnisbericht. Bitte wähle einen vollständigen Lernstand aus „Einstellungen & Daten“.');pendingImport=validate(raw);await loadSolutions();showDialog('Lernstand ersetzen?',`<p>${pendingImport.progressVersion<3?'Ältere Version: Decks und Termine werden neu berechnet; ein alter Entwurf wird im Archiv erhalten. ':''}Die Datei enthält ${pendingImport.sessions.length} abgeschlossene Einheiten${pendingImport.active?' und ein laufendes Training':''}. Der aktuelle Lernstand wird ersetzt.</p><p>Exportiere deinen bisherigen Lernstand zuerst, wenn du ihn behalten möchtest.</p><div class="button-row">${button('Bisherigen Stand exportieren','export-all')}${button('Abbrechen','close-dialog')}${button('Importieren & ersetzen','confirm-import','btn-primary')}</div>`);}catch(e){pendingImport=null;toast(e instanceof SyntaxError?'Die Datei enthält kein gültiges JSON.':e.message);}}
const routes={dashboard,decks,progress,solutions,settings,quiz};
function go(page){if(location.hash.slice(1)===page)return render();location.hash=page;}
let renderToken=0;
async function render(){const token=++renderToken;let [page,id]=(location.hash.slice(1)||'dashboard').split('/');const aliases={world:'decks',training:'decks',skills:'decks',achievements:'progress'};if(Object.hasOwn(aliases,page))page=aliases[page];if(!Object.hasOwn(labels,page))page='dashboard';if(saveError){$('#main').innerHTML=recovery();$('#page-label').textContent='Lernstand schützen';setMenuOpen(false);return;}if((state.sessions.length||page==='solutions'||(page==='quiz'&&state.active?.answers.some(answer=>answer!==null)))&&!window.MQ_SOLUTIONS){$('#main').innerHTML='<div class="panel">Dein Lernstand wird geladen …</div>';try{await loadSolutions();if(token!==renderToken)return;}catch(e){$('#main').innerHTML=`<div class="save-warning">${esc(e.message)}</div>`;return;}}refresh();if(page==='solutions'&&state.active)solutionsOpen=false;
 document.body.classList.toggle('is-learning',page==='quiz');
 document.querySelectorAll('[data-nav]').forEach(a=>{const group={quiz:'dashboard',report:'progress',solutions:'progress'};const active=a.dataset.nav===(group[page]||page);a.classList.toggle('active',active);if(active)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});$('#page-label').textContent=labels[page];document.title=`${labels[page]} · MatheQuest`;
 const content=page==='report'?report(id):routes[page]();$('#main').innerHTML=storageNotice()+content;
 setMenuOpen(false);
}
function rerenderQuiz(focusAnswer){const y=window.scrollY;render();window.scrollTo(0,y);if(focusAnswer!==undefined)$('#answer-feedback')?.focus();}
document.addEventListener('click',async event=>{
 const el=event.target.closest('[data-action]');if(!el||el.disabled)return;event.preventDefault();const action=el.dataset.action;
 if(saveError&&!['export-all','export-stored','import','confirm-import','reset','confirm-reset','close-dialog','reload','upgrade','confirm-upgrade'].includes(action))return;
 switch(action){
 case 'start-daily':start('daily');break;
 case 'start-free':start('free');break;
 case 'choose-deck':{const id=Number(el.dataset.deck);if(!state.learning.unlockedDecks.includes(id))break;state.learning.currentDeck=id;freeDeck=id;freeDomain='all';freeTopic='all';save();await render();$('#free-training')?.scrollIntoView({block:'start',behavior:'auto'});$('#free-deck')?.focus({preventScroll:true});break;}
 case 'confirm-start':closeDialog();state.active=null;start(el.dataset.mode);break;
 case 'resume':closeDialog();go('quiz');break;
 case 'answer':{
  const a=state.active,index=a?.index,value=Number(el.dataset.answer);if(!a||a.answers[index]!==null||!validAnswer(value)||loadSolutions.answerBusy)break;
  loadSolutions.answerBusy=true;a.selection=value;save();el.disabled=true;
  try{await loadSolutions();if(saveError||state.active!==a||a.index!==index||a.answers[index]!==null)break;a.answers[index]=value;a.selection=null;if(a.guessed)a.guessed[index]=false;save();await render();$('#answer-feedback')?.focus();}
  catch(e){toast(e.message);if(el.isConnected)el.disabled=false;}finally{loadSolutions.answerBusy=false;}break;
 }
 case 'quiz-prev':case 'quiz-next':case 'quiz-jump':{
  const a=state.active;if(!a)break;const index=action==='quiz-prev'?a.index-1:action==='quiz-next'?a.index+1:Number(el.dataset.index);if(!Number.isInteger(index)||index<0||index>=a.ids.length)break;
  a.index=index;a.selection=null;save();await render();$('.question-title')?.focus();break;
 }
 case 'submit':await submit();break;
 case 'confirm-submit':await submit(true);break;
 case 'close-dialog':pendingImport=null;closeDialog();break;
 case 'export-all':exportAll();break;
 case 'export-stored':if(storedRaw!==null)download(storedRaw,'MatheQuest-Rohstand.json',true);break;
 case 'reload':location.reload();break;
 case 'retry-save':if(save()){render();toast('Dein Lernstand wurde gespeichert.');}break;
 case 'export-report':{
  const s=state.sessions.find(s=>s.id===el.dataset.session);if(!s)break;
  download({app:'MatheQuest',version:1,progressVersion:PROGRESS_VERSION,kind:'report',session:s,result:computed.reports[s.id],exportedAt:new Date().toISOString()},`MatheQuest-Bericht-${s.id}.json`);break;
 }
 case 'print':window.print();break;
 case 'import':$('#import-file')?.click();break;
 case 'confirm-import':{
  if(!pendingImport)break;try{const next=pendingImport.progressVersion<3?await upgrade(pendingImport):pendingImport;if(replaceState(next)){pendingImport=null;closeDialog();refresh();render();toast('Dein Lernstand wurde importiert.');}}catch(e){toast(e.message);}break;
 }
 case 'upgrade':showDialog('Lernstand in MatheQuest 2.0 übernehmen?',`<p>Deine bisherigen Einheiten und Antworten bleiben erhalten. Offene Decks und Wiederholungstermine werden aus ihnen neu berechnet. Ein alter laufender Durchlauf bleibt als Archiv im Export erhalten.</p><p>Sichere zuerst den Originalstand, wenn du zur älteren App zurückkehren möchtest.</p><div class="button-row">${button('Originalstand sichern','export-stored')}${button('Abbrechen','close-dialog')}${button('Übernahme bestätigen','confirm-upgrade','btn-primary')}</div>`);break;
 case 'confirm-upgrade':{
  if(!legacyCandidate)break;el.disabled=true;try{if(localStorage.getItem(KEY)!==lastPersisted)throw Error('Der Speicher wurde zwischenzeitlich geändert. Bitte zuerst sichern und neu laden.');const next=await upgrade(legacyCandidate);if(replaceState(next)){closeDialog();refresh();go('dashboard');toast('Dein Lernstand wurde übernommen.');}}
  catch(e){toast(e.message);}finally{if(el.isConnected)el.disabled=false;}break;
 }
 case 'reset':showDialog('Lernstand wirklich zurücksetzen?',`<p>Alle Einheiten, Wiederholungstermine, Freischaltungen und archivierten Entwürfe dieses Browsers werden gelöscht. Sichere sie vorher, wenn du sie behalten möchtest.</p><div class="button-row">${button('Abbrechen','close-dialog')}${button('Jetzt zurücksetzen','confirm-reset','btn-danger')}</div>`);break;
 case 'confirm-reset':if(replaceState(fresh())){pendingImport=null;closeDialog();refresh();go('dashboard');toast('Dein Lernstand beginnt wieder mit Deck 1.');}break;
 }
});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&$('#sidebar').classList.contains('open')){setMenuOpen(false);$('#menu-button').focus();}});
document.addEventListener('change',event=>{
 const el=event.target;
 if(el.id==='import-file'){importFile(el.files[0]);el.value='';return;}
 if(saveError)return;
 if(el.matches('[data-theme-choice]')){state.themePreference=window.MQ_THEME.getPreference();save();}
 if(el.id==='daily-limit'){const value=Number(el.value);if(el.value===''||!Number.isInteger(value)||value<0||value>30){el.value=state.learning.newPerDay;toast('Bitte eine ganze Zahl von 0 bis 30 eingeben.');return;}state.learning.newPerDay=value;save();toast('Tageslimit gespeichert.');}
 if(['free-deck','free-domain','free-topic'].includes(el.id)){
  if(el.id==='free-deck'){const id=Number(el.value);if(id!==0&&!state.learning.unlockedDecks.includes(id))return;freeDeck=id;freeTopic='all';}
  if(el.id==='free-domain'){freeDomain=['analysis','geometry'].includes(el.value)?el.value:'all';freeTopic='all';}
  if(el.id==='free-topic')freeTopic=el.value;
  const y=scrollY;render();scrollTo(0,y);$('#'+el.id)?.focus({preventScroll:true});
 }
 if(el.dataset.oral&&Object.hasOwn(questionById,el.dataset.oral)){if(['yes','partial','no'].includes(el.value))state.oral[el.dataset.oral]=el.value;else delete state.oral[el.dataset.oral];save();}
});

$('#menu-button').addEventListener('click',()=>setMenuOpen(!$('#sidebar').classList.contains('open')));
document.addEventListener('click',e=>{if($('#sidebar').classList.contains('open')&&!e.target.closest('#sidebar')&&!e.target.closest('#menu-button'))setMenuOpen(false);});
// Fälligkeiten wechseln auch in einem offen gelassenen Tab; keine Antworten oder Speicherwerte werden dabei verändert.
function refreshDue(){if((!location.hash||location.hash==='#dashboard')&&!$('#modal').open&&!document.hidden&&!saveError){const plan=reviewPlan();if(JSON.stringify([plan.queue,plan.newIds.length,plan.due.length])!==dashboard.signature)render();}}
setInterval(refreshDue,60000);window.addEventListener('focus',refreshDue);
let printDetails=[];
window.addEventListener('beforeprint',()=>{printDetails=[...document.querySelectorAll('main details:not([open])')];for(const detail of printDetails)detail.open=true;});
window.addEventListener('afterprint',()=>{for(const detail of printDetails)detail.open=false;printDetails=[];});
window.addEventListener('hashchange',()=>{closeDialog();render();window.scrollTo(0,0);});
window.addEventListener('storage',e=>{if(e.storageArea===localStorage&&(e.key===KEY||e.key===null)){storedRaw=e.newValue;saveError='Der Lernstand wurde in einem anderen Tab geändert oder gelöscht. Deine Sitzung wird nicht darüber gespeichert. Exportiere sie vor dem Neuladen.';render();}});
render();
})();
