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
 await p.getByRole('button',{name:'Weiter üben'}).click();await p.locator('.question-title').waitFor();h.assert.equal((await h.saved(p)).active.ids.length,h.J.questionIds.length);
 await p.reload();await p.locator('.question-title').waitFor();h.assert.equal((await h.saved(p)).active.ids.length,h.J.questionIds.length);h.assert.deepEqual((await h.saved(p)).learning.reviews,before);
 const demo=h.blank();demo.learning.unlockedDecks=[1,2,3,4,5,6,7,8,9,10];demo.active={id:'fraction-demo',mode:'daily',title:'Lernen',ids:['A029','F004'],answers:[null,null],index:0,selection:null,startedAt:new Date().toISOString()};
 const sample=await h.open(browser,{state:demo});await h.route(sample.page,'quiz');await h.confirm(sample.page,h.key.A029.correct);await sample.page.screenshot({path:h.path.join(h.root,'tests/latex-fraction.png'),fullPage:true,animations:'disabled'});h.assert.deepEqual(sample.errors,[]);
 const vectorState=h.blank();vectorState.learning.unlockedDecks=[1,2,3,4,5,6,7,8,9,10];
 const vectorIds=['G007','G006','G004','G009','G038','G030'];vectorState.active={id:'vector-notation',mode:'daily',title:'Lernen',ids:vectorIds,answers:vectorIds.map((id,i)=>i===0?(h.key[id].correct+1)%3:h.key[id].correct),index:0,selection:null,startedAt:new Date().toISOString()};
 const vectors=await h.open(browser,{state:vectorState});await h.route(vectors.page,'quiz');await vectors.page.locator('.answer-option .katex-mathml mtable').first().waitFor();
 for(let i=0;i<vectorIds.length;i++){
  if(i){await vectors.page.locator('[data-action="quiz-next"]').click();await vectors.page.waitForFunction(i=>JSON.parse(localStorage.getItem('mathequest.v1')).active.index===i,i);}
  if(vectorIds[i]==='G004')h.assert.equal(await vectors.page.locator('.answer-option mtable').count(),0,'Punkte bleiben in Koordinatenschreibweise');
  else{const rows=await vectors.page.locator('.answer-option').evaluateAll(options=>options.map(el=>el.querySelectorAll('.katex-mathml mtable mtr').length));h.assert.ok(rows.every(n=>n>0),vectorIds[i]);}
  for(const width of [320,768,1440]){await vectors.page.setViewportSize({width,height:1100});h.assert.ok(await vectors.page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));}
  if(i===0){h.assert.equal(await vectors.page.locator('.answer-feedback>p .katex-mathml mtable mtr').count(),3);await vectors.page.screenshot({path:h.path.join(h.root,'tests/column-vectors.png'),fullPage:true,animations:'disabled'});}
 }
 const roles=await vectors.page.evaluate(()=>({vector:MQ_MATH.render('(2|−1|3)',{vectorTuples:true}).includes('pmatrix'),point:MQ_MATH.render('(2|−1|3)').includes('pmatrix')}));h.assert.deepEqual(roles,{vector:true,point:false});h.assert.deepEqual(vectors.errors,[]);
 console.log('OK Orts-, Verbindungs-, Stütz- und Normalenvektoren als Spalten; Punkte unverändert; Cache trennt beide Rollen; drei Breiten ohne Überlauf');
 h.assert.equal(requests.filter(r=>r.origin!==new URL(h.base).origin).length,0);h.assert.deepEqual(errors,[]);
 console.log('OK LaTeX in Fragen/Antworten/Lösungen, beide Themes, vier Breiten, sichere Texte und lokale Ressourcen');
 console.log('OK Auch altes Tageslimit 0 blockiert nicht; nach Abschluss sind Alle aktiven Fragen erneut lernbar und nach Neuladen erhalten');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
