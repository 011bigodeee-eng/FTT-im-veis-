/** Runs in <head>, before the body is parsed. Never depends on React hydration. */
export const INTRO_BOOTSTRAP = `(function(){
  var root=document.documentElement;
  var media=window.matchMedia('(prefers-reduced-motion: reduce)');
  var seen=false;
  try{seen=sessionStorage.getItem('ftt-visited')==='yes';}catch(e){}
  if(seen||media.matches){root.dataset.fttIntro='done';return;}
  root.dataset.fttIntro='playing';
  function active(){return root.dataset.fttIntro!=='done';}
  function finish(){
    if(!active())return;
    var focused=document.activeElement;
    var moveFocus=focused&&focused.closest&&focused.closest('#ftt-intro');
    root.dataset.fttIntro='done';
    try{sessionStorage.setItem('ftt-visited','yes');}catch(e){}
    window.clearTimeout(fallback);
    document.removeEventListener('animationstart',start);
    document.removeEventListener('animationend',end);
    document.removeEventListener('click',skip);
    document.removeEventListener('keydown',key);
    media.removeEventListener('change',preference);
    window.dispatchEvent(new Event('ftt:intro-ready'));
    if(moveFocus){var target=document.querySelector('#site-stage .header a')||document.querySelector('#site-stage a');if(target)target.focus({preventScroll:true});}
  }
  function start(event){
    if(event.target.id==='ftt-intro'&&event.animationName==='ftt-intro-reveal'&&active()){
      root.dataset.fttIntro='revealing';
      window.dispatchEvent(new Event('ftt:intro-reveal'));
    }
  }
  function end(event){if(event.target.id==='ftt-intro'&&event.animationName==='ftt-intro-reveal')finish();}
  function skip(event){if(event.target.closest&&event.target.closest('[data-skip-intro]'))finish();}
  function key(event){if(!active())return;if(event.key==='Escape'){event.preventDefault();finish();}else if(event.key==='Tab'){var button=document.querySelector('[data-skip-intro]');if(button){event.preventDefault();button.focus({preventScroll:true});}}}
  function preference(){if(media.matches)finish();}
  document.addEventListener('animationstart',start);
  document.addEventListener('animationend',end);
  document.addEventListener('click',skip);
  document.addEventListener('keydown',key);
  media.addEventListener('change',preference);
  // Release-only fallback if styles or animation events fail. It never hides the site.
  var fallback=window.setTimeout(finish,4200);
})();`;

/** Critical gating is inline so delayed React/CSS chunks cannot cause a content flash. */
export const INTRO_CRITICAL_CSS = `
#ftt-intro{display:none}
html[data-ftt-intro="playing"],html[data-ftt-intro="revealing"]{overflow:hidden!important;overscroll-behavior:none;background:#0B1420}
html[data-ftt-intro="playing"] body,html[data-ftt-intro="revealing"] body{overflow:hidden!important;background:#0B1420}
html[data-ftt-intro="playing"] #site-stage{visibility:hidden;pointer-events:none}
html[data-ftt-intro="playing"] #ftt-intro,html[data-ftt-intro="revealing"] #ftt-intro{position:fixed;inset:0;z-index:9999;display:flex;align-items:center;justify-content:center;background:#0B1420;color:#E9AA36;isolation:isolate;overflow:hidden}
@media(prefers-reduced-motion:reduce){#ftt-intro{display:none!important}html[data-ftt-intro] #site-stage{visibility:visible!important;pointer-events:auto}html[data-ftt-intro],html[data-ftt-intro] body{overflow:visible!important}}
`;
