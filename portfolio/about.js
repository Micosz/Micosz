// A transcript-led journey. Original records remain separate from editorial notes.
const STUDY_AREAS={software:'Software & design',systems:'Systems & cloud',data:'Math, data & AI',general:'Beyond computing'};
function educationData(){return data.education||window.PORTFOLIO.education;}
function studyRecords(){return educationData().terms.flatMap((term,ti)=>term.courses.map((course,ci)=>({...course,term,ti,ci,key:ti+'-'+ci})));}
function studyNumber(value){return Number.isFinite(Number(value))&&value!==null?Number(value).toFixed(2):'Pending';}
function studyGrade(course){return course.grade===null||course.grade===''?'Pending':course.grade;}
function studyTermLabel(term){return term.term+' / '+term.year;}
function courseTrigger(course,key,compact=false){return `<button type="button" class="study-course${compact?' is-compact':''}" data-course="${key}"><span class="study-code">${esc(course.code)}</span>${compact?'':`<span class="study-course-name">${esc(course.name)}</span><span class="study-grade">${esc(studyGrade(course))}</span><span class="study-open" aria-hidden="true">↗</span>`}</button>`;}
function studyMap(records){
 const picks=[['software',['CS100','CS111','CS216','CS251','CS263','CS364']],['systems',['CS233','CS232','CS234','CS264','CS361']],['data',['CS101','ST216','CS240','CS271','CS373','CS374']]];
 return `<div class="study-map"><div class="study-map-head"><span>COURSE MAP</span><span>Select a course ↗</span></div><div class="study-map-grid"><span></span>${['2024','2025','2026'].map(y=>`<span class="study-map-year">${y}</span>`).join('')}${picks.map(([area,codes])=>`<span class="study-map-label">${esc(STUDY_AREAS[area])}</span>${['2024','2025','2026'].map(year=>`<div class="study-map-cell" data-area="${area}">${records.filter(r=>r.term.year===year&&codes.includes(r.code)).map(r=>courseTrigger(r,r.key,true)).join('')}</div>`).join('')}`).join('')}</div><p class="study-map-note">A few subjects along the way.<br>Grouped by topic and academic year.</p></div>`;
}
function aboutPage(){
 const e=educationData(),terms=e.terms,records=studyRecords(),latest=terms.at(-1),pending=records.filter(r=>!r.grade);
 const completed=records.filter(r=>r.grade&&r.grade!=='W');
 const graded=completed.filter(r=>r.grade!=='ACC');
 return `<div class="about-page">
 <section class="about-intro" aria-labelledby="about-title"><div class="about-kicker"><span>ABOUT ME / UNIVERSITY YEARS</span><span>2024 — ${esc(latest.year)}</span></div>
 <div class="about-hero-grid"><div><p class="about-name">${esc(data.name)} / ${esc(e.university)}</p><h1 id="about-title">${esc(e.heroTitle).replace(/\n/g,' <br>')}</h1><p class="about-intro-copy">${esc(e.intro)}</p><button class="study-start" type="button" data-jump="0">Follow my journey <span aria-hidden="true">↓</span></button></div>${studyMap(records)}</div>
 <div class="about-facts"><div><span>PROGRAMME</span><strong>${esc(e.program)}</strong><small>${esc(e.campus)}</small></div><div><span>CUMULATIVE GPA</span><strong class="study-stat">${studyNumber(latest.gpax)}<small> / 4.00</small></strong></div><div><span>CREDITS EARNED</span><strong class="study-stat">${latest.earnedTotal}<small> credits</small></strong></div><div><span>LATEST SEMESTER</span><strong class="study-stat">${pending.length}<small> courses</small></strong><small>Results pending</small></div></div>
 <p class="about-record-note">Academic record as of ${esc(e.recordDate)} · Includes summer terms</p></section>
 ${studyJourneyMarkup(terms)}
 <section class="study-connections" aria-labelledby="connections-title"><p class="study-mono">02 / FROM CLASS TO CODE</p><div class="study-section-head"><h2 id="connections-title">Some of it <br>became a project.</h2><p>Coursework is part of the story.<br>These are a few things I worked on with a team.</p></div><div class="study-projects">${['CS261','CS232','CS251','CS361'].map(code=>{const c=records.find(r=>r.code===code),p=data.projects.find(p=>p.id===c?.project);return p?`<a href="${projectRoute(p,data.projects.indexOf(p))}"><span class="study-mono">${c.code} / ${c.term.year}</span><h3>${esc(p.name)}</h3><p>${esc(c.name)}</p><span class="study-project-action">Explore the project <span aria-hidden="true">↗</span></span></a>`:'';}).join('')}</div></section>
 <section class="study-index" aria-labelledby="index-title"><p class="study-mono">03 / COURSE INDEX</p><div class="study-section-head"><h2 id="index-title">Look a little closer.</h2><p>Browse the full record, including summer<br>courses, accepted credits and current subjects.</p></div>
 <div class="study-tools"><label class="study-search"><span>Find a course</span><input type="search" placeholder="Search by name or code" aria-label="Search courses by name or code"></label><label class="study-filter"><span>Subject area</span><select aria-label="Filter by subject area"><option value="all">All subjects</option>${Object.entries(STUDY_AREAS).map(([k,v])=>`<option value="${k}">${v}</option>`).join('')}</select></label><label class="study-grade-toggle"><input type="checkbox" data-show-grades> Show course grades</label></div>
 <div class="study-index-status"><p role="status" data-course-count></p><button type="button" data-reset-study hidden>Clear filters</button></div><div class="study-index-list"></div>
 <div class="study-record-source"><p>Based on my unofficial academic record, ${esc(e.recordDate)}.</p><p>W = withdrawn · ACC = accepted credit, outside the GPA calculation · Pending = no final grade in this record.</p><p>Academic years are shown in CE; semester notes also show the original Buddhist Era year.</p></div></section>
 <section class="study-outro"><p class="study-mono">THE NEXT CHAPTER</p><h2>Still learning. <br>Still making things.</h2><a class="primary" href="#projects">Explore my work <span aria-hidden="true">↗</span></a></section>
 <dialog class="study-dialog" aria-labelledby="course-dialog-title"><div class="study-dialog-toolbar"><label class="study-grade-toggle"><input type="checkbox" data-show-grades> Show course grades</label><button type="button" data-close-course aria-label="Close course notes">Close ×</button></div><div data-course-detail></div></dialog></div>`;
}
function startAbout(main){
 const page=main.querySelector('.about-page');if(!page)return ()=>{};
 const records=studyRecords(),terms=educationData().terms,events=new AbortController(),opt={signal:events.signal};
 const preference=matchMedia('(prefers-reduced-motion:reduce)'),dialog=page.querySelector('dialog'),list=page.querySelector('.study-index-list'),search=page.querySelector('input[type=search]'),filter=page.querySelector('select');
 const journey=startStudyJourney(page);
 function toggleGrades(show){page.classList.toggle('show-grades',show);page.querySelectorAll('[data-show-grades]').forEach(c=>c.checked=show);}
 page.querySelectorAll('[data-show-grades]').forEach(c=>c.addEventListener('change',()=>toggleGrades(c.checked),opt));
 function showCourse(key){
  const c=records.find(r=>r.key===key);if(!c)return;
  const p=data.projects.find(p=>p.id===c.project);
  page.querySelector('[data-course-detail]').innerHTML=`<p class="study-dialog-code">${esc(c.code)}</p><h2 id="course-dialog-title">${esc(c.name)}</h2><div class="study-dialog-meta"><span>${esc(studyTermLabel(c.term))} · ${c.term.academicYear}</span><span>${c.credits} credits</span><span>${esc(STUDY_AREAS[c.area]||c.area)}</span></div><p class="study-dialog-status">${!c.grade?'Registered · final result pending':c.grade==='W'?'Withdrawn in this semester':c.grade==='ACC'?'Accepted credit · excluded from GPA':'Completed course'}</p><p class="study-dialog-grade study-grade">Recorded grade <strong>${esc(studyGrade(c))}</strong></p>${p?`<a class="study-dialog-project" href="${projectRoute(p,data.projects.indexOf(p))}"><span class="study-mono">RELATED PROJECT</span><strong>${esc(p.name)} <span aria-hidden="true">↗</span></strong><span>See the related project and its notes.</span></a>`:''}<p class="study-footnote">Recorded as of ${esc(educationData().recordDate)}.</p>`;
  if(!dialog.open)dialog.showModal();
 }
 function paintIndex(){
  const q=search.value.trim().toLowerCase();const visible=records.filter(r=>(filter.value==='all'||r.area===filter.value)&&(!q||(r.code+' '+r.name).toLowerCase().includes(q)));
  page.querySelector('[data-course-count]').textContent=`${visible.length} of ${records.length} course registrations`;
  page.querySelector('[data-reset-study]').hidden=!q&&filter.value==='all';
  list.innerHTML=visible.length?visible.map(r=>`<div class="study-index-row"><span class="study-mono study-index-term">${esc(studyTermLabel(r.term))}</span>${courseTrigger(r,r.key)}</div>`).join(''):'<div class="study-no-results"><h3>No courses found.</h3><p>Try a different code, name or subject area.</p></div>';
 }
 search.addEventListener('input',paintIndex,opt);filter.addEventListener('change',paintIndex,opt);
 page.addEventListener('click',event=>{
  const course=event.target.closest('[data-course]');if(course)showCourse(course.dataset.course);
  const jump=event.target.closest('[data-jump]');if(jump){journey.jump(Number(jump.dataset.jump));}
  const semester=event.target.closest('[data-semester-courses]');if(semester){
   const ti=Number(semester.dataset.semesterCourses),term=terms[ti];
   page.querySelector('[data-course-detail]').innerHTML=`<p class="study-dialog-code">${esc(studyTermLabel(term))} · ${term.academicYear}</p><h2 id="course-dialog-title">${term.courses.length} courses.<br>One chapter.</h2><p class="study-footnote">Select a course to read its record.</p><div class="study-semester-list">${term.courses.map((c,ci)=>courseTrigger(c,ti+'-'+ci)).join('')}</div>`;
   if(!dialog.open)dialog.showModal();
  }
  if(event.target.closest('[data-close-course]'))dialog.close();
  if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}
  if(event.target.closest('[data-reset-study]')){search.value='';filter.value='all';paintIndex();search.focus();}
 },opt);
 paintIndex();
 return ()=>{if(dialog.open)dialog.close();events.abort();journey.dispose();};
}
