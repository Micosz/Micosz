// A rotating, folded ribbon made of points. Drag to turn the sculpture.
function startArt(canvas) {
  const ctx=canvas.getContext('2d'); if(!ctx)return ()=>{};
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  let drag=null, yaw=.45, progress=0;
  canvas.onpointerdown=e=>{drag=e.clientX;canvas.setPointerCapture(e.pointerId)};
  canvas.onpointermove=e=>{if(drag!==null){yaw+=(e.clientX-drag)*.008;drag=e.clientX;draw(progress);}};
  canvas.onpointerup=canvas.onpointercancel=()=>drag=null;
  const points=[];
  for(let a=0;a<170;a++)for(let b=0;b<27;b++){
    const u=a*Math.PI*2/170,v=b*Math.PI*2/27,t=.36*Math.cos(v)+1.02;
    points.push([t*Math.cos(u),t*Math.sin(u),.36*Math.sin(v)+.53*Math.sin(3*u),a,b]);
  }
  function draw(value){
    progress=value;
    const w=canvas.clientWidth,h=canvas.clientHeight,d=Math.min(devicePixelRatio,2);
    if(canvas.width!==Math.round(w*d)||canvas.height!==Math.round(h*d)){canvas.width=Math.round(w*d);canvas.height=Math.round(h*d);}
    ctx.setTransform(d,0,0,d,0,0);ctx.clearRect(0,0,w,h);
    const phase=reduced.matches?0:progress;
    const angle=yaw+phase*Math.PI*1.32;
    const scale=Math.min(w*.30,h*.36)*(1+.33*phase),ca=Math.cos(angle),sa=Math.sin(angle);
    for(const [x,y,z,a,b] of points){
      const X=x*ca-y*sa,Y=x*sa+y*ca,Z=.80*Y+.60*z;
      const px=w*.51+scale*(X*.94+(.56*Y-.83*z)*.31), py=h*.51+scale*(-X*.31+(.56*Y-.83*z)*.94);
      ctx.fillStyle=a<24?'#ffe1aa':b<5?'#fc9bde':'#b095ff';ctx.globalAlpha=Math.max(.13,Math.min(1,.5+Z*.33));const r=1+Math.max(0,Z)*.7;ctx.fillRect(px,py,r,r);
    }ctx.globalAlpha=1;
  }
  return draw;
}
