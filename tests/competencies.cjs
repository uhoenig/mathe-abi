'use strict';
const h=require('./helpers.cjs'),{assert,launch,open,blank,record,J,R,key,route,saved,raw,confirm,exportData}=h;
(async()=>{const browser=await launch();try{
 const {page:p,errors}=await open(browser);await p.locator('[data-action="start-daily"]').click();await p.locator('.question-title').waitFor();
 let answered=0;
 while(true){const a=(await saved(p)).active;await confirm(p,key[a.ids[a.index]].correct);answered++;
  const complete=await p.evaluate(()=>MQ_JOURNEY.progress([JSON.parse(localStorage.getItem('mathequest.v1')).active],MQ_SOLUTIONS)[0].complete);
  if(complete)break;
  await p.locator('[data-action="quiz-next"]').click();
 }
 for(const width of [320,390,768,1440]){await p.setViewportSize({width,height:1024});assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));}
 assert.equal(answered,J.decks[0].requiredCompetencies.length);await p.locator('.quiz-nav [data-action="submit"]').click();await p.locator('[data-action="confirm-submit"]').click();await p.locator('.report-hero').waitFor();
 const state=await saved(p);assert.deepEqual(state.learning.unlockedDecks,[1,2]);assert.ok(state.sessions[0].answers.some(a=>a===null));assert.equal(state.sessions[0].answers.filter(a=>a!==null).length,answered);assert.ok(state.sessions[0].ids.every((id,i)=>state.sessions[0].answers[i]===null||J.questionById[id].difficulty===1));
 await route(p,'decks');assert.equal(await p.locator('.journey-station.completed').count(),1);assert.equal(await p.locator('.journey-station.locked').count(),8);assert.equal(await p.locator('[data-nav="progress"]').count(),0);assert.deepEqual(errors,[]);
 console.log('OK Deck 2 nach je einem Grundnachweis sofort erreichbar; mittlere/schwere Fragen dürfen unbeantwortet bleiben; Kartendesign und entfernte Fortschrittsseite erhalten');
 const legacy=blank();legacy.learning.unlockedDecks=[1,2];legacy.learning.currentDeck=2;
 const session=record(['A001'],[key.A001.correct],'old-session','daily',new Date().toISOString());legacy.sessions=[session];legacy.learning=R.apply(legacy.learning,session,key,J.questionIds);const due=legacy.learning.reviews.A001.dueAt;
 const oldIds=['A001','A002','A003','A004','A005','G001','G002','G003','G004','G005'];legacy.active={id:'old-active',mode:'daily',title:'Heute · Deck 1',ids:oldIds,answers:[key.A001.correct,...Array(9).fill(null)],index:1,selection:null,startedAt:new Date().toISOString()};
 const original=JSON.stringify(legacy);const sample=await open(browser,{state:original});assert.equal(await raw(sample.page),original);await sample.page.locator('[data-action="resume"]').click();await sample.page.locator('.question-title').waitFor();assert.deepEqual((await saved(sample.page)).active.ids,oldIds);await confirm(sample.page,key.A002.correct);assert.equal((await saved(sample.page)).learning.reviews.A001.dueAt,due);assert.equal((await saved(sample.page)).sessions.length,1);assert.deepEqual((await saved(sample.page)).learning.unlockedDecks,[1,2]);
 await route(sample.page,'settings');const exported=JSON.parse(await exportData(sample.page));assert.equal(exported.active.id,'old-active');assert.deepEqual(exported.active.ids,oldIds);assert.deepEqual(exported.sessions,legacy.sessions);assert.equal(exported.learning.reviews.A001.dueAt,due);assert.deepEqual(sample.errors,[]);
 const demo=blank();demo.learning.unlockedDecks=[1,2,3,4,5,6,7,8,9,10];demo.active={id:'new-formula-demo',mode:'daily',title:'Lernen',ids:['A196','G256'],answers:[key.A196.correct,null],index:0,selection:null,startedAt:new Date().toISOString()};
 const expanded=await open(browser,{state:demo});await route(expanded.page,'quiz');await expanded.page.locator('.answer-feedback .katex').first().waitFor();for(const width of [320,390,768,1440]){await expanded.page.setViewportSize({width,height:1024});assert.ok(await expanded.page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));}await expanded.page.screenshot({path:h.path.join(h.root,'tests/expanded-question.png'),fullPage:true,animations:'disabled'});assert.deepEqual(expanded.errors,[]);
 console.log('OK Neue verschachtelte LaTeX-Aufgabe samt Erklärung bei vier Breiten; Abschluss-Buttons passen auch auf 320 px');
 console.log('OK Alter Version-3-Stand beim Laden bytegleich; offene Decks, laufende Zehn-Fragen-Runde, Antwortschlüssel, Termine und JSON-Export unverändert gültig');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
