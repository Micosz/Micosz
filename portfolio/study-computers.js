// Visual eras accompany the transcript; these are not claims about owned devices.
const STUDY_COMPUTERS=[
 {id:'crt',label:'CRT desktop',file:'crt.glb',yaw:Math.PI,size:2.65,source:'https://poly.pizza/m/doMMnviJrGi',creator:'Robert Schlyter',title:'Simple computer'},
 {id:'pc',label:'Desktop PC',file:'pc.glb',yaw:0,size:2.85,source:'https://poly.pizza/m/2EHvZLax4Y3',creator:'Poly by Google',title:'Computer'},
 {id:'desktop',label:'All-in-one',file:'desktop.glb',yaw:Math.PI,size:2.65,source:'https://poly.pizza/m/0twMVGXRVDl',creator:'Poly by Google',title:'Monitor'},
 {id:'macbook',label:'MacBook',file:'macbook.glb',yaw:0,size:2.85,source:'https://poly.pizza/m/27hcX_w47Jb',creator:'Alex Safayan',title:'Laptop / MacBook Pro'}
];
function studyComputerEra(index,count){return index===count-1?3:Math.min(3,Math.floor(index*4/Math.max(1,count)));}
