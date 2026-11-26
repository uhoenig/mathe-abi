/* Lokale LaTeX-Darstellung; unbekannte Texte bleiben sicherer Klartext. */
(function(root){
'use strict';
const cache=new Map();
const escape=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function render(text,{vectorTuples=false}={}){
 const cacheKey=JSON.stringify([text,vectorTuples]);
 if(cache.has(cacheKey))return cache.get(cacheKey);
 const source=root.MQ_MATH_CONTENT;
 const parts=source&&Object.hasOwn(source,text)?source[text]:null;
 if(!parts||!root.katex)return escape(text);
 const html=parts.map(([kind,value])=>{
  if(kind!=='math')return escape(value);
  if(vectorTuples)value=value.replace(/\\left\(([^()]*)\\right\)/g,(tuple,body)=>{
   const components=body.split(/\\mid\s*/);
   return components.length>=2&&components.length<=3?'\\begin{pmatrix}'+components.map(c=>c.trim()).join('\\\\')+'\\end{pmatrix}':tuple;
  });
  try{return `<span class="math-inline">${root.katex.renderToString('\\displaystyle '+value,{throwOnError:true,trust:false,strict:'error',output:'htmlAndMathml'})}</span>`;}
  catch{return escape(value);}
 }).join('');
 cache.set(cacheKey,html);return html;
}
root.MQ_MATH=Object.freeze({render});
})(window);
