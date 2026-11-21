/**
 * ==========================================
 * অ্যাড কন্ট্রোল প্যানেল (এখান থেকে সব তথ্য পরিবর্তন করবেন)
 * ==========================================
 */
const AD_CONFIG = {
    enableAd: true, // অ্যাড চালু রাখতে true, বন্ধ রাখতে false লিখুন
    delayBeforeShow: 25000, // কতক্ষণ পর অ্যাড আসবে (25000 মিলিসেকেন্ড = ২৫ সেকেন্ড)
    autoHideAfter: 20000,   // কতক্ষণ পর নিজে থেকে চলে যাবে (20000 মিলিসেকেন্ড = ২০ সেকেন্ড)
    
    // অ্যাডের কন্টেন্ট (ভবিষ্যতে এগুলো বদলালেই নতুন অ্যাড হয়ে যাবে)
    imageUrl: "https://res.cloudinary.com/dhj4ovvav/image/upload/v1795277024/897151505_1662289652265423_2500840113489463345_n_pcaqzt.jpg", // এখানে স্কয়ার ইমেজের লিংক দিন
    text: 'লেখিকা ইসরাত জাহান রিতু-র লেখা <b>"ইশক-ই-জুনুন"</b> বইটি প্রি অর্ডার করলেই ৩০০ টাকার বই পেয়ে যাবেন মাত্র ২৮০ টাকায়।',
    
    // বাটন ১ (উপরের বাটন)
    btn1Text: "অর্ডার করতে চাই",
    btn1Link: "https://www.facebook.com/share/18WwYrqpXx/", // অর্ডারের লিংক এখানে বসাবেন
    
    // বাটন ২ (নিচের বাটন)
    btn2Text: "লেখিকার প্রোফাইল",
    btn2Link: "https://www.facebook.com/israt.jahan.ritu.902052"  // লেখিকার প্রোফাইলের লিংক এখানে বসাবেন
};

/**
 * ==========================================
 * নিচের ডিজাইন এবং ফাংশন কোডে হাত দেওয়ার প্রয়োজন নেই
 * ==========================================
 */
(function() {
    if (!AD_CONFIG.enableAd) return;

    // ১. CSS স্টাইল যুক্ত করা
    const style = document.createElement('style');
    style.innerHTML = `
        #gb-floating-ad {
            position: fixed;
            bottom: 20px;
            left: -350px; /* শুরুতে বাম দিকে লুকানো থাকবে */
            width: 280px;
            max-width: 85vw;
            background: #ffffff;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
            border: 1px solid #e2e8f0;
            z-index: 999999;
            padding: 15px;
            font-family: inherit;
            transition: left 0.6s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.5s ease;
            opacity: 0;
            user-select: none;
            touch-action: pan-y;
        }

        /* বাম দিক থেকে স্ক্রিনে আসার ক্লাস */
        #gb-floating-ad.gb-ad-show {
            left: 20px;
            opacity: 1;
        }

        /* ডান দিকে সরে গিয়ে হারিয়ে যাওয়ার ক্লাস */
        #gb-floating-ad.gb-ad-hide-right {
            left: 110vw !important;
            opacity: 0 !important;
        }

        /* উপরে ডানের ক্রস বাটন */
        #gb-ad-close {
            position: absolute;
            top: -10px;
            right: -10px;
            width: 28px;
            height: 28px;
            background: #ef4444;
            color: #ffffff;
            border: 2px solid #ffffff;
            border-radius: 50%;
            font-size: 16px;
            font-weight: bold;
            line-height: 24px;
            text-align: center;
            cursor: pointer;
            box-shadow: 0 2px 6px rgba(0,0,0,0.2);
            transition: transform 0.2s;
        }
        #gb-ad-close:hover {
            transform: scale(1.1);
            background: #dc2626;
        }

        /* স্কয়ার শেপ ইমেজ */
        .gb-ad-img-box {
            width: 100%;
            aspect-ratio: 1 / 1;
            overflow: hidden;
            border-radius: 8px;
            margin-bottom: 12px;
            background: #f8fafc;
        }
        .gb-ad-img-box img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
        }

        /* লেখা */
        .gb-ad-text {
            font-size: 14px;
            line-height: 1.5;
            color: #1e293b;
            margin-bottom: 12px;
            text-align: left;
        }

        /* বাটন ডিজাইন (পাশের দিকে ওয়াইড) */
        .gb-ad-btn {
            display: block;
            width: 100%;
            padding: 9px 12px;
            text-align: center;
            text-decoration: none;
            border-radius: 6px;
            font-size: 14px;
            font-weight: 600;
            box-sizing: border-box;
            transition: background 0.2s, transform 0.1s;
        }
        .gb-ad-btn:active {
            transform: scale(0.98);
        }
        .gb-btn-primary {
            background: #e11d48; /* আকর্ষণীয় লালচে-গোলাপি রঙ */
            color: #ffffff !important;
            margin-bottom: 8px;
        }
        .gb-btn-primary:hover {
            background: #be123c;
        }
        .gb-btn-secondary {
            background: #f1f5f9;
            color: #334155 !important;
            border: 1px solid #cbd5e1;
        }
        .gb-btn-secondary:hover {
            background: #e2e8f0;
        }
    `;
    document.head.appendChild(style);

    // ২. HTML কাঠামো তৈরি
    const adContainer = document.createElement('div');
    adContainer.id = 'gb-floating-ad';
    adContainer.innerHTML = `
        <div id="gb-ad-close" title="বন্ধ করুন">&times;</div>
        <div class="gb-ad-img-box">
            <img src="${AD_CONFIG.imageUrl}" alt="Advertisement">
        </div>
        <div class="gb-ad-text">${AD_CONFIG.text}</div>
        <a href="${AD_CONFIG.btn1Link}" target="_blank" class="gb-ad-btn gb-btn-primary">${AD_CONFIG.btn1Text}</a>
        <a href="${AD_CONFIG.btn2Link}" target="_blank" class="gb-ad-btn gb-btn-secondary">${AD_CONFIG.btn2Text}</a>
    `;

    // পেইজ লোড হওয়ার পর কাজ শুরু হবে
    window.addEventListener('DOMContentLoaded', () => {
        document.body.appendChild(adContainer);
        let autoHideTimer;
        let isClosed = false;

        // অ্যাড বন্ধ করার ফাংশন (ডান দিকে সরে যাবে)
        function closeAdRight() {
            if (isClosed) return;
            isClosed = true;
            clearTimeout(autoHideTimer);
            adContainer.classList.remove('gb-ad-show');
            adContainer.classList.add('gb-ad-hide-right');
            
            // অ্যানিমেশন শেষে DOM থেকে সরিয়ে ফেলা
            setTimeout(() => {
                adContainer.remove();
            }, 600);
        }

        // ২৫ সেকেন্ড পর অ্যাড দেখানো
        setTimeout(() => {
            if (isClosed) return;
            adContainer.classList.add('gb-ad-show');

            // অ্যাড আসার পর ২০ সেকেন্ড কাউন্টডাউন শুরু (কিছু না করলে চলে যাবে)
            autoHideTimer = setTimeout(() => {
                closeAdRight();
            }, AD_CONFIG.autoHideAfter);

        }, AD_CONFIG.delayBeforeShow);

        // ক্রস বাটনে ক্লিক করলে ডান দিকে সরে যাবে
        document.getElementById('gb-ad-close').addEventListener('click', closeAdRight);

        // মোবাইলে ডান দিকে সোয়াইপ (Swipe Right) ডিটেক্ট করা
        let touchStartX = 0;
        let touchEndX = 0;

        adContainer.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        adContainer.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            // যদি অন্তত ৫০ পিক্সেল ডান দিকে সোয়াইপ করা হয়
            if (touchEndX - touchStartX > 50) {
                closeAdRight();
            }
        }, { passive: true });
    });
})();