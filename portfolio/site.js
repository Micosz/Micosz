const sections={projects:'Work',about:'About me',achievements:'Achievements',events:'Events',contact:'Contact'};
const data=getContent(),main=document.querySelector('main'),menu=document.querySelector('.menu');
let stop=()=>{};document.querySelector('#brand').textContent=data.name;document.querySelector('#foot').textContent=data.name+' ↗';
document.querySelector('#nav').innerHTML=Object.entries(sections).map(([k,v])=>`<a href="#${k}">${v}</a>`).join('');
menu.onclick=()=>menu.setAttribute('aria-expanded',String(menu.getAttribute('aria-expanded')==='false'));
document.querySelector('#nav').addEventListener('click',event=>{if(event.target.closest('a'))menu.setAttribute('aria-expanded','false');});
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&menu.getAttribute('aria-expanded')==='true'){menu.setAttribute('aria-expanded','false');menu.focus();}});
function itemMeta(key,item){return key==='events' ? [item.date,item.place].filter(Boolean).join(' · ') : item.category;}
function rows(key,limit=Infinity){return data[key].slice(0,limit).map((p,i)=>`<a class="row" data-index="${i}" href="#${key}/${i}"><small>${String(i+1).padStart(2,'0')}</small><strong>${esc(p.name)}</strong><small>${esc(itemMeta(key,p))}</small><i>↗</i></a>`).join('')||'<p class="empty">No entries yet.</p>';}
function link(label,url){const dest=webLink(url);return dest?`<a class="under" href="${dest}">${label} ↗</a>`:'';}
function contact(){
 const contacts=[
  {label:'GitHub',icon:'github',url:webLink(data.github)},
  {label:'LinkedIn',icon:'linkedin',url:webLink(data.linkedin)},
  {label:'Gmail',icon:'gmail',url:data.email?'mailto:'+esc(encodeURIComponent(data.email)):''},
  {label:'University Email',icon:'university',url:data.universityEmail?'mailto:'+esc(encodeURIComponent(data.universityEmail)):''}
 ];
 return '<div class="contacts contact-pets">'+contacts.filter(item=>item.url).map(item=>
  `<a class="contact-pet" href="${item.url}" aria-label="${item.label}"><img src="assets/contact/${item.icon}.svg" alt="" width="${item.icon==='university'?124:92}" height="80"></a>`
 ).join('')+'</div>';
}
function chapterBody(key){
 if(key==='events' && !data.events.length)return '<p class="empty">No events added yet.</p>';
 if(key==='projects')return workScene(data.projects)||rows(key);
 if(key==='achievements')return '<div class="award-index">'+archiveSeal()+'<div>'+rows(key)+'</div></div>';
 return rows(key);
}
function introSection(key,index,label,headline,description,cta){
 return `<section class="block chapter work-intro" data-chapter="${key}"><div class="cap">FILE / ${index} &nbsp; ${label}</div><a class="work-intro-link" href="#${key}"><h2>${esc(headline)}</h2><span class="work-intro-arrow" aria-hidden="true">↗</span></a><div class="work-intro-bottom"><p>${esc(description)}</p><a class="under" href="#${key}">${cta} ↗</a></div></section>`;
}
function home(){return `<section class="hero"><div class="hero-stage"><div class="status"><span><b>●</b> PERSONAL ARCHIVE</span><span>TH / <time></time></span></div><div class="hero-grid"><div class="hero-copy"><h1>${esc(data.title).replace(/\n/g,'<br>')}</h1><p>${esc(data.intro)}</p><a class="primary" href="#projects">Explore the work <span>↗</span></a></div><figure><canvas aria-label="Rotating lavender ribbon sculpture"></canvas><figcaption>FIG. 01 &nbsp; / &nbsp; ORBIT STUDY <span>SCROLL ↓ · DRAG ↔</span></figcaption></figure></div><div class="scene-meter" aria-hidden="true"><i></i></div></div></section><section class="paper"><div class="cap">ABOUT ME / 01</div><h2>${esc(data.headline)}</h2><p>${esc(data.about)}</p><a class="paper-link" href="#about">About me ↗</a></section>${introSection('projects','02','WORK',data.workHeadline,data.workIntro,'Explore projects')}<section class="block spark-showcase" aria-label="Spark, day and night">${sparkScene()}</section>${introSection('achievements','03','ACHIEVEMENTS',data.achievementsHeadline,data.achievementsIntro,'Explore achievements')}${introSection('events','04','EVENTS',data.eventsHeadline,data.eventsIntro,'Explore events')}<section class="block" data-chapter="contact"><div class="cap">GET IN TOUCH</div><h2>Contact</h2>${contact()}</section>`;}
function render(){
 document.querySelector('#brand').textContent=data.name;document.querySelector('#foot').textContent=data.name+' ↗';
 stop();menu.setAttribute('aria-expanded','false');
 const [key='home',id]=location.hash.slice(1).split('/');const name=sections[key];
 const record=id && Array.isArray(data[key]) ? (/^\d+$/.test(id)?data[key][Number(id)]:data[key].find(item=>item.id===id)) : null;
 document.body.dataset.page=key==='projects'?'work':key||'home';
 if(key==='edit'){showEditor(main,data);document.title='Edit portfolio';window.scrollTo(0,0);return;}
 if(!name){main.innerHTML=home();clock();}
 else if(key==='projects'){
  main.innerHTML=record?workProject(record,data.projects.indexOf(record)):workArchive(data.projects);
 }
 else if(key==='about'){main.innerHTML=aboutPage();}
 else {
  let body='';
  if(record){
   const pic=imageSrc(record.image);
   const visual=pic ? `<img class="cover" src="${pic}" alt="${esc(record.name)}">`
     : key==='projects' ? `<figure class="detail-plate"><div class="plate-layer" data-tone="${Number(id)%4}" data-active="true">${projectPlate(record,Number(id))}</div></figure>` : '';
   body=`<div class="cap">${esc(itemMeta(key,record))}</div><h1>${esc(record.name)}</h1><p class="lead">${esc(record.description)}</p>${visual}<p class="prose">${esc(record.detail)}</p>${link(key==='events'?'Event link':'Open project or source',record.link)}`;
  }
  else if(key==='contact'){body='<h1>Get in touch.</h1>'+contact();}
  else {body=`<h1>${name}.</h1><div class="entries">${chapterBody(key)}</div>`;}
  main.innerHTML=`<section class="block interior" data-chapter="${esc(key)}"><a class="crumb" href="#${record?key:'home'}">← ${record?name:'Home'}</a>${body}</section>`;
 }
 document.title=(record?.name||name||'Personal archive')+' — '+data.name;
 document.querySelectorAll('#nav a').forEach(a=>a.toggleAttribute('aria-current',a.hash==='#'+key));
 window.scrollTo(0,0);
 const stopMotion=startScrollMotion(main),stopAbout=startAbout(main);
 stop=()=>{stopAbout();stopMotion();};
}
const formatter=new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Bangkok',timeStyle:'medium'});
function clock(){const el=main.querySelector('time');if(el)el.textContent=formatter.format(new Date());}
setInterval(clock,1000);let transition;
function route(){
 const curtain=document.querySelector('.curtain');
 transition?.cancel();
 if(matchMedia('(prefers-reduced-motion: reduce)').matches || !curtain.animate){render();return;}
 const key=location.hash.slice(1).split('/')[0];
 curtain.querySelector('span').textContent=(sections[key]|| (key==='edit'?'Edit':'Home'))+' / '+data.name;
 const cover=curtain.animate([{transform:'translateY(100%)'},{transform:'translateY(0)'}],{duration:230,easing:'cubic-bezier(.55,0,.25,1)',fill:'forwards'});
 transition=cover;
 cover.onfinish=()=>{
   if(transition!==cover)return;
   render();cover.cancel();
   transition=curtain.animate([{transform:'translateY(0)'},{transform:'translateY(-100%)'}],{duration:340,easing:'cubic-bezier(.55,0,.15,1)'});
 };
}
window.addEventListener('hashchange',route);render();
