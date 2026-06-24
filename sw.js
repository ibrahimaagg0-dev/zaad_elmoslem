const cacheName = 'zaad-v6'; // رفعنا الفيرجن لـ v6 للتأكيد
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

// حدث التثبيت - مع طرد الحارس القديم فوراً
self.addEventListener('install', e => {
  self.skipWaiting(); // السطر السحري لإجبار التحديث الفوري 🚀
  e.waitUntil(
    caches.open(cacheName).then(cache => {
      return cache.addAll(assets);
    })
  );
});

// تفعيل السيرفيس وركر الجديد والسيطرة على الصفحة فوراً
self.addEventListener('activate', e => {
  e.waitUntil(clients.claim()); 
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(res => {
      return res || fetch(e.request);
    })
  );
});
