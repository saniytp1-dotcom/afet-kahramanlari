// Ortak icerik: hem sunucu (node) hem tarayici kullanir.
(function(root){
const ITEMS = [
  {e:"💧",n:"Su",ok:1,w:"Ailenin en az 3 gün yetecek kadar suyu olmalı. Su en önemli ihtiyaçtır."},
  {e:"🥫",n:"Konserve",ok:1,w:"Bozulmayan, pişirmeden yenebilen yiyecekler ilk günlerde çok işe yarar."},
  {e:"🔦",n:"El feneri",ok:1,w:"Elektrik kesilir. Mum yerine el feneri kullan; mum yangın çıkarabilir."},
  {e:"🔋",n:"Yedek pil",ok:1,w:"Fener ve radyo için yedek pil şart."},
  {e:"📣",n:"Düdük",ok:1,w:"Enkaz altında bağırmak seni yorar ve toz yutarsın. Düdük sesi çok daha uzağa gider."},
  {e:"🩹",n:"İlk yardım seti",ok:1,w:"Küçük yaralar için yara bandı, sargı bezi ve antiseptik bulunmalı."},
  {e:"💊",n:"Kişisel ilaçlar",ok:1,w:"Düzenli kullanılan ilaçlar ve reçete fotokopisi mutlaka çantada olmalı."},
  {e:"📻",n:"Pilli radyo",ok:1,w:"Telefon ve internet çalışmazsa resmî duyuruları radyodan dinlersin."},
  {e:"📄",n:"Belge fotokopileri",ok:1,w:"Kimlik ve önemli belgelerin fotokopileri su geçirmez poşette saklanır."},
  {e:"🧥",n:"Yedek kıyafet",ok:1,w:"Mevsime uygun yedek kıyafet ve kalın çorap soğuktan korur."},
  {e:"😷",n:"Toz maskesi",ok:1,w:"Yıkılan binaların tozu ciğerlere zarar verir. Maske hayat kurtarır."},
  {e:"🔌",n:"Powerbank",ok:1,w:"Dolu bir powerbank ile telefonunla haber verebilir, yardım çağırabilirsin."},
  {e:"💨",n:"Saç kurutma makinesi",ok:0,w:"Elektrik yokken hiçbir işe yaramaz, üstelik ağır."},
  {e:"🎮",n:"Oyun konsolu",ok:0,w:"Yer kaplar, pil yer. Çantada her santimetre değerli!"},
  {e:"🕯️",n:"Mum",ok:0,w:"Gaz kaçağı olabilir, yangın çıkarabilir. El feneri çok daha güvenli."},
  {e:"🍦",n:"Dondurma",ok:0,w:"Erir ve bozulur. Bozulmayan yiyecekler seçilmeli."},
  {e:"🖼️",n:"Cam çerçeve",ok:0,w:"Kırılır, kesebilir. Fotoğrafları telefonda ya da fotokopi olarak sakla."},
  {e:"🪴",n:"Saksı çiçeği",ok:0,w:"Çok güzel ama afet çantasının işi değil!"},
  {e:"📺",n:"Tablet şarjı %3",ok:0,w:"Boş bir cihaz işe yaramaz. Dolu bir powerbank çok daha değerli."},
  {e:"🧸",n:"Kocaman peluş",ok:0,w:"Küçük çocuklar için küçük bir oyuncak olabilir, ama kocaman peluş çok yer kaplar."},
  {e:"🧴",n:"Cam şişe parfüm",ok:0,w:"Kırılır ve yanıcıdır. Yerine sabun, ıslak mendil gibi hijyen ürünleri koy."},
];
const HZ = {
  bedwin:{e:"🛏️",t:"Yatak pencerenin dibinde",p:"Depremde camlar kırılıp üstüne düşebilir. Yatağını pencereden <b>uzağa</b> taşı."},
  frame:{e:"🖼️",t:"Yatağın üstünde ağır tablo",p:"Sallantıda düşüp başına çarpabilir. Yatağın üstüne ağır eşya <b>asma</b>."},
  shelf:{e:"📚",t:"Sabitlenmemiş kitaplık",p:"Kitaplık ve dolaplar devrilebilir. <b>L demir</b> veya kayışla duvara sabitle."},
  topbox:{e:"📦",t:"Dolabın üstünde ağır kutu ve cam vazo",p:"Yüksekteki ağır ve kırılacak eşyalar düşer. Ağır eşyaları <b>alt raflara</b> koy."},
  plug:{e:"⚡",t:"Aşırı yüklenmiş uzatma kablosu",p:"Çok fazla fiş yangın çıkarabilir. Depremden sonra elektrik yangınları sık görülür."},
  exit:{e:"🚪",t:"Kapının önü kutularla dolu",p:"Kaçış yolu her zaman <b>açık</b> olmalı. Afette saniyeler önemli!"},
  heater:{e:"🔥",t:"Isıtıcı perdenin yanında",p:"Isıtıcı devrilirse perde tutuşabilir. Isıtıcıları yanıcı eşyalardan <b>uzak</b> tut."},
  tv:{e:"📺",t:"Sabitlenmemiş televizyon",p:"Televizyon sehpadan düşebilir. Duvara ya da sehpaya <b>sabitle</b>."},
};
const STORIES = {
  deprem:{c:"#c0392b",steps:[
    {s:"🛋️",shake:1,q:"Akşam salonda ödev yapıyorsun. Birden her şey sallanmaya başladı! Ne yaparsın?",o:[
      ["Sağlam masanın yanına çöker, başımı kollarımla korur, masaya tutunurum.",1,"Doğru! <b>Çök – Kapan – Tutun.</b> Sarsıntı bitene kadar yerinde kal."],
      ["Kapı kasasının altına koşarım.",0,"Kapı kasası güvenli değildir ve koşarken düşebilirsin. Olduğun yerde çök, kapan, tutun."],
      ["Hemen balkona çıkarım.",0,"Balkonlar depremde en riskli yerlerden biridir. İçeride kal, çök-kapan-tutun."]]},
    {s:"😮‍💨",q:"Sarsıntı bitti. Annen 'Hemen çıkalım' diyor. Önce ne yaparsın?",o:[
      ["Ayakkabımı giyer, afet çantamızı alırım.",1,"Doğru! Yerde cam kırıkları olabilir. Afet çantası da hazırda bekliyor."],
      ["Telefonla sallanan odanın videosunu çekerim.",0,"Önce güvenlik! Zaman kaybetmeden binadan çıkmaya hazırlanmalısın."],
      ["Mum yakıp etrafa bakarım.",0,"Gaz kaçağı olabilir, mum ya da çakmak yakma! El feneri kullan."]]},
    {s:"🛗",q:"6. kattasınız. Aşağı nasıl inersiniz?",o:[
      ["Asansörle, çünkü daha hızlı.",0,"Asansör durabilir ve içinde mahsur kalırsın. Afette asla asansör kullanma!"],
      ["Merdivenden, sakince, tırabzana tutunarak.",1,"Doğru! Koşmadan, itişmeden merdivenden in."],
      ["Merdivenden koşarak, en önde olmak için.",0,"Koşarsan düşebilir, başkalarını da düşürebilirsin. Sakin ol."]]},
    {s:"🌳",q:"Dışarıdasınız. Nerede beklersiniz?",o:[
      ["Binanın hemen önünde, eve yakın olalım diye.",0,"Artçı depremlerde binadan parçalar düşebilir. Binalardan uzak dur."],
      ["Önceden belirlediğimiz toplanma alanında.",1,"Doğru! Toplanma alanları açık ve güvenli alanlardır. e-Devlet'ten öğrenebilirsin."],
      ["Elektrik direğinin altında.",0,"Direkler ve teller devrilebilir. Açık alana git."]]},
    {s:"📱",q:"Babaannene haber vermek istiyorsun. Ne yaparsın?",o:[
      ["Kısa bir mesaj atarım: 'İyiyiz, toplanma alanındayız.'",1,"Doğru! Hatları meşgul etmemek için kısa mesaj en iyisi. Hatlar acil çağrılar için gerekli."],
      ["Uzun uzun ararım, tekrar tekrar.",0,"Hatlar kilitlenir ve acil çağrılar ulaşamaz. Kısa mesaj gönder."],
      ["Sosyal medyada canlı yayın açarım.",0,"İnterneti ve şarjını boşa harcarsın. Kısa bir mesaj yeterli."]]},
  ]},
  okul:{c:"#8e44ad",steps:[
    {s:"🏫",shake:1,q:"Matematik dersindesin, sınıf sallanmaya başladı! Ne yaparsın?",o:[
      ["Sıramın yanına çöker, başımı korur, sıraya tutunurum.",1,"Doğru! Okulda da kural aynı: Çök – Kapan – Tutun."],
      ["Kapıya koşarım, ilk ben çıkayım.",0,"Sallantı sırasında koşmak düşmene ve izdihama yol açar."],
      ["Pencerenin yanına gidip dışarı bakarım.",0,"Camlar kırılabilir. Pencerelerden uzak dur."]]},
    {s:"👩‍🏫",q:"Sarsıntı durdu. Öğretmenin 'Sırayla çıkıyoruz' dedi. Ne yaparsın?",o:[
      ["Çantamı toplayıp kitaplarımı yerleştiririm.",0,"Eşya toplamakla vakit kaybetme. Öğretmenini dinle."],
      ["Öğretmenimi dinler, tahliye planına göre sırayla çıkarım.",1,"Doğru! Okulların tahliye planı vardır. Tatbikatlarda öğrendiğin gibi davran."],
      ["Arkadaşlarımı iterek koridora koşarım.",0,"İtişmek kazalara yol açar. Sakin ve sıralı çıkılmalı."]]},
    {s:"🧱",q:"Koridorda bir arkadaşın düştü ve ayağı acıyor. Ne yaparsın?",o:[
      ["Hemen bir öğretmene haber veririm.",1,"Doğru! Yetişkinlere haber vermek en hızlı yardım yoludur."],
      ["Onu hızlıca sürükleyip kaldırmaya çalışırım.",0,"Yanlış hareket yarayı kötüleştirebilir. Bir yetişkine haber ver."],
      ["Görmezden gelip devam ederim.",0,"Yardımlaşma afetlerde çok önemlidir. En azından bir yetişkine haber ver."]]},
    {s:"🧑‍🤝‍🧑",q:"Okul bahçesindesiniz. Ne yaparsın?",o:[
      ["Sınıfımla toplanma alanında kalır, yoklamaya katılırım.",1,"Doğru! Öğretmenin herkesin güvende olduğunu yoklamayla kontrol eder."],
      ["Eve tek başıma yürürüm.",0,"Ailen seni okulda arar. Toplanma alanında kal, ailen gelsin."],
      ["Unuttuğum telefonu almak için sınıfa dönerim.",0,"Artçı deprem olabilir! Hiçbir eşya için binaya geri girme."]]},
    {s:"📣",q:"Hayal et: Enkaz altında kaldın ama yaralı değilsin. Ne yaparsın?",o:[
      ["Sürekli bağırırım.",0,"Bağırmak seni yorar ve toz yutarsın. Sesini idareli kullan."],
      ["Düdük çalar ya da borulara, duvara vururum.",1,"Doğru! Düdük ve vurma sesleri kurtarıcılara uzaktan ulaşır. Ağzını bir bezle kapat."],
      ["Kibrit yakıp etrafa bakarım.",0,"Gaz kaçağı olabilir. Asla ateş yakma!"]]},
  ]},
  sel:{c:"#2e86de",steps:[
    {s:"🌧️",q:"Günlerdir yağmur yağıyor. Radyoda sel uyarısı verildi. Ne yaparsın?",o:[
      ["Dereye gidip suyun yükselişini izlerim.",0,"Dere yatakları selde en tehlikeli yerlerdir. Uzak dur!"],
      ["Ailemle hazırlık yapar, resmî duyuruları takip ederiz.",1,"Doğru! Çantanı hazırla ve yetkililerin uyarılarını dinle."],
      ["Bodrum kata inip saklanırım.",0,"Su önce bodrumları doldurur. Yüksek yerlere çık!"]]},
    {s:"🏠",q:"Su eve girmeye başladı. İlk ne yapılmalı?",o:[
      ["Elektriği sigortadan kapatıp üst kata çıkarız.",1,"Doğru! Su ve elektrik birlikte çok tehlikeli. Sonra yüksek bir yere çık."],
      ["Suyun içinde prize takılı eşyaları toplarım.",0,"Elektrik çarpabilir! Suya girmeden önce elektrik kapatılmalı."],
      ["Halıları kurtarmaya çalışırım.",0,"Eşyalar beklesin, önce can güvenliği!"]]},
    {s:"🚶",q:"Tahliye ediliyorsunuz. Yolda dizine gelmeyen ama hızlı akan bir su var. Ne yaparsın?",o:[
      ["Sığ görünüyor, içinden geçeriz.",0,"Sadece 15 cm akan su seni düşürebilir! Akan suya asla girme."],
      ["Geri dönüp başka bir yol buluruz.",1,"Doğru! 'Dön, başka yol bul.' Akan su göründüğünden çok daha güçlüdür."],
      ["Bisikletle hızlıca geçeriz.",0,"Akan su bisikleti de devirir. Başka yol bul."]]},
    {s:"🚗",q:"Arabadasınız ve önünüzde sular altında kalmış bir yol var.",o:[
      ["Hızla geçeriz, araba ağırdır.",0,"30 cm akan su bir arabayı bile sürükleyebilir!"],
      ["Arabayı yüksek bir yerde durdurup başka güzergâh ararız.",1,"Doğru! Sular altındaki yollardan asla geçilmez."],
      ["Camı açıp suyun derinliğine bakarız.",0,"Önemli olan derinlik değil; akan su her zaman tehlikelidir."]]},
    {s:"🚰",q:"Sel çekildi. Çok susadın. Ne içersin?",o:[
      ["Musluk suyunu hemen içerim.",0,"Sel suları şebekeyi kirletebilir. Yetkililer 'güvenli' diyene kadar içme."],
      ["Afet çantamızdaki kapalı şişe suyu içerim.",1,"Doğru! Kapalı şişe su güvenlidir. Bu yüzden çantada su olmalı."],
      ["Yerdeki birikmiş sudan içerim.",0,"Sel suyu mikrop ve kimyasallarla doludur. Asla içme ve oynama!"]]},
  ]},
  yangin:{c:"#e67e22",steps:[
    {s:"🔔",q:"Apartmanda yangın alarmı çalıyor, koridorda duman var. Ne yaparsın?",o:[
      ["Eğilerek, yere yakın ilerlerim ve ağzımı bir bezle kapatırım.",1,"Doğru! Duman yukarıda birikir; temiz hava yere yakındır."],
      ["Dik dik koşarım.",0,"Duman yukarıda toplanır ve seni bayıltabilir. Eğil, yere yakın ilerle."],
      ["Saklanmak için yatağın altına girerim.",0,"Saklanmak yerine çıkmalısın. İtfaiye seni bulamayabilir."]]},
    {s:"🚪",q:"Kapalı bir kapıya geldin. Ne yaparsın?",o:[
      ["Hemen açarım.",0,"Kapının arkasında ateş olabilir. Önce kontrol et!"],
      ["Elimin tersiyle kapıya ve kola dokunurum. Sıcaksa açmam.",1,"Doğru! Sıcak kapının arkasında yangın vardır. Başka çıkış ara."],
      ["Kapıyı tekmeleyip kırarım.",0,"Kapıyı kırmak ateşe oksijen verir. Önce sıcaklığını kontrol et."]]},
    {s:"🛗",q:"Binadan nasıl çıkarsın?",o:[
      ["Merdivenden.",1,"Doğru! Yangında asansörler durabilir ve bacaya dönüşebilir."],
      ["Asansörden.",0,"Asansör yangında tuzağa dönüşebilir. Merdiveni kullan."],
      ["Çatıya çıkarım.",0,"Duman ve ateş yukarı doğru gider. Aşağı, çıkışa doğru ilerle."]]},
    {s:"🧥",q:"Kaçarken kazağının ucu tutuştu! Ne yaparsın?",o:[
      ["Koşarak söndürmeye çalışırım.",0,"Koşmak ateşi büyütür!"],
      ["DUR – YAT – YUVARLAN!",1,"Doğru! Dur, yere yat, yüzünü elinle kapat ve alevler sönene kadar yuvarlan."],
      ["Elimle vururum.",0,"Ellerin yanabilir. Dur, yat ve yuvarlan."]]},
    {s:"☎️",q:"Dışarıdasın. Kimi ararsın?",o:[
      ["112'yi ararım ve adresi net söylerim.",1,"Doğru! Tüm acil durumlar için 112. Sakin ol, adresi ve ne olduğunu söyle."],
      ["Arkadaşlarımı arayıp anlatırım.",0,"Önce itfaiyeye haber verilmeli: 112!"],
      ["Kimseyi aramam, nasılsa birisi aramıştır.",0,"Herkes böyle düşünürse kimse aramaz! Hemen 112."]]},
  ]},
};
const PAIRS = [
  ["🌍","Deprem anı","🙇","Çök – Kapan – Tutun"],
  ["🌊","Sel uyarısı","⛰️","Yüksek yere çık"],
  ["🔥","Dumanlı koridor","🐢","Eğil, yere yakın ilerle"],
  ["🧱","Enkaz altında","📣","Düdük çal, vur"],
  ["🧥","Kıyafet tutuştu","🔄","Dur – Yat – Yuvarlan"],
  ["💨","Gaz kokusu","🚫","Ateş yakma, vanayı kapat"],
  ["🆘","Acil durum","☎️","112'yi ara"],
  ["👨‍👩‍👧","Aile buluşması","📍","Toplanma alanı"],
];
const ROOM_SVG = '<svg viewBox="0 0 1000 600" role="img" aria-label="Bir çocuk odası">\n        <!-- room -->\n        <rect width="1000" height="600" fill="#fde9d9"/>\n        <rect y="440" width="1000" height="160" fill="#c98f5e"/>\n        <g stroke="#b37a4c" stroke-width="4">\n          <line x1="0" y1="490" x2="1000" y2="490"/><line x1="0" y1="545" x2="1000" y2="545"/>\n        </g>\n        <rect y="430" width="1000" height="14" fill="#e7c9a9"/>\n        <!-- wallpaper dots -->\n        <g fill="#f7d4bd">\n          <circle cx="60" cy="60" r="6"/><circle cx="160" cy="120" r="6"/><circle cx="420" cy="70" r="6"/><circle cx="700" cy="60" r="6"/><circle cx="900" cy="140" r="6"/><circle cx="560" cy="200" r="6"/>\n        </g>\n        <!-- door (right) -->\n        <rect x="860" y="190" width="120" height="250" fill="#8b5a2b" stroke="#5e3a19" stroke-width="5"/>\n        <circle cx="880" cy="320" r="8" fill="#f5c542"/>\n        <!-- window with bed under it (hazard 1) -->\n        <g class="hz" data-hz="bedwin">\n          <rect class="glow" x="250" y="60" width="270" height="390" rx="20"/>\n          <rect x="300" y="80" width="170" height="160" fill="#bfe6ff" stroke="#fff" stroke-width="12"/>\n          <line x1="385" y1="80" x2="385" y2="240" stroke="#fff" stroke-width="8"/>\n          <line x1="300" y1="160" x2="470" y2="160" stroke="#fff" stroke-width="8"/>\n          <rect x="270" y="320" width="240" height="70" rx="12" fill="#5b8def"/>\n          <rect x="270" y="300" width="80" height="40" rx="14" fill="#fff"/>\n          <rect x="262" y="290" width="14" height="150" fill="#7a4a24"/><rect x="504" y="330" width="14" height="110" fill="#7a4a24"/>\n          <rect x="270" y="390" width="240" height="18" fill="#7a4a24"/>\n          <circle class="ring" cx="385" cy="250" r="150"/>\n        </g>\n        <!-- heavy frame over the bed (hazard 2) -->\n        <g class="hz" data-hz="frame">\n          <rect class="glow" x="525" y="90" width="120" height="120" rx="14"/>\n          <rect x="540" y="105" width="90" height="90" fill="#f2c94c" stroke="#8b5a2b" stroke-width="10"/>\n          <path d="M555 180 L580 140 L600 165 L615 150 L625 180 Z" fill="#6fcf97"/>\n          <circle cx="600" cy="130" r="9" fill="#ff8a65"/>\n          <circle class="ring" cx="585" cy="150" r="72"/>\n        </g>\n        <!-- unsecured bookcase (hazard 3) -->\n        <g class="hz" data-hz="shelf">\n          <rect class="glow" x="20" y="80" width="200" height="370" rx="14"/>\n          <g transform="rotate(-3 120 440)">\n            <rect x="40" y="110" width="160" height="330" fill="#a0673a" stroke="#6b411e" stroke-width="6"/>\n            <g fill="#6b411e"><rect x="40" y="190" width="160" height="8"/><rect x="40" y="270" width="160" height="8"/><rect x="40" y="350" width="160" height="8"/></g>\n            <g><rect x="52" y="140" width="16" height="50" fill="#e74c3c"/><rect x="70" y="146" width="14" height="44" fill="#3498db"/><rect x="86" y="138" width="18" height="52" fill="#f1c40f"/><rect x="110" y="150" width="40" height="40" fill="#9b59b6"/><rect x="58" y="220" width="70" height="50" fill="#16a085"/><rect x="140" y="226" width="40" height="44" fill="#e67e22"/><rect x="52" y="300" width="20" height="50" fill="#2c3e50"/><rect x="76" y="306" width="18" height="44" fill="#c0392b"/><rect x="120" y="296" width="60" height="54" fill="#bdc3c7"/></g>\n          </g>\n          <circle class="ring" cx="120" cy="270" r="140"/>\n        </g>\n        <!-- heavy box on top of wardrobe (hazard 4) -->\n        <g>\n          <rect x="660" y="200" width="170" height="240" fill="#d9a066" stroke="#8b5a2b" stroke-width="6"/>\n          <line x1="745" y1="200" x2="745" y2="440" stroke="#8b5a2b" stroke-width="5"/>\n          <circle cx="732" cy="320" r="6" fill="#5e3a19"/><circle cx="758" cy="320" r="6" fill="#5e3a19"/>\n        </g>\n        <g class="hz" data-hz="topbox">\n          <rect class="glow" x="660" y="80" width="170" height="125" rx="14"/>\n          <rect x="672" y="120" width="96" height="80" fill="#c69c6d" stroke="#7a5230" stroke-width="5"/>\n          <text x="720" y="168" font-size="20" text-anchor="middle" fill="#7a5230" font-weight="800">AĞIR</text>\n          <path d="M780 200 l10 -70 h30 l10 70 Z" fill="#7fc8f8" stroke="#3b7fb0" stroke-width="4"/>\n          <circle class="ring" cx="745" cy="150" r="80"/>\n        </g>\n        <!-- overloaded power strip (hazard 5) -->\n        <g class="hz" data-hz="plug">\n          <rect class="glow" x="530" y="440" width="150" height="80" rx="14"/>\n          <rect x="545" y="470" width="120" height="30" rx="8" fill="#eee" stroke="#999" stroke-width="3"/>\n          <g fill="#333"><rect x="555" y="460" width="16" height="24" rx="3"/><rect x="580" y="458" width="16" height="26" rx="3"/><rect x="605" y="460" width="16" height="24" rx="3"/><rect x="630" y="458" width="16" height="26" rx="3"/></g>\n          <g stroke="#333" stroke-width="4" fill="none"><path d="M563 460 q-10 -40 -40 -50"/><path d="M588 458 q0 -40 30 -60"/><path d="M613 460 q20 -30 60 -30"/><path d="M638 458 q40 -10 50 -60"/></g>\n          <text x="600" y="455" font-size="26" text-anchor="middle">⚡</text>\n          <circle class="ring" cx="605" cy="480" r="72"/>\n        </g>\n        <!-- boxes blocking the door (hazard 6) -->\n        <g class="hz" data-hz="exit">\n          <rect class="glow" x="835" y="330" width="160" height="150" rx="14"/>\n          <rect x="850" y="370" width="80" height="80" fill="#c69c6d" stroke="#7a5230" stroke-width="5"/>\n          <rect x="900" y="400" width="80" height="60" fill="#d6b07f" stroke="#7a5230" stroke-width="5"/>\n          <rect x="870" y="340" width="60" height="34" fill="#e74c3c" stroke="#a83226" stroke-width="4"/>\n          <circle class="ring" cx="915" cy="405" r="80"/>\n        </g>\n        <!-- heater next to the curtain (hazard 7) -->\n        <g>\n          <path d="M290 70 q-20 120 0 240 l-25 0 q-15 -120 0 -240 Z" fill="#f78fb3"/>\n        </g>\n        <g class="hz" data-hz="heater">\n          <rect class="glow" x="205" y="330" width="80" height="120" rx="14"/>\n          <rect x="215" y="360" width="60" height="80" rx="8" fill="#e5e5e5" stroke="#888" stroke-width="4"/>\n          <g stroke="#ff6b3d" stroke-width="5"><line x1="225" y1="375" x2="265" y2="375"/><line x1="225" y1="395" x2="265" y2="395"/><line x1="225" y1="415" x2="265" y2="415"/></g>\n          <path d="M262 340 q10 -20 0 -40" stroke="#ff9f6e" stroke-width="4" fill="none" opacity=".8"/>\n          <circle class="ring" cx="245" cy="395" r="62"/>\n        </g>\n        <!-- glass jar on the desk edge / TV not fixed (hazard 8) -->\n        <g>\n          <rect x="530" y="330" width="120" height="14" fill="#7a4a24"/>\n          <rect x="540" y="344" width="10" height="96" fill="#7a4a24"/><rect x="630" y="344" width="10" height="96" fill="#7a4a24"/>\n        </g>\n        <g class="hz" data-hz="tv">\n          <rect class="glow" x="520" y="235" width="140" height="100" rx="14"/>\n          <rect x="535" y="250" width="110" height="70" rx="6" fill="#2c3e50" stroke="#111" stroke-width="5"/>\n          <rect x="580" y="320" width="20" height="12" fill="#111"/>\n          <path d="M548 300 l20 -25 l15 15 l20 -20 l25 30 Z" fill="#5dade2" opacity=".7"/>\n          <circle class="ring" cx="590" cy="285" r="62"/>\n        </g>\n        <!-- safe decoys -->\n        <g class="safe"><circle cx="470" cy="520" r="34" fill="#ffd166"/><circle cx="460" cy="512" r="5" fill="#333"/><circle cx="480" cy="512" r="5" fill="#333"/><path d="M458 528 q12 10 24 0" stroke="#333" stroke-width="4" fill="none"/></g>\n        <g class="safe"><rect x="100" y="470" width="110" height="60" rx="10" fill="#7bd389"/><text x="155" y="508" text-anchor="middle" font-size="22" font-weight="800" fill="#1d5c36">HALI</text></g>\n      </svg>';
const C = { ITEMS, HZ, STORIES, PAIRS, ROOM_SVG };
if (typeof module !== 'undefined' && module.exports) module.exports = C; else root.CONTENT = C;
})(this);
