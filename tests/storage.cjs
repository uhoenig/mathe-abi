/* Speicher-Regressionsprüfungen in isolierten Browserkontexten, ohne Testartefakte.
   Voraussetzung wie tests/browser.cjs: Playwright + Chromium, optional MQ_BROWSER. */
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
let chromium;
try{({chromium}=require('playwright'));}
catch{({chromium}=require('/Applications/ChatGPT.app/Contents/Resources/cua_node/lib/node_modules/playwright'));}
const root=path.resolve(__dirname,'..'),KEY='mathequest.v1',URL='https://mathequest.test/Mathe-Abi/';
const data={window:{}};
for(const file of ['questions.js','final-questions.js','solutions.js'])vm.runInNewContext(fs.readFileSync(path.join(root,file),'utf8'),data);
const key=data.window.MQ_SOLUTIONS,core=data.window.MQ_QUESTIONS,ids=core.slice(0,5).map(q=>q.id);
const record=(id='one')=>({id,date:'2026-11-15T12:00:00.000Z',mode:'skill',title:'Speichertest',ids:[ids[0]],answers:[key[ids[0]].correct]});
const fixture=()=>({app:'MatheQuest',version:1,progressVersion:1,sessions:[record()],active:null,oral:{}});
const allow=new Set(['index.html','theme.js','theme.css','app.js','review.js','questions.js','final-questions.js','solutions.js','style.css','assets/favicon.svg','assets/quest.svg']);
const errors=[];let browser;const contexts=[];
async function open(raw=null,faults={}){
 const context=await browser.newContext({acceptDownloads:true});contexts.push(context);
 await context.route('**/*',route=>{const url=new globalThis.URL(route.request().url()),file=url.pathname.replace('/Mathe-Abi/','')||'index.html';if(file==='__bootstrap')return route.fulfill({body:'<!doctype html><title>Test</title>',contentType:'text/html'});if(!allow.has(file))return route.abort();return route.fulfill({body:fs.readFileSync(path.join(root,file)),contentType:file.endsWith('.js')?'text/javascript':file.endsWith('.css')?'text/css':file.endsWith('.svg')?'image/svg+xml':'text/html'});});
 const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
 await page.goto(URL+'__bootstrap');
 if(raw!==null)await page.evaluate(({raw,KEY})=>localStorage.setItem(KEY,raw),{raw,KEY});
 await context.addInitScript(({writeError,readError,KEY})=>{
  window.__mqFailWrites=writeError;window.__mqFailReads=readError;
  const set=Storage.prototype.setItem,get=Storage.prototype.getItem;
  window.__mqNativeGet=get;
  Storage.prototype.setItem=function(k,v){if(k===KEY&&window.__mqFailWrites)throw new DOMException('Test: Speicher voll','QuotaExceededError');return set.call(this,k,v);};
  Storage.prototype.getItem=function(k){if(k===KEY&&window.__mqFailReads)throw new DOMException('Test: Zugriff gesperrt','SecurityError');return get.call(this,k);};
 },{writeError:false,readError:false,...faults,KEY});
 await page.goto(URL+'#world');await page.locator('main h1').waitFor();
 return page;
}
const raw=page=>page.evaluate(KEY=>window.__mqNativeGet.call(localStorage,KEY),KEY);
const saved=async page=>JSON.parse(await raw(page));
async function upload(page,state){await page.locator('#import-file').setInputFiles({name:'stand.json',mimeType:'application/json',buffer:Buffer.from(typeof state==='string'?state:JSON.stringify(state))});}
async function downloadText(page,action){const [download]=await Promise.all([page.waitForEvent('download'),page.locator(`[data-action="${action}"]`).first().click()]);const stream=await download.createReadStream(),chunks=[];for await(const chunk of stream)chunks.push(chunk);return Buffer.concat(chunks).toString('utf8');}
async function finish(page){
 const active=(await saved(page)).active;
 for(let i=0;i<active.ids.length;i++){
  await page.locator('.quiz-extras').evaluate(el=>el.open=true);await page.locator(`[data-action="quiz-jump"][data-index="${i}"]`).click();
  const choice=page.locator(`[data-answer="${key[active.ids[i]].correct}"]`);
  if(await choice.isEnabled()){await choice.click();await page.locator('.answer-feedback').waitFor();}
 }
 await page.evaluate(()=>{const b=document.querySelector('[data-action="submit"]');b.click();b.click();});
 await page.getByRole('heading',{name:'Ein Schritt weiter.'}).waitFor();
}
async function check(name,fn){await fn();console.log('OK '+name);for(const c of contexts.splice(0))await c.close();}
(async()=>{
 let executablePath=process.env.MQ_BROWSER;
 if(!executablePath&&!fs.existsSync(chromium.executablePath())&&fs.existsSync('/Applications/Brave Browser.app/Contents/MacOS/Brave Browser'))executablePath='/Applications/Brave Browser.app/Contents/MacOS/Brave Browser';
 browser=await chromium.launch({headless:true,...(executablePath?{executablePath}:{})});
 try{
 await check('Autosave bei Start, Antwort, Navigation; Wiederherstellung und einmalige Abgabe',async()=>{
  const p=await open();await p.locator('[data-action="start-skill"][data-skill="analysis-01"]').click();
  const draft=(await saved(p)).active;assert.ok(draft.id);assert.equal((await saved(p)).progressVersion,2);
  await p.locator(`[data-answer="${key[draft.ids[0]].correct}"]`).click();await p.locator('.answer-feedback.correct').waitFor();
  assert.equal((await saved(p)).active.answers[0],key[draft.ids[0]].correct);
  await p.locator('[data-action="quiz-next"]').click();assert.equal((await saved(p)).active.index,1);
  await p.reload();await p.locator('.quiz-progress-text').waitFor();assert.match(await p.locator('.quiz-progress-text').innerText(),/Frage 2 von 5/);
  await p.locator('[data-action="quiz-prev"]').click();await p.locator('.answer-feedback.correct').waitFor();assert.equal((await saved(p)).active.id,draft.id);
  await finish(p);let state=await saved(p);assert.equal(state.sessions.length,1);assert.equal(state.sessions[0].id,draft.id);assert.equal(state.active,null);assert.match(await p.locator('.report-rewards').innerText(),/\+50 XP/);
  await p.reload();await p.locator('.report-rewards').waitFor();assert.equal((await saved(p)).sessions.length,1);assert.match(await p.locator('.report-rewards').innerText(),/\+50 XP/);
  await p.goto(URL+'#settings');const exported=JSON.parse(await downloadText(p,'export-all'));assert.equal(exported.progressVersion,2);assert.deepEqual(exported.sessions,state.sessions);
 });
 await check('Kompatibler Altstand ohne progressVersion: Antworten, mündliche Bewertung und aktives Training bleiben erhalten',async()=>{
  const old=fixture();delete old.progressVersion;old.oral[ids[0]]='yes';old.active={mode:'skill',title:'Altstand',ids,answers:[key[ids[0]].correct,null,null,null,null],index:1,startedAt:'2026-11-15T12:00:00Z'};
  const p=await open(JSON.stringify(old));await p.goto(URL+'#quiz');await p.locator('.quiz-progress-text').waitFor();
  await p.locator('[data-action="quiz-next"]').click();const restored=await saved(p);assert.equal(restored.progressVersion,2);assert.equal(restored.active.index,2);assert.ok(restored.active.id);assert.equal(restored.oral[ids[0]],'yes');assert.deepEqual(restored.sessions,old.sessions);
 });
 await check('Inkompatible Version geschützt; Rohdaten-Export; Reset nur nach Bestätigung',async()=>{
  const incompatible={...fixture(),progressVersion:3};const original=JSON.stringify(incompatible,null,2);const p=await open(original);
  await p.getByRole('heading',{name:'Deinen Lernstand schützen'}).waitFor();assert.equal(await raw(p),original);
  await p.goto(URL+'#training');assert.equal(await p.locator('[data-action="start-diagnostic"]').count(),0);
  assert.equal(await downloadText(p,'export-stored'),original);
  await p.locator('[data-action="reset"]').click();await p.locator('[data-action="close-dialog"]').click();assert.equal(await raw(p),original);
  await p.locator('[data-action="reset"]').click();await p.locator('[data-action="confirm-reset"]').click();
  assert.deepEqual(await saved(p),{app:'MatheQuest',version:1,progressVersion:2,sessions:[],active:null,oral:{}});
  await p.reload();assert.equal(await p.locator('#header-level').innerText(),'Level 1');
 });
 await check('Beschädigtes JSON bleibt unverändert und kann exakt gesichert werden',async()=>{
  const original='{kaputt';const p=await open(original);await p.getByRole('heading',{name:'Deinen Lernstand schützen'}).waitFor();
  assert.equal(await raw(p),original);assert.equal(await downloadText(p,'export-stored'),original);
  await upload(p,fixture());await p.locator('[data-action="confirm-import"]').click();assert.equal((await saved(p)).sessions.length,1);await p.reload();await p.locator('.world-map').waitFor();
 });
 await check('Ungültige Fortschrittsversionen werden abgewiesen, ohne Datenverlust',async()=>{
  for(const version of [null,'1',false,0,99]){const original=JSON.stringify({...fixture(),progressVersion:version});const p=await open(original);await p.getByRole('heading',{name:'Deinen Lernstand schützen'}).waitFor();assert.equal(await raw(p),original);}
 });
 await check('JSON-Import: Versionsprüfung, Abbrechen, Bestätigen und wiederholter Import ohne zusätzliche XP',async()=>{
  const original=JSON.stringify(fixture());const p=await open(original);await p.goto(URL+'#settings');
  await upload(p,{...fixture(),progressVersion:99});assert.equal(await raw(p),original);assert.equal(await p.locator('[data-action="confirm-import"]').count(),0);
  const incoming=fixture();incoming.sessions=Array.from({length:8},(_,i)=>record('repeat-'+i));
  await upload(p,incoming);await p.locator('[data-action="close-dialog"]').click();assert.equal(await raw(p),original);
  for(let i=0;i<2;i++){await upload(p,incoming);await p.locator('[data-action="confirm-import"]').click();assert.equal((await saved(p)).sessions.length,8);await p.goto(URL+'#progress');await p.locator('details.disclosure').first().evaluate(el=>el.open=true);assert.match(await p.locator('.xp-numbers').innerText(),/20 \/ 50 XP/);await p.goto(URL+'#settings');}
  const duplicate={...incoming,sessions:[record(),record()]};const before=await raw(p);await upload(p,duplicate);assert.equal(await raw(p),before);assert.match(await p.locator('#toast').innerText(),/Ungültige Trainingseinheit/);
 });
 await check('Speicherausfall sichtbar; Antworten exportierbar und nach erneutem Speichern wiederherstellbar',async()=>{
  const p=await open(null,{writeError:true});await p.locator('[data-action="start-skill"][data-skill="analysis-01"]').click();await p.locator('#storage-notice').waitFor();assert.equal(await raw(p),null);
  await p.locator('[data-answer="0"]').click();await p.locator('.answer-feedback').waitFor();assert.match(await p.locator('#storage-notice').innerText(),/fehlgeschlagen/);
  const memory=JSON.parse(await downloadText(p,'export-all'));assert.equal(memory.active.answers[0],0);assert.equal(memory.progressVersion,2);
  await p.evaluate(()=>window.__mqFailWrites=false);await p.locator('[data-action="retry-save"]').click();assert.equal(await p.locator('#storage-notice').count(),0);assert.equal((await saved(p)).active.answers[0],0);
  await p.reload();await p.locator('.answer-feedback').waitFor();
 });
 await check('Fehlgeschlagene Speicherung nach Abgabe: erneutes Speichern vergibt keine doppelten XP',async()=>{
  const state=fixture();state.sessions=[];state.active={id:'retry-unit',mode:'skill',title:'Abgabetest',ids,answers:ids.map(id=>key[id].correct),index:4,startedAt:'2026-11-15T12:00:00Z'};
  const original=JSON.stringify(state),p=await open(original,{writeError:true});await p.goto(URL+'#quiz');await p.locator('.answer-feedback').waitFor();
  await p.evaluate(()=>{const b=document.querySelector('[data-action="submit"]');b.click();b.click();});
  await p.getByRole('heading',{name:'Ein Schritt weiter.'}).waitFor();assert.equal(await raw(p),original);assert.match(await p.locator('.report-rewards').innerText(),/\+50 XP/);
  const memory=JSON.parse(await downloadText(p,'export-all'));assert.equal(memory.sessions.length,1);assert.equal(memory.sessions[0].id,'retry-unit');assert.equal(memory.active,null);
  await p.evaluate(()=>window.__mqFailWrites=false);await p.locator('[data-action="retry-save"]').click();assert.equal((await saved(p)).sessions.length,1);
  await p.reload();await p.locator('.report-rewards').waitFor();assert.equal((await saved(p)).sessions.length,1);assert.match(await p.locator('.report-rewards').innerText(),/\+50 XP/);
 });
 await check('Fehlgeschlagener Import/Reset überschreibt weder Speicher noch Sitzungsstand und meldet keinen Erfolg',async()=>{
  const original=JSON.stringify(fixture());const p=await open(original,{writeError:true});await p.goto(URL+'#settings');
  const incoming=fixture();incoming.sessions.push(record('two'));
  await upload(p,incoming);await p.locator('[data-action="confirm-import"]').click();assert.equal(await raw(p),original);assert.equal(await p.locator('#modal[open]').count(),1);assert.match(await p.locator('#toast').innerText(),/bisherige Stand bleibt erhalten/);
  await p.locator('[data-action="close-dialog"]').click();const exported=JSON.parse(await downloadText(p,'export-all'));assert.deepEqual(exported.sessions,fixture().sessions);
  await p.locator('[data-action="reset"]').click();await p.locator('[data-action="confirm-reset"]').click();assert.equal(await raw(p),original);assert.equal(await p.locator('#modal[open]').count(),1);
  await p.evaluate(()=>window.__mqFailWrites=false);await p.locator('[data-action="confirm-reset"]').click();assert.equal((await saved(p)).sessions.length,0);
 });
 await check('Lesefehler wird gemeldet; später wieder sichtbarer Altstand nicht versehentlich überschrieben',async()=>{
  const original=JSON.stringify(fixture());const p=await open(original,{readError:true});await p.locator('#storage-notice').waitFor();
  await p.locator('[data-action="start-skill"][data-skill="analysis-01"]').click();assert.equal(await raw(p),original);
  await p.evaluate(()=>window.__mqFailReads=false);await p.locator('[data-action="retry-save"]').click();await p.getByRole('heading',{name:'Deinen Lernstand schützen'}).waitFor();assert.equal(await raw(p),original);
 });
 await check('Ein anderer Tab und verpasste storage-Ereignisse werden vor Überschreiben erkannt',async()=>{
  const p=await open(JSON.stringify(fixture()));
  await p.context().addInitScript(()=>{if(location.search.includes('ignoreStorage'))window.addEventListener('storage',e=>e.stopImmediatePropagation());});
  const p2=await p.context().newPage();await p2.goto(URL+'?ignoreStorage=1#world');await p2.locator('.world-map').waitFor();
  await p.locator('[data-action="start-skill"][data-skill="analysis-01"]').click();const current=await raw(p);
  await p2.locator('[data-action="start-skill"][data-skill="analysis-01"]').click();await p2.getByRole('heading',{name:'Deinen Lernstand schützen'}).waitFor();assert.equal(await raw(p2),current);
  const p3=await p.context().newPage();await p3.goto(URL+'#world');await p3.locator('.world-map').waitFor();
  await p.locator('[data-answer="0"]').click();await p.locator('.answer-feedback').waitFor();await p3.getByRole('heading',{name:'Deinen Lernstand schützen'}).waitFor();
 });
 await check('Die Grenze von 5.000 Einheiten kann nicht durch ein weiteres Training überschritten werden',async()=>{
  const state=fixture();state.sessions=Array.from({length:5000},(_,i)=>record('limit-'+i));const original=JSON.stringify(state);const p=await open(original);
  await p.locator('[data-action="start-skill"][data-skill="analysis-01"]').click();assert.match(await p.locator('#toast').innerText(),/5.000/);assert.equal(await raw(p),original);
 });
 await check('Version 2: Weiß nicht, Ratemarkierung, laufendes Training und JSON-Roundtrip bleiben erhalten',async()=>{
  const incoming=fixture();incoming.progressVersion=2;incoming.sessions=[{...record(),ids:[ids[0],ids[1]],answers:[-1,key[ids[1]].correct],guessed:[false,true]}];incoming.active={id:'review-active',mode:'review',title:'Wiederholung',ids:[ids[2]],answers:[null],guessed:[true],index:0,startedAt:new Date().toISOString()};
  const p=await open(JSON.stringify(incoming));await p.goto(URL+'#quiz');await p.locator('.question-title').waitFor();assert.equal(await p.locator('#guess-answer').count(),0);
  await p.reload();await p.locator('.question-title').waitFor();
  await p.getByRole('button',{name:'Weiß nicht',exact:true}).click();await p.locator('.answer-feedback').waitFor();let current=await saved(p);assert.equal(current.active.answers[0],-1);assert.equal(current.active.guessed[0],false);
  await p.reload();await p.locator('.answer-feedback').waitFor();assert.equal(await p.locator('.answer-correct').count(),1);assert.equal(await p.locator('.unknown-answer').isDisabled(),true);
  await p.goto(URL+'#settings');const exported=JSON.parse(await downloadText(p,'export-all'));assert.equal(exported.progressVersion,2);assert.deepEqual(exported.sessions,incoming.sessions);assert.deepEqual(exported.active,current.active);
  await upload(p,exported);await p.locator('[data-action="confirm-import"]').click();await p.reload();assert.deepEqual((await saved(p)).sessions,incoming.sessions);
 });
 await check('Ungültige neue Antwortdaten ersetzen keinen Stand; alte Version darf keine neuen Antwortarten enthalten',async()=>{
  const p=await open(JSON.stringify(fixture()));await p.goto(URL+'#settings');const original=await raw(p);
  const cases=[];for(const answer of [-2,3,'-1']){const invalid=fixture();invalid.progressVersion=2;invalid.sessions[0].answers=[answer];cases.push(invalid);}
  for(const guessed of [[true,false],['yes']]){const invalid=fixture();invalid.progressVersion=2;invalid.sessions[0].guessed=guessed;cases.push(invalid);}
  const invalid=fixture();invalid.progressVersion=2;invalid.sessions[0].answers=[-1];invalid.sessions[0].guessed=[true];cases.push(invalid);
  const old=fixture();old.sessions[0].answers=[-1];cases.push(old);
  for(const candidate of cases){await upload(p,candidate);await p.waitForFunction(()=>document.querySelector('#toast').textContent.includes('ungültig')||document.querySelector('#toast').textContent.includes('Ungültig')||document.querySelector('#toast').textContent.includes('Fortschrittsversion 2'));assert.equal(await p.locator('[data-action="confirm-import"]').count(),0);assert.equal(await raw(p),original);}
 });
 await check('Geratene richtige Antworten liefern unveränderte XP, gelten aber nicht als sichere aktuelle Antworten',async()=>{
  const incoming=fixture();incoming.progressVersion=2;incoming.sessions=[0,1].map(round=>({id:'guess-'+round,date:new Date(Date.now()-(2-round)*86400000).toISOString(),mode:'skill',title:'Konzept',ids,answers:ids.map(id=>key[id].correct),guessed:ids.map((id,i)=>round===1&&i<2)}));
  const p=await open(JSON.stringify(incoming));assert.equal(await p.locator('#header-level').innerText(),'Level 2');await p.goto(URL+'#skills');assert.equal(await p.locator('.skill-node .secure').count(),0);
  await p.locator('.skill-node summary').first().click();assert.match(await p.locator('.skill-node[open]').innerText(),/10\/10/);
 });
 await check('Ratemarkierung einer übersprungenen Frage bleibt als Entwurf gültig und wird bei Abgabe bereinigt',async()=>{
  const legacy=fixture();legacy.progressVersion=2;legacy.sessions=[];legacy.active={id:'legacy-draft',mode:'skill',title:'Altentwurf',ids,answers:ids.map(()=>null),guessed:ids.map((id,i)=>i===0),index:0,startedAt:new Date().toISOString()};const p=await open(JSON.stringify(legacy));await p.goto(URL+'#quiz');await p.locator('[data-action="quiz-next"]').click();await p.reload();await p.locator('.question-title').waitFor();assert.equal((await saved(p)).active.guessed[0],true);
  await p.locator('.quiz-extras summary').click();await p.locator('[data-action="submit"]').click();await p.locator('[data-action="confirm-submit"]').click();await p.locator('.report-hero').waitFor();assert.deepEqual((await saved(p)).sessions[0].guessed,[false,false,false,false,false]);await p.reload();await p.locator('.report-hero').waitFor();assert.equal(await p.locator('#storage-notice').count(),0);
 });
 assert.deepEqual(errors,[]);console.log('Alle Speicherprüfungen bestanden; keine JavaScript-Laufzeitfehler.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
