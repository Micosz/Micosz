const PREVIOUS_PROJECTS = [{"name": "CSTU Hub", "category": "Web application", "description": "A team project for the computer science community at Thammasat University.", "detail": "Explore the application and its source in the team repository.", "link": "https://github.com/Micosz/Cs361-Group1-Project7", "image": ""}, {"name": "Indoor Map Navigation", "category": "Maps / Cloud", "description": "Search for a room and follow directions between floors.", "detail": "The navigation tool combines location search, floor changes, and shareable routes.", "link": "https://github.com/Micosz/Map_Navigation", "image": ""}, {"name": "Course Timetabling Lab", "category": "Algorithms", "description": "Explore how room and time constraints shape a course schedule.", "detail": "Use the interactive workbench to explore scheduling decisions.", "link": "https://micosz.github.io/course-timetabling-lab/", "image": ""}, {"name": "Company News NLP Workbench", "category": "Language / Research", "description": "Compare pairs of company news reports about mergers and acquisitions.", "detail": "The workbench starts with a text similarity baseline to study whether two reports describe the same event.", "link": "https://github.com/Micosz/company-news-nlp-workbench", "image": ""}];
const DRAFT = 'chanakarn-archive-draft-v1';
function getContent() {
  try {const saved = JSON.parse(localStorage.getItem(DRAFT)); if(saved && typeof saved === 'object') {
    const data={...window.PORTFOLIO,...saved};
    if(saved.title==='Ideas in\nmotion.') data.title=window.PORTFOLIO.title;
    if(saved.eventsHeadline==='Learning beyond the classroom.') data.eventsHeadline=window.PORTFOLIO.eventsHeadline;
    if(saved.headline==='A personal archive, still taking shape.') data.headline=window.PORTFOLIO.headline;
    if(saved.workCatalogVersion!==window.PORTFOLIO.workCatalogVersion && Array.isArray(saved.projects)) {
      const savedProjects=saved.projects.slice();
      data.projects=window.PORTFOLIO.projects.map(project=>{
        const index=savedProjects.findIndex(p=>p.id===project.id || p.name===project.name);
        if(index<0)return structuredClone(project);
        const edited=savedProjects.splice(index,1)[0];
        const previous=PREVIOUS_PROJECTS.find(p=>p.name===edited.name);
        const merged={...project,...edited,id:project.id};
        if(previous)for(const [key,value] of Object.entries(previous)){
          if(edited[key]===value && key in project)merged[key]=structuredClone(project[key]);
        }
        return merged;
      }).concat(savedProjects);
      data.workCatalogVersion=window.PORTFOLIO.workCatalogVersion;
    }
    return data;
  }} catch {}
  return structuredClone(window.PORTFOLIO);
}
function esc(text){return String(text??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function webLink(value){try {const u=new URL(value);return /^https?:$/.test(u.protocol)?esc(u.href):'';} catch {return '';}}
function imageSrc(value){return webLink(value)||(/^[\w./ -]+\.(png|jpe?g|webp|gif|svg)$/i.test(value) ? esc(value):'');}
