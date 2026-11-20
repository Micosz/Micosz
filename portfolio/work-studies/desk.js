import { locations, courses, events } from './records.js';
import { safe, option, buttons, updateList } from './ui.js';

export function showPlanner(stage, signal) {
  const days = ['Inbox','Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const tasks = [
    {id:1, name:'Trace a map route', day:0, done:false},
    {id:2, name:'Review the course notes', day:days.indexOf('Monday'), done:false},
    {id:3, name:'Sketch a project card', day:days.indexOf('Tuesday'), done:false}
  ];
  let day=0,nextId=4;
  stage.innerHTML=`<div class="planner-top"><div class="sheet-caption">Sample planner</div><div class="planner-count" role="status"></div></div>
    <div class="study-tabs planner-days">${days.map((d,i)=>`<button data-value="${i}">${d}</button>`).join('')}</div>
    <div class="planner-list"></div><form class="add-task"><label>Add a task<input maxlength="64" required placeholder="Task name"></label><button>Add</button></form>`;
  const tabs=stage.querySelector('.planner-days'),list=stage.querySelector('.planner-list'),form=stage.querySelector('form');
  function draw(){
    buttons(tabs,day);
    updateList(list,tasks.filter(t=>t.day===day).map(t=>`<div class="task-line" data-done="${t.done}">
      <button class="task-check" data-id="${t.id}" data-key="check-${t.id}" aria-pressed="${t.done}" aria-label="${t.done?'Reopen':'Complete'} ${safe(t.name)}">${t.done?'✓':'○'}</button>
      <strong>${safe(t.name)}</strong><select data-move="${t.id}" aria-label="Move ${safe(t.name)}">${days.map((d,i)=>`<option value="${i}" ${i===t.day?'selected':''}>${d}</option>`).join('')}</select></div>`).join('')||'<p class="study-empty">No tasks here yet.</p>');
    stage.querySelector('.planner-count').textContent=tasks.filter(t=>t.done).length+' / '+tasks.length+' complete';
  }
  tabs.addEventListener('click',e=>{const b=e.target.closest('button');if(b){day=Number(b.dataset.value);draw();}},{signal});
  list.addEventListener('click',e=>{const b=e.target.closest('[data-id]');if(b){const t=tasks.find(t=>t.id===Number(b.dataset.id));t.done=!t.done;draw();}},{signal});
  list.addEventListener('change',e=>{const target=e.target.closest('[data-move]');if(!target)return;const t=tasks.find(t=>t.id===Number(target.dataset.move));day=t.day=Number(target.value);draw();tabs.querySelector('[aria-pressed="true"]').focus({preventScroll:true});},{signal});
  form.addEventListener('submit',e=>{e.preventDefault();const input=form.querySelector('input'),name=input.value.trim();if(!name)return;tasks.push({id:nextId++,name,day,done:false});input.value='';draw();},{signal});draw();
}

export function showDirectory(stage,signal) {
  stage.innerHTML=`<label class="specimen-search">Search LC3<input type="search" placeholder="CS111, Open House, 650001…"></label>
    <div class="directory-layout"><div class="directory-list"></div><div class="directory-ticket" aria-live="polite"><span class="sheet-caption">LC3 / Location</span><strong data-room></strong><span data-place></span></div></div>`;
  const input=stage.querySelector('input'),list=stage.querySelector('.directory-list');
  let selected=0;
  function draw(){
    const term=input.value.toLowerCase().trim();
    const matches=locations.map((p,i)=>({p,i})).filter(({p})=>(p.name+' '+p.room+' '+p.type).toLowerCase().includes(term));
    if(!matches.some(({i})=>selected===i))selected=matches[0]?.i??-1;
    updateList(list,matches.map(({p,i})=>`<button data-key="${i}" aria-pressed="${selected===i}"><small>${safe(p.type)}</small><span>${safe(p.name)}</span><b>↗</b></button>`).join('')||'<p class="study-empty">No matching location.</p>');
    const place=locations[selected];
    const room = place?.room === 'hallway-5' ? 'Hall 5' : place?.room || '—';
    const label = stage.querySelector('[data-room]');
    if (room !== label.textContent) {
      label.textContent = room;
      if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
        label.animate([
          {transform:'translateY(9px) rotate(-2deg)', opacity:.55},
          {transform:'none', opacity:1}
        ], {duration:220, easing:'ease-out'});
      }
    }
    stage.querySelector('[data-place]').textContent=place?.name||'Try another course or event.';
  }
  input.addEventListener('input',draw,{signal});list.addEventListener('click',e=>{const b=e.target.closest('button');if(b){selected=Number(b.dataset.key);draw();}},{signal});draw();
}

export function showEvents(stage,signal) {
  const favourites=new Set();
  stage.innerHTML=`<div class="events-controls"><label>Category<select>${option('','All categories')}${[...new Set(events.map(e=>e.category))].sort().map(s=>option(s,s)).join('')}</select></label>
    <button type="button" class="event-saved" aria-pressed="false">Saved <span>0</span></button></div>
    <div class="events-board"></div><p class="study-result" role="status"></p>`;
  const select=stage.querySelector('select'),saved=stage.querySelector('.event-saved'),board=stage.querySelector('.events-board');
  let onlySaved=false;
  function draw(){
    const shown=events.map((event,i)=>({event,i})).filter(({event,i})=>(!select.value||select.value===event.category)&&(!onlySaved||favourites.has(i)));
    saved.setAttribute('aria-pressed',String(onlySaved));saved.querySelector('span').textContent=favourites.size;
    updateList(board,shown.map(({event,i})=>{
      const date=new Date(event.date+'T12:00:00Z');
      return `<div class="event-line"><time datetime="${safe(event.date)}"><strong>${date.getUTCDate()}</strong>${date.toLocaleDateString('en',{month:'short',timeZone:'UTC'})}</time>
      <div><small>${safe(event.category)}</small><strong>${safe(event.title)}</strong><span>${safe(event.place)}</span></div>
      <button data-key="${i}" aria-label="${favourites.has(i)?'Unsave':'Save'} ${safe(event.title)}" aria-pressed="${favourites.has(i)}">${favourites.has(i)?'★':'☆'}</button></div>`;
    }).join('')||'<p class="study-empty">No events in this selection.</p>');
    stage.querySelector('.study-result').textContent=shown.length+' of '+events.length+' repository sample events';
  }
  select.addEventListener('change',draw,{signal});saved.addEventListener('click',()=>{onlySaved=!onlySaved;draw();},{signal});
  board.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;const i=Number(b.dataset.key);if(favourites.has(i))favourites.delete(i);else favourites.add(i);draw();},{signal});draw();
}

export function showCourses(stage,signal) {
  stage.innerHTML=`<label class="specimen-search">Course search<input type="search" placeholder="CS100, 111, โครงสร้าง…"></label>
    <div class="course-layout"><div class="course-options"></div><article class="course-page" aria-live="polite"></article></div>`;
  const input=stage.querySelector('input'),list=stage.querySelector('.course-options'),card=stage.querySelector('.course-page');
  let selected=0;
  function draw(){
    const term=input.value.toLowerCase().replace(/^cs\s*/,'').trim();
    const found=courses.map((c,i)=>({c,i})).filter(({c})=>(c.courseCode+' '+c.courseName+' '+c.courseGroup).toLowerCase().includes(term));
    if(!found.some(({i})=>i===selected))selected=found[0]?.i??-1;
    updateList(list,found.map(({c,i})=>`<button data-key="${i}" aria-pressed="${selected===i}"><strong>${safe(c.courseCode)}</strong><span lang="th">${safe(c.courseName)}</span></button>`).join('')||'<p class="study-empty">No matching course.</p>');
    if (card.dataset.record === String(selected)) return;
    card.dataset.record = String(selected);
    const c=courses[selected];
    card.innerHTML=c?`<div class="sheet-caption">Course record <span>${c.credit} credits</span></div><strong lang="th">${safe(c.courseName)}</strong>
      <p lang="th">${safe(c.courseDetail)}</p><dl><div><dt>Prerequisite</dt><dd>${safe(c.coursePermission==='-'?'None listed':c.coursePermission)}</dd></div><div><dt>Follow-on</dt><dd>${safe(c.courseNext)}</dd></div></dl>`:'<p>Select a course to inspect its record.</p>';
  }
  input.addEventListener('input',draw,{signal});list.addEventListener('click',e=>{const b=e.target.closest('button');if(b){selected=Number(b.dataset.key);draw();}},{signal});draw();
}
