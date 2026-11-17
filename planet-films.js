const filmDialog = document.querySelector('#planet-film');
const filmOpen = document.querySelector('#planet-film-open');
const filmClose = document.querySelector('#film-close');
const filmPlay = document.querySelector('#film-play');
const filmAudio = document.querySelector('#film-audio');
const filmSub = document.querySelector('#film-sub');
const filmProgress = document.querySelector('#film-progress');
const filmImage = document.querySelector('#film-image');
const filmCaption = document.querySelector('#film-caption');
const filmStatus = document.querySelector('#film-status');
const filmUi = {
 tr:['Gezegeni izle','Kapat','Oynat','Duraklat','Ses','Altyazı','Kapalı','Bölüm','Bu cihazda seçilen dilin sesi kullanılamıyor. Altyazı açık kalabilir.'],
 en:['Watch planet guide','Close','Play','Pause','Audio','Subtitles','Off','Chapter','The selected voice is unavailable on this device. Captions can stay on.']
};
const orbitLabels = {
 tr:'Güneş çevresindeki bir tur, Dünya günü', en:'One orbit around the Sun, in Earth days',
 de:'Ein Umlauf um die Sonne in Erdtagen', es:'Una órbita alrededor del Sol, en días terrestres',
 fr:'Une orbite autour du Soleil, en jours terrestres', pt:'Uma órbita ao redor do Sol, em dias terrestres',
 ar:'دورة واحدة حول الشمس بالأيام الأرضية', zh:'绕太阳一周所需的地球日数',
 ja:'太陽を一周するのにかかる地球日数', ru:'Один оборот вокруг Солнца в земных днях'
};
const localizedOpen = {
 de:'Planetenporträt ansehen', es:'Ver guía del planeta', fr:'Voir le portrait de la planète',
 pt:'Ver guia do planeta', ar:'شاهد دليل الكوكب', zh:'观看行星导览', ja:'惑星ガイドを見る', ru:'Смотреть обзор планеты'
};
function filmOption(value,label) {
  const option=document.createElement('option');
  option.value=value;
  option.textContent=label;
  filmSub.append(option);
}
filmOption('off','Kapalı / Off');
for(const [code,copy] of Object.entries(translations))filmOption(code,copy[0]);
let filmPlanet = 0;
let filmStep = 0;
let filmPlaying = false;
let filmTimer;
let filmRun = 0;
function filmText(code) {
  const planet=translations[code];
  const name=planet[9].split('|')[filmPlanet];
  const fact=planet[10].split('|')[filmPlanet];
  const days=new Intl.NumberFormat(code).format(planets[filmPlanet][2]);
  const words = filmDetails[filmPlanet][code];
  return [name+'. '+fact,words,orbitLabels[code]+': '+days+'.'];
}
const filmDetails = [
 {tr:'MESSENGER görüntülerinin birleşimi, Merkür’ün kraterli kuzey kutbunu gösterir.',en:'MESSENGER images combine to reveal Mercury’s cratered north pole.',de:'MESSENGER-Aufnahmen zeigen den von Kratern geprägten Nordpol.',es:'Las imágenes de MESSENGER revelan el polo norte lleno de cráteres.',fr:'Les images de MESSENGER révèlent les cratères du pôle Nord.',pt:'As imagens da MESSENGER revelam as crateras do polo norte.',ar:'تكشف صور مسبار ماسنجر الحفر في القطب الشمالي لعطارد.',zh:'信使号的影像展示了水星北极的密集撞击坑。',ja:'メッセンジャーの画像は北極のクレーターを示しています。',ru:'Снимки MESSENGER показывают кратеры северного полюса.'},
 {tr:'Magellan radarı, kalın bulutların altındaki yüzeyi haritaladı.',en:'Magellan radar mapped the surface beneath Venus’s thick clouds.',de:'Magellan kartierte die Oberfläche unter den dichten Wolken mit Radar.',es:'El radar de Magallanes cartografió la superficie bajo las densas nubes.',fr:'Le radar de Magellan a cartographié la surface sous les nuages épais.',pt:'O radar da Magellan mapeou a superfície sob as nuvens densas.',ar:'رسم رادار ماجلان خريطة السطح تحت السحب الكثيفة.',zh:'麦哲伦号用雷达绘制了厚云下的金星表面。',ja:'マゼランのレーダーは厚い雲の下の地表を地図にしました。',ru:'Радар «Магеллана» составил карту поверхности под плотными облаками.'},
 {tr:'Antarktika haritasındaki renkler, buzun ne hızla aktığını gösterir.',en:'The colors on this Antarctic map show how fast the ice flows.',de:'Die Farben zeigen die Fließgeschwindigkeit des Eises in der Antarktis.',es:'Los colores del mapa antártico indican la velocidad del hielo.',fr:'Les couleurs indiquent la vitesse d’écoulement de la glace antarctique.',pt:'As cores indicam a velocidade do fluxo de gelo na Antártida.',ar:'تُظهر الألوان سرعة تدفق الجليد في القارة القطبية الجنوبية.',zh:'南极地图的颜色表示冰层流动的速度。',ja:'南極の地図の色は氷が流れる速さを示します。',ru:'Цвета на карте Антарктиды показывают скорость движения льда.'},
 {tr:'Hubble gözlemleri, kuzey kutup buz örtüsünün mevsimle nasıl değiştiğini gösterir.',en:'Hubble observations show how the northern polar ice cap changes with the seasons.',de:'Hubble-Beobachtungen zeigen die jahreszeitlichen Veränderungen der nördlichen Eiskappe.',es:'Hubble muestra cómo cambia el casquete polar norte con las estaciones.',fr:'Hubble montre les variations saisonnières de la calotte polaire nord.',pt:'O Hubble mostra as mudanças sazonais na calota polar norte.',ar:'تُظهر أرصاد هابل كيف يتغير الغطاء الجليدي الشمالي مع الفصول.',zh:'哈勃的观测显示了北极冰盖的季节变化。',ja:'ハッブルの観測から北極の氷冠の季節変化が分かります。',ru:'Наблюдения «Хаббла» показывают сезонные изменения северной полярной шапки.'},
 {tr:'Juno’nun kızılötesi görüntüsünde kuzey kutbundaki büyük siklonun çevresinde sekiz siklon görülüyor.',en:'Juno’s infrared image shows eight cyclones surrounding a larger one at the north pole.',de:'Juno zeigt im Infrarot acht Wirbelstürme um einen größeren am Nordpol.',es:'La imagen infrarroja de Juno muestra ocho ciclones alrededor de uno mayor en el polo norte.',fr:'L’image infrarouge de Juno montre huit cyclones autour d’un plus grand au pôle Nord.',pt:'A imagem infravermelha da Juno mostra oito ciclones em torno de um maior no polo norte.',ar:'تُظهر صورة جونو تحت الحمراء ثمانية أعاصير حول إعصار أكبر عند القطب الشمالي.',zh:'朱诺号红外影像显示北极有八个气旋围绕一个更大的气旋。',ja:'ジュノーの赤外線画像では、北極の大きなサイクロンを八つの渦が囲んでいます。',ru:'На инфракрасном снимке «Юноны» восемь циклонов окружают более крупный у северного полюса.'},
 {tr:'Cassini, kuzey kutbu çevresindeki altıgen biçimli atmosfer akımını görüntüledi.',en:'Cassini imaged the hexagonal atmospheric jet around Saturn’s north pole.',de:'Cassini fotografierte die sechseckige Strömung am Nordpol.',es:'Cassini fotografió la corriente hexagonal alrededor del polo norte.',fr:'Cassini a observé le courant hexagonal autour du pôle Nord.',pt:'A Cassini observou a corrente hexagonal ao redor do polo norte.',ar:'رصدت كاسيني التيار الجوي السداسي حول القطب الشمالي.',zh:'卡西尼号拍摄了环绕土星北极的六边形急流。',ja:'カッシーニは北極を囲む六角形の大気の流れを撮影しました。',ru:'«Кассини» заснял шестиугольное течение вокруг северного полюса.'},
 {tr:'Webb’in kızılötesi görüntüsünde parlak kutup bölgesi ve ince halkalar görülür.',en:'Webb’s infrared image reveals a bright polar region and faint rings.',de:'Webbs Infrarotbild zeigt eine helle Polarregion und schwache Ringe.',es:'La imagen infrarroja de Webb muestra una región polar brillante y anillos tenues.',fr:'L’image infrarouge de Webb révèle une région polaire brillante et de faibles anneaux.',pt:'A imagem infravermelha do Webb mostra uma região polar brilhante e anéis tênues.',ar:'تكشف صورة ويب تحت الحمراء منطقة قطبية لامعة وحلقات خافتة.',zh:'韦布红外影像揭示了明亮的极区和暗淡的光环。',ja:'ウェッブの赤外線画像には明るい極域と淡い環が見えます。',ru:'Инфракрасный снимок «Уэбба» показывает яркую полярную область и слабые кольца.'},
 {tr:'Voyager 2, güney kutbu çevresindeki bulutları farklı filtrelerle görüntüledi.',en:'Voyager 2 used different filters to image clouds near Neptune’s south pole.',de:'Voyager 2 nahm Wolken am Südpol mit verschiedenen Filtern auf.',es:'Voyager 2 fotografió las nubes del polo sur con distintos filtros.',fr:'Voyager 2 a photographié les nuages du pôle Sud avec plusieurs filtres.',pt:'A Voyager 2 fotografou nuvens perto do polo sul com vários filtros.',ar:'صوّر فوياجر 2 السحب قرب القطب الجنوبي بمرشحات مختلفة.',zh:'旅行者2号用不同滤镜拍摄了海王星南极附近的云层。',ja:'ボイジャー2号は異なるフィルターで南極付近の雲を撮影しました。',ru:'«Вояджер-2» снимал облака у южного полюса с разными фильтрами.'}
];
function filmCopy() { return filmUi[language.value==='tr'?'tr':'en']; }
function syncFilmUi() {
  const copy=filmCopy();
  filmOpen.textContent=localizedOpen[language.value]||copy[0];
  filmClose.textContent=copy[1];
  filmPlay.textContent=copy[filmPlaying?3:2];
  document.querySelector('#film-audio-label').textContent=copy[4];
  document.querySelector('#film-sub-label').textContent=copy[5];
  filmSub.options[0].textContent=copy[6];
  filmProgress.setAttribute('aria-label',copy[7]);
}
function renderFilm() {
  const record=filmStep === 1 ? aerialPhotos[filmPlanet] : closePhotos[filmPlanet];
  const name=translations[language.value][9].split('|')[filmPlanet];
  document.querySelector('#film-title').textContent=name;
  if(filmImage.src!==record.image)filmImage.src=record.image;
  filmImage.alt=name;
  document.querySelector('#film-credit').textContent=record.credit;
  document.querySelector('#film-source').href=record.source;
  filmProgress.value=filmStep;
  document.querySelector('#film-chapter').textContent=(filmStep+1)+' / 3';
  filmCaption.lang=filmSub.value==='off'?language.value:filmSub.value;
  filmCaption.textContent=filmSub.value==='off'?'':filmText(filmSub.value)[filmStep];
  syncFilmUi();
}
function stopFilm() {
  filmRun++;
  clearTimeout(filmTimer);
  window.speechSynthesis?.cancel();
  filmPlaying=false;
  syncFilmUi();
}
function playFilm() {
  stopFilm();
  filmPlaying=true;
  filmStatus.textContent='';
  renderFilm();
  const run=filmRun;
  const engine=window.speechSynthesis;
  const text=filmText(filmAudio.value)[filmStep];
  const duration=Math.max(4000,text.length*59);
  const advance=()=>{
    if(run!==filmRun||!filmPlaying)return;
    if(filmStep===2){stopFilm();return;}
    filmStep++;
    playFilm();
  };
  filmTimer=setTimeout(advance,Math.max(16000,duration*2));
  const resume=(delay)=>{if(run===filmRun){clearTimeout(filmTimer);filmTimer=setTimeout(advance,delay);}};
  if(!engine||typeof SpeechSynthesisUtterance!=='function'){
    filmStatus.textContent=filmCopy()[8];
    resume(duration);
    return;
  }
  const utterance=new SpeechSynthesisUtterance(text);
  utterance.lang=filmAudio.value==='tr'?'tr-TR':'en-US';
  const voice=engine.getVoices().find(v=>v.lang.toLowerCase().startsWith(filmAudio.value));
  if(voice)utterance.voice=voice;
  utterance.onend=()=>resume(650);
  utterance.onerror=()=>{
    if(run!==filmRun)return;
    filmStatus.textContent=filmCopy()[8];
    resume(duration);
  };
  engine.speak(utterance);
}
filmOpen.onclick=()=>{
  filmPlanet=selected;filmStep=0;
  filmAudio.value=language.value==='tr'?'tr':'en';
  filmSub.value=language.value;
  filmStatus.textContent='';
  renderFilm();
  filmDialog.showModal();
};
filmClose.onclick=()=>filmDialog.close();
filmDialog.addEventListener('close',stopFilm);
filmPlay.onclick=()=>{if(filmPlaying)stopFilm();else playFilm();};
filmSub.onchange=renderFilm;
filmAudio.onchange=()=>{if(filmPlaying)playFilm();};
filmProgress.oninput=()=>{
  filmStep=Number(filmProgress.value);
  if(filmPlaying)playFilm();else renderFilm();
};
language.addEventListener('change',syncFilmUi);
syncFilmUi();
