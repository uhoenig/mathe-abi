'use strict';
const h=require('./helpers.cjs');
const {assert,open,route,confirm,saved,key}=h;
(async()=>{const browser=await h.launch();try{
 const {page:p,errors}=await open(browser,{width:393,height:852,hasTouch:true,isMobile:true});
 const stale=new Map([
  ['app.js','window.__staleAppCacheUsed=true;'],
  ['theme.css','.theme-control,.theme-touch{display:block!important}'],
  ['raumlabor.js','window.MQ_RAUM=undefined;'],
  ['solutions.js','window.MQ_SOLUTIONS={};']
 ]),cacheHits=[];
 // Alte Antworten liegen weiter unter den unveränderten URLs im Browsercache.
 await p.context().route('**/*',r=>{
  const url=new URL(r.request().url()),file=url.pathname.slice(1);
  if(stale.has(file)&&!url.search){cacheHits.push(file);return r.fulfill({body:stale.get(file),contentType:file.endsWith('.css')?'text/css':'text/javascript'});}
  return r.fallback();
 });
 await p.reload();await p.locator('.daily-card').waitFor();assert.deepEqual(cacheHits,[],'Alte App-/CSS-Dateien dürfen nicht aus unveränderten Cache-Adressen kommen.');
 assert.equal(await p.locator('.theme-control').isVisible(),false);assert.equal(await p.locator('.topbar .theme-touch').isVisible(),true);
 await p.locator('.topbar [data-theme-value="dark"]').tap();assert.equal(await p.locator('html').getAttribute('data-theme'),'dark');
 await route(p,'raumlabor');await p.locator('.geo-start [data-lab-lesson="0"]').tap();await p.locator('#lab-parameter').fill('2');await p.locator('[data-geo-command="next"]').tap();assert.match(await p.locator('#geo-question').innerText(),/startet/);
 await p.setViewportSize({width:1440,height:1000});await route(p,'dashboard');await p.locator('[data-action="start-daily"]').click();await p.locator('.question-title').waitFor();const a=(await saved(p)).active;await confirm(p,key[a.ids[0]].correct);assert.equal(await p.locator('.answer-feedback.correct').count(),1);
 assert.deepEqual(cacheHits,[],'Auch der nachgeladene Lösungsschlüssel muss eine aktuelle Adresse verwenden.');assert.deepEqual(errors,[]);
 console.log('OK Alte App-, Theme-, Raumlabor- und Lösungsdateien im Cache werden umgangen; Raumlabor, Touch-Farbschalter und Direktantwort funktionieren gemeinsam.');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
