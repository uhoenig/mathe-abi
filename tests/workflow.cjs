/* Geführter Lernablauf: isolierte Spielstände, keine externen Dienste. */
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
let chromium;try{({chromium}=require('playwright'));}catch{({chromium}=require('/Applications/ChatGPT.app/Contents/Resources/cua_node/lib/node_modules/playwright'));}
const root=path.resolve(__dirname,'..'),base='https://mathequest.test/Mathe-Abi/',KEY='mathequest.v1';
const data={window:{}};vm.runInNewContext(fs.readFileSync(path.join(root,'solutions.js'),'utf8'),data);const key=data.window.MQ_SOLUTIONS;
const allowed=new Set(['index.html','style.css','theme.css','theme.js','review.js','app.js','review.js','questions.js','final-questions.js','solutions.js','assets/favicon.svg','assets/quest.svg']);
(async()=>{
 let executablePath=process.env.MQ_BROWSER;if(!executablePath&&!fs.existsSync(chromium.executablePath()))executablePath='/Applications/Brave Browser.app/Contents/MacOS/Brave Browser';
 const browser=await chromium.launch({headless:true,...(executablePath?{executablePath}:{})});
 try{
 const context=await browser.newContext({viewport:{width:768,height:1024},acceptDownloads:true}),errors=[];
 await context.route('**/*',route=>{const file=new URL(route.request().url()).pathname.replace('/Mathe-Abi/','')||'index.html';if(!allowed.has(file))return route.abort();return route.fulfill({body:fs.readFileSync(path.join(root,file)),contentType:file.endsWith('.js')?'text/javascript':file.endsWith('.css')?'text/css':file.endsWith('.svg')?'image/svg+xml':'text/html'});});
 const p=await context.newPage();p.on('pageerror',e=>errors.push(e.message));const saved=()=>p.evaluate(KEY=>JSON.parse(localStorage.getItem(KEY)),KEY);
 await p.goto(base);await p.locator('.lesson-card').waitFor();
 assert.equal(await p.locator('nav[aria-label="Hauptnavigation"] a').count(),3);
 assert.equal(await p.locator('.world-map').count(),0);assert.equal(await p.locator('.deck-card').count(),3);
 assert.equal(await p.locator('.sidebar .journey-card,.sidebar .profile,.sidebar .workspace-tag').count(),0);
 for(const [width,height] of [[1440,1100],[768,1024],[390,844],[320,700]]){
  await p.setViewportSize({width,height});
  const box=await p.locator('.lesson-card .btn-primary').boundingBox();assert.ok(box.y>=0&&box.y+box.height<=height,`Einstieg außerhalb des ersten Bildschirms: ${width}`);
  assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`Seitenüberlauf: ${width}`);assert.ok(await p.locator('.lesson-copy').evaluate(el=>el.scrollWidth<=el.clientWidth),`Abgeschnittener Einstieg: ${width}`);
 }
 await p.setViewportSize({width:1440,height:1100});await p.waitForTimeout(150);await p.screenshot({path:path.join(root,'tests/workflow-today-desktop.png'),fullPage:true,animations:'disabled'});
 await p.setViewportSize({width:390,height:844});await p.reload();await p.locator('.lesson-card').waitFor();await p.waitForTimeout(150);await p.screenshot({path:path.join(root,'tests/workflow-today-mobile.png'),fullPage:true,animations:'disabled'});
 console.log('OK Drei Hauptziele, drei Lernstapel und reduzierte Seitenleiste und Lernstart im ersten Bildschirm bei vier Größen');
 await p.getByRole('button',{name:'Jetzt lernen',exact:true}).click();await p.locator('.question-title').waitFor();
 assert.equal(await p.locator('#guess-answer,.guess-choice').count(),0);assert.equal(await p.getByText('Ich rate gerade',{exact:false}).count(),0);let active=(await saved()).active;assert.equal(active.mode,'review');assert.equal(active.ids.length,5);const sessionId=active.id;
 assert.equal(await p.locator('.quiz-nav .btn-primary').count(),1);assert.equal(await p.locator('.quiz-nav [data-action="submit"]').count(),0);assert.equal(await p.locator('.quiz-extras').getAttribute('open'),null);
 await p.getByRole('button',{name:'Weiß nicht',exact:true}).click();await p.locator('.answer-feedback.unknown').waitFor();assert.equal(await p.locator('.answer-correct').count(),1);assert.match(await p.locator('.answer-feedback').innerText(),/fünf Minuten/);
 assert.equal((await saved()).active.answers[0],-1);
 await p.locator('[data-action="quiz-next"]').click();await p.getByRole('link',{name:'Pause · gespeichert'}).click();await p.locator('.lesson-card').waitFor();
 assert.match(await p.locator('.lesson-card').innerText(),/1 von 5 beantwortet/);await p.reload();await p.getByRole('button',{name:'Training fortsetzen'}).click();
 assert.equal((await saved()).active.id,sessionId);assert.equal((await saved()).active.index,1);assert.equal((await saved()).active.answers[0],-1);
 for(let i=1;i<5;i++){
  await p.locator(`[data-answer="${key[active.ids[i]].correct}"]`).click();await p.locator('.answer-feedback.correct').waitFor();
  if(i<4){await p.locator('[data-action="quiz-next"]').click();assert.equal(await p.locator('.question-title').evaluate(el=>el===document.activeElement),true);}
 }
 await p.getByRole('button',{name:'Ergebnis ansehen',exact:true}).click();await p.locator('.report-hero').waitFor();
 assert.match(await p.locator('.report-hero').innerText(),/4 von 5/);assert.match(await p.locator('.report-rewards').innerText(),/\+40 XP/);
 assert.equal(await p.locator('.report-details').getAttribute('open'),null);assert.equal(await p.locator('.report-next .btn-primary').isVisible(),true);
 const reportState=await saved();assert.equal(reportState.progressVersion,2);assert.equal(reportState.sessions.length,1);assert.equal(reportState.active,null);assert.equal(reportState.sessions[0].answers[0],-1);assert.equal(reportState.sessions[0].guessed,undefined);assert.match(await p.locator('.answer-breakdown').innerText(),/1 × Weiß nicht/);
 await p.screenshot({path:path.join(root,'tests/workflow-report-mobile.png'),fullPage:true,animations:'disabled'});
 console.log('OK Fünf Fragen mit Feedback, Pause/Neuladen/Fortsetzen, Tastaturfokus, kompakter Bericht und unveränderte XP');
 await p.locator('.report-details summary').click();assert.equal(await p.locator('[data-action="export-report"]').isVisible(),true);
 await p.locator('.report-details summary').click();await p.evaluate(()=>dispatchEvent(new Event('beforeprint')));assert.equal(await p.locator('.report-details').getAttribute('open'),'');await p.evaluate(()=>dispatchEvent(new Event('afterprint')));assert.equal(await p.locator('.report-details').getAttribute('open'),null);
 await p.locator('.report-next .btn-primary').click();await p.locator('.lesson-card').waitFor();assert.match(await p.locator('.lesson-card').innerText(),/Für jetzt|Gut für heute/);
 assert.equal(await p.locator('.lesson-card [data-action="start-review"]').count(),0);
 await p.goto(base+'#settings');
 const dueState=JSON.parse(JSON.stringify(reportState));dueState.sessions[0].date=new Date(Date.now()-6*60000).toISOString();
 await p.locator('#import-file').setInputFiles({name:'faellig.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(dueState))});await p.locator('[data-action="confirm-import"]').click();
 await p.goto(base+'#dashboard');await p.locator('.lesson-card').waitFor();assert.match(await p.locator('.lesson-card').innerText(),/1 Aufgabe ist fällig/);
 await p.reload();await p.getByRole('button',{name:'Jetzt lernen',exact:true}).click();await p.locator('.question-title').waitFor();
 assert.deepEqual((await saved()).active.ids,[active.ids[0]]);assert.equal((await saved()).active.mode,'review');
 await p.locator(`[data-answer="${key[active.ids[0]].correct}"]`).click();await p.locator('.answer-feedback.correct').waitFor();await p.getByRole('button',{name:'Ergebnis ansehen',exact:true}).click();await p.locator('.report-hero').waitFor();assert.match(await p.locator('.report-rewards').innerText(),/\+5 XP/);
 const finalState=await saved();assert.equal(finalState.sessions.length,2);assert.equal(finalState.progressVersion,2);
 await p.goto(base+'#world');await p.locator('.world-map').waitFor();assert.equal(await p.locator('.map-country').count(),31);
 await p.goto(base+'#progress');await p.locator('.recent-practice').waitFor();assert.match(await p.locator('.recent-practice').innerText(),/4\/5 richtig/);
 const download=p.waitForEvent('download');await p.getByRole('button',{name:'Lernstand exportieren',exact:true}).first().click();const file=await download;const stream=await file.createReadStream(),chunks=[];for await(const chunk of stream)chunks.push(chunk);const exported=JSON.parse(Buffer.concat(chunks));assert.deepEqual(exported.sessions,finalState.sessions);
 await p.goto(base+'#dashboard');await p.locator('.home-extras summary').click();await p.getByRole('link',{name:'Diagnose & Gebietstraining'}).click();await p.locator('[data-action="start-diagnostic"]').click();assert.equal((await saved()).active.ids.length,30);
 console.log('OK Fällige Aufgaben nach Zeit und Import, unbekannt/geraten getrennt, Tageslimit, separate Weltkarte, vollständiger Export und optionale Diagnose');
 assert.deepEqual(errors,[]);console.log('Alle Workflow-Prüfungen bestanden.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
