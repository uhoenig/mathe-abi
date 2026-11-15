/* Darstellungstests ohne Server und ohne echte Benutzer-Spielstände. */
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
let chromium;try{({chromium}=require('playwright'));}catch{({chromium}=require('/Applications/ChatGPT.app/Contents/Resources/cua_node/lib/node_modules/playwright'));}
const root=path.resolve(__dirname,'..'),URL_BASE='https://mathequest.test/Mathe-Abi/',THEME='mathequest.theme.v1',GAME='mathequest.v1';
const allowed=new Set(['index.html','style.css','theme.css','theme.js','review.js','app.js','review.js','questions.js','final-questions.js','solutions.js','assets/favicon.svg','assets/quest.svg']);
const data={window:{}};for(const file of ['questions.js','final-questions.js','solutions.js'])vm.runInNewContext(fs.readFileSync(path.join(root,file),'utf8'),data);
const blank=()=>({app:'MatheQuest',version:1,progressVersion:1,sessions:[],active:null,oral:{}});
const errors=[];let browser;const contexts=[];
async function open({scheme='light',preference=null,state=blank(),fault=false,width=1440,height=1100}={}){
 const context=await browser.newContext({colorScheme:scheme,viewport:{width,height}});contexts.push(context);
 await context.route('**/*',route=>{const file=new URL(route.request().url()).pathname.replace('/Mathe-Abi/','')||'index.html';if(file==='__bootstrap')return route.fulfill({body:'<!doctype html><title>Test</title>',contentType:'text/html'});if(!allowed.has(file))return route.abort();return route.fulfill({body:fs.readFileSync(path.join(root,file)),contentType:file.endsWith('.css')?'text/css':file.endsWith('.js')?'text/javascript':file.endsWith('.svg')?'image/svg+xml':'text/html'});});
 const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));await page.goto(URL_BASE+'__bootstrap');
 await page.evaluate(({preference,state,THEME,GAME})=>{localStorage.setItem(GAME,JSON.stringify(state));if(preference!==null)localStorage.setItem(THEME,preference);},{preference,state,THEME,GAME});
 if(fault)await context.addInitScript(THEME=>{window.__themeFail=true;const set=Storage.prototype.setItem,get=Storage.prototype.getItem;Storage.prototype.setItem=function(k,v){if(k===THEME&&window.__themeFail)throw new DOMException('Test','QuotaExceededError');return set.call(this,k,v);};Storage.prototype.getItem=function(k){if(k===THEME&&window.__themeFail)throw new DOMException('Test','SecurityError');return get.call(this,k);};},THEME);
 await page.goto(URL_BASE+'#world');await page.locator('.world-map').waitFor();return page;
}
const game=p=>p.evaluate(GAME=>localStorage.getItem(GAME),GAME);
const mode=p=>p.locator('html').getAttribute('data-theme');
async function check(name,fn){await fn();console.log('OK '+name);for(const context of contexts.splice(0))await context.close();}
async function assertMode(p,value){await p.waitForFunction(value=>document.documentElement.dataset.theme===value,value);assert.equal(await p.locator('html').evaluate(el=>getComputedStyle(el).colorScheme),value);await p.evaluate(()=>Promise.all(document.getAnimations().filter(a=>a.effect?.getComputedTiming().iterations!==Infinity).map(a=>a.finished.catch(()=>{}))));}
async function ratio(p,selector,backgroundSelector,foreground='color',background='backgroundColor'){
 return p.evaluate(({selector,backgroundSelector,foreground,background})=>{
  const canvas=document.createElement('canvas');canvas.width=canvas.height=1;const ctx=canvas.getContext('2d');
  function rgb(css){ctx.clearRect(0,0,1,1);ctx.fillStyle=css;ctx.fillRect(0,0,1,1);return [...ctx.getImageData(0,0,1,1).data].slice(0,3);}
  function lum(rgb){return rgb.map(v=>v/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4).reduce((s,v,i)=>s+v*[.2126,.7152,.0722][i],0);}
  const fg=lum(rgb(getComputedStyle(document.querySelector(selector))[foreground])),bg=lum(rgb(getComputedStyle(document.querySelector(backgroundSelector))[background]));return(Math.max(fg,bg)+.05)/(Math.min(fg,bg)+.05);
 },{selector,backgroundSelector,foreground,background});
}
(async()=>{
 let executablePath=process.env.MQ_BROWSER;if(!executablePath&&!fs.existsSync(chromium.executablePath())&&fs.existsSync('/Applications/Brave Browser.app/Contents/MacOS/Brave Browser'))executablePath='/Applications/Brave Browser.app/Contents/MacOS/Brave Browser';
 browser=await chromium.launch({headless:true,...(executablePath?{executablePath}:{})});
 try{
 await check('System als Standard; Änderungen der Geräteeinstellung werden übernommen',async()=>{
  const p=await open();await assertMode(p,'light');assert.equal(await p.locator('#theme-choice').inputValue(),'system');
  await p.emulateMedia({colorScheme:'dark'});await assertMode(p,'dark');await p.emulateMedia({colorScheme:'light'});await assertMode(p,'light');
  assert.equal(await p.evaluate(THEME=>localStorage.getItem(THEME),THEME),null);
 });
 await check('Manuelle Auswahl bleibt nach Neuladen erhalten und überstimmt die Systemeinstellung',async()=>{
  const p=await open({scheme:'dark',preference:'light'});await assertMode(p,'light');assert.equal(await p.locator('#theme-choice').inputValue(),'light');
  await p.locator('#theme-choice').selectOption('dark');await assertMode(p,'dark');await p.reload();await p.locator('.world-map').waitFor();await assertMode(p,'dark');
  await p.emulateMedia({colorScheme:'light'});assert.equal(await mode(p),'dark');
  await p.locator('#theme-choice').selectOption('system');await assertMode(p,'light');await p.emulateMedia({colorScheme:'dark'});await assertMode(p,'dark');
  assert.equal(await p.locator('meta[name="theme-color"]').getAttribute('content'),'#101015');
 });
 await check('Kopfzeile und Einstellungen synchron; keine Änderung des Spielstands',async()=>{
  const p=await open();const before=await game(p);await p.goto(URL_BASE+'#settings');
  await p.locator('#theme-setting').selectOption('dark');await assertMode(p,'dark');assert.equal(await p.locator('#theme-choice').inputValue(),'dark');assert.match(await p.locator('[data-theme-effective]').innerText(),/Dunkel/);
  await p.locator('#theme-choice').selectOption('light');assert.equal(await p.locator('#theme-setting').inputValue(),'light');assert.equal(await game(p),before);
  await p.locator('[data-action="reset"]').click();await p.locator('[data-action="confirm-reset"]').click();assert.equal(await mode(p),'light');assert.equal(await p.evaluate(THEME=>localStorage.getItem(THEME),THEME),'light');
  await p.goto(URL_BASE+'#settings');await p.locator('#import-file').setInputFiles({name:'stand.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(blank()))});await p.locator('[data-action="confirm-import"]').click();assert.equal(await mode(p),'light');
 });
 await check('Darstellungswechsel erhält SVG, Kartenposition, Quizantwort und geöffnete Lösungen',async()=>{
  const p=await open({width:768,height:1024});await p.evaluate(()=>{window.__map=document.querySelector('.world-map');document.querySelector('.world-frame').scrollLeft=200;});
  const left=await p.locator('.world-frame').evaluate(el=>el.scrollLeft);await p.locator('#theme-choice').selectOption('dark');assert.ok(await p.evaluate(()=>window.__map===document.querySelector('.world-map')));assert.equal(await p.locator('.world-frame').evaluate(el=>el.scrollLeft),left);
  await p.locator('[data-action="start-skill"][data-skill="analysis-01"]').click();await p.locator('[data-answer="0"]').click();await p.locator('.answer-feedback').waitFor();
  const saved=await game(p);await p.evaluate(()=>window.__question=document.querySelector('.question-card'));await p.locator('#theme-choice').selectOption('light');assert.equal(await game(p),saved);assert.ok(await p.evaluate(()=>window.__question===document.querySelector('.question-card')));assert.equal(await p.locator('[data-answer="0"]').getAttribute('aria-pressed'),'true');
  await p.goto(URL_BASE+'#solutions');await p.locator('[data-action="unlock-solutions"]').click();await p.locator('[data-action="close-dialog"]').click();
  await p.goto(URL_BASE+'#settings');await p.locator('[data-action="reset"]').click();await p.locator('[data-action="confirm-reset"]').click();
  await p.goto(URL_BASE+'#solutions');await p.locator('[data-action="unlock-solutions"]').click();await p.locator('#teacher-consent').check();await p.locator('[data-action="confirm-unlock"]').click();await p.locator('.solution-item summary').first().click();
  await p.locator('#theme-choice').selectOption('dark');assert.equal(await p.locator('.solution-item[open]').count(),1);
 });
 await check('Separate Tabs synchronisieren nur die Darstellung und sperren keinen Lernstand',async()=>{
  const p=await open(),p2=await p.context().newPage();await p2.goto(URL_BASE+'#world');await p2.locator('.world-map').waitFor();const before=await game(p);
  await p.locator('#theme-choice').selectOption('dark');await assertMode(p2,'dark');assert.equal(await p2.locator('#theme-choice').inputValue(),'dark');assert.equal(await game(p),before);assert.equal(await p2.locator('.world-map').count(),1);
  await p.evaluate(THEME=>localStorage.removeItem(THEME),THEME);await assertMode(p2,'light');assert.equal(await p2.locator('#theme-choice').inputValue(),'system');
 });
 await check('Ungültige Einstellung fällt auf System zurück; Speicherfehler blockieren das Lernen nicht',async()=>{
  const invalid=await open({preference:'unbekannt'});await assertMode(invalid,'light');assert.equal(await invalid.locator('#theme-choice').inputValue(),'system');
  const p=await open({fault:true});const before=await game(p);await p.locator('#theme-choice').selectOption('dark');await assertMode(p,'dark');assert.equal(await p.locator('#theme-notice').isVisible(),true);assert.equal(await game(p),before);assert.equal(await p.locator('.world-map').count(),1);
  await p.evaluate(()=>window.__themeFail=false);await p.locator('#theme-choice').selectOption('light');assert.equal(await p.locator('#theme-notice').isVisible(),false);assert.equal(await p.evaluate(THEME=>localStorage.getItem(THEME),THEME),'light');
 });
 await check('Helle/dunkle Hauptansichten auf Desktop und Tablet; Lesbarkeit und Kontraste',async()=>{
  const p=await open();
  for(const theme of ['light','dark']){
   await p.locator('#theme-choice').selectOption(theme);await assertMode(p,theme);
   for(const [width,height] of [[1440,1100],[768,1024],[390,844],[320,700]]){
    await p.setViewportSize({width,height});
    for(const route of ['dashboard','world','training','skills','progress','achievements','solutions','settings']){
     await p.goto(URL_BASE+'#'+route);await p.locator('main h1').waitFor();assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${theme}/${width}/${route}: Seitenüberlauf`);
    }
   }
   await p.setViewportSize({width:1440,height:1100});await p.goto(URL_BASE+'#world');
   for(const [fg,bg] of [['body','body'],['.country-rule','.country-panel'],['.map-toolbar label','.map-toolbar'],['.btn-primary','.btn-primary']])assert.ok(await ratio(p,fg,bg)>=4.5,`${theme}: Textkontrast ${fg}`);
   for(const domain of ['analysis','geometry','probability'])assert.ok(await ratio(p,`.map-country.${domain} .country-level`,`.map-country.${domain} polygon`,'fill','fill')>=4.5,`${theme}: Kartenkontrast ${domain}`);
   await p.screenshot({path:path.join(root,`tests/theme-${theme}-desktop.png`),fullPage:true,animations:'disabled'});
   await p.setViewportSize({width:768,height:1024});await p.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));await p.screenshot({path:path.join(root,`tests/theme-${theme}-ipad.png`),animations:'disabled'});
   console.log('OK Hauptansichten und geprüfte Text-/Kartenkontraste für '+theme);
  }
 });
 await check('Feedback, eroberte Länder, Dialog und Druckansicht in beiden Darstellungen',async()=>{
  const p=await open();await p.locator('[data-action="start-skill"][data-skill="analysis-01"]').click();
  const draft=JSON.parse(await game(p)).active,correct=data.window.MQ_SOLUTIONS[draft.ids[0]].correct;
  await p.locator(`[data-answer="${(correct+1)%3}"]`).click();await p.locator('.answer-feedback').waitFor();
  for(const theme of ['light','dark']){
   await p.locator('#theme-choice').selectOption(theme);await assertMode(p,theme);
   for(const selector of ['.answer-correct','.answer-incorrect','.answer-feedback'])assert.ok(await ratio(p,selector,selector)>=4.5,`${theme}: Feedbackkontrast ${selector}`);
   await p.screenshot({path:path.join(root,`tests/theme-${theme}-quiz.png`),animations:'disabled'});
  }
  await p.locator('.quiz-extras summary').click();await p.locator('[data-action="submit"]').click();await p.locator('[data-action="confirm-submit"]').click();await p.locator('.report-hero').waitFor();
  for(const theme of ['light','dark']){await p.locator('#theme-choice').selectOption(theme);await p.emulateMedia({media:'print'});assert.equal(await p.locator('.theme-control').isVisible(),false);assert.equal(await p.locator('body').evaluate(el=>getComputedStyle(el).backgroundColor),'rgb(255, 255, 255)');await p.emulateMedia({media:'screen'});}
  const state=blank();for(let r=0;r<3;r++)for(const domain of data.window.MQ_DOMAINS){const ids=data.window.MQ_QUESTIONS.filter(q=>q.domain===domain.id).map(q=>q.id);state.sessions.push({id:`world-${r}-${domain.id}`,date:'2026-11-15T12:00:00Z',mode:'domain',title:'Kartenprüfung',ids,answers:ids.map(id=>data.window.MQ_SOLUTIONS[id].correct)});}
  await p.goto(URL_BASE+'#settings');await p.locator('#import-file').setInputFiles({name:'welt.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(state))});await p.locator('[data-action="confirm-import"]').click();await p.goto(URL_BASE+'#world');assert.equal(await p.locator('.map-country.conquered').count(),30);
  for(const theme of ['light','dark']){await p.locator('#theme-choice').selectOption(theme);await assertMode(p,theme);assert.ok(await ratio(p,'.map-country.conquered .country-level','.map-country.conquered polygon','fill','fill')>=4.5,`${theme}: erobertes Land`);await p.goto(URL_BASE+'#settings');await p.locator('[data-action="reset"]').click();assert.ok(await ratio(p,'dialog','dialog')>=4.5);await p.locator('[data-action="close-dialog"]').click();await p.goto(URL_BASE+'#world');}
 });
 assert.deepEqual(errors,[]);console.log('Alle Theme-Prüfungen bestanden; keine JavaScript-Laufzeitfehler.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
