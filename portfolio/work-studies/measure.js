import {safe, buttons} from './ui.js';

export function showTickets(stage, signal) {
  const fares=[['Adult',200],['Child',100],['Infant',0]],counts=[1,0,0];
  stage.innerHTML=`<div class="ticket-layout"><div class="ticket-lines">${fares.map(([name,price],i)=>`<div class="fare"><div><strong>${name}</strong><small>${price?'฿'+price:'Free'}</small></div><div class="stepper">
    <button data-i="${i}" data-step="-1" aria-label="Remove ${name.toLowerCase()} ticket">−</button><output data-qty="${i}"></output><button data-i="${i}" data-step="1" aria-label="Add ${name.toLowerCase()} ticket">+</button></div></div>`).join('')}</div>
    <div class="admit-ticket"><small>Khao Mai Rak Zoo</small><strong>ADMIT<br> <span data-total-count></span></strong><div class="ticket-perf"></div><div class="ticket-price"><span>Sample total</span><output role="status"></output></div></div></div>`;
  function draw(){
    stage.querySelectorAll('[data-qty]').forEach((el,i)=>el.textContent=counts[i]);
    stage.querySelectorAll('button').forEach(b=>b.disabled=Number(b.dataset.step)<0?counts[b.dataset.i]===0:counts[b.dataset.i]>=12);
    stage.querySelector('[data-total-count]').textContent=String(counts.reduce((a,b)=>a+b,0)).padStart(2,'0');
    stage.querySelector('.ticket-price output').textContent='฿'+counts.reduce((total,n,i)=>total+n*fares[i][1],0).toLocaleString('en');
  }
  stage.addEventListener('click',e=>{const b=e.target.closest('[data-step]');if(b){counts[b.dataset.i]+=Number(b.dataset.step);draw();}},{signal});draw();
}

export function showTimetable(stage, signal) {
  const needs=[false,true,false,true],rooms=['Lecture','Lab','Lecture','Lab'];
  let mode='weekly';
  stage.innerHTML=`<div class="lab-top"><span class="sheet-caption">Sample class · Mon 09:00</span><div class="study-tabs"><button data-value="weekly">Weekly rooms</button><button data-value="fixed">Fixed room</button></div></div>
    <div class="lab-weeks">${needs.map((n,i)=>`<div><span>Week 0${i+1}</span><small>${n?'Lab required':'Lecture week'}</small><button data-week="${i}" aria-label="Change room for week ${i+1}"></button></div>`).join('')}</div>
    <div class="lab-metrics" role="status">${['Unmet labs','Extra lab weeks','Room changes'].map((label,i)=>`<div><output data-score="${i}"></output><span>${label}</span></div>`).join('')}</div>`;
  function draw(){
    buttons(stage.querySelector('.study-tabs'),mode);
    stage.querySelectorAll('[data-week]').forEach((b,i)=>{b.textContent=rooms[i]+' ⇄';b.dataset.room=rooms[i];b.setAttribute('aria-label','Week '+(i+1)+': '+rooms[i]+'. Change room');});
    const metrics=[rooms.filter((r,i)=>needs[i]&&r!=='Lab').length,rooms.filter((r,i)=>!needs[i]&&r==='Lab').length,rooms.slice(1).filter((r,i)=>r!==rooms[i]).length];
    stage.querySelectorAll('output').forEach((o,i)=>o.textContent=metrics[i]);
  }
  stage.addEventListener('click',e=>{
    const b=e.target.closest('button');if(!b)return;
    if(b.dataset.value){mode=b.dataset.value;if(mode==='fixed')rooms.fill(rooms[0]);}
    else if(b.hasAttribute('data-week')){const i=Number(b.dataset.week),room=rooms[i]==='Lab'?'Lecture':'Lab';if(mode==='fixed')rooms.fill(room);else rooms[i]=room;}
    draw();
  },{signal});draw();
}

export function textSimilarity(left,right){
  const words=s=>(s.toLowerCase().match(/[\p{L}\p{N}_]+/gu)||[]).filter(w=>w.length>1);
  const a=words(left),b=words(right);
  const frequencies=tokens=>{const counts=new Map();for(const word of tokens)counts.set(word,(counts.get(word)||0)+1);return counts;};
  const first=frequencies(a),second=frequencies(b);
  const vocabulary=new Set([...first.keys(),...second.keys()]);
  let dot=0,normA=0,normB=0;const shared=[];
  for(const word of vocabulary){
    const hits=Number(first.has(word))+Number(second.has(word));
    const idf=1+Math.log(3/(hits+1)),x=(first.get(word)||0)*idf,y=(second.get(word)||0)*idf;
    dot+=x*y;normA+=x*x;normB+=y*y;if(hits===2)shared.push(word);
  }
  return {score:normA&&normB?Math.min(1,dot/Math.sqrt(normA*normB)):0,shared};
}
export function showHeadlines(stage, signal) {
  const examples=[
    ['Orchid buys Pine Systems in a cash deal','Pine Systems agrees to cash deal with Orchid'],
    ['Orchid buys Pine Systems in a cash deal','City opens new riverside library on Friday']
  ];
  let example=0;
  stage.innerHTML=`<div class="news-comparison"><label>Headline A<textarea maxlength="320" rows="3"></textarea></label>
    <label>Headline B<textarea maxlength="320" rows="3"></textarea></label></div>
    <div class="similarity"><div><span class="sheet-caption">Cosine similarity</span><output aria-live="polite"></output></div>
    <div class="similarity-bar"><i></i></div><p class="shared-words"></p><button class="study-button" type="button">Switch example ↺</button></div>`;
  const [a,b]=stage.querySelectorAll('textarea');
  function draw(){const {score,shared}=textSimilarity(a.value,b.value);stage.querySelector('output').textContent=score.toFixed(2);stage.querySelector('.similarity-bar i').style.width=(score*100)+'%';
    stage.querySelector('.shared-words').textContent=shared.length?'Shared words · '+shared.slice(0,9).join(', '):'No shared words';}
  function sample(){[a.value,b.value]=examples[example];draw();}
  stage.addEventListener('input',draw,{signal});stage.querySelector('button').addEventListener('click',()=>{example=1-example;sample();},{signal});sample();
}

// Rounded classification_report outputs from the retained notebook cells for RF, CART and KNN.
const results=[
  {name:'Random forest',accuracy:.81,f1:.72,recall:.79},
  {name:'Decision tree',accuracy:.74,f1:.65,recall:.73},
  {name:'K-nearest neighbours',accuracy:.87,f1:.69,recall:.65}
];
export function showResults(stage, signal) {
  const metrics={accuracy:'Accuracy',f1:'Macro F1',recall:'Macro recall'};
  stage.innerHTML=`<div class="chart-top"><span class="sheet-caption">Notebook output · 231 cases</span><div class="study-tabs">${Object.entries(metrics).map(([k,n])=>`<button data-value="${k}">${safe(n)}</button>`).join('')}</div></div>
    <div class="score-chart" role="group" aria-label="Comparison of three models">${results.map(row=>`<div class="chart-row"><span>${row.name}</span><div class="bar-track"><i></i></div><output></output></div>`).join('')}<div class="chart-axis"><span>0</span><span>0.5</span><span>1.0</span></div></div><p class="study-result" role="status"></p>`;
  function draw(metric){
    buttons(stage.querySelector('.study-tabs'),metric);
    stage.querySelectorAll('.chart-row').forEach((line,i)=>{const v=results[i][metric];line.querySelector('i').style.width=(v*100)+'%';line.querySelector('output').textContent=v.toFixed(2);});
    const best=results.reduce((a,b)=>a[metric]>b[metric]?a:b);
    stage.querySelector('.study-result').textContent=best.name+' has the highest '+metrics[metric].toLowerCase()+' in this recorded run.';
  }
  stage.querySelector('.study-tabs').addEventListener('click',e=>{const b=e.target.closest('button');if(b)draw(b.dataset.value);},{signal});draw('accuracy');
}
