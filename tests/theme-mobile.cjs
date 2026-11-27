'use strict';
const h=require('./helpers.cjs'),{assert,open,route,saved,key}=h;
const THEME_KEY='mathequest.theme.v1';
async function launch(){
 if(process.env.MQ_THEME_ENGINE!=='webkit')return h.launch();
 let playwright;try{playwright=require('playwright');}catch{playwright=require('/Applications/ChatGPT.app/Contents/Resources/cua_node/lib/node_modules/playwright');}
 return playwright.webkit.launch();
}
async function checkTheme(p,theme){
 assert.equal(await p.locator('html').getAttribute('data-theme'),theme);
 assert.equal(await p.evaluate(()=>getComputedStyle(document.body).backgroundColor),theme==='dark'?'rgb(16, 16, 21)':'rgb(245, 243, 248)');
 assert.equal(await p.locator('#theme-choice').inputValue(),theme);
 for(const button of await p.locator('[data-theme-value]').all())assert.equal(await button.getAttribute('aria-pressed'),String((await button.getAttribute('data-theme-value'))===theme));
}
(async()=>{const browser=await launch();try{
 for(const [width,height]of [[320,700],[393,852],[430,932]]){
  const state=h.blank();state.active={id:'mobile-theme',mode:'daily',title:'Unterwegs',ids:['A001','G001'],answers:[key.A001.correct,null],index:0,selection:null,startedAt:new Date().toISOString()};
  const {page:p,errors}=await open(browser,{state,width,height,hasTouch:true,isMobile:true});
  await checkTheme(p,'light');assert.equal(await p.locator('.theme-control').isVisible(),false);
  const dark=p.locator('.topbar [data-theme-value="dark"]');const box=await dark.boundingBox();assert.ok(box.width>=44&&box.height>=44&&box.x+box.width<=width);
  await dark.tap();await checkTheme(p,'dark');assert.equal(await p.evaluate(k=>localStorage.getItem(k),THEME_KEY),'dark');
  const persisted=await saved(p);assert.deepEqual(persisted.active,state.active);assert.deepEqual(persisted.learning,state.learning);assert.equal(persisted.themePreference,'dark');
  await p.reload();await p.locator('.daily-card').waitFor();await checkTheme(p,'dark');
  await route(p,'settings');await p.locator('.theme-settings [data-theme-value="light"]').tap();await checkTheme(p,'light');assert.equal((await saved(p)).themePreference,'light');
  await p.locator('.topbar [data-theme-value="dark"]').tap();await checkTheme(p,'dark');await p.emulateMedia({colorScheme:'light'});await checkTheme(p,'dark');
  await route(p,'quiz');await p.locator('.answer-feedback').waitFor();await p.locator('.topbar [data-theme-value="light"]').tap();await checkTheme(p,'light');assert.deepEqual((await saved(p)).active,state.active);
  assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));assert.deepEqual(errors,[]);
  await p.screenshot({path:h.path.join(h.root,`tests/theme-touch-${process.env.MQ_THEME_ENGINE||'chromium'}-${width}.png`),animations:'disabled'});
  await p.context().close();console.log(`OK ${width}×${height}: echtes Antippen, beide Schalter synchron, Farben, Neuladen, Einstellungen, Systemwechsel und laufende Runde`);
 }
 const sample=await open(browser,{width:393,height:852,hasTouch:true,isMobile:true});
 await sample.page.evaluate(k=>{const original=Storage.prototype.setItem;Storage.prototype.setItem=function(key,value){if(key===k)throw new DOMException('Test','QuotaExceededError');return original.call(this,key,value);};},THEME_KEY);
 await sample.page.locator('.topbar [data-theme-value="dark"]').tap();await checkTheme(sample.page,'dark');assert.equal(await sample.page.locator('#theme-notice').isVisible(),true);assert.equal(await sample.page.evaluate(k=>localStorage.getItem(k),THEME_KEY),null);assert.deepEqual(sample.errors,[]);
 console.log('OK Blockierte Theme-Speicherung: Umschalten funktioniert in der Sitzung mit sichtbarem Hinweis');
 if(process.env.MQ_DARKREADER_SCRIPT){
  const {page:p,errors}=await open(browser,{width:393,height:852,hasTouch:true,isMobile:true});
  await p.addScriptTag({path:process.env.MQ_DARKREADER_SCRIPT});
  await p.evaluate(()=>{DarkReader.setFetchMethod(fetch);DarkReader.enable({mode:1});});
  await checkTheme(p,'light');await p.locator('.topbar [data-theme-value="dark"]').tap();await checkTheme(p,'dark');await p.locator('.topbar [data-theme-value="light"]').tap();await checkTheme(p,'light');
  assert.equal(await p.locator('style.darkreader--sync').count(),0);assert.deepEqual(errors,[]);
  console.log('OK Dark Reader tatsächlich aktiviert: automatische Farbüberschreibung respektiert eigene Hell-/Dunkel-Auswahl');
 }
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
