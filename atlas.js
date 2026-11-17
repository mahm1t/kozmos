const photojournal = 'https://assets.science.nasa.gov/content/dam/science/psd/photojournal/pia/';
const nasa = 'https://science.nasa.gov/';
function mission(id, path, credit, tr, en) {
  const image = id.startsWith('https:') ? id : photojournal + 'pia' + id.slice(0,2) + '/pia' + id + '/PIA' + id + '.jpg';
  return {image, source:nasa + path, credit, tr, en};
}
const nasaJpl = 'NASA / JPL-Caltech';
const mercuryCredit = 'NASA / JHUAPL / Carnegie Institution of Washington';
const cassiniCredit = 'NASA / JPL-Caltech / Space Science Institute';
const closePhotos = [
  mission('https://assets.science.nasa.gov/content/dam/science/psd/solar/2023/09/p/i/a/1/PIA16853-1.jpg','resource/colors-of-the-innermost-planet-view-1/',mercuryCredit,'MESSENGER · Küresel renk mozaiği','MESSENGER · Global color mosaic'),
  mission('23791','photojournal/venus-from-mariner-10/',nasaJpl,'Mariner 10 · Bulut örtüsü','Mariner 10 · Cloud cover'),
  mission('18033','photojournal/earth/','NASA','Suomi NPP · Blue Marble uydu mozaiği','Suomi NPP · Blue Marble satellite mosaic'),
  mission('00407','photojournal/global-color-views-of-mars/','NASA / JPL / USGS','Viking · Valles Marineris ve Tharsis','Viking · Valles Marineris and Tharsis'),
  mission('22946','photojournal/jupiter-marble/','Kevin M. Gill (CC BY) / NASA / JPL-Caltech / SwRI / MSSS','JunoCam · Renkleri güçlendirilmiş görüntü','JunoCam · Enhanced-color image'),
  mission('17218','photojournal/a-farewell-to-saturn/',cassiniCredit,'Cassini · Gezegen ve halkalar, doğal renk','Cassini · Planet and rings, natural color'),
  mission('18182','photojournal/uranus-as-seen-by-nasas-voyager-2/',nasaJpl,'Voyager 2 · Gezegen diski','Voyager 2 · Planetary disk'),
  mission('01492','resource/neptune-full-disk-view/','NASA / JPL','Voyager 2 · Büyük Koyu Leke ve parlak bulutlar','Voyager 2 · Great Dark Spot and bright clouds')
];
const aerialPhotos = [
  mission('16950','photojournal/orbital-mosaic-of-mercurys-north-pole/',mercuryCredit,'MESSENGER · Kuzey kutbu harita projeksiyonu','MESSENGER · North polar map projection'),
  mission('00104','photojournal/venus-computer-simulated-global-view-centered-at-180-degrees-east-longitude/','NASA / JPL','Magellan · Yüzey radar mozaiği, yapay renk','Magellan · Surface radar mosaic, artificial color'),
  mission('14556','photojournal/nasa-research-leads-to-first-complete-map-of-antarctic-ice-flows/','NASA / JPL-Caltech / UCI','Antarktika · Uydu verisi, renkler buz akışını gösterir','Antarctica · Satellite data, colors represent ice flow'),
  mission('01247','photojournal/seasonal-changes-in-mars-north-polar-ice-cap/','JPL / NASA / STScI','Hubble · Kuzey buz örtüsünün mevsimsel harita projeksiyonları','Hubble · Seasonal map projections of the north polar ice cap'),
  mission('https://assets.science.nasa.gov/dynamicimage/assets/science/missions/webb/science/2020/07/STScI-01EVST6VRG39BECAA76BTC3Y3K.png?fit=clip&h=2000&w=2000','asset/webb/jupiters-polar-cyclone-storms-juno/','NASA / Caltech / SwRI / ASI / INAF / JIRAM','Juno · Kuzey kutbu, kızılötesi ısı haritası','Juno · North pole, infrared heat map'),
  mission('09186','photojournal/saturns-strange-hexagon/','NASA / JPL / University of Arizona','Cassini · Kuzey kutbu altıgeni, kızılötesi','Cassini · North polar hexagon, infrared'),
  mission('https://assets.science.nasa.gov/dynamicimage/assets/science/missions/webb/science/2023/04/STScI-01GWQDPJTF1MY8ZGN4WBMWMACJ.png?fit=clip&h=1268&w=1268','asset/webb/uranus-nircam-image/','NASA / ESA / CSA / STScI · Joseph DePasquale','Webb · Kuzey kutup bölgesi ve halkalar, kızılötesi teleskop görüntüsü','Webb · North polar region and rings, infrared telescope image'),
  mission('02204','photojournal/neptunes-bright-crescent/','NASA / JPL · D. A. Alexander','Voyager 2 · Güney kutbu çevresi, altı filtrede eğik çekim','Voyager 2 · South polar region, oblique view in six filters')
];
const ringsPhoto = mission('01627','photojournal/jupiters-inner-satellites-and-ring-components/','NASA / JPL / Cornell University','Toz halkaları ve iç uydular · Şema','Dust rings and inner moons · Diagram');
const atlasData = [
  ['mercury/facts/','Kabuk · silikat manto · büyük metal çekirdek','Crust · silicate mantle · large metallic core'],
  ['venus/venus-facts/','Kabuk · kayalık manto · demir çekirdek','Crust · rocky mantle · iron core'],
  ['earth/facts/','Kabuk · manto · sıvı dış çekirdek · katı iç çekirdek','Crust · mantle · liquid outer core · solid inner core'],
  ['mars/facts/','Kabuk · kayalık manto · metalce zengin çekirdek','Crust · rocky mantle · metal-rich core'],
  ['jupiter/jupiter-facts/','Bulut katmanı · moleküler hidrojen · metalik hidrojen · yayvan çekirdek modeli','Cloud layer · molecular hydrogen · metallic hydrogen · diffuse core model'],
  ['saturn/facts/','Atmosfer · moleküler hidrojen · metalik hidrojen · çekirdek','Atmosphere · molecular hydrogen · metallic hydrogen · core'],
  ['uranus/facts/','Atmosfer · su, metan ve amonyakça zengin akışkan katman · kayalık çekirdek','Atmosphere · water-, methane- and ammonia-rich fluid · rocky core'],
  ['neptune/neptune-facts/','Atmosfer · sıcak ve yoğun akışkan katman · kayalık çekirdek','Atmosphere · hot dense fluid layer · rocky core']
];
const atlasCopy = {
  tr:['İç yapı','Toz halkaları','Güneş Sistemi’ni keşfet','Gezegenleri uzay görevlerinin objektifinden incele.','İç yapı şeması · ölçeksiz','Radar verisi · yapay renk','Kızılötesi · renkler ısıyı gösterir','Toz halkaları ve iç uydular · şema'],
  en:['Interior','Dust rings','Explore the Solar System','See the planets through the cameras of space missions.','Interior model · not to scale','Radar data · artificial color','Infrared · colors show heat','Dust rings and inner moons · diagram'],
  de:['Innerer Aufbau','Staubringe'],es:['Interior','Anillos de polvo'],fr:['Structure interne','Anneaux de poussière'],pt:['Interior','Anéis de poeira'],ar:['البنية الداخلية','حلقات الغبار'],zh:['内部结构','尘埃环'],ja:['内部構造','ちりの環'],ru:['Внутреннее строение','Пылевые кольца']
};
const atlas = document.querySelector('#atlas');
const missionImage = document.querySelector('#mission-image');
const cutaway = document.querySelector('#cutaway');
const credit = document.querySelector('#mission-credit');
const source = document.querySelector('#mission-source');
const status = document.querySelector('#mission-status');
const interior = document.querySelector('#interior');
const rings = document.querySelector('#rings');
function updateAtlas() {
  const code = language.value;
  const words = atlasCopy[code];
  const copy = words.length > 2 ? words : atlasCopy.en;
  const [facts, turkish, english] = atlasData[selected];
  if (words.length > 2) {
    document.querySelector('#heading').textContent = copy[2];
    document.querySelector('#instructions').textContent = copy[3];
  }
  interior.textContent = words[0];
  rings.textContent = words[1];
  rings.hidden = selected !== 4;
  interior.setAttribute('aria-pressed', view === 'interior');
  rings.setAttribute('aria-pressed', view === 'rings');
  const diagram = view === 'interior';
  const photo = view === 'close' || view === 'aerial' || view === 'rings';
  atlas.hidden = !(diagram || photo);
  canvas.hidden = !atlas.hidden;
  if (atlas.hidden) return;
  zoom.disabled = diagram || view === 'rings';
  missionImage.hidden = !photo;
  cutaway.hidden = !diagram;
  status.textContent = '';
  const record = view === 'rings' ? ringsPhoto : view === 'aerial' ? aerialPhotos[selected] : closePhotos[selected];
  const description = code === 'tr' ? record.tr : record.en;
  let caption = description + ' · ' + record.credit;
  let link = record.source;
  if (diagram) {
    const layers = code === 'tr' ? turkish : english;
    const colors = ['#ffe29b','#ee8546','#a53f4d',palettes[selected][1]];
    const stops = layers.split(' · ').reverse().map((_,i,array) => {
      return colors[i] + ' ' + (i*100/array.length) + '% ' + ((i+1)*100/array.length) + '%';
    });
    cutaway.style.background = 'radial-gradient(circle closest-side,' + stops.join(',') + ')';
    cutaway.setAttribute('aria-label', layers);
    caption = copy[4] + ' · ' + layers;
    link = 'https://science.nasa.gov/' + facts;
  }
  credit.textContent = caption + ' ';
  source.href = link;
  if (photo) {
    missionImage.alt = document.querySelector('#name').textContent + ' · ' + description;
    if (missionImage.src !== record.image) {
      status.textContent = code === 'tr' ? ' · Görüntü yükleniyor…' : ' · Loading image…';
      missionImage.src = record.image;
    }
    if (missionImage.complete && missionImage.naturalWidth) showDimensions();
    missionImage.style.transform = 'scale(' + (view === 'rings' ? 1 : Number(zoom.value)/100) + ')';
  }
  document.querySelector('#scale-note').textContent = '';
}
const originalSetView = setView;
setView = next => {
  originalSetView(next);
  missionImage.style.removeProperty('--x');
  missionImage.style.removeProperty('--y');
  updateAtlas();
};
interior.onclick = () => setView('interior');
rings.onclick = () => setView('rings');
zoom.oninput = updateAtlas;
missionImage.onpointermove = event => {
  if (Number(zoom.value) <= 100 || view === 'rings') return;
  const rect = missionImage.parentElement.getBoundingClientRect();
  missionImage.style.setProperty('--x', ((event.clientX-rect.left)/rect.width*100) + '%');
  missionImage.style.setProperty('--y', ((event.clientY-rect.top)/rect.height*100) + '%');
};
function showDimensions() {
  status.textContent = ' · ' + missionImage.naturalWidth + ' × ' + missionImage.naturalHeight + ' px';
}
missionImage.onload = showDimensions;
missionImage.onerror = () => { status.textContent = language.value === 'tr' ? ' · Görüntü yüklenemedi. NASA bağlantısını aç.' : ' · Image unavailable. Open the NASA source.'; };
language.addEventListener('change',updateAtlas);
updateAtlas();
