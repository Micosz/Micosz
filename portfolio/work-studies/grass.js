import * as THREE from '../assets/vendor/three/three.module.js';

const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
function generator(seed){
  return ()=>{seed=(1664525*seed+1013904223)>>>0;return seed/4294967296;};
}
function buildStalk(random, palette, geometries, materials) {
  const stalk=new THREE.Group(),height=1.7+random()*1.45,lean=.1+random()*.75,bend=(random()-.5)*.32;
  const point=t=>new THREE.Vector3(lean*t*t+bend*Math.sin(t*Math.PI),height*t,.12*Math.sin(t*3));
  const curve=new THREE.CatmullRomCurve3(Array.from({length:8},(_,i)=>point(i/7)));
  const stem=new THREE.Mesh(new THREE.TubeGeometry(curve,20,.011,5,false),materials.stems[palette]);
  geometries.push(stem.geometry);stalk.add(stem);
  // A folded, tapered blade catches light on its central ridge.
  for(let j=0;j<3;j++){
    const t=.13+j*.18+random()*.07,base=point(t),direction=(j%2?1:-1),positions=[];
    const leafPoint=(u,side)=>new THREE.Vector3(base.x+direction*(.21*u+.48*u*u),base.y+.66*u-.28*u*u,base.z+.18*u+side*.055*Math.sin(Math.PI*u));
    for(let k=0;k<9;k++){
      const a=k/9,b=(k+1)/9;
      for(const side of [-1,1]){
        const a0=leafPoint(a,0),b0=leafPoint(b,0),a1=leafPoint(a,side),b1=leafPoint(b,side);
        a0.y+=.036*Math.sin(Math.PI*a);b0.y+=.036*Math.sin(Math.PI*b);
        for(const v of [a0,b0,a1,a1,b0,b1])positions.push(v.x,v.y,v.z);
      }
    }
    const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));geo.computeVertexNormals();geometries.push(geo);stalk.add(new THREE.Mesh(geo,materials.leaves[palette]));
  }
  const grains=[],lines=[],dummy=new THREE.Object3D(),axis=new THREE.Vector3(0,1,0);
  function line(a,b){lines.push(a.x,a.y,a.z,b.x,b.y,b.z);}
  const levels=13+Math.floor(random()*5),phase=random()*6.28;
  for(let i=0;i<levels;i++){
    const q=i/(levels-1),root=point(.64+.35*q);
    for(let j=0;j<3;j++){
      const angle=i*2.4+j*2.094+phase,spread=(1-q*.81)*(.16+random()*.085),radial=new THREE.Vector3(Math.cos(angle),0,Math.sin(angle));
      const branch=root.clone().addScaledVector(radial,spread*.78);branch.y+=.085+q*.028;line(root,branch);
      for(let k=0;k<2;k++){
        const dir=radial.clone().add(new THREE.Vector3(.19,1.4+k*.48,0)).normalize();
        const end=branch.clone().addScaledVector(dir,.08+k*.018);end.x+=k*.017;
        const center=branch.clone().lerp(end,.62);grains.push({center,dir,size:.68+random()*.43});
        const awn=end.clone().addScaledVector(dir,.18+random()*.14);awn.x+=.035;line(end,awn);
      }
    }
  }
  const mesh=new THREE.InstancedMesh(materials.grainShape,materials.seeds[palette],grains.length);
  grains.forEach(({center,dir,size},i)=>{dummy.position.copy(center);dummy.quaternion.setFromUnitVectors(axis,dir);dummy.scale.set(.021*size,.073*size,.024*size);dummy.updateMatrix();mesh.setMatrixAt(i,dummy.matrix);});stalk.add(mesh);
  const hairs=new THREE.BufferGeometry();hairs.setAttribute('position',new THREE.Float32BufferAttribute(lines,3));geometries.push(hairs);stalk.add(new THREE.LineSegments(hairs,materials.awns[palette]));
  return stalk;
}
export function mountGrass(field,signal){
  const host=field.querySelector('.grass-view'),button=field.querySelector('.grass-wind'),pref=matchMedia('(prefers-reduced-motion: reduce)');
  const renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'});
  renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.6));renderer.setClearColor(0x191b20,0);renderer.outputColorSpace=THREE.SRGBColorSpace;
  const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(32,1,.1,30),arrangement=new THREE.Group();
  camera.position.set(.1,1.6,7.35);camera.lookAt(0,1.53,0);scene.add(arrangement);
  const hemi=new THREE.HemisphereLight(0xfff1d8,0x676187,1.65),sun=new THREE.DirectionalLight(0xffe6bd,2.05),rim=new THREE.DirectionalLight(0xc9aeff,2.1);
  sun.position.set(-3,4,3);rim.position.set(3,3,-2);scene.add(hemi,sun,rim);
  const matte=(color,side=THREE.FrontSide)=>new THREE.MeshStandardMaterial({color,roughness:.83,side});
  const materials={
    grainShape:new THREE.SphereGeometry(1,6,4),
    stems:[0x8a9978,0x707d6f,0x927775].map(c=>matte(c)),
    leaves:[0x7e956c,0x5b776f,0x977782].map(c=>matte(c,THREE.DoubleSide)),
    seeds:[0xd3c18c,0xc5b2d7,0xb58d93].map(c=>matte(c)),
    awns:[0xe1c69a,0xcbb8e4,0xc2a9a1].map(c=>new THREE.LineBasicMaterial({color:c,transparent:true,opacity:.61}))
  };
  const random=generator(273119),geometries=[],stalks=[];
  for(let i=0;i<19;i++){
    const stalk=buildStalk(random,i%3,geometries,materials);
    stalk.position.set((i%7-3)*.43+(random()-.5)*.36,-.18-random()*.34,(Math.floor(i/7)-1)*.56+(random()-.5)*.27);
    stalk.userData.rest=(random()-.42)*.55;stalk.userData.phase=random()*6.28;stalks.push(stalk);arrangement.add(stalk);
  }
  host.append(renderer.domElement);renderer.domElement.setAttribute('aria-hidden','true');
  let yaw=-.17,trav=0,wind=2,frame=0,prev=0,visible=true,paused=pref.matches,drag=null,disposed=false,contextLost=false;
  function paint(){
    arrangement.rotation.y=yaw+trav*.19;
    stalks.forEach((s,i)=>{s.rotation.z=s.userData.rest+Math.sin(wind*.86+s.userData.phase)*.036+Math.sin(wind*.37+i*.34)*.022;s.rotation.x=Math.sin(wind*.54+i)*.023;});
    renderer.render(scene,camera);host.dataset.drawn='true';
  }
  function loop(now){frame=0;if(disposed||contextLost||!visible||document.hidden)return;if(prev&&!paused)wind+=(Math.min(now-prev,64))/1000;prev=now;paint();if(!paused)frame=requestAnimationFrame(loop);}
  function schedule(){if(!disposed&&!contextLost&&!frame&&visible&&!document.hidden)frame=requestAnimationFrame(loop);}
  function sync(){button.setAttribute('aria-pressed',String(paused));button.textContent=paused?'Play wind':'Pause wind';prev=0;schedule();}
  function resize(){const {width,height}=host.getBoundingClientRect();if(width<1||height<1)return;
    renderer.setSize(width,height,false);camera.aspect=width/height;camera.position.z=Math.max(7.35,6.6/camera.aspect);camera.updateProjectionMatrix();schedule();}
  const resizeObserver=new ResizeObserver(resize);resizeObserver.observe(host);
  const intersection=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;prev=0;if(visible)schedule();else{cancelAnimationFrame(frame);frame=0;}});intersection.observe(host);
  button.addEventListener('click',()=>{paused=!paused;sync();},{signal});
  pref.addEventListener('change',()=>{paused=pref.matches;sync();},{signal});
  host.addEventListener('pointerdown',e=>{if(!e.isPrimary)return;drag={x:e.clientX,angle:yaw};host.setPointerCapture(e.pointerId);},{signal});
  host.addEventListener('pointermove',e=>{if(drag){yaw=drag.angle+(e.clientX-drag.x)*.009;schedule();}},{signal});
  host.addEventListener('lostpointercapture',()=>{drag=null;},{signal});
  host.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight'].includes(e.key))return;e.preventDefault();yaw+=(e.key==='ArrowRight'?1:-1)*.18;schedule();},{signal});
  window.addEventListener('scroll',()=>{if(!visible||pref.matches)return;trav=clamp(-field.getBoundingClientRect().top/Math.max(field.offsetHeight,1),0,1);schedule();},{signal,passive:true});
  document.addEventListener('visibilitychange',()=>{prev=0;schedule();},{signal});
  const lost = event => {
    event.preventDefault();
    contextLost = true;
    cancelAnimationFrame(frame);
    host.removeAttribute('data-drawn');
    host.removeAttribute('tabindex');
    host.setAttribute('role', 'img');
    host.setAttribute('aria-label', 'Wildgrass in the wind');
    renderer.domElement.hidden = true;
    button.hidden = true;
    field.querySelector('figcaption span').textContent = 'Wildgrass';
  };
  renderer.domElement.addEventListener('webglcontextlost',lost,{signal});
  signal.addEventListener('abort',()=>{disposed=true;cancelAnimationFrame(frame);intersection.disconnect();resizeObserver.disconnect();geometries.forEach(g=>g.dispose());materials.grainShape.dispose();for(const key of ['stems','leaves','seeds','awns'])materials[key].forEach(m=>m.dispose());stalks.forEach(stalk=>stalk.traverse(obj=>{if(obj.isInstancedMesh)obj.dispose();}));renderer.dispose();renderer.forceContextLoss();renderer.domElement.remove();},{once:true});
  resize();sync();
}
