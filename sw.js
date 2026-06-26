const cacheName = 'zaad-smart-offline-v1';
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

// 1. التثبيت السريع للموقع بدون حظر بسبب الـ PDF الكبير
self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(cacheName).then(cache => {
      return cache.addAll(assets);
    })
  );
});

// 2. تنظيف مخلفات الكاش القديم تماماً
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

// 3. ذكاء جلب الملفات: الملفات العادية أوفلاين، والـ PDF كاش ديناميكي فور الفتح
self.addEventListener('fetch', e => {
  if (e.request.url.includes('quran.pdf')) {
    // إستراتيجية الكاش الديناميكي للمصحف الكبير
    e.respondWith(
      caches.match(e.request).then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse; // لو محفوظ جوه التليفون افتحه فوراً
        }
        return fetch(e.request).then(networkResponse => {
          if (networkResponse && networkResponse.status === 200) {
            const cacheCopy = networkResponse.clone();
            caches.open(cacheName).then(cache => {
              cache.put(e.request, cacheCopy); // حفظه في الذاكرة العميقة تلقائياً
            });
          }
          return networkResponse;
        });
      })
    );
  } else {
    // بقية ملفات الموقع العادية أوفلاين
    e.respondWith(
      caches.match(e.request).then(res => {
        return res || fetch(e.request);
      })
    );
  }
});
