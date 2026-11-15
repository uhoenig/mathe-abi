/* Läuft vor dem Stylesheet: Darstellung unabhängig vom MatheQuest-Spielstand. */
(() => {
 'use strict';
 const KEY='mathequest.theme.v1',choices=['system','light','dark'];
 const media=window.matchMedia('(prefers-color-scheme: dark)');
 let preference='system',storageError='';
 const errorText='Die Darstellung gilt nur für diese Sitzung, weil der Browser die Einstellung nicht speichern konnte.';
 try{const saved=localStorage.getItem(KEY);if(choices.includes(saved))preference=saved;}
 catch(e){storageError=errorText;}
 const effective=()=>preference==='system'?(media.matches?'dark':'light'):preference;
 function apply(){
  const theme=effective();
  document.documentElement.dataset.theme=theme;
  document.documentElement.style.colorScheme=theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content',theme==='dark'?'#101015':'#f5f3f8');
  document.querySelectorAll('[data-theme-choice]').forEach(select=>{select.value=preference;});
  document.querySelectorAll('[data-theme-effective]').forEach(el=>{el.textContent=(theme==='dark'?'Dunkel':'Hell')+(preference==='system'?' (Systemeinstellung)':'');});
  const notice=document.querySelector('#theme-notice');
  if(notice){notice.textContent=storageError;notice.hidden=!storageError;}
 }
 function setPreference(value){
  if(!choices.includes(value))return false;
  preference=value;
  try{localStorage.setItem(KEY,value);storageError='';}
  catch(e){storageError=errorText;}
  apply();return true;
 }
 window.MQ_THEME=Object.freeze({getPreference:()=>preference,getEffective:effective,setPreference});
 apply();
 document.addEventListener('DOMContentLoaded',apply);
 document.addEventListener('change',event=>{if(event.target.matches('[data-theme-choice]'))setPreference(event.target.value);});
 if(media.addEventListener)media.addEventListener('change',()=>{if(preference==='system')apply();});
 else media.addListener(()=>{if(preference==='system')apply();});
 window.addEventListener('storage',event=>{
  if(event.key!==KEY&&event.key!==null)return;
  preference=choices.includes(event.newValue)?event.newValue:'system';storageError='';apply();
 });
})();
