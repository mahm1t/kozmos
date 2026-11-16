const explorationLabels = {
  tr:['Yörünge','Yakın çekim','Kuş bakışı','Yakınlaştırma','Keşfe başla','Koloniler','Ücretsiz','Premium giriş henüz açılmadı.','Sahne temsili olarak çizilmiştir.'],
  en:['Orbit','Close-up','Aerial view','Zoom','Start exploring','Colonies','Free','Premium access is coming.','This scene is an illustration.'],
  de:['Umlaufbahn','Nahansicht','Vogelperspektive','Zoom','Entdecken','Kolonien','Kostenlos','Premium-Zugang folgt.','Ansicht zur Veranschaulichung.'],
  es:['Órbita','Primer plano','Vista aérea','Zoom','Explorar','Colonias','Gratis','El acceso Premium estará disponible próximamente.','Vista ilustrativa.'],
  fr:['Orbite','Gros plan','Vue aérienne','Zoom','Explorer','Colonies','Gratuit','Accès Premium à venir.','Vue illustrative.'],
  pt:['Órbita','Vista próxima','Vista aérea','Zoom','Explorar','Colônias','Grátis','Acesso Premium em breve.','Vista ilustrativa.'],
  ar:['المدار','عرض مقرب','منظر جوي','تكبير','ابدأ الاستكشاف','المستعمرات','مجاني','وصول بريميوم قريبًا.','مشهد توضيحي.'],
  zh:['轨道','特写','俯瞰','缩放','开始探索','殖民地','免费','高级访问即将开放。','此场景为示意图。'],
  ja:['軌道','クローズアップ','俯瞰','ズーム','探索する','コロニー','無料','プレミアムアクセスは準備中です。','イメージ図です。'],
  ru:['Орбита','Крупный план','Вид сверху','Масштаб','Начать исследование','Колонии','Бесплатно','Доступ Premium скоро откроется.','Иллюстративный вид.']
};
const palettes = [
  ['#817c79','#9d9486'], ['#bb8550','#ffe2a0'], ['#114782','#479557'],
  ['#9d3b2c','#d78254'], ['#9f644c','#f7d29b'], ['#a58352','#ead6a6'],
  ['#589eaa','#9cdae0'], ['#223b93','#5379d7']
];
function drawPlanetDetail(ctx, width, height, index, angle, tilt, zoom, aerial) {
  const [base, accent] = palettes[index];
  const gas = index >= 4;
  const radius = Math.min(width,height) * (aerial ? .67 : .33) * zoom;
  const x = width/2, y = height*(aerial ? .65 : .5);
  if (index === 5 && !aerial) {
    ctx.save();
    ctx.translate(x,y);
    ctx.rotate(-.22);
    for (let i=0;i<7;i++) {
      ctx.strokeStyle = i%2 ? '#9b835d' : '#cfba91';
      ctx.beginPath();
      ctx.ellipse(0,0,radius*(1.22+i*.085),radius*(.32+i*.022),0,0,Math.PI*2);
      ctx.stroke();
    }
    ctx.restore();
  }
  ctx.save();
  ctx.beginPath();
  ctx.arc(x,y,radius,0,Math.PI*2);
  ctx.clip();
  ctx.fillStyle = base;
  ctx.fillRect(x-radius,y-radius,2*radius,2*radius);
  ctx.fillStyle = accent;
  for (let i=0;i<55;i++) {
    const phase = i * 2.39996;
    const latitude = ((i*53)%109)/55-1;
    const longitude = phase + angle;
    const z = Math.cos(longitude)*Math.sqrt(Math.max(0,1-latitude*latitude));
    const py = latitude*Math.cos(tilt)-z*Math.sin(tilt);
    const facing = latitude*Math.sin(tilt)+z*Math.cos(tilt);
    if (!gas && facing <= 0) continue;
    const px = Math.sin(longitude)*Math.sqrt(Math.max(0,1-latitude*latitude));
    ctx.globalAlpha = gas ? .21 : .14 + i%5*.09;
    ctx.beginPath();
    ctx.ellipse(x+radius*(gas ? 0 : px),y+radius*(gas ? latitude : py),
      radius*(gas ? 1.13 : (.07+i%8*.018)*facing),radius*(gas ? .012+i%7*.007 : .03+i%5*.022),
      gas ? Math.sin(angle+i)*.025 : Math.sin(phase)*.75,0,Math.PI*2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
  if (index === 4 && Math.cos(angle) > 0) {
    ctx.fillStyle = '#a44238';
    ctx.beginPath();
    ctx.ellipse(x+Math.sin(angle)*radius,y+radius*.34,radius*.18*Math.cos(angle),radius*.073,-.15,0,Math.PI*2);
    ctx.fill();
  }
  const light = ctx.createRadialGradient(x-radius*.35,y-radius*.35,0,x,y,radius);
  light.addColorStop(0,'#fff3d84d');
  light.addColorStop(.59,'#00000000');
  light.addColorStop(1,aerial ? '#10182b78' : '#030614df');
  ctx.fillStyle = light;
  ctx.fillRect(x-radius,y-radius,2*radius,2*radius);
  ctx.restore();
}
