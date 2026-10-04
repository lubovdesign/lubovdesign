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
const principleVisual=document.querySelector('.thinking-visual');
const principleStates=[['Почему<br>это работает?','Идея','Аргумент','Результат','Логика решений'],['Начнём<br>с вопроса','Задача','Варианты','Решение','Совместный поиск'],['Один<br>визуальный язык','Шрифт','Цвет','Композиция','Цельная система'],['В вашем<br>ритме','Диалог','Апдейт','Обратная связь','Гибкий процесс']];
document.querySelectorAll('.principle').forEach((details,index)=>details.addEventListener('toggle',()=>{
 if(!details.open)return;
 document.querySelectorAll('.principle').forEach(other=>{if(other!==details)other.open=false});
 const state=principleStates[index];principleVisual.dataset.state=String(index);
 principleVisual.querySelector('.thinking-core span').innerHTML=state[0];
 principleVisual.querySelector('.orbit-one').textContent=state[1];principleVisual.querySelector('.orbit-two').textContent=state[2];principleVisual.querySelector('.orbit-three').textContent=state[3];principleVisual.querySelector('.visual-kind').textContent=state[4];principleVisual.querySelector('.visual-index').textContent='0'+(index+1)+' — 04';
}));

const imageDialog=document.querySelector('.image-dialog');
if(imageDialog){document.querySelectorAll('.image-expand').forEach(button=>button.addEventListener('click',()=>{const image=imageDialog.querySelector('img');image.src=button.dataset.image;image.alt=button.dataset.title;imageDialog.showModal()}));imageDialog.querySelector('.close').addEventListener('click',()=>imageDialog.close());imageDialog.addEventListener('click',event=>{if(event.target===imageDialog)imageDialog.close()})}
