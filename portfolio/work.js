// The Work archive uses the same content as its individual project pages and editor.
function projectSlug(project,index){return project.id || String(index);}
function projectRoute(project,index){return '#projects/'+encodeURIComponent(projectSlug(project,index));}
function workLinks(project){
  const links=Array.isArray(project.links)?project.links:[];
  const all=[...(project.link?[{label:project.repositoryVisibility==='private'?'Private repository':'Repository',url:project.link,repository:true}]:[]),...links];
  const seen=new Set();
  return all.map(item=>{
    const url=webLink(item.url);
    if(!url||seen.has(url))return '';
    seen.add(url);
    if(item.repository&&new URL(item.url).hostname==='github.com'){
      const privateRepo=project.repositoryVisibility==='private';
      const label=`Open ${project.name}${privateRepo?' private repository':''} on GitHub (new tab)`;
      return `<a class="work-repo-pet" href="${url}" target="_blank" rel="noopener noreferrer" aria-label="${esc(label)}"><img src="assets/contact/github-work.svg" alt="" width="138" height="120">${privateRepo?'<span class="work-repo-access">Private repository</span>':''}</a>`;
    }
    return `<a href="${url}" target="_blank" rel="noopener noreferrer">${esc(item.label||'Source')} <span aria-hidden="true">↗</span></a>`;
  }).join('');
}
function workMeta(project,index){
  return `<div class="work-meta"><span>PROJECT ${String(index+1).padStart(2,'0')}</span><span>${esc(project.category)}</span>${project.context?`<span>${esc(project.context)}</span>`:''}</div>`;
}
function workBody(project,index,{detail=false}={}){
  const features=Array.isArray(project.features)?project.features:[];
  const stack=Array.isArray(project.stack)?project.stack:[];
  const heading=detail?'h1':'h2';
  const title=detail?esc(project.name):`<a href="${projectRoute(project,index)}">${esc(project.name)}</a>`;
  const picture=detail?imageSrc(project.image):'';
  return `<div class="work-entry-body">
    <${heading} class="work-project-title">${title}</${heading}>
    <p class="work-subtitle">${esc(project.description)}</p>
    ${picture?`<img class="work-image" src="${picture}" alt="${esc(project.name)}" loading="lazy">`:''}
    <div class="work-copy">${[project.detail,detail?project.notes:''].filter(Boolean).join('\n\n').split(/\n\s*\n/).filter(Boolean).map(p=>`<p>${esc(p)}</p>`).join('')}${features.length?`<ul>${features.map(feature=>`<li>${esc(feature)}</li>`).join('')}</ul>`:''}</div>
    ${stack.length?`<p class="work-stack"><span>Built with</span> ${stack.map(esc).join(' · ')}</p>`:''}
    ${project.contribution?`<p class="work-contribution"><span>My part</span> ${esc(project.contribution)}</p>`:''}
    ${project.status?`<p class="work-status"><span>Project note</span> ${esc(project.status)}</p>`:''}
    <div class="work-links">${workLinks(project)}${!detail?`<a class="work-permalink" href="${projectRoute(project,index)}">Project notes <span aria-hidden="true">↗</span></a>`:''}</div>
  </div>`;
}
function workArchive(projects){
  return `<section class="work-page" aria-labelledby="work-heading">
    <div class="work-wrap">
      <div class="work-page-head">
        <p class="work-eyebrow">WORK · ${projects.length} PROJECT${projects.length===1?'':'S'}</p>
        <h1 id="work-heading">${esc(data.workArchiveTitle||'Projects, coursework,\nand things I’ve built.').replace(/\n/g,' <br>')}</h1>
        <p class="work-page-intro">${esc(data.workArchiveIntro||'A closer look at my class projects, team work, and personal experiments — what they do and how they work.')}</p>
      </div>
      <ol class="work-entries">${projects.map((project,index)=>`<li class="work-entry" id="work-${esc(projectSlug(project,index))}">${workMeta(project,index)}${workBody(project,index)}</li>`).join('')}</ol>
      ${projects.length?'':'<p class="work-empty">Projects will appear here as I add them.</p>'}
      <a class="work-back" href="#home">← Back to the archive</a>
    </div>
  </section>`;
}
function workProject(project,index){
  const next=data.projects[(index+1)%data.projects.length];
  return `<section class="work-page work-detail" aria-label="${esc(project.name)}">
    <div class="work-wrap"><a class="work-back" href="#projects">← All projects</a>
      <article class="work-entry">${workMeta(project,index)}${workBody(project,index,{detail:true})}</article>
      ${data.projects.length>1?`<a class="work-next" href="${projectRoute(next,(index+1)%data.projects.length)}"><span>Next project</span><strong>${esc(next.name)}</strong><span aria-hidden="true">↗</span></a>`:''}
    </div>
  </section>`;
}
