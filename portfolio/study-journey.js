// The scroll position owns the chapter, copy, progress rail and 3D pose.
function studyJourneyMarkup(terms){
 return `<section class="study-journey" aria-labelledby="journey-title" style="--term-count:${terms.length}"><div class="study-stage">
 <div class="study-stage-top"><h2 id="journey-title">MY UNIVERSITY YEARS</h2><span class="study-mono">THAMMASAT / ${esc(terms[0].year)}—${esc(terms.at(-1).year)}</span></div>
 <div class="study-stage-year" aria-hidden="true">${esc(terms[0].year)}</div>
 <div class="study-object" role="group" aria-label="Rotate the computer" aria-describedby="study-object-help" aria-keyshortcuts="ArrowLeft ArrowRight ArrowUp ArrowDown Home" tabindex="0" data-model-state="loading"><img class="study-object-poster" src="assets/study/computers/crt.png" alt="A classic CRT desktop computer" width="760" height="760"><span class="study-object-note">Loading the computer</span><span class="study-object-caption" aria-hidden="true"><span>OBJECT 01 / 04</span><span data-computer-label>CRT desktop</span></span></div>
 <p id="study-object-help" class="study-visually-hidden">Drag sideways or use the arrow keys to rotate the computer. Press Home to reset its angle. Scroll or choose a semester below to continue the story.</p>
 <div class="study-stage-chapters">${terms.map((t,i)=>`<article id="study-${esc(t.id)}" class="study-scene" data-term="${i}" data-side="${i%2?'right':'left'}" aria-labelledby="term-title-${i}"${i?' aria-hidden="true" inert':''}>
 <p class="study-scene-eyebrow"><span></span>${esc(t.term)} / ${esc(t.year)} · ${t.academicYear}</p>
 <h3 id="term-title-${i}">${esc(t.title)}</h3><p class="study-scene-story">${esc(t.story)}</p>
 <div class="study-scene-metrics"><span>${t.courses.length} ${t.courses.length===1?'COURSE':'COURSES'}</span><span>GPAX ${studyNumber(t.gpax)}${t.gpa===null?' · CARRIED FORWARD':''}</span></div>
 <div class="study-scene-actions"><button type="button" data-semester-courses="${i}">View courses <span aria-hidden="true">↗</span></button><span>${t.gpa===null?'Results pending':t.earnedTotal+' credits earned so far'}</span></div>
 </article>`).join('')}</div>
 <div class="study-stage-rail"><span class="study-stage-hint">SCROLL TO EXPLORE <span aria-hidden="true">↓</span></span><div class="study-object-controls" aria-label="Computer controls"><button type="button" data-turn="-1" aria-label="Rotate computer left"><img src="assets/study/rotate-left.svg" alt="" width="18" height="18"></button><button type="button" data-reset-object>Reset</button><button type="button" data-turn="1" aria-label="Rotate computer right"><img src="assets/study/rotate-right.svg" alt="" width="18" height="18"></button></div></div>
 <nav class="study-stage-nav" aria-label="Choose a semester">${terms.map((t,i)=>`<button type="button" data-jump="${i}" aria-label="${esc(studyTermLabel(t))}"${i===0?' aria-current="step"':''}><span class="study-step-no">${String(i+1).padStart(2,'0')}</span><span class="study-step-label">${esc(t.year)} <span>/ ${t.term==='Summer'?'Summer':t.term.slice(-1)}</span></span><span class="study-step-track" aria-hidden="true"><span></span></span></button>`).join('')}</nav>
 </div></section><details class="study-computer-credits"><summary>3D model credits</summary><p>Computers through time, accompanying the university journey.</p><ul>${STUDY_COMPUTERS.map(c=>`<li><a href="${c.source}" target="_blank" rel="noopener noreferrer">${esc(c.title)}</a> by ${esc(c.creator)}</li>`).join('')}</ul><p>Models shared under <a href="https://creativecommons.org/licenses/by/3.0/" target="_blank" rel="noopener noreferrer">CC BY 3.0</a>. Scale, lighting and materials adapted for this scene.</p></details>`;
}

function startStudyJourney(page){
 const root=page.querySelector('.study-journey'),stage=root.querySelector('.study-stage'),object=root.querySelector('.study-object'),panels=[...root.querySelectorAll('.study-scene')],nav=[...root.querySelectorAll('[data-jump]')];
 const reduced=matchMedia('(prefers-reduced-motion:reduce)'),shortScreen=matchMedia('(max-height:560px)'),events=new AbortController(),opt={signal:events.signal};
 const manualMode=()=>reduced.matches||shortScreen.matches;
 const clamp=(v,a=0,b=1)=>Math.min(b,Math.max(a,v)),ease=x=>x*x*(3-2*x),lerp=(a,b,t)=>a+(b-a)*t;
 const poses=[[.10,-.38,-.025,1],[.12,.38,.025,1.04],[.10,-.36,-.035,1],[.15,.36,.025,1.04],[.09,-.32,-.025,1],[.12,.32,.025,1.05],[.20,-.40,-.04,1.02]];
 let disposed=false,frame=0,position=0,target=0,active=-1,model=null,loading=false,visible=false,turn=0,tilt=0,manual=0,headerHeight=70;
 let pointer=null,lastTime=0;
 const turns=root.querySelector('.study-object-controls');
 function setActive(index){
  if(index===active)return;
  // A focused outgoing control must not be left in an inert chapter.
  if(active>=0&&panels[active].contains(document.activeElement))nav[index].focus({preventScroll:true});
  active=index;root.dataset.active=String(index);
  const era=studyComputerEra(index,panels.length),computer=STUDY_COMPUTERS[era],poster=object.querySelector('.study-object-poster');
  object.dataset.computer=computer.id;object.setAttribute('aria-label','Rotate the '+computer.label);
  poster.src='assets/study/computers/'+computer.id+'.png';poster.alt=computer.label+' computer';
  object.querySelector('.study-object-caption>span').textContent='OBJECT '+String(era+1).padStart(2,'0')+' / 04';object.querySelector('[data-computer-label]').textContent=computer.label;
  root.querySelector('.study-stage-year').textContent=educationData().terms[index].year;
  panels.forEach((p,i)=>{p.inert=i!==index;p.setAttribute('aria-hidden',String(i!==index));});
  nav.forEach((b,i)=>i===index?b.setAttribute('aria-current','step'):b.removeAttribute('aria-current'));
 }
 function measure(){
  headerHeight=document.querySelector('header').getBoundingClientRect().height;
  root.style.setProperty('--study-header',headerHeight+'px');
  const height=stage.offsetHeight;root.style.setProperty('--study-span',Math.max(innerHeight*.72,470)*(panels.length-1)+height+'px');
 }
 function read(){
  const rect=root.getBoundingClientRect(),span=Math.max(1,root.offsetHeight-stage.offsetHeight);
  visible=rect.top<innerHeight&&rect.bottom>headerHeight;
  target=manualMode()?manual:clamp((headerHeight-rect.top)/span)*(panels.length-1);
  if(!visible)position=target;
  const intro=page.querySelector('.about-intro').getBoundingClientRect();page.style.setProperty('--about-travel',reduced.matches?0:clamp(-intro.top/(innerHeight*.9)));
  schedule();
 }
 function paint(time){
  frame=0;if(disposed)return;
  const dt=Math.min(64,time-(lastTime||time-16));lastTime=time;
  position=manualMode()?target:lerp(position,target,1-Math.exp(-dt/105));
  if(Math.abs(position-target)<.0008)position=target;
  const index=clamp(Math.round(position),0,panels.length-1);setActive(index);
  panels.forEach((panel,i)=>{
   const distance=position-i,opacity=reduced.matches?(i===index?1:0):clamp(1-Math.max(0,Math.abs(distance)-.12)/.32);
   panel.style.setProperty('--scene-opacity',opacity.toFixed(3));panel.style.setProperty('--scene-shift',(reduced.matches?0:distance*-42)+'px');
   nav[i].style.setProperty('--chapter-fill',clamp(position-i).toFixed(4));
  });
  const from=Math.min(Math.floor(position),panels.length-1),to=Math.min(from+1,panels.length-1),t=ease(clamp((position-from-.14)/.72));
  const mobile=innerWidth<=760,side=lerp(from%2?-1:1,to%2?-1:1,t);
  object.style.left=mobile?'6%':(26+side*24)+'%';
  const p=poses[from%poses.length],q=poses[to%poses.length];
  model?.update({fromEra:studyComputerEra(from,panels.length),toEra:studyComputerEra(to,panels.length),mix:t,x:lerp(p[0],q[0],t)+tilt,y:lerp(p[1],q[1],t)+turn,z:lerp(p[2],q[2],t),scale:lerp(p[3],q[3],t)});
  object.dataset.pose=[position,turn,tilt].map(n=>n.toFixed(3)).join(',');
  if(position!==target&&visible&&!document.hidden)schedule();
 }
 function schedule(){if(!frame&&!disposed)frame=requestAnimationFrame(paint);}
 async function load(){
  if(loading||disposed)return;loading=true;
  try{
   const {createStudyObject}=await import('./study-object.js?v=20261031-computer-eras-final');if(disposed)return;
   const result=await createStudyObject(object,STUDY_COMPUTERS);if(disposed){result.dispose();return;}model=result;object.dataset.modelState='ready';object.querySelector('.study-object-note').textContent='';schedule();
  }catch(error){if(disposed)return;object.dataset.modelState='fallback';object.querySelector('.study-object-note').textContent='Static view · scroll to explore';object.removeAttribute('tabindex');turns.hidden=true;}
 }
 function jump(index){
  index=clamp(index,0,panels.length-1);manual=index;measure();
  const top=scrollY+root.getBoundingClientRect().top-headerHeight;
  if(manualMode()){target=position=index;scrollTo({top,behavior:'instant'});schedule();}
  else scrollTo({top:top+(root.offsetHeight-stage.offsetHeight)*index/Math.max(1,panels.length-1),behavior:'smooth'});
 }
 root.addEventListener('click',event=>{const button=event.target.closest('[data-turn]');if(button){turn+=Number(button.dataset.turn)*.38;schedule();}if(event.target.closest('[data-reset-object]')){turn=tilt=0;schedule();}},opt);
 object.addEventListener('keydown',event=>{
  const actions={ArrowLeft:()=>turn-=.18,ArrowRight:()=>turn+=.18,ArrowUp:()=>tilt=clamp(tilt-.12,-.6,.6),ArrowDown:()=>tilt=clamp(tilt+.12,-.6,.6),Home:()=>{turn=tilt=0;}};
  if(actions[event.key]){event.preventDefault();actions[event.key]();schedule();}
 },opt);
 object.addEventListener('pointerdown',event=>{if(event.button!==0||!model)return;pointer={id:event.pointerId,x:event.clientX,y:event.clientY,turn};object.setPointerCapture(event.pointerId);},opt);
 object.addEventListener('pointermove',event=>{if(!pointer||event.pointerId!==pointer.id)return;const dx=event.clientX-pointer.x,dy=event.clientY-pointer.y;if(event.pointerType==='touch'&&Math.abs(dy)>Math.abs(dx))return;turn=pointer.turn+dx*.009;schedule();},opt);
 const release=()=>{pointer=null;};object.addEventListener('pointerup',release,opt);object.addEventListener('pointercancel',release,opt);object.addEventListener('lostpointercapture',release,opt);
 const observer=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){load();observer.disconnect();}},{rootMargin:'500px'});observer.observe(root);
 const resize=new ResizeObserver(()=>{measure();model?.resize();read();});resize.observe(stage);resize.observe(document.querySelector('header'));
 window.addEventListener('scroll',read,{...opt,passive:true});window.addEventListener('resize',read,opt);document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(frame);frame=0;}else read();},opt);
 reduced.addEventListener('change',()=>{manual=Math.max(active,0);measure();read();},opt);
 shortScreen.addEventListener('change',()=>{manual=Math.max(active,0);measure();read();},opt);
 measure();read();
 return {jump,dispose(){disposed=true;events.abort();observer.disconnect();resize.disconnect();cancelAnimationFrame(frame);model?.dispose();}};
}
