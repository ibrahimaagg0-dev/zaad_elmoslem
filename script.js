/**
 * تطبيق زاد المسلم - السكريبت الأساسي المطور
 * يشمل: جلب مواقيت الصلاة أونلاين وحفظها أوفلاين، التمرير السلس، وزر الصعود لأعلى
 */

document.addEventListener('DOMContentLoaded', function () {

    // ==========================================
    // 1. تأثير التمرير السلس لزر مواقيت الصلاة
    // ==========================================
    const prayBtn = document.querySelector('.btn1'); // زر مواقيت الصلاة في الهيدر
    const praySection = document.querySelector('.pray'); // قسم المواعيد
    
    if (prayBtn && praySection) {
        prayBtn.addEventListener('click', function () {
            praySection.scrollIntoView({ behavior: 'smooth' });
        });
    }

    // ==========================================
    // 2. تشغيل وزيادة تفاعلية زر الصعود لأعلى (Scroll To Top)
    // ==========================================
    const scrollBtn = document.querySelector('.scrollBtn');
    
    if (scrollBtn) {
        // إظهار وإخفاء الزرار بناءً على نزول المستخدم في الصفحة
        window.addEventListener('scroll', function () {
            if (window.scrollY > 400) {
                scrollBtn.style.display = "block";
                scrollBtn.style.opacity = "1";
            } else {
                scrollBtn.style.opacity = "0";
                setTimeout(() => {
                    if(window.scrollY <= 400) scrollBtn.style.display = "none";
                }, 200);
            }
        });

        // حركة الصعود السلس عند الضغط على الزر
        scrollBtn.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ==========================================
    // 3. دالة جلب وعرض مواقيت الصلاة (أونلاين + حفظ أوفلاين)
    // ==========================================
    function loadPrayerTimes() {
        const cardsContainer = document.querySelector('.pray .cards');
        const cacheKey = 'last_known_prayer_times';
        
        // منع حدوث أخطاء برمجية إذا لم تكن الحاوية موجودة في الصفحة الحالية
        if (!cardsContainer) return;

        // دالة فرعية لبناء وترتيب كروت الصلاة داخل الصفحة
        function renderCards(timings, isOffline = false) {
            const prayerNames = {
                Fajr: 'الفجر',
                Sunrise: 'الشروق',
                Dhuhr: 'الظهر',
                Asr: 'العصر',
                Maghrib: 'المغرب',
                Isha: 'العشاء'
            };
            
            let html = '';
            
            // إضافة تنويه ذكي للمستخدم في حالة عدم وجود إنترنت
            if (isOffline) {
                html += 
                    <p style="text-align:center; color:#666; font-size:1rem; font-weight:bold; width:100%; margin-bottom:20px; font-family:sans-serif;">
                        ⚠️ وضع الأوفلاين: يتم عرض مواقيت الصلاة بناءً على آخر تحديث تلقائي للموقع
                    </p>
                ;
            }
            
            // تدوير البيانات لإنشاء كروت فخمة متناسقة مع الهوية الخضراء للتطبيق
            for (let [key, name] of Object.entries(prayerNames)) {
                let timeStr = timings[key];
                
                html += 
                    <div class="card" style="background: white; padding: 20px; margin: 12px; border-radius: 15px; box-shadow: 0 4px 15px rgba(0,0,0,0.06); text-align: center; display: inline-block; min-width: 125px; border-top: 4px solid #247429; transition: transform 0.2s;">
                        <h5 style="color: #247429; margin: 0 0 10px 0; font-size: 1.2rem; font-weight: bold; font-family: inherit;">${name}</h5>
                        <span style="font-size: 1.4rem; font-weight: bold; color: #1b4332; font-family: sans-serif;">${timeStr}</span>
                    </div>
                ;
            }
            cardsContainer.innerHTML = html;
        }// أولاً: محاولة جلب المواعيد الحديثة فوراً من السيرفر السحابي (أونلاين)
        fetch('https://api.aladhan.com/v1/timingsByCity?city=Beni+Suef&country=Egypt&method=5')
            .then(response => {
                if (!response.ok) throw new Error('الشبكة غير مستقرة');
                return response.json();
            })
            .then(data => {
                if (data.code === 200) {
                    const timings = data.data.timings;
                    
                    // حفظ المواعيد الفريش في الذاكرة المحلية كاحتياطي للأوفلاين
                    localStorage.setItem(cacheKey, JSON.stringify(timings));
                    
                    // عرض الكروت المحدثة بنجاح
                    renderCards(timings, false);
                }
            })
            .catch(() => {
                // ثانياً: خطة الطوارئ في حالة انقطاع الإنترنت (أوفلاين)
                const savedTimings = localStorage.getItem(cacheKey);
                if (savedTimings) {
                    // جلب النسخة المخزنة من ذاكرة المتصفح فوراُ
                    renderCards(JSON.parse(savedTimings), true);
                } else {
                    // رسالة توجيهية إذا كان التطبيق يفتح لأول مرة في التاريخ بدون إنترنت
                    cardsContainer.innerHTML = 
                        <p style="text-align:center; color:#d32f2f; width:100%; font-weight:bold; padding: 20px; font-size:1.1rem;">
                            برجاء الاتصال بالإنترنت لمرة واحدة فقط لتفعيل وعرض مواقيت الصلاة تلقائياً.
                        </p>
                    ;
                }
            });
    }

    // تشغيل جلب مواقيت الصلاة تلقائياً فور جاهزية الصفحة
    loadPrayerTimes();

});
