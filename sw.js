const cacheName = 'zaad-final-v1'; // اسم جديد تماماً لتنظيف الجهاز
const assets = [
  './',
  './index.html',
  './style.css',
  './manifest.json',
  './icon.png',
  './sabah.html',
  './masa.html',
  './quran.html'
];

// 1. حدث التثبيت والتشغيل الفوري
self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(cacheName).then(cache => cache.addAll(assets))
  );
});

// 2. السطر السحري: إبادة وتدمير أي كاش قديم على جهاز المستخدم 🚀
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== cacheName) {
            return caches.delete(key); // مسح النسخ القديمة الفاشلة
          }
        })
      );
    }).then(() => clients.claim())
  );
});

// 3. جلب الملفات أوفلاين
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(res => res || fetch(e.request))
  );
});
