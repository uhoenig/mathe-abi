'use strict';
const h=require('./helpers.cjs'),{assert,launch,open,blank,record,J,R,key,raw,route,confirm,exportData}=h;
const DEV='mathequest.developer.v1',SETTING='mathequest.developer.enabled';
const devState=p=>p.evaluate(k=>JSON.parse(localStorage.getItem(k)),DEV);
async function toggle(p,enabled){await route(p,'settings');await p.locator('[data-action="toggle-developer"]').click();await p.locator(`[data-action="toggle-developer"][aria-pressed="${enabled}"]`).waitFor();}
(async()=>{const browser=await launch();try{
 const normal=blank();const past=record(['A001'],[key.A001.correct],'regular-session','daily',new Date(Date.now()-2*86400000).toISOString());normal.sessions=[past];normal.learning=R.apply(normal.learning,past,key,J.questionIds);
 normal.active={id:'regular-active',mode:'daily',title:'Heute',ids:['A002','G001'],answers:[null,null],index:0,selection:null,startedAt:new Date().toISOString()};
 const original=JSON.stringify(normal);const {page:p,errors}=await open(browser,{state:original});await route(p,'decks');assert.equal(await p.locator('.journey-station.locked').count(),9);
 await toggle(p,true);assert.equal(await raw(p),original);await route(p,'decks');assert.equal(await p.locator('.journey-station.locked').count(),0);assert.equal(await p.locator('[data-action="choose-deck"]:enabled').count(),10);
 await p.locator('[data-action="choose-deck"][data-deck="10"]').click();await p.locator('.question-title').waitFor();let dev=await devState(p);assert.equal(dev.learning.currentDeck,10);assert.equal(dev.active.ids.length,J.decks[9].questionIds.length);assert.ok(dev.active.ids.every(id=>J.deckFor[id]===10));assert.equal(J.questionById[dev.active.ids[0]].difficulty,3);
 const difficulty=dev.active.ids.map(id=>J.questionById[id].difficulty);assert.deepEqual(difficulty,[...difficulty].sort((a,b)=>b-a));
 await confirm(p,key[dev.active.ids[0]].correct);await p.reload();await p.locator('.answer-feedback.correct').waitFor();assert.equal((await devState(p)).active.answers[0],key[dev.active.ids[0]].correct);assert.equal(await raw(p),original);
 for(let i=0;i<dev.active.ids.length;i++){if(i){await p.locator('[data-action="quiz-next"]').click();await p.waitForFunction(({k,i})=>JSON.parse(localStorage.getItem(k)).active.index===i,{k:DEV,i});}if((await devState(p)).active.answers[i]===null)await confirm(p,key[dev.active.ids[i]].correct);}
 await p.locator('[data-action="submit"]').click();await p.locator('.report-hero').waitFor();dev=await devState(p);assert.equal(dev.sessions.length,1);assert.equal(Object.keys(dev.learning.reviews).length,J.decks[9].questionIds.length);assert.equal(await raw(p),original);
 await route(p,'settings');const backup=JSON.parse(await exportData(p));assert.equal(backup.sessions.length,1);assert.deepEqual(backup.learning.unlockedDecks,[1,2,3,4,5,6,7,8,9,10]);
 for(const width of [320,390,768,1440]){await p.setViewportSize({width,height:1100});assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));assert.ok(await p.locator('[data-action="toggle-developer"]').evaluate(el=>el.offsetHeight>=44));}
 await p.screenshot({path:h.path.join(h.root,'tests/developer-settings.png'),fullPage:true,animations:'disabled'});
 await toggle(p,false);assert.equal(await raw(p),original);assert.deepEqual(JSON.parse(await raw(p)),JSON.parse(original));await route(p,'decks');assert.equal(await p.locator('.journey-station.locked').count(),9);await route(p,'dashboard');await p.locator('[data-action="resume"]').click();await p.locator('.question-title').waitFor();assert.equal(JSON.parse(await raw(p)).active.id,'regular-active');
 await toggle(p,true);assert.equal((await devState(p)).sessions.length,1);assert.equal(await raw(p),original);await toggle(p,false);assert.equal(await raw(p),original);assert.deepEqual(errors,[]);
 console.log('OK Alle zehn Decks zugänglich; Deck 10 startet direkt mit schweren Fragen; Testantworten, Termine und Export separat; regulärer Stand samt laufender Runde bytegleich');
 const fresh=await open(browser);await toggle(fresh.page,true);assert.equal(await raw(fresh.page),null);await toggle(fresh.page,false);assert.equal(await raw(fresh.page),null);assert.deepEqual(fresh.errors,[]);
 console.log('OK Auch ohne bisherigen Lernstand werden keine regulären Freischaltungen angelegt');
 const failed=await open(browser,{state:original});await route(failed.page,'settings');await failed.page.evaluate(setting=>{const set=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(k===setting)throw new DOMException('Test','QuotaExceededError');return set.call(this,k,v);};},SETTING);
 await failed.page.locator('[data-action="toggle-developer"]').click();await failed.page.waitForFunction(()=>document.getElementById('toast').textContent.includes('nicht gespeichert'));assert.equal(await failed.page.locator('[data-action="toggle-developer"]').getAttribute('aria-pressed'),'false');assert.equal(await raw(failed.page),original);assert.deepEqual(failed.errors,[]);
 console.log('OK Umschalten bei Schreibfehler ohne Neuladen, ohne vorgetäuschte Aktivierung und ohne Datenverlust');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
