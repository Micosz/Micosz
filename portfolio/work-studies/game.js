const map=[
  '.......',
  '.S.B#..',
  '.##....',
  '....#B.',
  '.#.....',
  '..B.##.',
  '.......'
];
const directions={up:[0,-1],down:[0,1],left:[-1,0],right:[1,0]};
const keys={ArrowUp:'up',w:'up',ArrowLeft:'left',a:'left',ArrowDown:'down',s:'down',ArrowRight:'right',d:'right'};

export function showClearing(stage,signal){
  stage.innerHTML=`<div class="game-top"><span class="sheet-caption">Berry clearing</span><button class="study-button" type="button" data-pause aria-pressed="false">Pause</button></div>
    <canvas class="clearing" width="820" height="405" tabindex="0" role="group" aria-label="Berry clearing. Move using arrow keys or W A S D, or the buttons below."></canvas>
    <div class="game-bottom"><p class="study-result" role="status"></p><div class="game-pad" aria-label="Move character">
      <button data-dir="left" aria-label="Move left">←</button><button data-dir="up" aria-label="Move up">↑</button><button data-dir="down" aria-label="Move down">↓</button><button data-dir="right" aria-label="Move right">→</button></div></div>`;
  const canvas=stage.querySelector('canvas'),ctx=canvas.getContext('2d'),status=stage.querySelector('[role="status"]');
  const pause=stage.querySelector('[data-pause]'),reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const berries=new Set();let player={x:1,y:1},initial=0,paused=false,frame=0,pose={...player},bump=0;
  for(let y=0;y<map.length;y++)for(let x=0;x<map[y].length;x++)if(map[y][x]==='B')berries.add(x+','+y);
  initial=berries.size;
  const summary=message=>{status.textContent=(initial-berries.size)+' / '+initial+' blueberries'+(message?' · '+message:'');};
  const position=(x,y)=>[410+(x-y)*43,45+(x+y)*23];
  function poly(points,fill){ctx.beginPath();points.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.closePath();ctx.fillStyle=fill;ctx.fill();}
  function ellipse(x,y,rx,ry,color){ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2);ctx.fillStyle=color;ctx.fill();}
  function avatar(x,y){
    ellipse(x,y+4,13,6,'#5b5e5a66');y-=bump;
    ellipse(x-5,y,4,4,'#292c41');ellipse(x+5,y,4,4,'#292c41');
    poly([[x-10,y-3],[x-7,y-21],[x+6,y-22],[x+11,y-4]],'#6b549a');
    ellipse(x,y-25,9,10,'#eed8ac');poly([[x-12,y-28],[x+10,y-29],[x+5,y-40],[x-2,y-38]],'#443852');
    ellipse(x+4,y-25,1.5,1.5,'#322a43');
  }
  function draw(){
    if(!ctx)return;ctx.clearRect(0,0,820,405);
    for(let y=0;y<7;y++)for(let x=0;x<7;x++){
      const [u,v]=position(x,y);
      if(y===6)poly([[u-43,v],[u,v+23],[u,v+35],[u-43,v+12]],'#9da88c');
      if(x===6)poly([[u+43,v],[u,v+23],[u,v+35],[u+43,v+12]],'#6f806c');
      poly([[u,v-23],[u+43,v],[u,v+23],[u-43,v]],['#d3dbbc','#e1e4c8','#c4d0ad'][(x*7+y*5+x*y)%3]);
      if((x+y)%2===0){ctx.strokeStyle='#8e9f7e';ctx.lineWidth=1.3;ctx.beginPath();ctx.moveTo(u-12,v+4);ctx.lineTo(u-15,v-3);ctx.moveTo(u-12,v+4);ctx.lineTo(u-9,v-1);ctx.stroke();}
    }
    // Depth ordering puts the walker behind a stone or plant as it crosses a tile.
    const objects=[];
    for(let y=0;y<7;y++)for(let x=0;x<7;x++){
      const [u,v]=position(x,y);
      if(map[y][x]==='#')objects.push({z:x+y,draw:()=>{
        ellipse(u+2,v+4,20,7,'#55625144');
        poly([[u-17,v],[u-11,v-17],[u+3,v-24],[u+17,v-7],[u+14,v+2],[u,v+6]],'#8882a1');
        poly([[u-11,v-17],[u+3,v-24],[u+10,v-13],[u-3,v-7]],'#b9b0c4');
      }});
      if(berries.has(x+','+y))objects.push({z:x+y,draw:()=>{
        ellipse(u,v+4,12,4,'#7f916a66');poly([[u,v-6],[u-10,v-23],[u-1,v-18],[u+5,v-27],[u+7,v-15]],'#546953');
        for(const [dx,dy] of [[-5,-9],[5,-8],[0,-15]]){ellipse(u+dx,v+dy,6,6,'#524b82');ellipse(u+dx-1,v+dy-2,1.5,1.5,'#c0b8e1');}
      }});
    }
    objects.push({z:pose.x+pose.y+.1,draw:()=>avatar(...position(pose.x,pose.y))});objects.sort((a,b)=>a.z-b.z).forEach(item=>item.draw());
  }
  function move(direction){
    if(paused||!berries.size)return;const [dx,dy]=directions[direction],x=player.x+dx,y=player.y+dy;
    if(!map[y]?.[x]||map[y][x]==='#'){summary('Path blocked');return;}
    cancelAnimationFrame(frame);const from={...pose};player={x,y};
    const collected=berries.delete(x+','+y);
    summary(!berries.size?'Clearing complete':collected?'Blueberry collected':'');
    if(reduced.matches){pose={...player};bump=0;draw();return;}
    const start=performance.now();
    const step=now=>{const t=Math.min(1,(now-start)/150);pose={x:from.x+(x-from.x)*t,y:from.y+(y-from.y)*t};bump=Math.sin(t*Math.PI)*4;draw();if(t<1)frame=requestAnimationFrame(step);};
    frame=requestAnimationFrame(step);
  }
  stage.querySelector('.game-pad').addEventListener('click',e=>{const b=e.target.closest('button');if(b)move(b.dataset.dir);},{signal});
  canvas.addEventListener('keydown',e=>{const direction=keys[e.key];if(direction&&!e.altKey&&!e.ctrlKey&&!e.metaKey){e.preventDefault();move(direction);}},{signal});
  pause.addEventListener('click',()=>{paused=!paused;pause.textContent=paused?'Resume':'Pause';pause.setAttribute('aria-pressed',String(paused));summary(paused?'Paused':'');},{signal});
  signal.addEventListener('abort',()=>cancelAnimationFrame(frame),{once:true});
  draw();summary('Collect three blueberries');
}
