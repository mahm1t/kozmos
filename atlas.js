const nasaMedia = 'https://science.nasa.gov/wp-content/uploads/';
const photojournal = 'https://assets.science.nasa.gov/content/dam/science/psd/photojournal/pia/';
const atlasData = [
  ['2024/03/pia15162-mercury-basins-messenger-16x9-1.jpg','MESSENGER · NASA / JHUAPL / Carnegie Institution of Washington','mercury/facts/','Kabuk · silikat manto · büyük metal çekirdek','Crust · silicate mantle · large metallic core'],
  ['2024/03/venus-mariner-10-pia23791-fig2-16x9-1.jpg','Mariner 10 · NASA / JPL-Caltech','venus/venus-facts/','Kabuk · kayalık manto · demir çekirdek','Crust · rocky mantle · iron core'],
  ['2024/03/blue-marble-apollo-17-16x9-1.jpg','Apollo 17 · NASA','earth/facts/','Kabuk · manto · sıvı dış çekirdek · katı iç çekirdek','Crust · mantle · liquid outer core · solid inner core'],
  ['2024/03/mars-full-globe-16x9-1.jpg','Viking · NASA / JPL / USGS','mars/facts/','Kabuk · kayalık manto · metalce zengin çekirdek','Crust · rocky mantle · metal-rich core'],
  ['2024/03/jupiter-marble-pia22946-16x9-1.jpg','JunoCam · Kevin M. Gill (CC BY) / NASA / JPL-Caltech / SwRI / MSSS','jupiter/jupiter-facts/','Bulut katmanı · moleküler hidrojen · metalik hidrojen · yayvan çekirdek modeli','Cloud layer · molecular hydrogen · metallic hydrogen · diffuse core model'],
  ['2023/05/saturn-farewell-pia21345-sse-banner-1920x640-1.jpg','Cassini · NASA / JPL-Caltech / Space Science Institute','saturn/facts/','Atmosfer · moleküler hidrojen · metalik hidrojen · çekirdek','Atmosphere · molecular hydrogen · metallic hydrogen · core'],
  ['2024/03/uranus-pia18182-16x9-1.jpg','Voyager 2 · NASA / JPL-Caltech','uranus/facts/','Atmosfer · su, metan ve amonyakça zengin akışkan katman · kayalık çekirdek','Atmosphere · water-, methane- and ammonia-rich fluid · rocky core'],
  ['2024/03/pia01492-neptune-full-disk-16x9-1.jpg','Voyager 2 · NASA / JPL-Caltech','neptune/neptune-facts/','Atmosfer · sıcak ve yoğun akışkan katman · kayalık çekirdek','Atmosphere · hot dense fluid layer · rocky core']
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
  const [path, attribution, facts, turkish, english] = atlasData[selected];
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
  let imageUrl = nasaMedia + path + '?w=1024';
  let caption = attribution;
  let link = 'https://science.nasa.gov/' + facts;
  if (selected === 3) {
    imageUrl = photojournal + 'pia00/pia00407/PIA00407.jpg';
    link = 'https://science.nasa.gov/photojournal/global-color-views-of-mars/';
  }
  if (selected === 4) {
    imageUrl = photojournal + 'pia22/pia22946/PIA22946.jpg';
    link = 'https://science.nasa.gov/photojournal/jupiter-marble/';
  }
  if (view === 'aerial' && selected === 4) {
    imageUrl = 'https://assets.science.nasa.gov/dynamicimage/assets/science/missions/webb/science/2020/07/STScI-01EVST6VRG39BECAA76BTC3Y3K.png?fit=clip&h=2000&w=2000';
    caption = copy[6] + ' · NASA / Caltech / SwRI / ASI / INAF / JIRAM';
    link = 'https://science.nasa.gov/asset/webb/jupiters-polar-cyclone-storms-juno/';
  }
  if (view === 'aerial' && selected === 1) {
    imageUrl = photojournal + 'pia00/pia00104/PIA00104.jpg';
    caption = copy[5] + ' · Magellan · NASA / JPL';
    link = 'https://science.nasa.gov/photojournal/venus-computer-simulated-global-view-centered-at-180-degrees-east-longitude/';
  }
  if (view === 'rings') {
    imageUrl = photojournal + 'pia01/pia01627/PIA01627.jpg';
    caption = copy[7] + ' · NASA / JPL / Cornell University';
    link = 'https://science.nasa.gov/photojournal/jupiters-inner-satellites-and-ring-components/';
  }
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
    missionImage.alt = document.querySelector('#name').textContent;
    if (missionImage.src !== imageUrl) missionImage.src = imageUrl;
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
missionImage.onerror = () => { status.textContent = language.value === 'tr' ? ' · Görüntü yüklenemedi. NASA bağlantısını aç.' : ' · Image unavailable. Open the NASA source.'; };
language.addEventListener('change',updateAtlas);
updateAtlas();
