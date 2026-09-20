(()=>{'use strict';
const flight=document.querySelector('#flightArea'),drone=document.querySelector('#drone'),distEl=document.querySelector('#dist');
if(!flight||!drone)return;
const layer=document.querySelector('#flightGuidanceLayer');
if(!layer)return;
const COUNT=7;
const markers=Array.from({length:COUNT},(_,i)=>{const m=document.createElement('i');m.className='flight-guidance-marker';m.textContent='›';m.style.setProperty('--i',i);layer.appendChild(m);return m});
let visible=false;
function hide(){if(visible){layer.classList.remove('show','near','close');visible=false}}
function centerInFlight(el,frame){const r=el.getBoundingClientRect();return{x:r.left+r.width/2-frame.left,y:r.top+r.height/2-frame.top}}
function render(ts){
  const arena=document.querySelector('#arena');
  const target=flight.querySelector('.official-object.mission-focus');
  if(!arena?.classList.contains('active')||!target){hide();requestAnimationFrame(render);return}
  const f=flight.getBoundingClientRect(),a=centerInFlight(drone,f),b=centerInFlight(target,f);
  if(!f.width||!f.height){hide();requestAnimationFrame(render);return}
  const dx=b.x-a.x,dy=b.y-a.y,angle=Math.atan2(dy,dx)*180/Math.PI;
  const dist=parseFloat(distEl?.textContent)||99;
  layer.classList.toggle('near',dist<=30);
  layer.classList.toggle('close',dist<10);
  if(!visible){layer.classList.add('show');visible=true}
  markers.forEach((m,i)=>{
    const t=(i+1)/(COUNT+1),scale=1.12-(t*.42);
    const flow=.72+.28*Math.sin(ts/260-i*.72);
    m.style.left=(a.x+dx*t)+'px';
    m.style.top=(a.y+dy*t)+'px';
    m.style.opacity=String(flow);
    m.style.transform='translate(-50%,-50%) rotate('+angle+'deg) scale('+scale+')';
  });
  requestAnimationFrame(render);
}
window.addEventListener('resize',()=>{visible=false});
requestAnimationFrame(render);
})();