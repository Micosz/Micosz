function showEditor(host,live) {
 const draft=structuredClone(live), groups=['profile','education','projects','achievements','events'];
 const groupNames=['หน้าแรกและข้อมูลส่วนตัว','การเรียน / About me','ผลงาน','ความสำเร็จ','อีเวนต์ที่เข้าร่วม'];
 draft.education ||= structuredClone(window.PORTFOLIO.education);
 const labels={achievementsHeadline:'หัวข้อเกริ่นความสำเร็จ',achievementsIntro:'คำอธิบายความสำเร็จ',eventsHeadline:'หัวข้อเกริ่นอีเวนต์',eventsIntro:'คำอธิบายอีเวนต์',workHeadline:'หัวข้อเกริ่นผลงาน',workIntro:'คำอธิบายผลงาน',date:'วันที่เข้าร่วม',place:'สถานที่ / ออนไลน์',name:'ชื่อ',title:'ประโยคใหญ่บนหน้าแรก',intro:'คำแนะนำตัว',about:'เกี่ยวกับฉัน',headline:'หัวข้อบนพื้นสีอ่อน',github:'GitHub URL',linkedin:'LinkedIn URL',email:'อีเมล',universityEmail:'อีเมลมหาวิทยาลัย',category:'ประเภท / ปี',description:'คำอธิบาย',detail:'รายละเอียดและบทบาทของฉัน',link:'ลิงก์เดโม ผลงาน หรือหลักฐาน',image:'รูปภาพ (URL หรือชื่อไฟล์ เช่น assets/photo.jpg)'};
 Object.assign(labels,{workArchiveTitle:'หัวข้อหน้า Work',workArchiveIntro:'คำเกริ่นหน้า Work',context:'วิชา / งานกลุ่ม / บริบท',notes:'รายละเอียดเพิ่มเติมในหน้าโปรเจกต์',features:'ฟีเจอร์ (หนึ่งรายการต่อบรรทัด)',stack:'เทคโนโลยี (หนึ่งรายการต่อบรรทัด)',contribution:'ส่วนที่ฉันรับผิดชอบ',status:'หมายเหตุของโปรเจกต์',links:'ลิงก์เพิ่มเติม (ชื่อ | URL หนึ่งลิงก์ต่อบรรทัด)'});
 host.innerHTML='<section class="block editor"><a href="#home">← กลับหน้าเว็บ</a><h1>แก้ไขพอร์ต</h1><p>บันทึกร่างเพื่อดูในเครื่อง หรือดาวน์โหลด content.js ไปแทนไฟล์เดิมเพื่อเก็บการแก้ไขกับตัวเว็บ</p><select aria-label="ส่วนที่จะแก้ไข"></select><div class="fields"></div><div class="tools"><button class="save">บันทึกและดูหน้าเว็บ</button><button class="export">ดาวน์โหลด content.js</button></div><p class="notice" role="status"></p></section>';
 const select=host.querySelector('select'), fields=host.querySelector('.fields'), notice=host.querySelector('.notice');
 groups.forEach((g,i)=>select.add(new Option(groupNames[i],g)));
 function form(obj,keys,target){for(const key of keys){const label=document.createElement('label');label.textContent=labels[key]||key;const field=document.createElement(['title','intro','about','workHeadline','workIntro','achievementsHeadline','achievementsIntro','eventsHeadline','eventsIntro','description','detail','workArchiveTitle','workArchiveIntro','notes','features','stack','contribution','status','links'].includes(key)?'textarea':'input');
   field.value=key==='links'?(obj[key]||[]).map(link=>link.label+' | '+link.url).join('\n'):Array.isArray(obj[key])?obj[key].join('\n'):obj[key]||'';
   field.oninput=()=>{obj[key]=key==='links'?field.value.split('\n').filter(line=>line.trim()).map(line=>{const split=line.indexOf('|');return split<0?{label:'Link',url:line.trim()}:{label:line.slice(0,split).trim(),url:line.slice(split+1).trim()}}):['features','stack'].includes(key)?field.value.split('\n').map(line=>line.trim()).filter(Boolean):field.value};
   label.append(field);target.append(label);}}
 function paint(){
   fields.replaceChildren();const g=select.value;
   if(g==='profile'){form(draft,Object.keys(labels).filter(k=>typeof draft[k]==='string'),fields);return;}
   if(g==='education'){educationForm();return;}
   draft[g].forEach((item,i)=>{const box=document.createElement('fieldset'),legend=document.createElement('legend');legend.textContent=(i+1)+' · '+(item.name||'รายการใหม่');box.append(legend);form(item,g==='events'?['name','date','place','description','detail','link','image']:g==='projects'?['name','category','context','description','detail','notes','features','stack','contribution','status','link','links','image']:['name','category','description','detail','link','image'],box);const del=document.createElement('button');del.textContent='ลบรายการ';del.onclick=()=>{draft[g].splice(i,1);paint()};box.append(del);fields.append(box);});
   const add=document.createElement('button');add.textContent='+ เพิ่มรายการ';add.onclick=()=>{draft[g].push({name:'',category:'',description:'',detail:'',link:'',image:''});paint();fields.querySelector('fieldset:last-of-type input')?.focus()};fields.append(add);
 }
 function educationForm(){
  const education=draft.education;
  Object.assign(labels,{university:'มหาวิทยาลัย',program:'หลักสูตร',faculty:'คณะ',campus:'วิทยาเขต',recordDate:'วันที่ข้อมูลผลการเรียน',heroTitle:'หัวข้อหน้า About me',intro:'คำแนะนำตัว',year:'ปี ค.ศ.',academicYear:'ปี พ.ศ.',term:'ภาคเรียน',story:'เรื่องเล่าประจำเทอม',gpa:'GPA เทอมนี้ (เว้นว่างถ้ายังไม่มีผล)',gpax:'GPAX สะสม',earnedTotal:'หน่วยกิตที่ได้รับสะสม (CE)',gradedTotal:'หน่วยกิตคิดเกรดสะสม (CL)',code:'รหัสวิชา',credits:'หน่วยกิต',project:'รหัสโปรเจกต์ที่เกี่ยวข้อง (ไม่บังคับ)'});
  function field(obj,key,parent,{numeric=false,multiline=false}={}){
   const label=document.createElement('label');label.textContent=key==='title'?'หัวข้อของเทอม':labels[key]||key;
   const input=document.createElement(multiline?'textarea':'input');input.value=obj[key]??'';
   if(numeric){input.type='number';input.step=['gpa','gpax'].includes(key)?'.01':'1';input.min='0';if(['gpa','gpax'].includes(key))input.max='4';}
   input.oninput=()=>obj[key]=numeric?(input.value===''?null:Number(input.value)):input.value;
   label.append(input);parent.append(label);
  }
  ['university','program','faculty','campus','recordDate','heroTitle','intro'].forEach(key=>field(education,key,fields,{multiline:['heroTitle','intro'].includes(key)}));
  education.terms.forEach((term,ti)=>{
   const box=document.createElement('fieldset'),legend=document.createElement('legend');legend.textContent=term.term+' / '+term.year;box.append(legend);
   ['year','academicYear','term','title','story','gpa','gpax','earnedTotal','gradedTotal'].forEach(key=>field(term,key,box,{numeric:['academicYear','gpa','gpax','earnedTotal','gradedTotal'].includes(key),multiline:['title','story'].includes(key)}));
   term.courses.forEach((course,ci)=>{
    const detail=document.createElement('details'),summary=document.createElement('summary');summary.textContent=course.code+' · '+course.name;detail.append(summary);
    ['code','name','credits','project'].forEach(key=>field(course,key,detail,{numeric:key==='credits'}));
    for(const [key,title,options] of [['grade','ผลการเรียน',[['','รอผล'],['A','A'],['B+','B+'],['B','B'],['C+','C+'],['C','C'],['D+','D+'],['D','D'],['F','F'],['W','W — ถอนรายวิชา'],['ACC','ACC — รับโอนหน่วยกิต']]],['area','กลุ่มวิชา',Object.entries(STUDY_AREAS)]]){
     const label=document.createElement('label'),select=document.createElement('select');label.textContent=title;options.forEach(([value,text])=>select.add(new Option(text,value)));select.value=course[key]||'';select.onchange=()=>course[key]=select.value||null;label.append(select);detail.append(label);
    }
    const remove=document.createElement('button');remove.type='button';remove.textContent='ลบวิชานี้';remove.onclick=()=>{term.courses.splice(ci,1);paint();};detail.append(remove);box.append(detail);
   });
   const add=document.createElement('button');add.type='button';add.textContent='+ เพิ่มวิชาในเทอมนี้';add.onclick=()=>{term.courses.push({code:'',name:'',credits:3,grade:null,area:'software'});paint();};box.append(add);fields.append(box);
  });
  const addTerm=document.createElement('button');addTerm.type='button';addTerm.textContent='+ เพิ่มภาคการศึกษา';addTerm.onclick=()=>{const previous=education.terms.at(-1);education.terms.push({id:'term-'+Date.now(),year:previous?.year||String(new Date().getFullYear()),academicYear:previous?.academicYear||new Date().getFullYear()+543,term:'Semester 2',title:'A new semester.',story:'',gpa:null,gpax:previous?.gpax??null,earnedTotal:previous?.earnedTotal||0,gradedTotal:previous?.gradedTotal||0,courses:[]});paint();};fields.append(addTerm);
 }
 select.onchange=paint;paint();
 host.querySelector('.save').onclick=()=>{try{localStorage.setItem(DRAFT,JSON.stringify(draft));Object.assign(live,draft);location.hash='home'}catch{notice.textContent='เบราว์เซอร์บันทึกร่างไม่ได้ กรุณาดาวน์โหลด content.js แทน'}};
 host.querySelector('.export').onclick=()=>{const url=URL.createObjectURL(new Blob(['window.PORTFOLIO = '+JSON.stringify(draft,null,2)+';\n'],{type:'text/javascript'}));const a=document.createElement('a');a.href=url;a.download='content.js';a.click();setTimeout(()=>URL.revokeObjectURL(url),1500);notice.textContent='นำไฟล์ที่ดาวน์โหลดไปแทน content.js ในโฟลเดอร์เว็บ'};
}
