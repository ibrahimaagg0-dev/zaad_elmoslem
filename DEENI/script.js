// ==================== [ أولاً: برمجة السبحة والذاكرة ] ====================
const tasbeehBtn = document.getElementById('tasbeeh-btn');
const resetBtn = document.getElementById('reset-btn');
const counterView = document.getElementById('counter-view');

let count = localStorage.getItem('myTasbeehCount') ? parseInt(localStorage.getItem('myTasbeehCount')) : 0;
counterView.textContent = count;

tasbeehBtn.addEventListener('click', () => {
    count++;
    counterView.textContent = count;
    localStorage.setItem('myTasbeehCount', count);
});

resetBtn.addEventListener('click', () => {
    if(confirm("هل تريد تصفير عداد السبحة؟")) {
        count = 0;
        counterView.textContent = count;
        localStorage.setItem('myTasbeehCount', count);
    }
});


// ==================== [ ثانياً: برمجة آية وتدبر (عشوائي) ] ====================
// مصفوفة فيها مجموعة آيات جاهزة وتشتغل أوفلاين
const versesList = [
    { text: "«إِنَّ مَعَ الْعُسْرِ يُسْرًا»", source: "[سورة الشرح: 6]" },
    { text: "«وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ»", source: "[سورة الطلاق: 3]" },
    { text: "«أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ»", source: "[سورة الرعد: 28]" },
    { text: "«وَقُل رَّبِّ زِدْنِي عِلْمًا»", source: "[سورة طه: 114]" },
    { text: "«إِنَّ اللَّهَ مَعَ الصَّابِرِينَ»", source: "[سورة البقرة: 153]" },
    { text: "«وَاخْفِضْ لَهُمَا جَنَاحَ الذُّلِّ مِنَ الرَّحْمَةِ»", source: "[سورة الإسراء: 24]" },
    { text: "«وَإِذَا سَأَلَكَ عِبَادِي عَنِّي فَإِنِّي قَرِيبٌ»", source: "[سورة البقرة: 186]" }
];

const verseTextEl = document.getElementById('quran-verse');
const verseSourceEl = document.getElementById('verse-surah');
const nextVerseBtn = document.getElementById('next-verse-btn');

nextVerseBtn.addEventListener('click', () => {
    // اختيار آية عشوائية من القائمة
    const randomIndex = Math.floor(Math.random() * versesList.length);
    const randomVerse = versesList[randomIndex];
    
    // تغيير النص في الصفحة
    verseTextEl.textContent = randomVerse.text;
    verseSourceEl.textContent = randomVerse.source;
    
    // حركة خفيفة لتنبيه العين
    verseTextEl.style.opacity = 0;
    setTimeout(() => { verseTextEl.style.opacity = 1; }, 100);
});


// ==================== [ ثالثاً: جلب مواقيت الصلاة ] ====================
function getPrayerTimes() {
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

                document.getElementById('fajr').textContent = timings.Fajr;
                document.getElementById('sunrise').textContent = timings.Sunrise;
                document.getElementById('dhuhr').textContent = timings.Dhuhr;
                document.getElementById('asr').textContent = timings.Asr;
                document.getElementById('maghrib').textContent = timings.Maghrib;
                document.getElementById('isha').textContent = timings.Isha;

                const hijri = dateInfo.hijri;
                const gregorian = dateInfo.gregorian;
                document.getElementById('prayer-date').textContent = 
                    ${hijri.day} ${hijri.month.ar} ${hijri.year} هـ | ${gregorian.date};
            }
        })
        .catch(error => {
            document.getElementById('fajr').textContent = "04:15";
            document.getElementById('sunrise').textContent = "05:55";
            document.getElementById('dhuhr').textContent = "12:00";
            document.getElementById('asr').textContent = "03:30";
            document.getElementById('maghrib').textContent = "07:00";
            document.getElementById('isha').textContent = "08:30";
            document.getElementById('prayer-date').textContent = "أوقات افتراضية (للمعاينة على اللاب توب)";
        });
}

getPrayerTimes();