import * as THREE from './assets/vendor/three/three.module.js';
import {dressStudyHardware} from './study-hardware.js';
import {GLTFLoader} from './assets/vendor/three/GLTFLoader.js';

// One renderer, four real GLB assets. Only the outgoing/incoming eras are drawn.
export async function createStudyObject(host,definitions){
 const renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'});
 renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.5));renderer.setClearColor(0x000000,0);
 renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=.95;
 const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(34,1,.1,50);
 camera.position.set(0,.1,6.0);camera.lookAt(0,0,0);
 scene.add(new THREE.HemisphereLight(0xe7e1ff,0x363044,2));
 const key=new THREE.DirectionalLight(0xfff1df,2.6);key.position.set(-3,5,5);scene.add(key);
 const rim=new THREE.DirectionalLight(0xb8a7dc,1.3);rim.position.set(4,2,-3);scene.add(rim);
 const fill=new THREE.DirectionalLight(0xd2e3ff,1);fill.position.set(2,0,4);scene.add(fill);
 let disposed=false,lastPose={fromEra:0,toEra:0,mix:0,x:.22,y:-.49,z:-.022,scale:1};
 const loader=new GLTFLoader(),managed=new Set();
 const dressed=await Promise.allSettled(definitions.map(async definition=>{
  const url=new URL('./assets/study/computers/'+definition.file,import.meta.url);
  const {scene:source}=await loader.loadAsync(url.href);managed.add(source);
  const model=await dressStudyHardware(definition,source);managed.add(model);return model;
 }));
 function freeModels(){
  const geometries=new Set(),materials=new Set(),textures=new Set();
  managed.forEach(model=>model.traverse(o=>{
   if(o.geometry)geometries.add(o.geometry);
   if(o.material)(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>materials.add(m));
  }));
  materials.forEach(m=>{Object.values(m).forEach(v=>{if(v?.isTexture)textures.add(v);});m.dispose();});
  textures.forEach(t=>t.dispose());geometries.forEach(g=>g.dispose());
 }
 if(dressed.some(r=>r.status==='rejected')){
  freeModels();renderer.dispose();renderer.forceContextLoss();throw new Error('Computer model unavailable');
 }
 const loaded=dressed.map(r=>r.value);
 const models=loaded.map((model,i)=>{
  const pivot=new THREE.Group(),basis=new THREE.Group(),bounds=new THREE.Box3().setFromObject(model),center=bounds.getCenter(new THREE.Vector3()),size=bounds.getSize(new THREE.Vector3()),normal=definitions[i].size/Math.max(size.x,size.y,size.z);
  model.position.copy(center).multiplyScalar(-normal);model.scale.setScalar(normal);basis.rotation.y=definitions[i].yaw;basis.add(model);pivot.add(basis);scene.add(pivot);
  return {pivot};
 });
 const canvas=renderer.domElement;canvas.setAttribute('aria-hidden','true');host.append(canvas);
 // Blend complete renders, so the opaque models never become X-ray meshes.
 const type=renderer.extensions.has('EXT_color_buffer_float')?THREE.HalfFloatType:THREE.UnsignedByteType;
 const targets=[new THREE.WebGLRenderTarget(1,1,{type,depthBuffer:true}),new THREE.WebGLRenderTarget(1,1,{type,depthBuffer:true})];
 const blendScene=new THREE.Scene(),blendCamera=new THREE.OrthographicCamera(-1,1,1,-1,0,1);
 const blendMaterial=new THREE.ShaderMaterial({transparent:true,premultipliedAlpha:true,depthTest:false,depthWrite:false,
  uniforms:{before:{value:targets[0].texture},after:{value:targets[1].texture},amount:{value:0}},
  vertexShader:'varying vec2 vUv; void main(){vUv=uv;gl_Position=vec4(position.xy,0.0,1.0);}',
  fragmentShader:`varying vec2 vUv; uniform sampler2D before; uniform sampler2D after; uniform float amount;
   void main(){vec4 a=texture2D(before,vUv),b=texture2D(after,vUv);float alpha=mix(a.a,b.a,amount);vec3 color=mix(a.rgb*a.a,b.rgb*b.a,amount)/max(alpha,0.00001);gl_FragColor=vec4(color,alpha);
   #include <tonemapping_fragment>
   #include <colorspace_fragment>
   #include <premultiplied_alpha_fragment>
   }`
 });
 const blendPlane=new THREE.Mesh(new THREE.PlaneGeometry(2,2),blendMaterial);blendScene.add(blendPlane);
 function update(p){
  if(disposed||document.hidden)return;lastPose=p;
  models.forEach((m,i)=>{
   const same=p.fromEra===p.toEra,weight=same?(i===p.fromEra?1:0):i===p.fromEra?1-p.mix:i===p.toEra?p.mix:0;
   m.pivot.visible=weight>.001;if(!m.pivot.visible)return;
   const direction=i===p.fromEra?1:-1,transition=same?0:1-weight;
   m.pivot.rotation.set(p.x,p.y+direction*transition*.75,p.z,'YXZ');m.pivot.scale.setScalar(p.scale*(1-transition*.22));m.pivot.position.set(direction*transition*.20,-transition*.06,0);

  });
  const transitioning=p.fromEra!==p.toEra&&p.mix>.001&&p.mix<.999;
  if(transitioning){
   for(let pass=0;pass<2;pass++){models.forEach((m,i)=>m.pivot.visible=i===(pass?p.toEra:p.fromEra));renderer.setRenderTarget(targets[pass]);renderer.clear();renderer.render(scene,camera);}
   renderer.setRenderTarget(null);blendMaterial.uniforms.amount.value=p.mix;renderer.render(blendScene,blendCamera);
  }else renderer.render(scene,camera);
 }
 function resize(){if(disposed)return;const r=host.getBoundingClientRect(),height=Math.max(1,r.height-28);renderer.setSize(r.width,height,false);camera.aspect=r.width/height;
  const baseHalfFov=THREE.MathUtils.degToRad(17);
  camera.fov=THREE.MathUtils.radToDeg(2*Math.atan(Math.tan(baseHalfFov)/Math.min(1,camera.aspect)));camera.updateProjectionMatrix();const size=renderer.getDrawingBufferSize(new THREE.Vector2());targets.forEach(t=>t.setSize(size.x,size.y));update(lastPose);}
 function lost(event){event.preventDefault();host.dataset.modelState='fallback';host.querySelector('.study-object-note').textContent='Static view';host.removeAttribute('tabindex');const controls=host.closest('.study-stage')?.querySelector('.study-object-controls');if(controls)controls.hidden=true;}
 canvas.addEventListener('webglcontextlost',lost);resize();
 return {update,resize,dispose(){if(disposed)return;disposed=true;canvas.removeEventListener('webglcontextlost',lost);freeModels();targets.forEach(t=>t.dispose());blendPlane.geometry.dispose();blendMaterial.dispose();renderer.dispose();renderer.forceContextLoss();canvas.remove();}};
}
