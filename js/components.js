const isGitHub = location.hostname.includes("github.io");
const basePath = isGitHub ? "/golper-bahar" : "";

function loadComponent(id, file) {
  fetch(`${basePath}${file}`)
    .then(res => res.text())
    .then(html => {
      const el = document.getElementById(id);
      if (el) {
        el.innerHTML = html;

        // ফুটার লোড হওয়ার পর Adsterra স্ক্রিপ্ট এক্সিকিউট করা
        if (id === "footer") {
          const adContainer = document.getElementById("container-09d5b3dba081e537545c7fc7fa968737");
          if (adContainer) {
            const adScript = document.createElement("script");
            adScript.async = true;
            adScript.setAttribute("data-cfasync", "false");
            adScript.src = "https://pl30115573.profitableratecpmnetwork.com/09d5b3dba081e537545c7fc7fa968737/invoke.js";
            document.body.appendChild(adScript);
          }
        }
      }
    })
    .catch(err => console.error("Component load error:", err));
}

// load footer
loadComponent("footer", "/components/footer/footer.html");


function goBack() {
  if (window.history.length > 1) {
    window.history.back();
  } else {
    window.location.href = "https://www.golperbahar.com";
  }
}


(function(){

  const menus = [
    { name: "হোমপেজ", link: "https://golperbahar.com/" },
    { name: "ধারাবাহিক গল্প", link: "https://golperbahar.com/stories/" },
    { name: "ছোটগল্প", link: "https://golperbahar.com/short-stories/" },
    { name: "অনুগল্প", link: "https://golperbahar.com/onugolpo/" },
    { name: "লেখক প্যানেল", link: "https://golperbahar.com/writers/" },
    { name: "বাংলা পোস্ট", link: "https://golperbahar.com/blogs/" },
    { name: "আমাদের কথা", link: "https://golperbahar.com/about/" },
    { name: "সার্চ করুন", link: "https://golperbahar.com/search/" }
  ];

  const target = document.getElementById("upNav");
  if(!target) return;

  const currentPath = window.location.pathname;

  const menuHtml = menus.map(item => {
    const itemPath = new URL(item.link).pathname;
    let isActive = false;
    if (itemPath === "/" || itemPath === "") {
      isActive = currentPath === "/" || currentPath === "";
    } else {
      isActive = currentPath.startsWith(itemPath);
    }
    const activeClass = isActive ? ' active' : '';
    return `<a href="${item.link}" class="upnav-link${activeClass}">${item.name}</a>`;
  }).join("");

  target.innerHTML = `
    <div class="upnav-wrap">
      <div class="upnav-inner">
        <a href="https://golperbahar.com/" class="upnav-brand">
          <img src="https://golperbahar.com/favicon.ico" alt="লোগো" class="upnav-brand-img">
          <span class="upnav-brand-text">গল্পের বাহার</span>
        </a>
        <button type="button" class="upnav-toggle" aria-label="মেনু খুলুন">
          <span></span>
          <span></span>
          <span></span>
        </button>
        <nav class="upnav">${menuHtml}</nav>
      </div>
    </div>
  `;

  /* ========= Toggle Hamburger Menu ========= */

  const toggleBtn = target.querySelector(".upnav-toggle");
  const navMenu = target.querySelector(".upnav");

  if(toggleBtn && navMenu){
    toggleBtn.addEventListener("click", function(e){
      e.stopPropagation();
      toggleBtn.classList.toggle("open");
      navMenu.classList.toggle("show");
    });

    document.addEventListener("click", function(e){
      if(!target.contains(e.target)){
        toggleBtn.classList.remove("open");
        navMenu.classList.remove("show");
      }
    });
  }

  

})();

const categoryMap = {

"romantic-thriller":"রোমান্টিক থ্রিলার",
"thriller":"দুর্দান্ত থ্রিলার",
"bangla-love-story":"রোমান্টিক",
"family-drama":"ফ্যামিলি ড্রামা",
"social-plot":"সামাজিক",
"teenager-special":"টিনেজার স্পেশাল",
"sangsarik":"সাংসারিক",
"onugolpo":"অনুগল্প",
"bangla-suspense":"রহস্যের বেড়াজাল"

};

function toBanglaNumber(num){

return String(num).replace(/\d/g, d =>
"০১২৩৪৫৬৭৮৯"[d]
);

}

(function(){

const target = document.getElementById("upNav");

if(!target) return;

const path = location.pathname
.replace(/^\/|\/$/g,"")
.split("/");

if(path[0] !== "stories") return;

const wrap = document.createElement("div");

wrap.className = "gb-breadcrumb-wrap";

const nav = document.createElement("nav");

nav.className = "gb-breadcrumb";

/* ===== Stories Home ===== */

if(path.length === 1){

wrap.innerHTML = `
<div class="gb-breadcrumb">
<a href="https://golperbahar.com/">হোমপেজ</a>
<span>›</span>
<span class="current">ক্যাটাগরি</span>
</div>
`;

target.insertAdjacentElement("afterend", wrap);

return;

}

let html = `
<a href="https://golperbahar.com/">হোমপেজ</a>
<span>›</span>

<a href="https://golperbahar.com/stories/">ক্যাটাগরি</a>
`;

/* ===== Category ===== */

if(path[1]){

const categoryName =
categoryMap[path[1]]
|| decodeURIComponent(path[1]).replace(/-/g," ");

if(path.length === 2){

html += `
<span>›</span>
<span class="current">${categoryName}</span>
`;

}else{

html += `
<span>›</span>
<a href="https://golperbahar.com/stories/${path[1]}/">
${categoryName}
</a>
`;

}

}

/* ===== Story ===== */

if(path[2]){

const storyTitleElement =
document.querySelector(".story-title")
|| document.querySelector(".header h1");

const storyName =
storyTitleElement
? storyTitleElement.textContent.trim()
: decodeURIComponent(path[2]).replace(/-/g," ");

/* episode page */
if(path[3]){

html += `
<span>›</span>
<a href="https://golperbahar.com/stories/${path[1]}/${path[2]}/">
${storyName}
</a>
`;

}else{

/* story index page */

html += `
<span>›</span>
<span class="current">${storyName}</span>
`;

}

}

/* ===== Episode ===== */

if(path[3]){

const rawEpisode =
decodeURIComponent(path[3]);

const episodeNumber =
rawEpisode.replace(/[^\d]/g,"");

const ep = toBanglaNumber(
episodeNumber || rawEpisode
);

html += `
<span>›</span>
<span class="current">পর্ব ${ep}</span>
`;

}

wrap.innerHTML = `<div class="gb-breadcrumb">${html}</div>`;

target.insertAdjacentElement("afterend", wrap);

})();

/* ===== Dynamic Breadcrumb Schema ===== */

(function(){

const path = location.pathname
.replace(/^\/|\/$/g,"")
.split("/");

if(path[0] !== "stories") return;

const breadcrumbItems = [];

/* ===== Home ===== */

breadcrumbItems.push({

"@type":"ListItem",
"position":1,
"name":"হোমপেজ",
"item":"https://golperbahar.com/"

});

/* ===== Stories ===== */

breadcrumbItems.push({

"@type":"ListItem",
"position":2,
"name":"সকল গল্প",
"item":"https://golperbahar.com/stories/"

});

/* ===== Category ===== */

if(path[1]){

const categoryName =
categoryMap[path[1]]
|| decodeURIComponent(path[1]).replace(/-/g," ");

breadcrumbItems.push({

"@type":"ListItem",
"position":breadcrumbItems.length + 1,
"name":categoryName,
"item":`https://golperbahar.com/stories/${path[1]}/`

});

}

/* ===== Story ===== */

if(path[2]){

const storyTitleElement =
document.querySelector(".story-title")
|| document.querySelector(".header h1");

const storyName =
storyTitleElement
? storyTitleElement.textContent.trim()
: decodeURIComponent(path[2]).replace(/-/g," ");

breadcrumbItems.push({

"@type":"ListItem",
"position":breadcrumbItems.length + 1,
"name":storyName,
"item":`https://golperbahar.com/stories/${path[1]}/${path[2]}/`

});

}

/* ===== Episode ===== */

if(path[3]){

const rawEpisode =
decodeURIComponent(path[3]);

const episodeNumber =
rawEpisode.replace(/[^\d]/g,"");

const ep =
toBanglaNumber(
episodeNumber || rawEpisode
);

breadcrumbItems.push({

"@type":"ListItem",
"position":breadcrumbItems.length + 1,
"name":`পর্ব ${ep}`,
"item":window.location.href

});

}

/* ===== Inject Schema ===== */

const schema = {

"@context":"https://schema.org",
"@type":"BreadcrumbList",
"itemListElement":breadcrumbItems

};

const script =
document.createElement("script");

script.type = "application/ld+json";

script.textContent =
JSON.stringify(schema);

document.head.appendChild(script);

})();

// ===== Copy Link =====

const box = document.getElementById("copy-link");

if(box){

box.innerHTML = `
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
<path stroke-linecap="round" stroke-linejoin="round"
d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244"/>
</svg>
<span id="copyText">Copy Link</span>
`;

box.addEventListener("click",function(){

navigator.clipboard.writeText(window.location.href);

const text = document.getElementById("copyText");

text.textContent="Copied! ✔";

setTimeout(function(){

text.textContent="Copy Link";

},2000);

});

}

/* ==========================================================
   Golper Bahar: Automated Fast Comment System & View Trigger
========================================================== */

const GB_APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwU75Chu74PABjZ_GYXT4fGD6XTAU1KXA5sS7WnP7tdeOcxsPAMtyAjKiaPlCKzutDW/exec";

// ১. কাস্টম রেসপন্সিভ মোডাল ফাংশন
function showGbModal(message) {
  return new Promise((resolve) => {
    const existing = document.querySelector(".gb-custom-modal-overlay");
    if (existing) existing.remove();

    const overlay = document.createElement("div");
    overlay.className = "gb-custom-modal-overlay";
    overlay.innerHTML = `
      <div class="gb-custom-modal">
        <div class="gb-custom-modal-msg">${message}</div>
        <button type="button" class="gb-custom-modal-btn">ঠিক আছে</button>
      </div>
    `;

    document.body.appendChild(overlay);
    document.body.classList.add("gb-modal-open");

    const closeBtn = overlay.querySelector(".gb-custom-modal-btn");
    closeBtn.focus();

    function close() {
      overlay.remove();
      document.body.classList.remove("gb-modal-open");
      resolve();
    }

    closeBtn.addEventListener("click", close);
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) close();
    });
  });
}

// ২. রিডার আইডি ও ৫ মিনিটের কুলডাউন হেল্পার
function getGbReaderId() {
  let id = localStorage.getItem("gb_reader_id");
  if (!id) {
    id = "gb_" + Date.now() + "_" + Math.random().toString(36).substring(2, 8);
    localStorage.setItem("gb_reader_id", id);
  }
  return id;
}

function isGbCooldownActive(pageKey) {
  const lastTime = localStorage.getItem("gb_cooldown_" + pageKey);
  if (!lastTime) return false;
  const diffMinutes = (Date.now() - parseInt(lastTime, 10)) / (1000 * 60);
  return diffMinutes < 5;
}

// ৩. DOMContentLoaded-এ UI রেন্ডার ও সাবমিশন হ্যান্ডলার
document.addEventListener("DOMContentLoaded", function () {
  const pathParts = window.location.pathname.replace(/^\/|\/$/g, "").split("/").filter(Boolean);
  
  // ক) সুনির্দিষ্ট ৩টি ইনডেক্স ও অনুগল্প পাতার ভিউ ট্র্যাকিং
  let isCountableViewPage = false;
  let viewStorySlug = "";
  let viewIndexPath = "";

  // ১. ধারাবাহিক গল্প: /stories/category-name/story-slug/
  if (pathParts.length === 3 && pathParts[0] === "stories") {
    isCountableViewPage = true;
    viewStorySlug = pathParts[2];
    viewIndexPath = pathParts.join("/") + "/index.html";
  }
  // ২. ছোটগল্প: /short-stories/category-name/story-slug/
  else if (pathParts.length === 3 && pathParts[0] === "short-stories") {
    isCountableViewPage = true;
    viewStorySlug = pathParts[2];
    viewIndexPath = pathParts.join("/") + "/index.html";
  }
  // ৩. অনুগল্প: /onugolpo/slug/
  else if (pathParts.length === 2 && pathParts[0] === "onugolpo") {
    isCountableViewPage = true;
    viewStorySlug = pathParts[1];
    viewIndexPath = pathParts.join("/") + "/index.html";
  }

  if (isCountableViewPage && viewStorySlug && viewIndexPath) {
    try {
      fetch(GB_APPS_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "view",
          storySlug: viewStorySlug,
          indexPath: viewIndexPath
        })
      }).catch(() => {});
    } catch (err) {}
  }

  // খ) কমেন্ট বক্স ইনজেক্ট করা (যদি পাতায় #story-comments থাকে)
  const commentContainer = document.getElementById("story-comments");
  if (!commentContainer) return;

  let commentStorySlug = "unknown-story";
  let commentEpisode = "index";
  let filePath = pathParts.join("/") + "/index.html";

  if (pathParts.length >= 2) {
    const last = pathParts[pathParts.length - 1];
    if (last.startsWith("part-")) {
      commentEpisode = last;
      commentStorySlug = pathParts[pathParts.length - 2];
    } else {
      commentStorySlug = last;
      commentEpisode = pathParts[0] === "onugolpo" ? "অনুগল্প" : "ইনডেক্স";
    }
  }

  commentContainer.innerHTML = `
    <div class="gb-comment-box-card">
      <h3 class="gb-comment-heading">আপনার মন্তব্য জানান</h3>
      <form id="gbCommentForm" class="gb-comment-form">
        <input type="text" id="gbCommentName" class="gb-form-input" placeholder="আপনার নাম" required autocomplete="name">
        <textarea id="gbCommentText" class="gb-form-textarea" placeholder="আপনার মন্তব্য লিখুন..." required></textarea>
        <button type="submit" id="gbCommentSubmit" class="gb-comment-btn">মন্তব্য জমা দিন</button>
      </form>
      <div class="gb-comment-note">
        আপনার একটি সুন্দর মন্তব্য লেখক বা লেখিকার জন্য উতসাহ এবং আমাদের জন্য অনুপ্রেরণা, আশা করি এই গল্পটি পড়া শেষ হলে আপনি একটি সুন্দর মন্তব্য করবেন
      </div>
    </div>
  `;

  // গ) ফর্ম সাবমিশন ও কঠোর ভ্যালিডেশন
  const form = document.getElementById("gbCommentForm");
  const submitBtn = document.getElementById("gbCommentSubmit");
  const nameInput = document.getElementById("gbCommentName");
  const textInput = document.getElementById("gbCommentText");

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const name = nameInput.value.trim();
    const comment = textInput.value.trim();

    // ১. কুলডাউন চেক (৫ মিনিট)
    if (isGbCooldownActive(filePath)) {
      await showGbModal("আপনি এই পেইজে ইতোমধ্যে একটি মন্তব্য জানিয়েছেন, অনুগ্রহ করে পরে আবার চেষ্টা করুন");
      return;
    }

    // ২. শব্দ সংখ্যা চেক (ন্যূনতম ৩ শব্দ হতে হবে)
    const words = comment.split(/\s+/).filter(w => w.length > 0);
    if (words.length < 3) {
      await showGbModal("অনুগ্রহ করে বিস্তারিত মন্তব্য জানান");
      return;
    }

    // ৩. ক্যারেক্টার লিমিট (সর্বোচ্চ ৬০০) ও লাইন ব্রেক (সর্বোচ্চ ১০)
    const lineBreaks = (comment.match(/\n/g) || []).length;
    if (comment.length > 600 || lineBreaks > 10) {
      await showGbModal("সম্মানিত পাঠক, অনুগ্রহ করে আরেকটু সংক্ষিপ্ত লেখা প্রদান করবেন।");
      return;
    }

    // ৪. সাবমিট প্রক্রিয়া শুরু
    submitBtn.disabled = true;
    submitBtn.textContent = "জমা হচ্ছে...";

    try {
      const response = await fetch(GB_APPS_SCRIPT_URL, {
        method: "POST",
        body: JSON.stringify({
          action: "comment",
          storySlug: commentStorySlug,
          episode: commentEpisode,
          filePath: filePath,
          name: name,
          comment: comment,
          readerId: getGbReaderId()
        })
      });

      const res = await response.json();
      if (res.success) {
        localStorage.setItem("gb_cooldown_" + filePath, Date.now().toString());
        await showGbModal("আপনার মূল্যবান মতামত এর জন্য ধন্যবাদ, যথাযথ যাচাইয়ের পর মন্তব্যটি এখানে সংযুক্ত করা হবে।");
        form.reset();
      } else {
        await showGbModal(res.message || "মন্তব্য গ্রহণ করা যায়নি। আবার চেষ্টা করুন।");
      }
    } catch (err) {
      await showGbModal("আপনার মূল্যবান মতামত এর জন্য ধন্যবাদ, যথাযথ যাচাইয়ের পর মন্তব্যটি এখানে সংযুক্ত করা হবে।");
      form.reset();
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "মন্তব্য জমা দিন";
    }
  });
});

/* ==========================================================
   Golper Bahar: Automated Fast Comment System Ending Point
========================================================== */


// Google Analytics
document.addEventListener("DOMContentLoaded", function(){

var gaScript = document.createElement("script");
gaScript.async = true;
gaScript.src = "https://www.googletagmanager.com/gtag/js?id=G-0FZ5HZ5B7V";
document.head.appendChild(gaScript);

window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}

gtag('js', new Date());
gtag('config', 'G-0FZ5HZ5B7V');

});


//  =========== right click and select off ============= 



document.addEventListener("contextmenu", e => e.preventDefault());

document.addEventListener("selectstart", e => e.preventDefault());

document.addEventListener("dragstart", e => e.preventDefault());

document.addEventListener("copy", e => e.preventDefault());

document.addEventListener("cut", e => e.preventDefault());

document.addEventListener("keydown", function(e){

    // Ctrl+A
    if(e.ctrlKey && e.key.toLowerCase()==="a"){
        e.preventDefault();
    }

    // Ctrl+C
    if(e.ctrlKey && e.key.toLowerCase()==="c"){
        e.preventDefault();
    }

    // Ctrl+X
    if(e.ctrlKey && e.key.toLowerCase()==="x"){
        e.preventDefault();
    }

    // Ctrl+S
    if(e.ctrlKey && e.key.toLowerCase()==="s"){
        e.preventDefault();
    }

    // Ctrl+U
    if(e.ctrlKey && e.key.toLowerCase()==="u"){
        e.preventDefault();
    }

    // Ctrl+P
    if(e.ctrlKey && e.key.toLowerCase()==="p"){
        e.preventDefault();
    }

    // F12
    if(e.key==="F12"){
        e.preventDefault();
    }

});
