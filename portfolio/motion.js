// Geometry follows native scroll; entrance cues run once when they reach the viewport.
function startScrollMotion(main) {
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
  const header = document.querySelector('header');
  const hero = main.querySelector('.hero');
  const stage = main.querySelector('.hero-stage');
  const renderArt = hero && startArt(hero.querySelector('canvas'));
  const chapters = [...main.querySelectorAll('.paper,.block')];
  const workMotion = prepareWorkScroll(main);
  const clamp = n => Math.max(0,Math.min(1,n));
  const events = new AbortController();
  const options = {signal:events.signal};
  const cross = document.querySelector('.pointer-mark');
  let pending = 0;

  // Mask individual words so edited copy can wrap naturally at any width.
  main.querySelectorAll('h1,h2').forEach(title=>{
    // Keep project titles as native links, including their keyboard behavior.
    if(title.querySelector('a'))return;
    title.setAttribute('aria-label',title.textContent.replace(/\s+/g,' ').trim());
    const pieces = [...title.childNodes];
    title.replaceChildren();
    let i=0;
    for(const piece of pieces){
      if(piece.nodeName==='BR'){title.append(piece);continue;}
      for(const word of piece.textContent.split(/(\s+)/)){
        if(!word.trim()){title.append(word);continue;}
        const mask=document.createElement('span'),ink=document.createElement('span');
        mask.className='word-mask';ink.textContent=word;
        mask.setAttribute('aria-hidden','true');
        ink.style.setProperty('--delay',Math.min(i++,8)*45+'ms');
        mask.append(ink);title.append(mask);
      }
    }
  });

  main.classList.add('motion');
  const observer=new IntersectionObserver(entries=>{
    for(const {target,isIntersecting} of entries)if(isIntersecting){
      target.classList.add('entered');observer.unobserve(target);
    }
  },{rootMargin:'0px 0px -3% 0px'});
  main.querySelectorAll('h1,h2,.row,.lead,.cover,.detail-plate,.empty,.hero-copy>p,.hero-copy>.primary,.contacts,.prose,.paper>p,.work-intro-bottom,.interior>.primary,.interior>.under,.cap,.crumb').forEach(el=>{
    // Work entries follow the scroll position in both directions, not a timer.
    if(el.closest('.work-entry'))return;
    el.classList.add('cue');
    if(el.matches('.row'))el.style.setProperty('--delay',Math.min(Number(el.dataset.index),4)*52+'ms');
    observer.observe(el);
  });
  function selectPlate(index,work){
    const layers=work.querySelectorAll('.plate-layer');
    if(!layers[index] || work.dataset.selected===String(index))return;
    layers.forEach((el,i)=>el.dataset.active=String(i===index));
    work.dataset.selected=String(index);
    const row=work.querySelectorAll('.row')[index];
    work.querySelector('.plate-count').textContent=String(index+1).padStart(2,'0');
    work.querySelector('.plate-label').textContent=row.querySelector('strong').textContent;
  }
  const works=[...main.querySelectorAll('.work-stage')];
  for(const work of works){
    for(const row of work.querySelectorAll('.row')){
      const select=()=>selectPlate(Number(row.dataset.index),work);
      row.addEventListener('pointerenter',select,options);
      row.addEventListener('focus',select,options);
    }
  }
  function movePointer(event){
    if(!finePointer.matches||preference.matches)return;
    const interactive=event.target.closest('.row,.hero figure,.under,.primary');
    cross.classList.toggle('active',Boolean(interactive));
    if(!interactive)return;
    cross.style.transform='translate('+Math.round(event.clientX+16)+'px,'+Math.round(event.clientY+16)+'px)';
    cross.textContent=interactive.matches('figure')?'TURN':'↗';
  }
  main.addEventListener('pointermove',movePointer,options);
  main.addEventListener('pointerleave',()=>cross.classList.remove('active'),options);

  function syncWorkPreview(height){
    for(const work of works){
      if(work.contains(document.activeElement) || (finePointer.matches && work.matches(':hover')))continue;
      const rows=[...work.querySelectorAll('.row')];
      const active=rows.findIndex(row=>row.getBoundingClientRect().bottom>=height*.55);
      selectPlate(active<0?rows.length-1:active,work);
    }
  }
  function paint(){
    pending=0;
    const height=innerHeight, reduced=preference.matches;
    const rects=chapters.map(el=>el.getBoundingClientRect());
    const workFrame=workMotion?.read(height,reduced);
    if(hero){
      const rect=hero.getBoundingClientRect();
      const distance=Math.max(rect.height-stage.offsetHeight,height*.48);
      const progress=reduced?0:clamp((header.offsetHeight-rect.top)/distance);
      hero.style.setProperty('--hero-progress',progress.toFixed(4));
      if(rect.bottom>=0 && rect.top<=height)renderArt(progress);
    }
    chapters.forEach((el,i)=>{
      const {top,height:h}=rects[i];
      const entry=reduced?1:clamp((height-top)/Math.min(height*.42,h));
      const travel=reduced?.5:clamp((height*.85-top)/(h+height*.45));
      el.style.setProperty('--entry',entry.toFixed(4));
      el.style.setProperty('--travel',travel.toFixed(4));
      const compare=el.querySelector('.compare');
      if(compare){
        const r=compare.getBoundingClientRect();
        const cut=reduced?.5:clamp((height*.83-r.top)/(height*.55+r.height*.32));
        compare.style.setProperty('--cut',(cut*100).toFixed(2)+'%');
      }
    });
    syncWorkPreview(height);
    const range=document.documentElement.scrollHeight-height;
    header.style.setProperty('--page-progress',range>0?clamp(scrollY/range):1);
    workMotion?.paint(workFrame,range>0?clamp(scrollY/range):1);
  }
  function schedule(){if(!pending)pending=requestAnimationFrame(paint);}
  function resize(){workMotion?.invalidate();schedule();}
  const size=new ResizeObserver(resize);size.observe(main);size.observe(header);
  window.addEventListener('scroll',schedule,{...options,passive:true});
  window.addEventListener('resize',resize,options);
  preference.addEventListener('change',schedule,options);
  paint();
  return ()=>{
    events.abort();size.disconnect();observer.disconnect();cancelAnimationFrame(pending);
    workMotion?.destroy();
    cross.classList.remove('active');main.classList.remove('motion');header.style.removeProperty('--page-progress');
  };
}

// Read untransformed layout positions first, then write only composited styles.
// No smoothing loop: stopping or reversing the scroll stops or reverses the motion.
function prepareWorkScroll(main){
  const page=main.querySelector('.work-page');
  if(!page)return null;
  const head=page.querySelector('.work-page-head');
  const rows=[...page.querySelectorAll('.work-entry')].map(entry=>({
    entry,
    pieces:[...entry.querySelectorAll('.work-project-title,.work-subtitle,.work-copy>p,.work-copy li,.work-stack,.work-contribution,.work-status,.work-links,.work-image')].map(node=>{
      node.classList.add('work-scroll-piece');
      return {node,top:0};
    })
  }));
  const clamp=n=>Math.max(0,Math.min(1,n));
  let dirty=true;
  main.classList.add('work-scrub');
  return {
    invalidate(){dirty=true;},
    read(height,reduced){
      if(dirty){
        for(const row of rows)for(const piece of row.pieces){
          // offsetTop is unaffected by the visual transform we apply below.
          let node=piece.node,top=0;
          while(node&&node!==row.entry){top+=node.offsetTop;node=node.offsetParent;}
          piece.top=top;
        }
        dirty=false;
      }
      const compact=innerWidth<900;
      const end=compact?.66:.56;
      return {
        reduced,
        head:reduced?0:clamp(scrollY/Math.max(head?.offsetHeight||height,height*.6)),
        rows:rows.map(row=>{
          const rect=row.entry.getBoundingClientRect();
          return {
            row,
            active:rect.top<=height*.5&&rect.bottom>height*.5,
            read:reduced?1:clamp((height*.8-rect.top)/Math.max(1,rect.height)),
            pieces:row.pieces.map(piece=>{
              const progress=reduced?1:clamp((height*.98-rect.top-piece.top)/(height*(.98-end)));
              return {node:piece.node,progress:progress*progress*(3-2*progress)};
            })
          };
        })
      };
    },
    paint(frame,progress){
      page.style.setProperty('--work-page-progress',progress.toFixed(4));
      head?.style.setProperty('--head-travel',frame.head.toFixed(4));
      for(const {row,active,read,pieces} of frame.rows){
        row.entry.style.setProperty('--work-read',read.toFixed(4));
        row.entry.toggleAttribute('data-reading',active);
        for(const piece of pieces)piece.node.style.setProperty('--piece-progress',piece.progress.toFixed(4));
      }
    },
    destroy(){main.classList.remove('work-scrub');}
  };
}
