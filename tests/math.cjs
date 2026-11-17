'use strict';
const h=require('./helpers.cjs'),vm=require('node:vm'),katex=require('../assets/katex/katex.min.js');
const data={window:{}};vm.runInNewContext(h.fs.readFileSync(h.path.join(h.root,'math-content.js'),'utf8'),data);
let count=0;
for(const [text,parts]of Object.entries(data.window.MQ_MATH_CONTENT))for(const [kind,tex]of parts)if(kind==='math'){
 h.assert.doesNotThrow(()=>katex.renderToString(tex,{throwOnError:true,trust:false,strict:'error'}),text+' / '+tex);count++;
}
const formula=text=>data.window.MQ_MATH_CONTENT[text].filter(([kind])=>kind==='math').map(([,tex])=>tex).join(' ');
h.assert.match(formula('1/(x + 1)²'),/\\frac\{1\}\{\\left\(x \+ 1\\right\)\^\{2\}\}/);
h.assert.match(formula('Berechne ∫₀² x dx.'),/\\int.*_\{0\}\^\{2\}.*\\mathrm\{d\}x/);
h.assert.match(formula('Wie groß ist √49?'),/\\sqrt\{49\}/);
console.log(`OK ${count} LaTeX-Abschnitte ohne Parsefehler; Brüche, Nennerpotenzen, Wurzeln und Integralgrenzen`);
(async()=>{const browser=await h.launch();try{
 const state=h.blank();state.learning.unlockedDecks=[1,2,3,4,5,6,7,8,9,10];state.learning.newPerDay=0;
 const {page:p,errors,requests}=await h.open(browser,{state});
 await p.locator('[data-action="start-daily"]').click();await p.locator('.question-title .katex').waitFor();
 h.assert.equal(await p.locator('#daily-limit').count(),0);
 const bad=await p.evaluate(()=>MQ_MATH.render('<img src=x onerror=alert(1)>'));h.assert.equal(bad,'&lt;img src=x onerror=alert(1)&gt;');
 await h.confirm(p,h.key.A001.correct);h.assert.ok(await p.locator('.answer-feedback .katex-mathml').count()>0);
 for(const theme of ['light','dark']){await p.locator('#theme-choice').selectOption(theme);for(const width of [320,390,768,1440]){await p.setViewportSize({width,height:1024});h.assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));}}
 await p.setViewportSize({width:1440,height:1100});await p.locator('#theme-choice').selectOption('light');await p.screenshot({path:h.path.join(h.root,'tests/latex-feedback.png'),fullPage:true,animations:'disabled'});
 await h.finish(p);await h.route(p,'decks');await p.locator('[data-action="choose-deck"][data-deck="1"]').click();
 await p.getByRole('button',{name:'Weiter üben'}).waitFor();h.assert.equal(await p.getByRole('button',{name:'Weiter üben'}).count(),1);const before=(await h.saved(p)).learning.reviews;
 await p.getByRole('button',{name:'Weiter üben'}).click();await p.locator('.question-title').waitFor();h.assert.equal((await h.saved(p)).active.ids.length,106);
 await p.reload();await p.locator('.question-title').waitFor();h.assert.equal((await h.saved(p)).active.ids.length,106);h.assert.deepEqual((await h.saved(p)).learning.reviews,before);
 const demo=h.blank();demo.learning.unlockedDecks=[1,2,3,4,5,6,7,8,9,10];demo.active={id:'fraction-demo',mode:'daily',title:'Lernen',ids:['A029','F004'],answers:[null,null],index:0,selection:null,startedAt:new Date().toISOString()};
 const sample=await h.open(browser,{state:demo});await h.route(sample.page,'quiz');await h.confirm(sample.page,h.key.A029.correct);await sample.page.screenshot({path:h.path.join(h.root,'tests/latex-fraction.png'),fullPage:true,animations:'disabled'});h.assert.deepEqual(sample.errors,[]);
 h.assert.equal(requests.filter(r=>r.origin!==new URL(h.base).origin).length,0);h.assert.deepEqual(errors,[]);
 console.log('OK LaTeX in Fragen/Antworten/Lösungen, beide Themes, vier Breiten, sichere Texte und lokale Ressourcen');
 console.log('OK Auch altes Tageslimit 0 blockiert nicht; nach Abschluss sind 106 Fragen erneut lernbar und nach Neuladen erhalten');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
