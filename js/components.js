const isGitHub = location.hostname.includes("github.io");
const basePath = isGitHub ? "/golper-bahar" : "";

function loadComponent(id, file) {
  fetch(`${basePath}${file}`)
    .then(res => res.text())
    .then(html => {
      const el = document.getElementById(id);
      if (el) el.innerHTML = html;
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
    { name: "গল্পের বাহার", link: "https://golperbahar.com/" },
    { name: "আমাদের কথা", link: "https://golperbahar.com/about/" },
    { name: "গল্পের ক্যাটাগরি", link: "https://golperbahar.com/stories/" },
    // { name: "অনুগল্প", link: "https://golperbahar.com/onugolpo/" },
    { name: "লেখক প্যানেল", link: "https://golperbahar.com/writers/" },
    { name: "প্রাইভেসি পলিসি", link: "https://golperbahar.com/privacy-policy/" },
    { name: "উপহার পাতা", link: "https://golperbahar.com/gift/" },
    // { name: "গল্প খুজুন", link: "#" }
  ];

  const current = location.pathname.split("/").pop();

  const target = document.getElementById("upNav");
  if(!target) return;

  /* ========= build structure ========= */
  const wrap = document.createElement("div");
  wrap.className = "upnav-wrap";

  const nav = document.createElement("nav");
  nav.className = "upnav";

  menus.forEach(item=>{
    const a = document.createElement("a");
    a.href = item.link;
    a.textContent = item.name;

    if(current === item.link){
      a.classList.add("active");
    }

    nav.appendChild(a);
  });

  wrap.appendChild(nav);
  target.appendChild(wrap);

  /* ========= hide / show on scroll ========= */

let lastScroll = window.pageYOffset;
const threshold = 250;   // কত scroll হলে hide start করবে

window.addEventListener("scroll", function(){
  const currentScroll = window.pageYOffset;

  // top area → always show
  if(currentScroll < threshold){
    wrap.classList.remove("hide");
    lastScroll = currentScroll;
    return;
  }

  if(currentScroll > lastScroll){
    wrap.classList.add("hide");     // down
  }else{
    wrap.classList.remove("hide");  // up
  }

  lastScroll = currentScroll;
});

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

/* ---------------------------------------------------------------------
-------------------    Story Comments Component    ----------------------
--------------------------------------------------------------------- */

// (function(){

// const form =
// document.getElementById("gbCommentForm");

// if(!form) return;

// form.addEventListener("submit",function(e){

// e.preventDefault();

// });

// })();

const COMMENTS_API =
"https://script.google.com/macros/s/AKfycbzeh6I6N7ChaYY6wfYM5llYftpmBWs8U2sunrIYLHfrZ_9hDCs53B1Tifv0XLmpSKV3Rg/exec";

(function(){

const target =
document.getElementById("story-comments");

if(!target) return;

target.innerHTML = `

<section class="gb-comments">

<h2 class="gb-comments-title">
আপনার মতামত জানান
</h2>

<form
id="gbCommentForm"
class="gb-comment-form">

<input
id="gbCommentName"
type="text"
required
class="gb-comment-input"
placeholder="আপনার নাম">

<textarea
id="gbCommentText"
required
class="gb-comment-textarea"
placeholder="আপনার মন্তব্য লিখুন"></textarea>

<button
id="gbCommentSubmit"
type="submit"
class="gb-comment-submit">
মতামত পাঠান
</button>

</form>

<div id="gbCommentToast"></div>

</section>

`;

})();

/* ===== Comment Submit ===== */

document.addEventListener(
"submit",
async function(e){

const form =
e.target;

if(
form.id !==
"gbCommentForm"
) return;

e.preventDefault();

const name =
document
.getElementById(
"gbCommentName"
)
.value
.trim();

const comment =
document
.getElementById(
"gbCommentText"
)
.value
.trim();

if(
!name ||
!comment
){
return;
}

const submitBtn =
document
.getElementById(
"gbCommentSubmit"
);

submitBtn.disabled = true;

submitBtn.textContent =
"পাঠানো হচ্ছে...";

try{

const path =
location.pathname
.replace(/^\/|\/$/g,"")
.split("/");

const payload = {

storySlug:
path[2] || "",

episode:
path[3] || "",

pageUrl:
location.href,

name:
name,

comment:
comment

};

const formData =
new FormData();

formData.append(
"data",
JSON.stringify(
payload
)
);

const response =
await fetch(
COMMENTS_API,
{
method:"POST",
body:
formData
}
);

const result =
await response.json();

if(result.success){

form.reset();

alert(
"আপনার মতামতটি খুব শীঘ্রই এখানে প্রকাশিত হবে, ইনশাআল্লাহ।"
);

}else{

alert(
"দুঃখিত, মন্তব্য পাঠানো যায়নি।"
);

}

}catch(error){

console.error(error);

alert(
error?.message ||
error?.toString() ||
"Unknown Error"
);

}

submitBtn.disabled = false;

submitBtn.textContent =
"মতামত পাঠান";

}
);


/* ===== End Comment Submit ===== */


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