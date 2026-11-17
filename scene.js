const planets = [
  ['#a59c90',4,88],
  ['#e5b878',7,225],
  ['#62aaff',8,365],
  ['#dd7853',5,687],
  ['#e7bc99',16,4333],
  ['#e2c388',13,10759],
  ['#88dbdf',10,30688],
  ['#7084fb',10,60182]
];
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const menu = document.querySelector('#planets');
const language = document.querySelector('#language');
let strings = translations.tr;
let view = 'orbit';
const zoom = document.querySelector('#zoom');
const viewButtons = ['orbit','close','aerial'].map(id => document.querySelector('#'+id));
function setView(next) {
  view = next;
  viewButtons.forEach(button => button.setAttribute('aria-pressed', button.id === next));
  zoom.disabled = next === 'orbit';
  document.querySelector('#scale-note').textContent = next === 'orbit' ? strings[8] : explorationLabels[language.value][8];
}
viewButtons.forEach(button => { button.onclick = () => setView(button.id); });
const motion = document.querySelector('#motion');
let selected = 2, tilt = 0.55, yaw = 0, clock = 0, previous, drag, hits = [];
let moving = !matchMedia('(prefers-reduced-motion: reduce)').matches;
function select(index) {
  selected = index;
  document.querySelector('#name').textContent = strings[9].split('|')[index];
  document.querySelector('#info').textContent = strings[10].split('|')[index];
  [...menu.children].forEach((button, i) => button.setAttribute('aria-pressed', i === index));
}
planets.forEach((planet, index) => {
  const button = document.createElement('button');
  button.type = 'button';
  button.onclick = () => { select(index); setView("close"); };
  menu.append(button);
});
function syncMotion() {
  motion.textContent = moving ? strings[5] : strings[6];
}
function applyLanguage(code) {
  strings = translations[code];
  document.documentElement.lang = code;
  document.documentElement.dir = code === 'ar' ? 'rtl' : 'ltr';
  document.title = 'KOZMOS — ' + strings[1];
  const labels = { heading:2, instructions:3, 'selected-label':4, reset:7, 'scale-note':8 };
  for (const [id,index] of Object.entries(labels)) {
    document.querySelector('#' + id).textContent = strings[index];
  }
  canvas.setAttribute('aria-label', strings[1]);
  menu.setAttribute('aria-label', strings[1]);
  strings[9].split('|').forEach((name,index) => { menu.children[index].textContent = name; });
  const copy = explorationLabels[code];
  const ids = ['orbit','close','aerial',null,'enter','colony-heading','free','locked-one'];
  ids.forEach((id,i) => { if (id) document.querySelector('#'+id).textContent = copy[i]; });
  zoom.setAttribute('aria-label',copy[3]);
  document.querySelector('#solar-enter').textContent = copy[4];
  document.querySelector('#solar-title').textContent = strings[1];
  document.querySelector('#locked-two').textContent = copy[7];
  setView(view);
  select(selected);
  syncMotion();
}
for (const [code,words] of Object.entries(translations)) {
  const option = document.createElement('option');
  option.value = code;
  option.lang = code;
  option.textContent = words[0];
  language.append(option);
}
let preference;
try { preference = localStorage.getItem('kozmos-language'); } catch {}
const browserLanguage = navigator.language.toLowerCase().split('-')[0];
language.value = [preference,browserLanguage,'tr'].find(code => Object.hasOwn(translations,code));
applyLanguage(language.value);
language.onchange = () => {
  applyLanguage(language.value);
  try { localStorage.setItem('kozmos-language',language.value); } catch {}
};
motion.onclick = () => { moving = !moving; syncMotion(); };
document.querySelector('#reset').onclick = () => { tilt = 0.55; yaw = 0; zoom.value = 100; setView("orbit"); };
canvas.onpointerdown = event => {
  drag = {x:event.clientX,y:event.clientY,tilt,yaw};
  canvas.setPointerCapture(event.pointerId);
};
canvas.onpointermove = event => {
  if (!drag) return;
  yaw = drag.yaw + (event.clientX - drag.x) * 0.012;
  tilt = Math.max(-1.45, Math.min(1.45, drag.tilt + (event.clientY - drag.y) * 0.008));
};
canvas.onpointercancel = () => { drag = undefined; };
canvas.onpointerup = event => {
  if (view === "orbit" && drag && Math.hypot(event.clientX - drag.x, event.clientY - drag.y) < 5) {
    const rect = canvas.getBoundingClientRect();
    const hit = [...hits].reverse().find(({x,y,r}) => Math.hypot(event.clientX-rect.left-x,event.clientY-rect.top-y) < r+6);
    if (hit) { select(hit.index); setView("close"); }
  }
  drag = undefined;
};
function render(now) {
  if (moving && previous !== undefined) clock += Math.min(now - previous, 50) / 1000;
  previous = now;
  if (canvas.hidden) {
    requestAnimationFrame(render);
    return;
  }
  const w = canvas.clientWidth, h = canvas.clientHeight, dpr = Math.min(devicePixelRatio, 2);
  if (canvas.width !== Math.round(w*dpr) || canvas.height !== Math.round(h*dpr)) {
    canvas.width = Math.round(w*dpr);
    canvas.height = Math.round(h*dpr);
  }
  ctx.setTransform(dpr,0,0,dpr,0,0);
  ctx.fillStyle = '#080d20';
  ctx.fillRect(0,0,w,h);
  for (let i=0;i<180;i++) {
    ctx.fillStyle = i%7 === 0 ? '#8b9cca' : '#34405e';
    ctx.fillRect((i*151.29)%w,(i*i*17.17)%h,i%7 === 0 ? 2 : 1,1);
  }
  if (view !== 'orbit') {
    drawPlanetDetail(ctx,w,h,selected,yaw+clock*.3,tilt-.55,Number(zoom.value)/100,view === 'aerial');
    requestAnimationFrame(render);
    return;
  }
  const unit = Math.min(w,h*1.4);
  function project(angle, radius) {
    const depth = Math.sin(angle+yaw)*radius;
    const scale = 1/(1+depth*Math.cos(tilt)/unit*0.45);
    return { x:w/2+Math.cos(angle+yaw)*radius*scale, y:h/2+depth*Math.sin(tilt)*scale, depth, scale };
  }
  const bodies = [{x:w/2,y:h/2,depth:0,r:Math.max(13,unit*.037),color:'#ffad38',index:-1}];
  planets.forEach(([color,size,period],index) => {
    const radius = unit*(.11+index*.044);
    ctx.strokeStyle = index === selected ? '#6b84bd' : '#283553';
    ctx.beginPath();
    for(let step=0;step<=96;step++) {
      const {x,y} = project(step*Math.PI/48,radius);
      if(step === 0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
    }
    ctx.stroke();
    const point = project(index*1.75+clock*3/Math.sqrt(period/30),radius);
    bodies.push({...point,r:size*point.scale*Math.max(.62,Math.min(1,unit/530)),color,index});
  });
  bodies.sort((a,b) => b.depth-a.depth);
  hits = bodies.filter(body => body.index >= 0);
  bodies.forEach(({x,y,r,color,index}) => {
    const shade = ctx.createRadialGradient(x-r*.35,y-r*.4,0,x,y,r);
    shade.addColorStop(0,'#fff0d0');
    shade.addColorStop(.36,color);
    shade.addColorStop(1,index === -1 ? '#e77b19' : '#20243a');
    ctx.fillStyle = shade;
    ctx.beginPath();
    ctx.arc(x,y,r,0,Math.PI*2);
    ctx.fill();
    if(index === 5 || index === selected) {
      ctx.strokeStyle = index === selected ? '#c9d8ff' : '#c7a878';
      ctx.beginPath();
      ctx.ellipse(x,y,r*1.65,index === 5 ? r*.42 : r*1.65,-.22,0,Math.PI*2);
      ctx.stroke();
    }
  });
  requestAnimationFrame(render);
}
requestAnimationFrame(render);
