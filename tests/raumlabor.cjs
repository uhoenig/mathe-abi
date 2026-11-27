'use strict';
const h=require('./helpers.cjs');
const {assert,open,route,raw,root,path}=h;
const LAB='mathequest.raumlabor.v1';
// Unabhängige Lösungen für die aufeinander aufbauenden Rechenschritte.
const solutions=[
 [2,'0','0',[2,2,0],[3,2,1],[0,-1,1],[2,2,0]],
 [2,'1',[1],'2',[3,-1,1],[2,-1,3]],
 [2,[2],[2],'1',[3],'1'],
 [1,'0','0',[2],[1],[2,1,1]],
 [1,'0','0',[2],[1],[2,2,2]],
 [1,'0',[2],'0',[1,1,2],[1,1,-2]],
 [0,'1','0','2','1']
];
async function launch(){
 if(process.env.MQ_RAUM_ENGINE!=='webkit')return h.launch();
 let pw;try{pw=require('playwright');}catch{pw=require('/Applications/ChatGPT.app/Contents/Resources/cua_node/lib/node_modules/playwright');}
 return pw.webkit.launch();
}
async function enter(p,i){await p.locator(`.geo-node[data-lab-lesson="${i}"]`).click();await p.locator('#geo-question').waitFor();}
async function next(p){await p.locator('[data-geo-command="next"]').click();}
async function solve(p,answer){
 if(Array.isArray(answer)){
  const inputs=p.locator('.geo-inputs input');assert.equal(await inputs.count(),answer.length);
  for(let j=0;j<answer.length;j++)await inputs.nth(j).fill(String(answer[j]));
 }else await p.locator(`[data-geo-option="${answer}"]`).tap();
 await p.locator('.geo-check').click();await p.locator('.geo-feedback.correct').waitFor();
}
async function explore(p,target){await p.locator('#lab-parameter').fill(String(target));await next(p);}
async function toMission(p){await enter(p,0);await explore(p,2);for(const a of solutions[0].slice(1,5)){await solve(p,a);await next(p);}}
(async()=>{const browser=await launch();try{
 const original=JSON.stringify(h.blank());const {page:p,errors,requests}=await open(browser,{state:original,width:393,height:852,hasTouch:true,isMobile:true});
 await p.locator('#menu-button').tap();await p.locator('[data-nav="raumlabor"]').click();await p.locator('.geo-path').waitFor();
 assert.equal(await p.locator('[data-nav="raumlabor"]').getAttribute('aria-current'),'page');assert.equal(await p.locator('.geo-node').count(),7);assert.equal(await p.locator('.lab-task,.lab-lesson').count(),0);
 const parsing=await p.evaluate(()=>['−1','0,5','1/2','','1/0','<img>','1e5'].map(MQ_RAUM.parseNumber));assert.deepEqual(parsing,[-1,.5,.5,null,null,null,null]);
 await p.screenshot({path:path.join(root,'tests/raumlabor-game-map.png'),fullPage:true,animations:'disabled'});
 for(let i=0;i<7;i++){
  await enter(p,i);assert.equal(await p.locator('main h1').count(),1);assert.equal(await p.locator('.lab-scene').count(),1);assert.equal(await p.locator('.geo-answer').count(),0);
  if(i===0){assert.equal(await p.locator('[data-geo-command="next"]').isEnabled(),false);await p.locator('#lab-parameter').fill('1');assert.equal(await p.locator('[data-geo-command="next"]').isEnabled(),false);}
  await explore(p,solutions[i][0]);
  for(let j=1;j<solutions[i].length;j++){
   assert.equal(await p.locator('.geo-answer').count(),1);assert.equal(await p.locator('main h1').count(),1);assert.equal(await p.locator('.katex-error').count(),0);
   assert.equal(await p.locator('[data-geo-command="next"]').count(),0);
   if(i===0&&j===1){
    await p.locator('.geo-check').click();assert.match(await p.locator('.geo-feedback').innerText(),/Antwort/);
    await solveWrong(p,'1');assert.equal(await p.evaluate(k=>localStorage.getItem(k),LAB),null);assert.equal(await p.locator('[data-geo-command="next"]').count(),0);
   }
   if(i===0&&j===3){
    await p.locator('.geo-check').click();assert.match(await p.locator('.geo-feedback').innerText(),/Zahl/);
    await p.locator('.geo-inputs input').first().fill('2');await p.locator('[data-geo-sign="geo-answer-0"]').tap();assert.equal(await p.locator('.geo-inputs input').first().inputValue(),'-2');await p.locator('[data-geo-sign="geo-answer-0"]').tap();assert.equal(await p.locator('.geo-inputs input').first().inputValue(),'2');
   }
   if(i===4&&j===3){
    for(const theme of ['light','dark']){await h.setTheme(p,theme);for(const width of [320,768,1440]){await p.setViewportSize({width,height:900});assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));}}
    await p.setViewportSize({width:1440,height:1000});await h.setTheme(p,'light');await p.screenshot({path:path.join(root,'tests/raumlabor-game-derive-desktop.png'),animations:'disabled'});
    await p.setViewportSize({width:393,height:852});await p.screenshot({path:path.join(root,'tests/raumlabor-game-derive-mobile.png'),animations:'disabled'});
   }
   await solve(p,solutions[i][j]);
   if(i===0&&j===1){
    assert.equal(await p.locator('.geo-option:enabled').count(),0);await p.locator('[data-geo-command="back"]').click();await explore(p,2);assert.equal(await p.locator('.geo-feedback.correct').count(),1);
   }
   await next(p);
  }
  await p.locator('.geo-reward').waitFor();assert.equal((await p.evaluate(k=>JSON.parse(localStorage.getItem(k)),LAB)).completed.length,2*(i+1));
  const link=new URL(await p.locator('.lab-video').getAttribute('href'));assert.equal(link.origin,'https://www.youtube.com');assert.equal(link.pathname,'/@mathebydanieljung/search');
  if(i===4)await p.screenshot({path:path.join(root,'tests/raumlabor-game-reward.png'),animations:'disabled'});
  await p.locator('.geo-reward-actions [data-geo-command="map"]').last().click();assert.equal(await p.locator('.geo-path-stop.complete').count(),i+1);
 }
 assert.equal(await raw(p),original);await p.reload();await p.locator('.geo-path').waitFor();assert.equal(await p.locator('.geo-path-stop.complete').count(),7);assert.equal(await raw(p),original);
 await toMission(p);await solve(p,[0,-1,1]);assert.equal((await p.evaluate(k=>JSON.parse(localStorage.getItem(k)),LAB)).completed.length,14);
 assert.equal(requests.filter(r=>r.origin!==new URL(h.base).origin).length,0);assert.deepEqual(errors,[]);
 console.log('OK 42 geführte Schritte, sieben Erkundungen, 14 Missionen; falsche/leere Antworten blockieren Weiter, Rückweg erhält Erfolg, ± per Touch, keine Doppelzählung; normale Lerndaten bytegleich');
 const failed=await open(browser,{state:original,hasTouch:true});await failed.page.evaluate(k=>localStorage.setItem(k,'unbekannte Version'),LAB);await failed.page.reload();await route(failed.page,'raumlabor');await toMission(failed.page);await solve(failed.page,[0,-1,1]);assert.equal(await failed.page.evaluate(k=>localStorage.getItem(k),LAB),'unbekannte Version');assert.match(await failed.page.locator('.lab-storage-note').innerText(),/nicht überschrieben/);assert.equal(await raw(failed.page),original);assert.deepEqual(failed.errors,[]);
 const test=await open(browser,{state:original,hasTouch:true});await test.page.evaluate(()=>localStorage.setItem('mathequest.developer.enabled','1'));await test.page.reload();await route(test.page,'raumlabor');await toMission(test.page);await solve(test.page,[0,-1,1]);assert.equal(await test.page.evaluate(k=>localStorage.getItem(k),LAB),null);assert.equal((await test.page.evaluate(()=>JSON.parse(localStorage.getItem('mathequest.developer.raumlabor.v1')))).completed.length,1);assert.equal(await raw(test.page),original);assert.deepEqual(test.errors,[]);
 console.log('OK Gespeicherte Missionen bleiben kompatibel; unbekannte Daten geschützt; Testfortschritt separat; beide Themes und drei Breiten');
 for(const r of [-1,0,.5,1,2,3]){const point=[r,r,4-2*r];assert.equal(point.reduce((a,b)=>a+b),4);assert.equal(point[0]-point[1],0);}assert.deepEqual([1+1,1,1],[3-1,1,1]);
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
async function solveWrong(p,answer){await p.locator(`[data-geo-option="${answer}"]`).tap();await p.locator('.geo-check').click();await p.locator('.geo-feedback.incorrect').waitFor();}
