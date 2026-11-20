import { option, buttons } from './ui.js';

const drawings = {
  1: {width:1217, height:742, file:'floor-1.svg'},
  2: {width:1152, height:766, file:'floor-2.svg'}
};
const asset = name => new URL('../assets/work/lc3/' + name, import.meta.url).href;
const distance = (a,b) => Math.hypot(a.x - b.x, a.y - b.y);

// The LC3 frontend uses undirected A* with a 200-unit floor-change penalty.
export function routeBetween(graph, start, end) {
  const nodes = new Map(graph.nodes.map(n => [n.id, n]));
  if (!nodes.has(start) || !nodes.has(end)) return [];
  const neighbours = new Map(graph.nodes.map(n => [n.id, []]));
  for (const edge of graph.edges) {
    const a = nodes.get(edge.from), b = nodes.get(edge.to);
    if (!a || !b) continue;
    const weight = (edge.weight || distance(a,b)) + (a.floor === b.floor ? 0 : 200);
    neighbours.get(a.id).push([b, weight]);
    neighbours.get(b.id).push([a, weight]);
  }
  const costs = new Map([[start, 0]]), parent = new Map(), open = new Map([[start, 0]]);
  while (open.size) {
    let best = null, lowest = Infinity;
    for (const [id, priority] of open) {
      if (priority < lowest) { best = id; lowest = priority; }
    }
    open.delete(best);
    if (best === end) {
      const path = [];
      for (let id = end; id !== undefined; id = parent.get(id)) path.push(nodes.get(id));
      return path.reverse();
    }
    for (const [next, weight] of neighbours.get(best)) {
      const cost = costs.get(best) + weight;
      if (cost >= (costs.get(next.id) ?? Infinity)) continue;
      costs.set(next.id, cost);
      parent.set(next.id, best);
      open.set(next.id, cost + distance(next, nodes.get(end)));
    }
  }
  return [];
}

export async function showIndoorMap(stage, signal) {
  stage.innerHTML = '<p class="study-loading">Loading the LC3 floor plans…</p>';
  const response = await fetch(asset('graph.json'), {signal});
  if (!response.ok) throw Error('LC3 graph unavailable');
  const graph = await response.json();
  if (signal.aborted) return;
  const rooms = graph.nodes.filter(n => n.type === 'room' && drawings[n.floor])
    .sort((a,b) => a.floor-b.floor || String(a.name).localeCompare(String(b.name),'en',{numeric:true}));
  const linked = new Set(graph.edges.flatMap(edge => [edge.from, edge.to]));
  const roomOption = room => option(room.id, 'Room ' + room.name + ' · F' + room.floor);
  const missingPaths = rooms.filter(room => !linked.has(room.id));
  const options = rooms.filter(room => linked.has(room.id)).map(roomOption).join('') +
    (missingPaths.length ? '<optgroup disabled label="No route recorded in the floor plan">' +
      missingPaths.map(roomOption).join('') + '</optgroup>' : '');
  stage.innerHTML = `<div class="route-controls"><label>From<select data-from>${options}</select></label>
    <button class="route-swap" type="button" aria-label="Swap origin and destination">⇄</button>
    <label>To<select data-to>${options}</select></label></div>
    <div class="route-sheet"><div class="route-toolbar"><span class="sheet-caption">LC3 / Floor plan</span><div class="study-tabs floor-tabs" aria-label="Map view"><button data-value="1">F1</button><button data-value="2">F2</button><button data-value="layers">3D layers</button></div></div>
      <div class="map-print"><img alt=""><canvas aria-hidden="true"></canvas></div>
      <div class="map-layers" hidden><div class="map-volume">${[1,2].map(level=>`<div class="map-plane level-${level}"><img data-level="${level}" alt="LC3 floor ${level}"><canvas width="${drawings[level].width}" height="${drawings[level].height}" aria-hidden="true"></canvas><span>F${level}</span></div>`).join('')}</div>
        <label>Turn layers <input type="range" min="-32" max="32" value="-16" aria-label="Turn layers"></label></div>
      <div class="route-stats"><span class="route-legend"><i></i> Your route</span><span data-count></span></div></div>
    <p class="study-result" data-directions role="status"></p>`;
  const q = selector => stage.querySelector(selector);
  const from = q('[data-from]'), to = q('[data-to]'), sheet = q('.map-print');
  const picture = q('img'), canvas = q('canvas'), ctx = canvas.getContext('2d');
  const pref = matchMedia('(prefers-reduced-motion: reduce)');
  from.value = 'LC3_111'; to.value = 'LC3_F2_204';
  let path = [], floor = 1, animation = 0;
  function paint(progress, target=ctx, layer=floor) {
    if (!target) return;
    const ctx=target;
    ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);
    const segments = [];
    for (let i=1; i<path.length; i++) {
      const a=path[i-1], b=path[i];
      if (a.floor===layer && b.floor===layer) segments.push([a,b,distance(a,b)]);
    }
    let remaining = segments.reduce((sum, seg) => sum + seg[2], 0) * progress;
    ctx.lineCap='round'; ctx.lineJoin='round';
    for (const [a,b,length] of segments) {
      if (remaining <= 0) break;
      const fraction = length ? Math.min(1, remaining/length) : 1;
      ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(a.x+(b.x-a.x)*fraction,a.y+(b.y-a.y)*fraction);
      ctx.lineWidth=12;ctx.strokeStyle='#f8f4e5';ctx.stroke();
      ctx.lineWidth=7;ctx.strokeStyle='#714dd8';ctx.stroke();
      remaining-=length;
    }
    const marker = (n,label) => {
      if (!n || n.floor!==layer) return;
      ctx.beginPath();ctx.arc(n.x,n.y,16,0,2*Math.PI);ctx.fillStyle='#29203a';ctx.fill();
      ctx.lineWidth=3;ctx.strokeStyle='#fbf5db';ctx.stroke();
      ctx.fillStyle='#fff';ctx.font='bold 17px system-ui';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(label,n.x,n.y);
    };
    for(let i=1;i<path.length;i++) if(path[i-1].floor!==path[i].floor){marker(path[i-1],'↕');marker(path[i],'↕');}
    marker(path[0],'A');if(path.length>1)marker(path.at(-1),'B');
  }
  function drawFloor(value) {
    cancelAnimationFrame(animation);
    const layered=value==='layers',layers=q('.map-layers');
    layers.hidden=!layered;sheet.hidden=layered;buttons(q('.floor-tabs'),value);
    if(layered){
      layers.querySelectorAll('.map-plane').forEach((plane,i)=>{
        const level=i+1,img=plane.querySelector('img');if(!img.hasAttribute('src'))img.src=asset(drawings[level].file);
        paint(1,plane.querySelector('canvas').getContext('2d'),level);
      });
      return;
    }
    floor=Number(value);
    const d=drawings[floor];sheet.style.aspectRatio=d.width+' / '+d.height;
    picture.src=asset(d.file);picture.alt='Original floor plan of LC3, floor '+floor;
    canvas.width=d.width;canvas.height=d.height;
    if(pref.matches || path.length<2){paint(1);return;}
    const start=performance.now();
    function frame(now){const p=Math.min(1,(now-start)/760);paint(p);if(p<1)animation=requestAnimationFrame(frame);}
    animation=requestAnimationFrame(frame);
  }
  function trace() {
    path=routeBetween(graph,from.value,to.value);
    const changes=path.slice(1).filter((n,i)=>n.floor!==path[i].floor).length;
    q('[data-count]').textContent=path.length ? path.length+' waypoints' : '';
    q('[data-directions]').textContent=!path.length?'These rooms have no connected route in the source graph.':path.length===1?'You are already at room '+path[0].name+'.':
      'Room '+path[0].name+' → '+(changes?'change floor '+(changes===1?'once':changes+' times')+' → ':'')+'Room '+path.at(-1).name+'.';
    const startFloor = path[0]?.floor ?? rooms.find(room => room.id === from.value)?.floor ?? 1;
    drawFloor(q('.map-layers').hidden ? startFloor : 'layers');
  }
  from.addEventListener('change',trace,{signal});to.addEventListener('change',trace,{signal});
  q('.route-swap').addEventListener('click',()=>{const old=from.value;from.value=to.value;to.value=old;trace();},{signal});
  q('.floor-tabs').addEventListener('click',e=>{const b=e.target.closest('button');if(b)drawFloor(b.dataset.value);},{signal});
  q('.map-layers input').addEventListener('input',e=>q('.map-volume').style.setProperty('--turn',e.target.value+'deg'),{signal});
  pref.addEventListener('change',()=>drawFloor(q('.map-layers').hidden?floor:'layers'),{signal});
  signal.addEventListener('abort',()=>cancelAnimationFrame(animation),{once:true});trace();
}
