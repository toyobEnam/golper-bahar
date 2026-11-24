// ===== Adsterra Native Banner =====

const nativeBannerScript = document.createElement("script");

nativeBannerScript.async = true;
nativeBannerScript.setAttribute("data-cfasync", "false");
nativeBannerScript.src = "https://bauval.org/21/09d5b3dba081e537545c7fc7fa968737";

document.body.appendChild(nativeBannerScript);

/* =========================================================
   GOLPER BAHAR - ADSTERRA ADS
   =========================================================

   IMPORTANT:
   Adsterra 320x50 / 300x250 / 160x600
   একই page-এ থাকলে atOptions conflict এড়ানোর জন্য
   সব ad sequentially load করা হবে।

   HTML Placeholder:

   <div class="adsterra-slot" data-ad="320x50"></div>
   <div class="adsterra-slot" data-ad="300x250"></div>
   <div class="adsterra-slot" data-ad="160x600"></div>

   Native Banner-এর কোনো code এখানে নেই।
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

    return new Promise(function (resolve, reject) {

        script.onload = resolve;
        script.onerror = reject;

        container.appendChild(script);

    });
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

    return new Promise(function (resolve, reject) {

        script.onload = resolve;
        script.onerror = reject;

        container.appendChild(script);

    });
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

    return new Promise(function (resolve, reject) {

        script.onload = resolve;
        script.onerror = reject;

        container.appendChild(script);

    });
}


/* =========================================================
   AD LOADER
   ========================================================= */

async function loadAdsterraSlot(container) {

    // একই slot দ্বিতীয়বার load হবে না
    if (container.dataset.loaded === 'true') {
        return;
    }

    const adType = container.dataset.ad;

    try {

        /* -------------------------------------------------
           320 × 50
        ------------------------------------------------- */

        if (adType === '320x50') {

            await loadAd320x50(container);

        }


        /* -------------------------------------------------
           300 × 250
        ------------------------------------------------- */

        else if (adType === '300x250') {

            await loadAd300x250(container);

        }


        /* -------------------------------------------------
           160 × 600
        ------------------------------------------------- */

        else if (adType === '160x600') {

            await loadAd160x600(container);

        }


        else {

            return;

        }


        container.dataset.loaded = 'true';

    }

    catch (error) {

        console.error(
            'Adsterra ad load failed:',
            adType,
            error
        );

    }
}


/* =========================================================
   INITIALIZE ALL ADS
   ========================================================= */

async function initAdsterraAds() {

    const adSlots = document.querySelectorAll('.adsterra-slot');

    /*
       গুরুত্বপূর্ণ:

       এখানে forEach ব্যবহার করা হয়নি।

       কারণ 320x50 load হওয়ার আগেই 300x250-এর
       atOptions সেট হয়ে গেলে conflict হতে পারে।

       তাই একটার পর একটা load হবে।
    */

    for (const container of adSlots) {

        await loadAdsterraSlot(container);

    }

}


/* =========================================================
   START
   ========================================================= */

if (document.readyState === 'loading') {

    document.addEventListener(
        'DOMContentLoaded',
        initAdsterraAds
    );

}

else {

    initAdsterraAds();

}