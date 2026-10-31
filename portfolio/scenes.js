// Illustrations for work that has no cover yet. An editor-supplied image takes priority.
function projectPlate(item,index) {
  const src=imageSrc(item.image);
  if(src)return '<img class="plate-image" src="'+src+'" alt="">';
  const shapes=[
    '<g fill="none" stroke="currentColor" stroke-width="1.5">'+Array.from({length:11},(_,i)=>'<path d="M60 '+(84+i*4)+'l68 -40 68 40 -68 40z"/>').join('')+'</g>',
    '<g fill="none" stroke="currentColor" stroke-width="1">'+Array.from({length:11},(_,i)=>'<path d="M0 '+(20+i*14)+' Q72 '+(65+i*5)+' 112 '+(22+i*12)+' T260 '+(35+i*13)+'"/>').join('')+'</g><path d="M39 142h38l41-42h36l48-51" fill="none" stroke="currentColor" stroke-width="5"/><circle cx="202" cy="49" r="8" fill="currentColor"/>',
    '<g fill="none" stroke="currentColor" stroke-width="1">'+Array.from({length:32},(_,i)=>'<rect x="'+(34+i%8*24)+'" y="'+(39+Math.floor(i/8)*25)+'" width="21" height="21" rx="1" '+(i%7<2?'fill="currentColor"':'')+'/>').join('')+'</g>',
    '<g fill="none" stroke="currentColor">'+Array.from({length:19},(_,i)=>'<path d="M0 '+(42+i*4)+' C75 '+(160-i*4)+' 133 '+(2+i*2)+' 256 '+(82+i*4)+'"/>').join('')+'</g>'
  ];
  return '<svg class="plate-svg" aria-hidden="true" viewBox="0 0 256 180">'+shapes[index%shapes.length]+'</svg>';
}
function workScene(items){
  if(!items.length)return '';
  return '<div class="work-stage"><div class="work-index">'+rows('projects')+'</div><figure class="plate"><div class="plate-layers">'+items.map((item,i)=>'<div class="plate-layer" data-tone="'+(i%4)+'" data-active="'+(i===0)+'">'+projectPlate(item,i)+'</div>').join('')+'</div><figcaption><span class="plate-count">01</span><span class="plate-label">'+esc(items[0].name)+'</span></figcaption></figure></div>';
}
function sparkScene(){
  function shot(mode){return '<picture><source media="(prefers-reduced-motion: reduce)" srcset="assets/motion/spark-'+mode+'.jpg"><img src="assets/motion/spark-'+mode+'.gif" width="1200" height="420" loading="lazy" alt=""></picture>';}
  return '<figure class="lab-screen" aria-label="Spark walking along a cable by day and by night"><div class="compare">'+shot('day')+'<div class="night">'+shot('night')+'</div><i class="seam"></i></div><figcaption><span>01 / DAY</span><span>02 / NIGHT</span></figcaption></figure>';
}
function archiveSeal(){
 return '<div class="archive-seal" aria-hidden="true"><svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="52" fill="none" stroke="currentColor" stroke-dasharray="1 4"/><g class="seal-needle"><path d="M60 15l7 45-7 45-7-45z" fill="none" stroke="currentColor"/><path d="M60 15l7 45h-7z" fill="currentColor"/></g></svg></div>';
}
