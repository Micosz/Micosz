import * as THREE from './assets/vendor/three/three.module.js';
import {mergeGeometries} from './assets/vendor/three/BufferGeometryUtils.js';

const paint = (color, roughness=.65, metalness=0) =>
 new THREE.MeshStandardMaterial({color, roughness, metalness});

// Closed rounded rectangles at successive depths describe a moulded case, its
// parting line, or a recessed bezel. Their winding faces the viewer at +Z.
function contour(width,height,radius,segments=5){
 const corners=[[1,-1,-Math.PI/2],[1,1,0],[-1,1,Math.PI/2],[-1,-1,Math.PI]];
 return corners.flatMap(([sx,sy,start])=>Array.from({length:segments+1},(_,i)=>{
  const a=start+(i/segments)*Math.PI/2;
  return [sx*(width/2-radius)+Math.cos(a)*radius,sy*(height/2-radius)+Math.sin(a)*radius];
 }));
}
function profile(sections,cap=true,segments=5){
 const vertices=[],indices=[],count=(segments+1)*4;
 for(const [w,h,z,r,dy=0] of sections){
  for(const [x,y] of contour(w,h,r,segments)) vertices.push(x,y+dy,z);
 }
 for(let j=1;j<sections.length;j++){
  for(let i=0;i<count;i++){
   const k=(i+1)%count,a=(j-1)*count,b=j*count;
   indices.push(a+i,a+k,b+k,a+i,b+k,b+i);
  }
 }
 if(cap){
  for(const front of [false,true]){
   const ring=front?sections.length-1:0,start=vertices.length/3,offset=ring*count*3;
   vertices.push(...vertices.slice(offset,offset+count*3));
   for(let i=1;i<count-1;i++){
    if(front)indices.push(start,start+i,start+i+1);
    else indices.push(start,start+i+1,start+i);
   }
  }
 }
 const geometry=new THREE.BufferGeometry();
 geometry.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));
 geometry.setIndex(indices);geometry.computeVertexNormals();
 return geometry;
}
function casePart(w,h,d,r=.025,bevel=.012,segments=4){
 const b=Math.min(bevel,d*.4,r*.8),z=d/2;
 return profile([[w-2*b,h-2*b,-z,r-b],[w,h,-z+b,r],[w,h,z-b,r],[w-2*b,h-2*b,z,r-b]],true,segments);
}
function part(parent,geometry,material,x,y,z){
 const mesh=new THREE.Mesh(geometry,material);
 mesh.position.set(x,y,z);parent.add(mesh);return mesh;
}
function block(parent,material,x,y,z,w,h,d,r,b){
 return part(parent,casePart(w,h,d,r,b),material,x,y,z);
}
function cable(parent,material,points,radius){
 const curve=new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p)));
 part(parent,new THREE.TubeGeometry(curve,36,radius,6,false),material,0,0,0);
}
function screenMaterial(texture){
 const material=new THREE.MeshBasicMaterial({map:texture,toneMapped:false});
 texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=4;
 return material;
}
function glass(parent,texture){
 const w=1.72,h=1.25,sections=[];
 for(const scale of [1,.92,.78,.61,.43,.22,.02]){
  sections.push([w*scale,h*scale,.074*(1-scale*scale),.14*scale]);
 }
 const geometry=profile(sections,true,9),pos=geometry.getAttribute('position'),uv=[];
 for(let i=0;i<pos.count;i++)uv.push(.5+pos.getX(i)/w,.5+pos.getY(i)/h);
 geometry.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));
 const material=screenMaterial(texture);
 // A soft studio strip catches the curved tube as it turns. The phosphor
 // image retains its own luminance even when the case rotates out of the key.
 material.onBeforeCompile=shader=>{
  shader.vertexShader='varying vec3 glassNormal; varying vec3 glassView;\n'+shader.vertexShader;
  shader.vertexShader=shader.vertexShader.replace('#include <project_vertex>',`
   #include <project_vertex>
   glassNormal=normalize(normalMatrix*normal);glassView=-mvPosition.xyz;
  `);
  shader.fragmentShader='varying vec3 glassNormal; varying vec3 glassView;\n'+shader.fragmentShader;
  shader.fragmentShader=shader.fragmentShader.replace('#include <map_fragment>',`
   #include <map_fragment>
   vec3 n=normalize(glassNormal),v=normalize(glassView),r=reflect(-v,n);
   float edge=pow(1.0-max(dot(n,v),0.0),2.0);
   float strip=exp(-pow((r.x+.57)/.19,2.0)-pow((r.y-.45)/.65,2.0));
   diffuseColor.rgb+=vec3(.37,.50,.46)*(.065*strip+.17*edge);
  `);
 };
 return part(parent,geometry,material,0,1.83,.597);
}
// Consolidate the repeating vents, keycaps and case parts by finish. They are
// static relative to one another and rotate on the single study-journey pivot.
function batch(model){
 model.updateMatrixWorld(true);
 const groups=new Map(),result=new THREE.Group(),originals=new Set();
 model.traverse(o=>{
  if(!o.isMesh)return;
  const g=o.geometry.clone().applyMatrix4(o.matrixWorld);
  if(!o.material.map)g.deleteAttribute('uv');
  if(!g.index)g.setIndex(Array.from({length:g.getAttribute('position').count},(_,i)=>i));
  const list=groups.get(o.material)||[];list.push(g);groups.set(o.material,list);originals.add(o.geometry);
 });
 for(const [material,geometries] of groups){
  const joined=geometries.length===1?geometries[0]:mergeGeometries(geometries);
  result.add(new THREE.Mesh(joined,material));
  if(geometries.length>1)geometries.forEach(g=>g.dispose());
 }
 originals.forEach(g=>g.dispose());
 return result;
}
function keyboard(model,mat){
 const board=new THREE.Group();model.add(board);board.position.set(-.12,.108,1.23);board.rotation.x=.10;
 block(board,mat.seam,0,0,0,2.28,.115,.72,.065,.026);
 block(board,mat.cream,0,.037,0,2.30,.119,.74,.065,.026);
 block(board,mat.keywell,0,.099,-.008,2.16,.015,.589,.006,.002);
 const ink=document.createElement('canvas');ink.width=1024;ink.height=300;
 const ctx=ink.getContext('2d');ctx.font='bold 13px monospace';ctx.fillStyle='#474438';ctx.textBaseline='middle';
 const step=.111,rows=['1234567890-=','QWERTYUIOP[]',"ASDFGHJKL;'","ZXCVBNM,./"];
 const caps=new Map();
 function key(x,z,span,label,color=mat.key){
  const w=span*step-.014,capKey=w.toFixed(3);
  if(!caps.has(capKey)){
   const g=profile([[w,.096,-.025,.010],[w-.014,.090,.014,.009],[w-.026,.078,.029,.007]],true,2);
   g.rotateX(-Math.PI/2);caps.set(capKey,g);
  }
  part(board,caps.get(capKey),color,x,.129,z);
  if(label)ctx.fillText(label,((x+1.15-w*.33)/2.30)*1024,((z+.37)/.74)*300);
 }
 rows.forEach((letters,row)=>{
  let start=-1.036;
  const lead=[1,1.33,1.55,1.88][row],leadText=['ESC','TAB','CTL','SHF'][row];
  const z=-.218+row*.108;
  key(start+lead*step/2,z,lead,leadText,row?mat.mod:mat.red);start+=lead*step;
  for(const label of letters){key(start+step/2,z,1,label);start+=step;}
  const tail=(.635-start)/step;
  if(tail>.85)key(start+tail*step/2,z,tail,row===2?'RET':'',mat.mod);
 });
 key(-.913,.214,1.9,'ALT',mat.mod);key(-.31,.214,8.65,'');key(.355,.214,2.8,'',mat.mod);
 const pad=['   ','789','456','123','0. '];
 pad.forEach((labels,row)=>[...labels].forEach((label,col)=>{
  key(.738+col*step,-.218+row*.108,1,label,row===0?mat.mod:mat.key);
 }));
 const marks=new THREE.CanvasTexture(ink);marks.colorSpace=THREE.SRGBColorSpace;marks.anisotropy=4;
 const legend=part(board,new THREE.PlaneGeometry(2.30,.74),new THREE.MeshBasicMaterial({map:marks,transparent:true,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-1}),0,.159,0);
 legend.rotation.x=-Math.PI/2;
}
function makeCRT(source,texture){
 const model=new THREE.Group();
 const mat={
  cream:paint('#c4b99b'),edge:paint('#aea185'),shadow:paint('#766e5d'),seam:paint('#635f53'),
  keywell:paint('#6b695b'),key:paint('#d2cbb3'),mod:paint('#a59f87'),red:paint('#ab5340'),
  rubber:paint('#3d403a'),dark:paint('#282e2b'),metal:paint('#817f72',.4,.32),
  badge:paint('#b48b58'),green:new THREE.MeshBasicMaterial({color:'#b6f185'}),cord:paint('#706f60')};
 // Retain the swivel pedestal of Robert Schlyter's original Simple computer.
 const donor=source.getObjectByName('group2115554823');
 if(donor){
  const stand=donor.clone();stand.geometry=donor.geometry.clone();stand.geometry.center();
  const bounds=new THREE.Box3().setFromObject(stand),s=bounds.getSize(new THREE.Vector3());
  stand.scale.set(1.1/s.x,.22/s.y,.77/s.z);stand.position.set(0,.765,-.08);
  stand.material=mat.shadow;model.add(stand);
 }
 block(model,mat.rubber,0,.063,-.035,2.28,.115,1.34,.052,.018);
 block(model,mat.shadow,0,.343,-.054,2.53,.51,1.58,.072,.028);
 block(model,mat.cream,0,.387,-.045,2.55,.47,1.60,.075,.028);
 block(model,mat.edge,0,.633,-.04,2.55,.052,1.59,.023,.009);
 // The side profile narrows sharply behind the bezel to house the picture tube.
 part(model,profile([[1.10,1.07,-.99,.16,.02],[1.23,1.16,-.94,.16,.03],[1.77,1.46,-.67,.16,.02],[2.08,1.67,-.17,.15],[2.09,1.68,.28,.15]]),mat.edge,0,1.74,0);
 part(model,profile([[2.09,1.68,.267,.15],[2.12,1.71,.304,.15]]),mat.seam,0,1.74,0);
 part(model,profile([[2.13,1.72,.30,.15],[2.15,1.74,.36,.15],[2.15,1.74,.49,.15],[2.12,1.71,.59,.14],[2.06,1.65,.616,.13],[2.04,1.63,.616,.13],[1.86,1.39,.616,.16,.09],[1.84,1.37,.616,.16,.09],[1.78,1.31,.565,.15,.09]],false,8),mat.cream,0,1.74,0);
 part(model,profile([[1.78,1.31,.565,.15],[1.74,1.27,.575,.14],[1.70,1.23,.614,.13]],false,8),mat.dark,0,1.83,0);
 glass(model,texture);
 // Recessed floppy drive, front airflow slots, hard power switch and status lamp.
 block(model,mat.shadow,.618,.394,.76,.96,.283,.055,.023,.008);
 block(model,mat.keywell,.618,.397,.791,.899,.229,.040,.017,.005);
 block(model,mat.dark,.62,.419,.816,.735,.044,.018,.011,.004);
 block(model,mat.rubber,.863,.338,.817,.174,.045,.021,.009,.004);
 block(model,mat.green,.273,.343,.818,.040,.013,.012,.005,.002);
 block(model,mat.rubber,-.991,.373,.762,.162,.167,.05,.021,.006);
 block(model,mat.red,-.99,.377,.793,.112,.112,.046,.016,.008);
 for(let i=0;i<8;i++)block(model,mat.shadow,-.754+i*.077,.37,.763,.034,.164,.022,.014,.004);
 for(let i=0;i<3;i++)block(model,mat.badge,-.810+i*.045,1.03,.62,.030,.082,.015,.008,.003);
 for(let i=0;i<2;i++)block(model,mat.edge,.59+i*.119,1.03,.624,.085,.045,.026,.014,.005);
 block(model,mat.green,.843,1.033,.623,.044,.018,.013,.006,.002);
 function lettering(words,x,y,z,w,h){
  const image=document.createElement('canvas');image.width=768;image.height=90;
  const c=image.getContext('2d');c.fillStyle='#473f32';c.font='bold 64px monospace';c.textBaseline='middle';c.fillText(words,4,45,760);
  const map=new THREE.CanvasTexture(image);map.colorSpace=THREE.SRGBColorSpace;map.anisotropy=4;
  part(model,new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map,transparent:true,depthWrite:false}),x,y,z);
 }
 lettering('VECTOR  14',-.393,1.032,.619,.50,.068);
 lettering('POWER',-.974,.245,.758,.150,.036);
 lettering('DISK  3.5',.514,.501,.817,.30,.041);
 for(const side of [-1,1]){
  for(let i=0;i<15;i++){
   const vent=block(model,mat.seam,side*1.05,1.84,-.133+i*.026,.017,.237,.013,.005,.002);
   vent.rotation.z=side*.025;
  }
  for(let i=0;i<14;i++)block(model,mat.shadow,side*1.273,.385,-.59+i*.042,.015,.190,.017,.006,.002);
 }
 for(let i=0;i<13;i++)block(model,mat.shadow,-.43+i*.073,1.93,-.99,.025,.25,.024,.009,.003);
 block(model,mat.rubber,0,1.52,-1.001,.52,.125,.018,.019,.006);
 block(model,mat.metal,-.085,1.52,-1.018,.205,.069,.027,.014,.003);
 keyboard(model,mat);
 const mouse=new THREE.Group();model.add(mouse);mouse.position.set(1.35,.097,1.11);mouse.rotation.y=-.13;
 block(mouse,mat.rubber,0,-.015,0,.32,.11,.45,.052,.025);
 block(mouse,mat.cream,0,.026,0,.32,.13,.45,.060,.034);
 for(const side of [-1,1])block(mouse,mat.mod,side*.069,.095,-.091,.126,.021,.155,.010,.004);
 cable(model,mat.cord,[[1.36,.105,.9],[1.43,.051,.64],[1.54,.035,.25],[1.46,.040,-.18],[1.26,.23,-.43]],.015);
 cable(model,mat.cord,[[-.95,.11,.88],[-1.14,.045,.78],[-1.34,.037,.59],[-1.37,.05,.35],[-1.265,.25,.16]],.014);
 return batch(model);
}

function towerFront(source){
 const detail=new THREE.Group(),caseMetal=paint('#696b69',.5,.20),trim=paint('#474b49'),slot=paint('#212627');
 const led=new THREE.MeshBasicMaterial({color:0x93d7c7});
 block(detail,caseMetal,320,145,109.8,143,252,3,5,1.2);
 block(detail,trim,320,239,112.3,124,30,3,2.5,.8);
 block(detail,slot,320,244,114.5,105,4,2,1,.3);
 block(detail,led,274,230,114.2,4,2,1,.6,.2);
 block(detail,caseMetal,366,231,114.8,10,3,2,.8,.3);
 block(detail,trim,320,206,112,122,19,3,2.2,.8);
 for(let i=0;i<9;i++)block(detail,slot,319,36+i*5.3,112.2,104,2.8,2,1,.4);
 for(let i=0;i<2;i++){
  block(detail,trim,277+i*21,134,113,15,7,2,1.3,.4);
  block(detail,slot,277+i*21,134,114.4,11,3,1,.8,.3);
 }
 part(detail,new THREE.TorusGeometry(8.3,1,8,28),led,363,133,113.2);
 const button=part(detail,new THREE.CylinderGeometry(6.9,6.9,1.8,24),trim,363,133,113);
 button.rotation.x=Math.PI/2;
 source.add(batch(detail));
}
export async function dressStudyHardware(definition,source){
 const url=new URL('./assets/study/computers/'+definition.id+'-display.webp',import.meta.url);
 const texture=await new THREE.TextureLoader().loadAsync(url.href);
 if(definition.id==='crt')return makeCRT(source,texture);
 if(definition.id==='pc')towerFront(source);
 const displays={
  pc:{w:348,h:190,x:0,y:170,z:12.0,back:false},
  desktop:{w:15.50,h:10.28,x:0,y:8.86,z:-1.005,back:true},
  macbook:{w:2.50,h:1.55,x:.023,y:.846,z:-.661,back:false}
 };
 const {w,h,x,y,z,back}=displays[definition.id];
 const display=part(source,new THREE.PlaneGeometry(w,h),screenMaterial(texture),x,y,z);
 if(back)display.rotation.y=Math.PI;
 return source;
}
