const cacheName = 'zaad-offline-pdf-v1'; // اسم كاش جديد ونظيف
const assets = [
  './',
  './index.html',
  './style.css',
  './manifest.json',
  './icon.png',
  './sabah.html',
  './masa.html',
  './quran.html',
  './quran.pdf' // حفرنا ملف المصحف الـ PDF هنا عشان ينزل جوه ذاكرة تليفونك ويشتغل بدون نت 🚀
];

// تثبيت التطبيق وتحميل الملفات في ذاكرة الجهاز العميقة
self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(cacheName).then(cache => {
      return cache.addAll(assets);
    })
  );
});

// مسح أي كاش قديم لتنظيف المتصفح فوراً
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

// تشغيل الموقع وقراءة الملفات من ذاكرة الجهاز مباشرة (حتى لو النت مقفول)
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(res => {
      return res || fetch(e.request);
    })
  );
});
