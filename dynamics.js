const eventCanvas = document.querySelector('#event-sky');
const eventContext = eventCanvas.getContext('2d');
const eventControls = document.querySelector('#event-controls');
const eventMotion = document.querySelector('#event-motion');
const eventNote = document.querySelector('#event-note');
const eventSource = document.querySelector('#event-source');
const events = [
  ['Satürn halkaları','Saturn’s rings','İç yörüngelerdeki parçacıklar daha hızlı döner. Noktalar buz ve kaya parçalarını temsil eder.','Inner ring particles orbit faster. Dots represent ice and rock fragments.','https://science.nasa.gov/saturn/facts/'],
  ['İç katmanlar','Interior layers','Seçili gezegenin iç katmanlarına ait ölçeksiz model. Noktalar temsili dolaşımı gösterir.','An unscaled model of the selected planet. Dots illustrate circulation.',''],
  ['Volkan patlaması','Volcanic eruption','Dünya tipi yanardağda magma ve sıcak parçacıkların yükselişi. Mars’taki Olympus Mons geçmiş volkanizmanın izidir.','Magma and hot ejecta rise in an Earth-like eruption. Olympus Mons on Mars records past volcanism.','https://science.nasa.gov/earth/earth-observatory/scoria-cones-on-earth-and-mars/'],
  ['Güneş püskürmesi','Solar eruption','Manyetik alan boyunca şekillenen sıcak plazma yayları.','Hot plasma arcs shaped by magnetic fields.','https://science.nasa.gov/sun/'],
  ['Meteor geçişi','Meteor streak','Yıldız kayması, bir meteoroidin Dünya atmosferinde bıraktığı kısa ışık izidir.','A shooting star is a brief streak from a meteoroid entering Earth’s atmosphere.','https://science.nasa.gov/solar-system/meteors-meteorites/']
];
const eventLabels = {
  tr:['Hareketli keşif','Durdur','Oynat','Temsili animasyon · '],
  en:['Animated exploration','Pause','Play','Illustrative animation · ']
};
let eventMode = 0, eventTime = 0, eventFrame, lastFrame;
let eventPlaying = !matchMedia('(prefers-reduced-motion: reduce)').matches;
let eventVisible = false;
const eventButtons = events.map((_,i) => {
  const button = document.createElement('button');
  button.type = 'button';
  button.onclick = () => { eventMode = i; eventTime = 0; refreshEvent(); };
  eventControls.append(button);
  return button;
});
function refreshEvent() {
  const turkish = language.value === 'tr';
  const copy = eventLabels[turkish ? 'tr' : 'en'];
  const event = events[eventMode];
  document.querySelector('#dynamics-heading').textContent = copy[0];
  eventMotion.textContent = copy[eventPlaying ? 1 : 2];
  eventButtons.forEach((button,i) => {
    button.textContent = events[i][turkish ? 0 : 1];
    button.setAttribute('aria-pressed',i === eventMode);
  });
  const planetName = document.querySelector('#name').textContent;
  const interiorText = eventMode === 1 ? planetName + ' · ' + atlasData[selected][turkish ? 1 : 2] + ' · ' : '';
  eventNote.textContent = copy[3] + interiorText + event[turkish ? 2 : 3];
  eventCanvas.setAttribute('aria-label',event[turkish ? 0 : 1]);
  eventSource.href = eventMode === 1 ? 'https://science.nasa.gov/' + atlasData[selected][0] : event[4];
  drawEvent();
}
function dot(ctx,x,y,r,color) {
  ctx.fillStyle=color;
  ctx.beginPath();
  ctx.arc(x,y,r,0,Math.PI*2);
  ctx.fill();
}
function circleShade(ctx,r,colors) {
  const shade=ctx.createRadialGradient(-r*.35,-r*.35,0,0,0,r);
  colors.forEach((color,i)=>shade.addColorStop(i/(colors.length-1),color));
  dot(ctx,0,0,r,shade);
}
function drawRingEvent(ctx,t) {
  ctx.rotate(-.24);
  const trails=[[.34,.41],[.43,.51],[.53,.59]];
  for (const [a,b] of trails) {
    ctx.strokeStyle='#97887655';
    ctx.lineWidth=b-a;
    ctx.beginPath();
    ctx.ellipse(0,0,(a+b)/2,(a+b)*.17,0,0,Math.PI*2);
    ctx.stroke();
  }
  const points=Array.from({length:430},(_,i)=>{
    const [a,b]=trails[i%3], r=a+(b-a)*((i*79)%431)/431;
    const phase=i*2.39996+t*.16/Math.pow(r,1.5);
    return [Math.cos(phase)*r,Math.sin(phase)*r*.34,(i%31===0?.008:.0025),i];
  });
  for(const [x,y,r,i] of points)if(y<0)dot(ctx,x,y,r,i%5?'#cbb79c':'#f9e7cc');
  circleShade(ctx,.27,['#f5dcad','#bc996c','#43332d']);
  for(const [x,y,r,i] of points)if(y>=0)dot(ctx,x,y,r,i%5?'#cbb79c':'#f9e7cc');
}
function drawInteriorEvent(ctx,t) {
  const layers=atlasData[selected][1].split(' · ');
  const shades=[palettes[selected][1],'#ad5147','#ed7855','#ffd686'];
  const idx=selected;
  layers.forEach((_,i)=>dot(ctx,0,0,.4-i*(.32/layers.length),shades[i === layers.length-1 ? 3 : i]));
  for(let i=0;i<44;i++){
    const phase=i*.87+t*(idx<4?.9:1.45);
    const pathAngle=i*2.39996;
    const radius=.26+.062*Math.cos(phase);
    dot(ctx,Math.cos(pathAngle)*radius,Math.sin(pathAngle)*radius,.0055,i%2?'#fff1ce':'#512b4d');
  }
}
function drawVolcanoEvent(ctx,t) {
  ctx.fillStyle='#513940';ctx.beginPath();
  ctx.moveTo(-1,.42);ctx.lineTo(-.21,.32);ctx.lineTo(-.05,.02);
  ctx.lineTo(.045,.02);ctx.lineTo(.31,.38);ctx.lineTo(1,.42);ctx.lineTo(1,.58);ctx.lineTo(-1,.58);ctx.fill();
  ctx.lineCap='round';ctx.lineWidth=.023;ctx.strokeStyle='#ff885c';ctx.beginPath();
  ctx.moveTo(-.02,.045);ctx.lineTo(.04,.15);ctx.lineTo(.13,.2);ctx.lineTo(.18,.29);ctx.stroke();
  for(let i=0;i<66;i++){
    const a=(t*.75+i*.061)%1;
    const x=Math.sin(i*2.9)*a*.24;
    const y=.025-Math.sin(a*Math.PI)*(.13+i%9*.022)+a*.1;
    dot(ctx,x,y,(1-a)*.008+.001,i%3?'#ff9a57':'#ffe5b5');
  }
}
function drawSolarEvent(ctx,t) {
  ctx.translate(0,.2);
  circleShade(ctx,.29,['#fff5aa','#f29535','#8f2115']);
  for(let i=0;i<10;i++){
    const wave=.025*Math.sin(t*1.8+i*.4);
    ctx.strokeStyle=i%2?'#ff783b9e':'#ffb458bd';
    ctx.lineWidth=.004;
    ctx.beginPath();
    ctx.moveTo(-.17+i*.008,-.22);
    ctx.bezierCurveTo(-.19,-.53-wave,.27+i*.012,-.55+wave,.24,-.15);
    ctx.stroke();
  }
}
function drawMeteorEvent(ctx,t) {
  const lap=Math.floor(t/4);
  const phase=(t%4)/1.25;
  ctx.strokeStyle='#74a1d966';ctx.lineWidth=.013;ctx.beginPath();
  ctx.ellipse(0,1.83,1.5,1.45,0,Math.PI,Math.PI*2);ctx.stroke();
  if(phase>1)return;
  const x=-.64+phase*1.37,y=-.39+phase*.57+Math.sin(lap*2.4)*.1;
  const glow=ctx.createLinearGradient(x-.28,y-.12,x,y);
  glow.addColorStop(0,'#e3c79b00');glow.addColorStop(1,'#fff2ce');
  ctx.strokeStyle=glow;ctx.lineWidth=.009;ctx.beginPath();
  ctx.moveTo(x-.28,y-.12);ctx.lineTo(x,y);ctx.stroke();
  dot(ctx,x,y,.011,'#fff5dd');
}
const drawEvents=[drawRingEvent,drawInteriorEvent,drawVolcanoEvent,drawSolarEvent,drawMeteorEvent];
function drawEvent() {
  if(!eventContext)return;
  const w=eventCanvas.clientWidth,h=eventCanvas.clientHeight;
  if(!w||!h)return;
  const dpr=Math.min(devicePixelRatio,2), width=Math.round(w*dpr), height=Math.round(h*dpr);
  if(eventCanvas.width!==width||eventCanvas.height!==height){eventCanvas.width=width;eventCanvas.height=height;}
  const ctx=eventContext;
  ctx.setTransform(dpr,0,0,dpr,0,0);
  ctx.fillStyle='#080c17';ctx.fillRect(0,0,w,h);
  for(let i=0;i<100;i++)dot(ctx,(i*167.15)%w,(i*i*23.83)%h,i%13===0?1:.55,i%5?'#647392':'#bcc9e3');
  const scale=Math.min(w*.78,h*.98);
  ctx.save();ctx.translate(w/2,h/2);ctx.scale(scale,scale);
  drawEvents[eventMode](ctx,eventTime);
  ctx.restore();
}
function eventTick(now) {
  if(lastFrame!==undefined)eventTime+=Math.min(.05,(now-lastFrame)/1000);
  lastFrame=now;
  drawEvent();
  eventFrame=requestAnimationFrame(eventTick);
}
function syncEventFrame() {
  cancelAnimationFrame(eventFrame);
  lastFrame=undefined;
  if(eventVisible&&eventPlaying)eventFrame=requestAnimationFrame(eventTick);
}
eventMotion.onclick=()=>{eventPlaying=!eventPlaying;refreshEvent();syncEventFrame();};
new IntersectionObserver(([entry])=>{eventVisible=entry.isIntersecting;syncEventFrame();}).observe(eventCanvas);
new ResizeObserver(drawEvent).observe(eventCanvas);
language.addEventListener('change',refreshEvent);
menu.addEventListener('click',()=>{if(eventMode===1)refreshEvent();});
canvas.addEventListener('pointerup',()=>{if(eventMode===1)refreshEvent();});
refreshEvent();
