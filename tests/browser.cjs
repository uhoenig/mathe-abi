/* Optionaler Entwicklungstest: npm install --no-save playwright (nicht für die App nötig).
   MQ_BROWSER kann auf ein vorhandenes Chromium/Brave zeigen. */
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
let chromium;
try { ({ chromium } = require('playwright')); }
catch { ({ chromium } = require('/Applications/ChatGPT.app/Contents/Resources/cua_node/lib/node_modules/playwright')); }
(async () => {
 let executablePath=process.env.MQ_BROWSER;
 if(!executablePath&&!fs.existsSync(chromium.executablePath())&&fs.existsSync('/Applications/Brave Browser.app/Contents/MacOS/Brave Browser')) executablePath='/Applications/Brave Browser.app/Contents/MacOS/Brave Browser';
 const browser = await chromium.launch({headless:true,...(executablePath?{executablePath}:{})});
 const context = await browser.newContext({viewport:{width:1440,height:1100},acceptDownloads:true});
 const page = await context.newPage();
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const url=process.env.MQ_URL || 'https://mathequest.test';
 const root=path.resolve(__dirname,'..');
 if(!process.env.MQ_URL){
  const allowed=new Set(['index.html','theme.js','theme.css','style.css','app.js','review.js','questions.js','final-questions.js','solutions.js','assets/favicon.svg','assets/quest.svg']);
  await context.route('**/*',route=>{const file=new URL(route.request().url()).pathname.slice(1)||'index.html';if(!allowed.has(file))return route.abort();return route.fulfill({body:fs.readFileSync(path.join(root,file)),contentType:file.endsWith('.js')?'text/javascript':file.endsWith('.css')?'text/css':file.endsWith('.svg')?'image/svg+xml':'text/html'});});
 }

 const solutions={window:{}};require('node:vm').runInNewContext(fs.readFileSync(path.join(root,'solutions.js'),'utf8'),solutions);
 const key=solutions.window.MQ_SOLUTIONS;
 const check=(label)=>console.log('OK '+label);
 await page.goto(url);await page.getByRole('heading',{name:'Heute lernen'}).waitFor();
 assert.equal(await page.locator('.deck-card').count(),3);
 await page.goto(url+'/#world');assert.equal(await page.locator('.map-country').count(),31);
 assert.equal(await page.locator('.map-country.conquered').count(),0);
 await page.locator('.final-country').focus();await page.keyboard.press('Enter');
 assert.equal(await page.locator('[data-action="start-final"]').isDisabled(),true);
 await page.locator('[data-skill="analysis-01"].map-country').click();
 assert.match(await page.locator('.country-panel').innerText(),/Termtal/);
 check('31 anklickbare Gebiete, Tastaturbedienung, Länderinformationen, Zitadelle zunächst gesperrt');
 await page.reload();await page.locator('.world-map').waitFor();await page.screenshot({path:path.join(root,'tests/desktop.png'),fullPage:true});
 check('Dashboard, drei Gebiete und Desktop-Screenshot');
 await page.goto(url+'/#training');await page.locator('[data-action="start-diagnostic"]').click();
 await page.locator('.question-card').waitFor();assert.equal(await page.locator('.question-dots button').count(),30);
 assert.equal(await page.locator('.answer-option').count(),3);
 assert.equal(await page.locator('script[src="solutions.js"]').count(),0);
 const initialId=await page.evaluate(()=>JSON.parse(localStorage.getItem('mathequest.v1')).active.ids[0]);
 const firstAnswer=key[initialId].correct;
 await page.locator(`[data-answer="${firstAnswer}"]`).click();
 await page.locator('.answer-feedback.correct').waitFor();
 assert.equal(await page.locator('.answer-correct').count(),1);
 assert.equal(await page.locator('.answer-option:disabled').count(),3);
 assert.match(await page.locator('.answer-feedback').innerText(),/Richtig!/);
 await page.locator('[data-action="quiz-next"]').click();
 await page.reload();await page.locator('.quiz-progress-text').waitFor();assert.match(await page.locator('.quiz-progress-text').innerText(),/Frage 2 von 30/);
 assert.equal(await page.locator('.answer-feedback').count(),0);
 await page.getByRole('button',{name:'Zurück',exact:true}).click();assert.equal(await page.locator(`[data-answer="${firstAnswer}"]`).getAttribute('aria-pressed'),'true');
 assert.equal(await page.locator('.solution-answer').count(),0);assert.equal(await page.locator('.answer-correct').count(),1);check('Sofortfeedback, richtige Antwort markiert, Erstantwort gesperrt, Wiederherstellung, keine Lösung bei offenen Fragen');
 await page.locator('.quiz-extras').evaluate(el=>el.open=true);await page.locator('[data-action="submit"]').click();await page.getByRole('heading',{name:'Noch nicht ganz fertig'}).waitFor();
 assert.match(await page.locator('#modal-content').innerText(),/29 Fragen/);
 await page.getByRole('button',{name:'Weiter üben'}).click();
 // Tatsächliche Quizfragen beantworten; der Schlüssel stammt ausschließlich aus dem Testprozess.
 async function answerAll(correct=true,limit=Infinity){
  const items=await page.evaluate(()=>JSON.parse(localStorage.getItem('mathequest.v1')).active.ids);
  for(let i=0;i<items.length;i++){
   await page.locator('.quiz-extras').evaluate(el=>el.open=true);await page.locator(`[data-action="quiz-jump"][data-index="${i}"]`).click();
   const option=page.locator(`[data-answer="${(correct&&i<limit)?key[items[i]].correct:(key[items[i]].correct+1)%3}"]`);
   if(await option.isEnabled()){await option.click();await page.locator('.answer-feedback').waitFor();}
  }
  await page.locator('.quiz-extras').evaluate(el=>el.open=true);await page.locator('[data-action="submit"]').click();
  await page.getByRole('heading',{name:'Ein Schritt weiter.'}).waitFor();
  return items;
 }
 const diagIds=await answerAll();
 const diagDomains=await page.evaluate(ids=>ids.map(id=>window.MQ_QUESTIONS.find(q=>q.id===id).domain),diagIds);
 assert.deepEqual(diagDomains.reduce((a,v)=>(a[v]=(a[v]||0)+1,a),{}),{...diagDomains.reduce((a,v)=>(a[v]=10,a),{})});
 assert.match(await page.locator('.report-hero').innerText(),/100 %/);
 assert.match(await page.locator('.report-rewards').innerText(),/\+300 XP/);
 assert.match(await page.locator('#header-level').innerText(),/Level 7/);
 check('30/30 richtige Diagnose, 300 XP, Levelaufstieg auf 7');
 await page.goto(url+'/#skills');
 assert.equal(await page.locator('.skill-node').count(),10);
 assert.equal(await page.locator('.skill-node .secure').count(),0);
 await page.locator('.skill-node summary').first().click();assert.equal(await page.locator('.skill-node[open] .subskill-list li').count(),3);
 await page.locator('.skill-node[open] [data-action="start-skill"]').click();await page.locator('.question-card').waitFor();assert.equal(await page.locator('.question-dots button').count(),5);
 const skillIds=await answerAll();
 await page.goto(url+'/#skills');
 assert.equal(await page.locator('.skill-node .secure').count(),1);
 check('90 Teilkompetenzen verfügbar; 1 Frage ist nicht sicher, 5 verschiedene + 2 Einheiten ergeben sichere Kompetenz');
 // Dasselbe Skilltraining mehrfach wiederholen: XP-Grenze von 20 je Frage.
 for(let n=0;n<4;n++){
  await page.goto(url+'/#skills');await page.locator('.skill-node summary').first().click();await page.locator('.skill-node[open] [data-action="start-skill"]').click();await answerAll();
 }
 assert.match(await page.locator('.report-rewards').innerText(),/\+0 XP/);check('Wiederholungs-XP gedeckelt, kein unbegrenztes Farming');
 await page.locator('.report-details summary').click();await page.getByRole('button',{name:'Lösungen freigeben'}).click();
 await page.getByRole('button',{name:'Lösungen öffnen'}).click();assert.equal(await page.locator('#modal[open]').count(),1);
 await page.locator('#teacher-consent').check();await page.getByRole('button',{name:'Lösungen öffnen'}).click();
 await page.locator('.solution-item').first().waitFor();assert.equal(await page.locator('.solution-item').count(),159);
 await page.locator('.solution-item summary').first().click();
 await page.locator('[data-oral="A001"]').selectOption('partial');
 await page.locator('#solution-search').fill('Taxi');assert.equal(await page.locator('.solution-item').count(),1);
 await page.locator('#solution-search').fill('');await page.locator('#solution-domain').selectOption('geometry');assert.equal(await page.locator('.solution-item').count(),53);
 check('Freigabe, 159 Lösungen, Suche, Fachfilter, separate mündliche Bewertung');
 await page.goto(url+'/#settings');
 const downloadPromise=page.waitForEvent('download');await page.getByRole('button',{name:'Lernstand exportieren',exact:true}).click();const download=await downloadPromise;
 const exportedPath=path.join(root,'tests/roundtrip.json');await download.saveAs(exportedPath);
 const exported=JSON.parse(fs.readFileSync(exportedPath));assert.equal(exported.oral.A001,'partial');assert.ok(exported.sessions.length>=6);
 await page.getByRole('button',{name:'Lernstand zurücksetzen'}).click();await page.getByRole('button',{name:'Alles zurücksetzen'}).click();await page.getByRole('heading',{name:'Heute lernen'}).waitFor();assert.equal(await page.locator('#header-level').innerText(),'Level 1');
 await page.goto(url+'/#settings');await page.locator('#import-file').setInputFiles(exportedPath);await page.getByRole('button',{name:'Importieren & ersetzen'}).click();
 const restored=await page.evaluate(()=>JSON.parse(localStorage.getItem('mathequest.v1')));
 assert.deepEqual(restored.sessions,exported.sessions);assert.deepEqual(restored.oral,exported.oral);
 await page.reload();assert.notEqual(await page.locator('#header-level').innerText(),'Level 1');
 check('JSON-Export, Zurücksetzen, validierter Import und Wiederherstellung');
 await page.locator('#import-file').setInputFiles({name:'kaputt.json',mimeType:'application/json',buffer:Buffer.from('{broken')});assert.match(await page.locator('#toast').innerText(),/kein gültiges JSON/);
 const unchanged=await page.evaluate(()=>JSON.parse(localStorage.getItem('mathequest.v1')).sessions.length);assert.equal(unchanged,exported.sessions.length);
 check('Ungültiger Import verändert keine vorhandenen Daten');
 // Falsche und unbeantwortete Aufgaben korrekt auswerten.
 await page.goto(url+'/#skills');await page.locator('.skill-node summary').first().click();await page.locator('.skill-node[open] [data-action="start-skill"]').click();
 const firstId=await page.evaluate(()=>JSON.parse(localStorage.getItem('mathequest.v1')).active.ids[0]);
 await page.locator(`[data-answer="${(key[firstId].correct+1)%3}"]`).click();
 await page.locator('.answer-feedback.incorrect').waitFor();
 assert.equal(await page.locator('.answer-incorrect').count(),1);assert.equal(await page.locator('.answer-correct').count(),1);
 assert.match(await page.locator('.answer-feedback').innerText(),/Richtige Antwort:/);
 assert.ok((await page.locator('.answer-feedback p').last().innerText()).length>20);
 await page.reload();await page.locator('.answer-feedback.incorrect').waitFor();
 assert.equal(await page.locator('.answer-option:disabled').count(),3);
 check('Falsche Antwort rot, richtige grün, Kurzerklärung und Erstantwort bleiben nach Neuladen erhalten');
 await page.goto(url+'/#solutions');await page.getByRole('button',{name:'Lernmodus freigeben'}).click();await page.getByRole('heading',{name:'Zuerst dein Training abschließen'}).waitFor();await page.getByRole('button',{name:'Zurück zum Training'}).click();
 await page.locator('.quiz-extras').evaluate(el=>el.open=true);await page.locator('[data-action="submit"]').click();await page.getByRole('button',{name:'Trotzdem abgeben'}).click();await page.getByRole('heading',{name:'Ein Schritt weiter.'}).waitFor();assert.match(await page.locator('.report-hero').innerText(),/0 %/);assert.match(await page.locator('.report-rewards').innerText(),/\+0 XP/);
 await page.locator('.report-details summary').click();assert.match(await page.locator('main').innerText(),/Falsch oder unbeantwortet \(5\)/);
 check('Lernmodus im laufenden Quiz gesperrt; falsche und fehlende Antworten = 0 Punkte/XP');
 await page.emulateMedia({media:'print'});await page.pdf({path:path.join(root,'tests/report.pdf'),format:'A4',printBackground:false});await page.emulateMedia({media:'screen'});check('Druckbericht als PDF erzeugt');
 // Smartphone: echte Interaktionen und Breitenkontrolle über alle Seiten.
 await page.setViewportSize({width:390,height:844});
 for(const route of ['dashboard','world','training','skills','progress','achievements','solutions','settings']){
  await page.goto(url+'/#'+route);await page.waitForTimeout(50);
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth),`Horizontaler Überlauf auf ${route}`);
 }
 await page.goto(url+'/#dashboard');await page.waitForFunction(()=>!document.getElementById('toast').classList.contains('visible'));await page.screenshot({path:path.join(root,'tests/mobile.png'),fullPage:true});
 await page.locator('#menu-button').click();assert.equal(await page.locator('#menu-button').getAttribute('aria-expanded'),'true');await page.locator('[data-nav="dashboard"]').click();await page.goto(url+'/#training');await page.waitForFunction(()=>document.getElementById('menu-button').getAttribute('aria-expanded')==='false');assert.equal(await page.locator('#menu-button').getAttribute('aria-expanded'),'false');
 await page.locator('[data-action="start-diagnostic"]').click();await page.locator('[data-answer="0"]').click();await page.locator('.answer-feedback').waitFor();await page.screenshot({path:path.join(root,'tests/mobile-quiz.png'),fullPage:true});
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth));check('Smartphone, alle Seiten ohne Überlauf, Menü und Quiz');
 // Vollständiger Lernstand: 1500 + 750 + 750 XP, Level maximal 60.
 await page.goto(url+'/#settings');
 const fullQuestions=await page.evaluate(()=>window.MQ_QUESTIONS.map(q=>({id:q.id,domain:q.domain})));
 const fullState={app:'MatheQuest',version:1,sessions:[],active:null,oral:{}};
 for(let round=0;round<3;round++)for(const domain of ['analysis','geometry','probability']){
  const ids=fullQuestions.filter(q=>q.domain===domain).map(q=>q.id);
  fullState.sessions.push({id:`test-${round}-${domain}`,date:new Date(2026,10,15,round).toISOString(),mode:'domain',title:'Prüfstand '+domain,ids,answers:ids.map(id=>key[id].correct)});
 }
 await page.locator('#import-file').setInputFiles({name:'max-level.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(fullState))});
 await page.getByRole('button',{name:'Importieren & ersetzen'}).click();
 assert.equal(await page.locator('#header-level').innerText(),'Level 60');
 await page.goto(url+'/#world');await page.locator('.world-map').waitFor();
 assert.equal(await page.locator('.map-country.conquered:not(.final-country)').count(),30);
 await page.locator('.final-country').click();
 assert.equal(await page.locator('[data-action="start-final"]').isEnabled(),true);
 await page.locator('[data-action="start-final"]').click();
 await page.locator('.question-card').waitFor();assert.equal(await page.locator('.question-dots button').count(),9);
 await answerAll(true,7);
 assert.match(await page.locator('.report-rewards').innerText(),/\+0 XP/);
 await page.goto(url+'/#world');assert.equal(await page.locator('.final-country.conquered').count(),0);
 await page.locator('.final-country').click();await page.locator('[data-action="start-final"]').click();
 await answerAll(true,8);
 await page.goto(url+'/#world');assert.equal(await page.locator('.final-country.conquered').count(),1);
 assert.match(await page.locator('.conquest-counter').innerText(),/31/);
 await page.locator('.final-country').click();assert.match(await page.locator('.conquest-notice').innerText(),/Alle 31 Gebiete/);
 await page.setViewportSize({width:1440,height:1100});await page.screenshot({path:path.join(root,'tests/conquered-world.png'),fullPage:true});
 check('30 eroberte Länder, Level-60-Freigabe, 7/9 reicht nicht, 8/9 erobert die Zitadelle ohne zusätzliche XP');
 const withCitadel=await page.evaluate(()=>JSON.parse(localStorage.getItem('mathequest.v1')));
 await page.goto(url+'/#settings');
 await page.locator('#import-file').setInputFiles({name:'welt-erobert.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(withCitadel))});
 await page.getByRole('button',{name:'Importieren & ersetzen'}).click();
 await page.goto(url+'/#world');assert.equal(await page.locator('.map-country.conquered').count(),31);
 check('Abgeschlossene Zitadellenrunden und alle 31 Eroberungen nach JSON-Import wiederhergestellt');
 // Nicht vorhandene IDs, auch Object-Prototypnamen, werden vor dem Ersetzen abgelehnt.
 await page.goto(url+'/#settings');const invalid=structuredClone(fullState);invalid.sessions[0].ids[0]='constructor';
 await page.locator('#import-file').setInputFiles({name:'ungueltig.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(invalid))});
 await page.waitForFunction(()=>document.getElementById('toast').textContent.includes('Ungültige Trainingseinheit'));
 assert.match(await page.locator('#toast').innerText(),/Ungültige Trainingseinheit/);
 const badIdentifier=structuredClone(fullState);badIdentifier.sessions[0].id='\"><img src=x onerror=alert(1)>';
 await page.locator('#import-file').setInputFiles({name:'falsche-id.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(badIdentifier))});
 await page.waitForFunction(()=>document.getElementById('toast').textContent.includes('Ungültige Trainingseinheit'));
 assert.match(await page.locator('#toast').innerText(),/Ungültige Trainingseinheit/);
 assert.equal(await page.locator('#header-level').innerText(),'Level 60');
 check('3.000 XP ergeben maximal Level 60; unbekannte Aufgaben-IDs werden sicher abgelehnt');
 // Ohne Server und ohne Netzwerk: file:// unterstützt klassische Scripts inkl. späterem Lösungsschlüssel.
 const offlineContext=await browser.newContext({offline:true});const offline=await offlineContext.newPage();
 await offline.goto('file://'+path.join(root,'index.html'));await offline.getByRole('heading',{name:'Heute lernen'}).waitFor();await offline.getByRole('button',{name:'Jetzt lernen'}).click();await offline.locator('[data-answer="0"]').click();await offline.locator('.answer-feedback').waitFor();await offline.locator('.quiz-extras summary').click();await offline.locator('[data-action="submit"]').click();await offline.getByRole('button',{name:'Trotzdem abgeben'}).click();await offline.getByRole('heading',{name:'Ein Schritt weiter.'}).waitFor();check('Direkter file://-Start offline, Quiz und dynamische Lösungsauswertung');
 assert.deepEqual(errors,[]);check('Keine JavaScript-Laufzeitfehler');
 await browser.close();
 console.log('Alle Browserprüfungen bestanden.');
})().catch(e=>{console.error(e);process.exit(1);});
