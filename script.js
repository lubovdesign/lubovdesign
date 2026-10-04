const logo=document.querySelector('.logo');
const motion=matchMedia('(prefers-reduced-motion: reduce)');
setInterval(()=>{if(motion.matches||document.hidden)return;logo.classList.add('glitch');setTimeout(()=>logo.classList.remove('glitch'),240)},5000);
const menu=document.querySelector('.menu');
const panel=document.querySelector('.menu-panel');
function closeMenu(){panel.hidden=true;menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Открыть меню')}
menu.addEventListener('click',()=>{panel.hidden=!panel.hidden;menu.setAttribute('aria-expanded',String(!panel.hidden));menu.setAttribute('aria-label',panel.hidden?'Открыть меню':'Закрыть меню')});
document.addEventListener('click',event=>{if(!menu.contains(event.target)&&!panel.contains(event.target))closeMenu()});
document.addEventListener('keydown',event=>{if(event.key==='Escape')closeMenu()});
panel.querySelectorAll('a').forEach(link=>link.addEventListener('click',closeMenu));
// Content stays visible if script execution or observer support is unavailable.
if('IntersectionObserver' in window){
 document.documentElement.classList.add('reveal-ready');
 const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target)}}),{threshold:.08});
 document.querySelectorAll('.reveal').forEach(element=>observer.observe(element));
}
const assembly=document.querySelector('.assembly');
let framePending=false;
function updateAssembly(){
 framePending=false;
 if(!assembly)return;
 const box=assembly.getBoundingClientRect();
 const progress=motion.matches?1:Math.max(0,Math.min(1,(innerHeight*.86-box.top)/(innerHeight*.55)));
 assembly.style.setProperty('--assembly',progress.toFixed(3));
}
function requestAssemblyUpdate(){if(!framePending){framePending=true;requestAnimationFrame(updateAssembly)}}
window.addEventListener('scroll',requestAssemblyUpdate,{passive:true});
window.addEventListener('resize',requestAssemblyUpdate);motion.addEventListener('change',requestAssemblyUpdate);updateAssembly();
document.querySelectorAll('.principle').forEach(details=>details.addEventListener('toggle',()=>{
 if(details.open)document.querySelectorAll('.principle').forEach(other=>{if(other!==details)other.open=false});
}));
