// The Work archive uses the same content as its individual project pages and editor.
function projectSlug(project,index){return project.id || String(index);}
function projectPath(project, index) {
  return '/work/' + encodeURIComponent(projectSlug(project, index)) + '/';
}
function projectRoute(project, index) {
  const published = window.PORTFOLIO.projects;
  const original = published.findIndex(item => project.id ? item.id === project.id : !item.id && item.name === project.name);
  return original >= 0 ? projectPath(published[original], original) : '/#projects/' + encodeURIComponent(projectSlug(project, index));
}
// Each study opens inside its project, independently of the original deployment.
const workStudies = new Map([
  ['taskflow', ['A week in TaskFlow', 'Plan a week', 'Move a sample task onto the calendar, then mark it complete.', 'https://github.com/Micosz/taskflow']],
  ['lc3-navigator', ['Room directory', 'Find a class', 'Look up a course section or an event from the team’s LC3 fixtures.', 'https://github.com/ronnakrit303/CS232-Map_Navigation/tree/main/Frontend']],
  ['indoor-map-navigation', ['Inside LC3', 'Trace a route', 'Pick two rooms. A* traces the route on the original floor plans, entirely in your browser.', 'https://github.com/Micosz/Map_Navigation/blob/main/frontend/app.js']],
  ['khao-mai-rak-zoo', ['The ticket window', 'Build a ticket', 'Make a sample booking with the original ticket categories and prices.', 'https://github.com/Micosz/3_CS251_SourceCode/blob/main/tickets.html']],
  ['timetable-lab', ['One slot, four weeks', 'Assign a room', 'Choose a room for each week of one sample class. The day and time stay fixed.', 'https://github.com/Micosz/CS373_CourseTimetablingLab']],
  ['company-news-workbench', ['Between two headlines', 'Compare headlines', 'Edit two fictional headlines to see how their TF-IDF cosine similarity changes.', 'https://github.com/Micosz/company-news-nlp-workbench/tree/main/pair_workbench']],
  ['tu-events', ['Campus programme', 'Browse events', 'Filter the repository’s sample events and save your own shortlist for this visit.', 'https://github.com/zero-h0ur/cs261--group5-650001/blob/dev/JSON/Snake/event_table.json']],
  ['cstu-courses-explorer', ['Course drawer', 'Explore courses', 'Search course codes and inspect prerequisites in the original test fixtures.', 'https://github.com/nustapark6709650334/CS262-Tester/tree/main/cypress/fixtures']],
  ['uboat-analysis', ['Reading the results', 'Compare models', 'Explore the historical classification results saved in the course notebook.', 'https://github.com/Micosz/CS240_Dataset_Uboat/blob/main/Main_Project.ipynb']],
  ['project-olympia', ['Berry clearing', 'Play the study', 'An original tile scene inspired by the prototype’s movement, collisions and blueberry collection.', '']]
]);
function workStudyPanel(project) {
  const study = workStudies.get(project.id);
  return `<section class="specimen" data-work-study="${esc(project.id)}" aria-label="${esc(study[0])}">
    <header class="specimen-heading"><p class="specimen-label">Interactive preview</p><h3>${esc(study[0])}</h3><p>${esc(study[2])}</p></header>
    <div class="specimen-stage" aria-busy="true"><p class="study-loading">Opening preview…</p></div>
    <footer class="specimen-footer">${study[3] ? `<a href="${esc(study[3])}" target="_blank" rel="noopener noreferrer">Project source ↗</a>` : '<span>Private project · independent illustration</span>'}<button type="button" class="study-reset">↺ Reset preview</button></footer>
  </section>`;
}
function workStudyCard(project,index,interactive) {
  const study = workStudies.get(project.id);
  const route = projectRoute(project,index);
  return `<li class="work-entry work-card" id="work-${esc(project.id)}">
    <div class="work-card-copy">${workMeta(project,index)}<h2 class="work-project-title"><a href="${route}">${esc(project.name)}</a></h2>
      <p class="work-subtitle">${esc(project.description)}</p><a class="work-open-study" href="${route}">${interactive ? esc(study[1]) : 'Read project'} <span aria-hidden="true">↗</span></a>
      <div class="work-links">${workLinks(project,interactive)}<a href="${route}">Project notes ↗</a></div></div>
    <a class="work-thumb" href="${route}" aria-label="${esc(study[1])} — ${esc(project.name)}"><img src="/assets/work/previews/${esc(project.id)}.webp" loading="lazy" width="780" height="480" alt=""></a>
  </li>`;
}
function workGrass() {
  return `<figure class="work-grass" data-work-field>
    <div class="grass-view" role="group" tabindex="0" aria-label="Rotate the wildgrass with the left and right arrow keys"></div>
    <figcaption><span>Wildgrass <i>·</i> Drag to turn</span><button class="grass-wind" type="button" aria-pressed="false">Pause wind</button></figcaption>
  </figure>`;
}
function startWorkStudies(main) {
  const panel = main.querySelector('[data-work-study]');
  const field = main.querySelector('[data-work-field]');
  if (!panel && !field) return () => {};
  const lifetime = new AbortController();
  if (panel) import('./work-studies/studies.js').then(module => {
    if (!lifetime.signal.aborted) module.mountStudy(panel, lifetime.signal);
  }).catch(() => {
    if (lifetime.signal.aborted) return;
    const stage = panel.querySelector('.specimen-stage');
    stage.textContent = 'Preview could not load. The project notes are available below.';
    stage.setAttribute('aria-busy','false');
    panel.querySelector('.study-reset').hidden = true;
  });
  if (field) import('./work-studies/grass.js').then(module => {
    if (!lifetime.signal.aborted) module.mountGrass(field, lifetime.signal);
  }).catch(() => {
    if (!lifetime.signal.aborted) {
      field.querySelector('button').hidden=true; field.querySelector('figcaption span').textContent='Wildgrass';
      const view=field.querySelector('.grass-view');view.removeAttribute('tabindex');view.setAttribute('role','img');view.setAttribute('aria-label','Wildgrass in the wind');
    }
  });
  return () => lifetime.abort();
}
function workLinks(project, interactive=true){
  const links=Array.isArray(project.links)?project.links:[];
  const all=[...(project.link?[{label:project.repositoryVisibility==='private'?'Private repository':'Repository',url:project.link,repository:true}]:[]),...links];
  const seen=new Set();
  return all.map(item=>{
    const url=webLink(item.url);
    if(!url||seen.has(url))return '';
    seen.add(url);
    if(item.repository&&new URL(item.url).hostname==='github.com'){
      const privateRepo=project.repositoryVisibility==='private';
      if (!interactive) {
        return `<a href="${url}">${privateRepo ? 'Private GitHub repository' : 'GitHub repository'} ↗</a>`;
      }
      const label=`Open ${project.name}${privateRepo?' private repository':''} on GitHub (new tab)`;
      return `<a class="work-repo-pet" href="${url}" target="_blank" rel="noopener noreferrer" aria-label="${esc(label)}"><img src="/assets/contact/github-work.svg" alt="" width="138" height="120">${privateRepo?'<span class="work-repo-access">Private repository</span>':''}</a>`;
    }
    return `<a href="${url}" target="_blank" rel="noopener noreferrer">${esc(item.label||'Source')} <span aria-hidden="true">↗</span></a>`;
  }).join('');
}
function workMeta(project,index,includeAuthor=false){
  return `<div class="work-meta">${includeAuthor ? `<span>Project notes by ${esc(data.name)}</span>` : ''}<span>PROJECT ${String(index+1).padStart(2,'0')}</span><span>${esc(project.category)}</span>${project.context?`<span>${esc(project.context)}</span>`:''}</div>`;
}
function workBody(project,index,{detail=false, interactive=true}={}){
  const features=Array.isArray(project.features)?project.features:[];
  const stack=Array.isArray(project.stack)?project.stack:[];
  const heading=detail?'h1':'h2';
  const title=detail?esc(project.name):`<a href="${projectRoute(project,index)}">${esc(project.name)}</a>`;
  const source = detail ? imageSrc(project.image) : '';
  const picture = source && !/^(?:https?:|\/)/i.test(source) ? '/' + source : source;
  return `<div class="work-entry-body">
    <${heading} class="work-project-title">${title}</${heading}>
    <p class="work-subtitle">${esc(project.description)}</p>
    ${detail && interactive && workStudies.has(project.id)?workStudyPanel(project):''}
    ${picture?`<img class="work-image" src="${picture}" alt="${esc(project.name)}" loading="lazy">`:''}
    <div class="work-copy">${[project.detail,detail?project.notes:''].filter(Boolean).join('\n\n').split(/\n\s*\n/).filter(Boolean).map(p=>`<p>${esc(p)}</p>`).join('')}${features.length?`<ul>${features.map(feature=>`<li>${esc(feature)}</li>`).join('')}</ul>`:''}</div>
    ${stack.length?`<p class="work-stack"><span>Built with</span> ${stack.map(esc).join(' · ')}</p>`:''}
    ${project.contribution?`<p class="work-contribution"><span>My part</span> ${esc(project.contribution)}</p>`:''}
    ${project.status?`<p class="work-status"><span>Project note</span> ${esc(project.status)}</p>`:''}
    <div class="work-links">${workLinks(project,interactive)}${!detail?`<a class="work-permalink" href="${projectRoute(project,index)}">Project notes <span aria-hidden="true">↗</span></a>`:''}</div>
  </div>`;
}
function workArchive(projects, interactive=true){
  const previews=projects.flatMap((project,index)=>workStudies.has(project.id)?[`<a href="${projectRoute(project,index)}">${esc(project.name)} <span aria-hidden="true">↗</span></a>`]:[]);
  return `<section class="work-page" aria-labelledby="work-heading">
    <div class="work-wrap">
      <div class="work-page-head work-gallery-head"><div class="work-head-copy">
        <p class="work-eyebrow">${esc(data.name)} · WORK · ${projects.length} PROJECT${projects.length===1?'':'S'}</p>
        <h1 id="work-heading">${esc(data.workArchiveTitle||'Projects, coursework,\nand things I’ve built.').replace(/\n/g,' <br>')}</h1>
        <p class="work-page-intro">${esc(data.workArchiveIntro||'A closer look at my class projects, team work, and personal experiments — what they do and how they work.')}</p>
        ${interactive && previews.length?`<details class="work-picker"><summary>Browse interactive previews <span>${previews.length}</span></summary><div>${previews.join('')}</div></details>`:''}
      </div>${interactive ? workGrass() : '<figure class="work-grass"><img class="work-grass-poster" src="/assets/work/previews/wildgrass.webp" alt="Wildgrass sculpture"></figure>'}</div>
      <ol class="work-entries">${projects.map((project,index)=>workStudies.has(project.id)?workStudyCard(project,index,interactive):`<li class="work-entry" id="work-${esc(projectSlug(project,index))}">${workMeta(project,index)}${workBody(project,index,{interactive})}</li>`).join('')}</ol>
      ${projects.length?'':'<p class="work-empty">Projects will appear here as I add them.</p>'}
      <a class="work-back" href="/">← Back to the archive</a>
    </div>
  </section>`;
}
function workProject(project,index,interactive=true){
  const next=data.projects[(index+1)%data.projects.length];
  return `<section class="work-page work-detail${workStudies.has(project.id)?' work-detail-study':''}" aria-label="${esc(project.name)}">
    <div class="work-wrap"><a class="work-back" href="/work/">← All projects</a>
      <article class="work-entry">${workMeta(project,index,true)}${workBody(project,index,{detail:true,interactive})}</article>
      ${data.projects.length>1?`<a class="work-next" href="${projectRoute(next,(index+1)%data.projects.length)}"><span>Next project</span><strong>${esc(next.name)}</strong><span aria-hidden="true">↗</span></a>`:''}
    </div>
  </section>`;
}
