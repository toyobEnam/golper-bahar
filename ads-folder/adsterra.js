// ===== Adsterra Native Banner =====

const nativeBannerScript = document.createElement("script");

nativeBannerScript.async = true;
nativeBannerScript.setAttribute("data-cfasync", "false");
nativeBannerScript.src = "https://bauval.org/21/09d5b3dba081e537545c7fc7fa968737";

document.body.appendChild(nativeBannerScript);

/* =========================================================
   GOLPER BAHAR - ADSTERRA ADS
   =========================================================

   এখানে শুধু নতুন Adsterra Ads থাকবে।

   ব্যবহার:
   <div class="adsterra-slot" data-ad="320x50"></div>
   <div class="adsterra-slot" data-ad="300x250"></div>
   <div class="adsterra-slot" data-ad="160x600"></div>

   নতুন Ad Code এলে:
   1. নিচে নতুন একটি AD BLOCK তৈরি করবে
   2. AD TYPE অনুযায়ী নাম দিবে
   3. প্রয়োজন হলে শুধু সেই Block-এর code replace করবে

   Native Banner এখানে রাখা হয়নি।
   Native Banner আগের মতোই থাকবে।
========================================================= */


/* =========================================================
   AD: 320 × 50
   ========================================================= */

function loadAd320x50(container) {

    window.atOptions = {
        'key': '40dc1ad928dae0ae6748bec4e1a074f8',
        'format': 'iframe',
        'height': 50,
        'width': 320,
        'params': {}
    };

    const script = document.createElement('script');

    script.setAttribute('data-cfasync', 'false');
    script.src = 'https://bauval.org/22/40dc1ad928dae0ae6748bec4e1a074f8';

    container.appendChild(script);
}


/* =========================================================
   AD: 300 × 250
   ========================================================= */

function loadAd300x250(container) {

    window.atOptions = {
        'key': 'd842d2a7b0a66324471688b86c6073ca',
        'format': 'iframe',
        'height': 250,
        'width': 300,
        'params': {}
    };

    const script = document.createElement('script');

    script.setAttribute('data-cfasync', 'false');
    script.src = 'https://bauval.org/22/d842d2a7b0a66324471688b86c6073ca';

    container.appendChild(script);
}


/* =========================================================
   AD: 160 × 600
   ========================================================= */

function loadAd160x600(container) {

    window.atOptions = {
        'key': '39fbfbae2dd36256117a3c77122b9dd3',
        'format': 'iframe',
        'height': 600,
        'width': 160,
        'params': {}
    };

    const script = document.createElement('script');

    script.setAttribute('data-cfasync', 'false');
    script.src = 'https://bauval.org/22/39fbfbae2dd36256117a3c77122b9dd3';

    container.appendChild(script);
}


/* =========================================================
   AD INITIALIZER
   ========================================================= */

function initAdsterraAds() {

    const adSlots = document.querySelectorAll('.adsterra-slot');

    adSlots.forEach(function (container) {

        // একই Ad যেন দ্বিতীয়বার Load না হয়
        if (container.dataset.loaded === 'true') {
            return;
        }

        const adType = container.dataset.ad;


        /* -------------------------------------------------
           320 × 50
        ------------------------------------------------- */

        if (adType === '320x50') {

            loadAd320x50(container);

        }


        /* -------------------------------------------------
           300 × 250
        ------------------------------------------------- */

        else if (adType === '300x250') {

            loadAd300x250(container);

        }


        /* -------------------------------------------------
           160 × 600
        ------------------------------------------------- */

        else if (adType === '160x600') {

            loadAd160x600(container);

        }


        // Ad successfully initialized
        if (
            adType === '320x50' ||
            adType === '300x250' ||
            adType === '160x600'
        ) {
            container.dataset.loaded = 'true';
        }

    });
}


/* =========================================================
   START ADS
   ========================================================= */

if (document.readyState === 'loading') {

    document.addEventListener('DOMContentLoaded', initAdsterraAds);

} else {

    initAdsterraAds();

}