const cacheName = 'zaad-v4';
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

// حدث التثبيت وتخزين الملفات أوفلاين
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(cacheName).then(cache => {
      return cache.addAll(assets);
    })
  );
});

// حدث جلب البيانات وتشغيل الموقع بدون نت بذكاء
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(res => {
      return res || fetch(e.request);
    })
  );
});
