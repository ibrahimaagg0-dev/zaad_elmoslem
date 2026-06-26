const cacheName = 'zaad-ultimate-offline-v3';
const assets = [
  './',
  './index.html',
  './quran.html',
  './quran.pdf',
  './page/azkar.html',
  './page/hadith.html',
  './page/tafseer.html',
  
  // 🎨 حفظ ملفات الـ CSS عشان شكل الموقع ميبوظش وأنت قاطع نت
  './CSS/bootstrap.css',
  './CSS/style.css',
  './CSS/navPage.css',
  
  // 💻 حفظ ملفات الـ JS عشان الأكواد ومواقيت الصلاة تشتغل أوفلاين 100%
  './JS/jquery-3.6.0.min.js',
  './JS/popper.min.js',
  './JS/bootstrap.js',
  './JS/script.js',
  
  // حفظ المانيفست والأيقونة
  './manifest.json',
  './photo/icon1.png'
];

// 1. تثبيت التطبيق وحفظ كل ملفات النظام في ذاكرة التليفون
self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(cacheName).then(cache => {
      return cache.addAll(assets);
    })
  );
});

// 2. طرد أي كاش قديم وتنظيف المتصفح فوراً
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== cacheName) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => clients.claim())
  );
});

// 3. تشغيل الموقع بالكامل من الذاكرة الداخلية عند انقطاع الشبكة
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(res => {
      return res || fetch(e.request);
    })
  );
});
