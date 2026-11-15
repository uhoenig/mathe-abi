/* iPad-Layout und Bedienung. Playwright/Chromium wie bei tests/browser.cjs.
   Kein Webserver nötig; MQ_BROWSER kann ein vorhandenes Chromium auswählen. */
'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
let playwright;
try{playwright=require('playwright');}
catch{playwright=require('/Applications/ChatGPT.app/Contents/Resources/cua_node/lib/node_modules/playwright');}
const root=path.resolve(__dirname,'..'),url='https://mathequest.test/Mathe-Abi/';
const allowed=new Set(['index.html','style.css','app.js','questions.js','final-questions.js','solutions.js','assets/favicon.svg','assets/quest.svg']);
async function run(browserType,options,engine){
 const browser=await browserType.launch(options),context=await browser.newContext({hasTouch:true,viewport:{width:768,height:1024}}),errors=[];
 await context.route('**/*',route=>{const file=new URL(route.request().url()).pathname.replace('/Mathe-Abi/','')||'index.html';if(!allowed.has(file))return route.abort();return route.fulfill({body:fs.readFileSync(path.join(root,file)),contentType:file.endsWith('.js')?'text/javascript':file.endsWith('.css')?'text/css':file.endsWith('.svg')?'image/svg+xml':'text/html'});});
 const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
 try{
  await page.goto(url);await page.locator('.world-map').waitFor();
  assert.equal(await page.locator('#country-choice option').count(),31);
  for(const [width,height] of [[768,1024],[820,1180],[834,1194],[1024,768],[1180,820],[1194,834],[744,1133],[520,1024],[390,844]]){
   await page.setViewportSize({width,height});
   const metrics=await page.evaluate(()=>{
    const map=document.querySelector('.world-map'),level=map.querySelector('.country-level'),countries=[...map.querySelectorAll('.map-country')].map(el=>el.getBoundingClientRect());
    return{width:innerWidth,pageWidth:document.documentElement.scrollWidth,levelFont:parseFloat(getComputedStyle(level).fontSize)*level.getScreenCTM().a,minCountryWidth:Math.min(...countries.map(r=>r.width)),minCountryHeight:Math.min(...countries.map(r=>r.height)),menu:getComputedStyle(document.querySelector('#menu-button')).display!=='none',menuWidth:document.querySelector('#menu-button').offsetWidth,menuHeight:document.querySelector('#menu-button').offsetHeight};
   });
   assert.ok(metrics.pageWidth<=width,`Seitenüberlauf bei ${width}: ${JSON.stringify(metrics)}`);
   assert.ok(metrics.levelFont>=12,`Unlesbare Levelschrift bei ${width}`);
   assert.ok(metrics.minCountryWidth>=44&&metrics.minCountryHeight>=44,`Länder zu klein: ${JSON.stringify(metrics)}`);
   assert.ok(metrics.menu&&metrics.menuWidth>=44&&metrics.menuHeight>=44);
   console.log(`OK ${engine}: ${width}×${height}, Levelschrift ${metrics.levelFont.toFixed(1)} px, Länder mindestens ${metrics.minCountryWidth.toFixed(0)}×${metrics.minCountryHeight.toFixed(0)} px, kein Seitenüberlauf`);
  }
  await page.setViewportSize({width:768,height:1024});
  await page.evaluate(()=>{window.__auditMap=document.querySelector('.world-map');window.__auditFrame=document.querySelector('.world-frame');window.__auditFrame.scrollLeft=9999;});
  const before=await page.locator('.world-frame').evaluate(el=>el.scrollLeft);assert.ok(before>0);
  await page.locator('.final-country').click();
  assert.equal(await page.locator('.world-frame').evaluate(el=>el.scrollLeft),before);
  assert.ok(await page.evaluate(()=>document.querySelector('.world-map')===window.__auditMap&&document.querySelector('.world-frame')===window.__auditFrame));
  assert.equal(await page.locator('#country-choice').inputValue(),'final');assert.equal(await page.locator('[data-action="start-final"]').isDisabled(),true);
  await page.locator('.final-country').focus();await page.keyboard.press('Enter');assert.equal(await page.locator('.world-frame').evaluate(el=>el.scrollLeft),before);
  console.log(`OK ${engine}: Scrollposition und SVG bleiben bei Klick und Tastaturauswahl erhalten`);
  await page.locator('#country-choice').selectOption('geometry-07');
  assert.equal(await page.locator('.map-country.selected').getAttribute('data-skill'),'geometry-07');
  assert.match(await page.locator('.country-panel').innerText(),/Kreuzungslande/);
  const center=await page.evaluate(()=>{const r=document.querySelector('.map-country.selected').getBoundingClientRect(),v=document.querySelector('.world-frame').getBoundingClientRect();return Math.abs(r.left+r.width/2-v.left-v.width/2);});assert.ok(center<3,`Land nicht zentriert: ${center}`);
  const focusBefore=await page.locator('.world-frame').evaluate(el=>el.scrollLeft);
  await page.locator('[data-action="center-country"]').click();assert.equal(await page.locator('.world-frame').evaluate(el=>el.scrollLeft),focusBefore);
  await page.setViewportSize({width:1180,height:820});assert.equal(await page.locator('#country-choice').inputValue(),'geometry-07');
  await page.evaluate(()=>scrollTo(0,0));assert.equal(await page.locator('header.topbar').count(),1);assert.equal(await page.locator('.world-section').count(),1);
  await page.screenshot({path:path.join(root,`tests/ipad-${engine}-landscape.png`),animations:'disabled'});
  await page.setViewportSize({width:768,height:1024});
  await page.evaluate(()=>scrollTo(0,0));
  await page.screenshot({path:path.join(root,`tests/ipad-${engine}-portrait.png`),animations:'disabled'});
  console.log(`OK ${engine}: Direktauswahl, Zentrierung und Orientierung erhalten das ausgewählte Land`);
  await page.locator('#menu-button').click();assert.equal(await page.locator('#menu-button').getAttribute('aria-expanded'),'true');assert.equal(await page.locator('#menu-button').getAttribute('aria-label'),'Menü schließen');
  await page.keyboard.press('Escape');assert.equal(await page.locator('#menu-button').getAttribute('aria-expanded'),'false');assert.ok(await page.locator('#menu-button').evaluate(el=>el===document.activeElement));
  await page.locator('#menu-button').click();await page.locator('[data-nav="training"]').click();await page.getByRole('heading',{name:'Dein Training. Dein Tempo.'}).waitFor();assert.equal(await page.locator('#menu-button').getAttribute('aria-expanded'),'false');
  await page.locator('#menu-button').click();await page.locator('.topbar-right .avatar').click();assert.equal(await page.locator('#menu-button').getAttribute('aria-expanded'),'false');
  await page.goto(url+'#skills');
  const tabs=await page.locator('.filter-tabs button').evaluateAll(els=>els.map(el=>({w:el.offsetWidth,h:el.offsetHeight})));assert.ok(tabs.every(r=>r.w>=44&&r.h>=44));
  await page.locator('.skill-node summary').first().click();await page.locator('.skill-node[open] [data-action="start-skill"]').click();await page.locator('.answer-option').first().waitFor();
  const targets=await page.locator('.answer-option,.quiz-nav .btn,.question-dots button').evaluateAll(els=>els.map(el=>({w:el.offsetWidth,h:el.offsetHeight})));assert.ok(targets.every(r=>r.w>=44&&r.h>=44));
  await page.locator('[data-answer="0"]').click();await page.locator('.answer-feedback').waitFor();
  await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:path.join(root,`tests/ipad-${engine}-quiz.png`),animations:'disabled'});
  const draft=await page.evaluate(()=>JSON.parse(localStorage.getItem('mathequest.v1')));assert.equal(draft.progressVersion,1);assert.equal(draft.active.answers[0],0);
  await page.reload();await page.locator('.answer-feedback').waitFor();assert.equal(await page.locator('[data-answer="0"]').getAttribute('aria-pressed'),'true');
  await page.locator('[data-action="quiz-next"]').click();await page.locator('[data-action="quiz-prev"]').click();await page.locator('.answer-feedback').waitFor();
  console.log(`OK ${engine}: Menü, Escape, Touch-Ziele ab 44 px, Sofortfeedback und Spielstand-Wiederherstellung`);
  for(const route of ['dashboard','training','skills','progress','achievements','solutions','settings']){
   await page.goto(url+'#'+route);await page.locator('main h1').waitFor();assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`Überlauf in ${route}`);
  }
  assert.deepEqual(errors,[]);console.log(`OK ${engine}: Alle sieben Ansichten ohne Seitenüberlauf oder JavaScript-Fehler`);
 }finally{await browser.close();}
}
(async()=>{
 let executablePath=process.env.MQ_BROWSER;
 if(!executablePath&&!fs.existsSync(playwright.chromium.executablePath())&&fs.existsSync('/Applications/Brave Browser.app/Contents/MacOS/Brave Browser'))executablePath='/Applications/Brave Browser.app/Contents/MacOS/Brave Browser';
 await run(playwright.chromium,{headless:true,...(executablePath?{executablePath}:{})},'chromium');
 if(fs.existsSync(playwright.webkit.executablePath()))await run(playwright.webkit,{headless:true},'webkit');
 else console.log('HINWEIS: Kein Playwright-WebKit installiert. Eine echte iPad-Safari-Abnahme bleibt erforderlich.');
 console.log('Alle verfügbaren iPad-Layoutprüfungen bestanden.');
})().catch(e=>{console.error(e);process.exitCode=1});
