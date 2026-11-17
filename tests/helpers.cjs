'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
let playwright;try{playwright=require('playwright');}catch{playwright=require('/Applications/ChatGPT.app/Contents/Resources/cua_node/lib/node_modules/playwright');}
const root=path.resolve(__dirname,'..'),base='https://mathequest.test/',KEY='mathequest.v1',data={window:{}};
for(const f of ['questions.js','final-questions.js','solutions.js','journey.js','review.js'])vm.runInNewContext(fs.readFileSync(path.join(root,f),'utf8'),data);
const J=data.window.MQ_JOURNEY,R=data.window.MQ_REVIEW,key=data.window.MQ_SOLUTIONS;
const blank=()=>({app:'MatheQuest',version:1,progressVersion:3,sessions:[],active:null,archivedActive:null,oral:{},learning:JSON.parse(JSON.stringify(J.fresh())),themePreference:'light'});
const record=(ids,answers,id='fixture',mode='daily',date=new Date().toISOString())=>({id,mode,date,title:mode==='free'?'Freies Training':'Heute',ids,answers});
async function launch(){let executablePath=process.env.MQ_BROWSER;if(!executablePath&&!fs.existsSync(playwright.chromium.executablePath()))executablePath='/Applications/Brave Browser.app/Contents/MacOS/Brave Browser';return playwright.chromium.launch({headless:true,executablePath});}
async function open(browser,{state=null,width=1440,height=1100,scheme='light',theme=null,writeError=false,readError=false,hasTouch=false}={}){
 const context=await browser.newContext({viewport:{width,height},colorScheme:scheme,hasTouch,acceptDownloads:true}),requests=[],errors=[];
 const allowed=new Set(['index.html','app.js','journey.js','review.js','theme.js','theme.css','style.css','trainer.css','questions.js','final-questions.js','solutions.js','assets/favicon.svg','assets/quest.svg','math-content.js','math-text.js']);
 await context.route('**/*',route=>{const req=route.request(),url=new URL(req.url()),file=url.pathname.slice(1)||'index.html';requests.push({origin:url.origin,method:req.method(),file});if(file==='__bootstrap')return route.fulfill({body:'<!doctype html>',contentType:'text/html'});if(url.origin!==new URL(base).origin||(!allowed.has(file)&&!file.startsWith('assets/katex/')))return route.abort();return route.fulfill({body:fs.readFileSync(path.join(root,file)),contentType:file.endsWith('.js')?'text/javascript':file.endsWith('.css')?'text/css':file.endsWith('.svg')?'image/svg+xml':file.endsWith('.woff2')?'font/woff2':file.endsWith('.woff')?'font/woff':'text/html'});});
 const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));await page.goto(base+'__bootstrap');
 if(state!==null)await page.evaluate(({state,KEY})=>localStorage.setItem(KEY,typeof state==='string'?state:JSON.stringify(state)),{state,KEY});
 if(theme)await page.evaluate(value=>localStorage.setItem('mathequest.theme.v1',value),theme);
 await context.addInitScript(({KEY,writeError,readError})=>{window.__mqFailWrites=writeError;window.__mqFailReads=readError;const get=Storage.prototype.getItem,set=Storage.prototype.setItem;window.__mqNativeGet=get;Storage.prototype.getItem=function(k){if(k===KEY&&window.__mqFailReads)throw new DOMException('Test','SecurityError');return get.call(this,k);};Storage.prototype.setItem=function(k,v){if(k===KEY&&window.__mqFailWrites)throw new DOMException('Test','QuotaExceededError');return set.call(this,k,v);};},{KEY,writeError,readError});
 await page.goto(base);await page.locator('main h1').waitFor();return {page,context,requests,errors};
}
const saved=p=>p.evaluate(KEY=>JSON.parse(window.__mqNativeGet.call(localStorage,KEY)),KEY);
const raw=p=>p.evaluate(KEY=>window.__mqNativeGet.call(localStorage,KEY),KEY);
async function route(p,name){await p.goto(base+'#'+name);await p.waitForFunction(name=>document.getElementById('page-label').textContent===name,({dashboard:'Heute',decks:'Decks',progress:'Fortschritt',settings:'Einstellungen',quiz:'Lernen',solutions:'Lösungswege'})[name]);}
async function upload(p,state){await p.locator('#import-file').setInputFiles({name:'synthetic.json',mimeType:'application/json',buffer:Buffer.from(typeof state==='string'?state:JSON.stringify(state))});}
async function exportData(p,action='export-all'){const promise=p.waitForEvent('download');await p.locator(`[data-action="${action}"]`).first().click();const d=await promise,stream=await d.createReadStream(),chunks=[];for await(const c of stream)chunks.push(c);return Buffer.concat(chunks).toString('utf8');}
async function confirm(p,answer){await p.locator(`[data-answer="${answer}"]`).click();await p.locator('.answer-feedback').waitFor();}
async function finish(p,{correct=true,doubleSubmit=false}={}){
 let a=(await saved(p)).active;
 while(a.index>0){await p.locator('[data-action="quiz-prev"]').click();a=(await saved(p)).active;}
 for(let i=0;i<a.ids.length;i++){
  if((await saved(p)).active.answers[i]===null)await confirm(p,correct?key[a.ids[i]].correct:(key[a.ids[i]].correct+1)%3);
  if(i<a.ids.length-1){await p.locator('[data-action="quiz-next"]').click();await p.waitForFunction(i=>JSON.parse(localStorage.getItem('mathequest.v1')).active.index===i,i+1);}
 }
 if(doubleSubmit)await p.locator('[data-action="submit"]').evaluate(el=>{el.click();el.click();});else await p.locator('[data-action="submit"]').click();
 await p.locator('.report-hero').waitFor();return saved(p);
}
module.exports={assert,fs,path,root,base,KEY,data,J,R,key,blank,record,launch,open,saved,raw,route,upload,exportData,confirm,finish};
