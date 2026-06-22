// ==================== [ 1. برمجة السبحة والذاكرة ] ====================
const tasbeehBtn = document.getElementById('tasbeeh-btn');
const resetBtn = document.getElementById('reset-btn');
const counterView = document.getElementById('counter-view');

let count = localStorage.getItem('myTasbeehCount') ? parseInt(localStorage.getItem('myTasbeehCount')) : 0;
if (counterView) counterView.textContent = count;

if (tasbeehBtn) {
    tasbeehBtn.addEventListener('click', () => {
        count++;
        counterView.textContent = count;
        localStorage.setItem('myTasbeehCount', count);
    });
}

if (resetBtn) {
    resetBtn.addEventListener('click', () => {
        if(confirm("هل تريد تصفير عداد السبحة؟")) {
            count = 0;
            counterView.textContent = count;
            localStorage.setItem('myTasbeehCount', count);
        }
    });
}

// ==================== [ 2. برمجة آية وتدبر ] ====================
const versesList = [
    { text: "«إِنَّ مَعَ الْعُسْرِ يُسْرًا»", source: "[سورة الشرح: 6]" },
    { text: "«وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ»", source: "[سورة الطلاق: 3]" },
    { text: "«أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ»", source: "[سورة الرعد: 28]" },
    { text: "«وَقُل رَّبِّ زِدْنِي عِلْمًا»", source: "[سورة طه: 114]" },
    { text: "«إِنَّ اللَّهَ مَعَ الصَّابِرِينَ»", source: "[سورة البقرة: 153]" },
    { text: "«وَإِذَا سَأَلَكَ عِبَادِي عَنِّي فَإِنِّي قَرِيبٌ»", source: "[سورة البقرة: 186]" }
];

const verseTextEl = document.getElementById('quran-verse');
const verseSourceEl = document.getElementById('verse-surah');
const nextVerseBtn = document.getElementById('next-verse-btn');

if (nextVerseBtn) {
    nextVerseBtn.addEventListener('click', () => {
        const randomIndex = Math.floor(Math.random() * versesList.length);
        const randomVerse = versesList[randomIndex];
        if (verseTextEl) verseTextEl.textContent = randomVerse.text;
        if (verseSourceEl) verseSourceEl.textContent = randomVerse.source;
    });
}

// ==================== [ 3. جلب مواقيت الصلاة الحقيقية أونلاين ] ====================
function getLivePrayerTimes() {
    const city = "Cairo";
    const country = "Egypt";
    const method = 5; 

    const apiUrl = https://api.aladhan.com/v1/timingsByCity?city=${city}&country=${country}&method=${method};

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if(data.code === 200) {
                const timings = data.data.timings;
                const dateInfo = data.data.date;

                if(document.getElementById('fajr')) document.getElementById('fajr').textContent = timings.Fajr;
                if(document.getElementById('sunrise')) document.getElementById('sunrise').textContent = timings.Sunrise;
                if(document.getElementById('dhuhr')) document.getElementById('dhuhr').textContent = timings.Dhuhr;
                if(document.getElementById('asr')) document.getElementById('asr').textContent = timings.Asr;
                if(document.getElementById('maghrib')) document.getElementById('maghrib').textContent = timings.Maghrib;
                if(document.getElementById('isha')) document.getElementById('isha').textContent = timings.Isha;

                const hijri = dateInfo.hijri;
                const gregorian = dateInfo.gregorian;
                if(document.getElementById('prayer-date')) {
                    document.getElementById('prayer-date').textContent = 
                        ${hijri.day} ${hijri.month.ar} ${hijri.year} هـ | ${gregorian.date};
                }
            }
        })
        .catch(error => {
            console.error("خطأ في جلب البيانات:", error);
        });
}

// تشغيل الدالة فوراً
getLivePrayerTimes();
