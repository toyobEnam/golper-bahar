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
    { name: "হোমপেজ", link: "https://golperbahar.com/" },
    { name: "আমাদের কথা", link: "https://golperbahar.com/about/" },
    { name: "লেখক প্যানেল", link: "https://golperbahar.com/writers/" },
    { name: "বাংলা পোস্ট", link: "https://golperbahar.com/blogs/" },
    { name: "ধারাবাহিক গল্প", link: "https://golperbahar.com/stories/" },
    { name: "ছোটগল্প", link: "https://golperbahar.com/short-stories/" },
    { name: "অনুগল্প", link: "https://golperbahar.com/onugolpo/" },
    { name: "সার্চ করুন", link: "https://golperbahar.com/search/" }
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
const threshold = 250;

window.addEventListener("scroll", function(){

  const currentScroll = window.pageYOffset;

  if(currentScroll < threshold){
    wrap.classList.remove("hide");
    lastScroll = currentScroll;
    return;
  }

  if(currentScroll > lastScroll){
    wrap.classList.add("hide");
  }else{
    wrap.classList.remove("hide");
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

function getReaderId(){

let readerId =
localStorage.getItem(
"gb_reader_id"
);

if(!readerId){

readerId =
"gb_" +
Date.now() +
"_" +
Math.random()
.toString(36)
.substring(2,10);

localStorage.setItem(
"gb_reader_id",
readerId
);

}

return readerId;

}

function showSecretPinModal(){

return new Promise(resolve=>{

const overlay =
document.createElement("div");

overlay.className =
"gb-pin-modal-overlay";

overlay.innerHTML = `

<div class="gb-pin-modal">

<div class="gb-pin-modal-title">
সেক্রেট পিন কোড
</div>

<input
type="password"
class="gb-pin-modal-input"
placeholder="সেক্রেট পিন প্রবেশ করান">

<div class="gb-pin-modal-actions">

<button
class="gb-pin-btn gb-pin-btn-cancel">
বাতিল
</button>

<button
class="gb-pin-btn gb-pin-btn-confirm">
নিশ্চিত করুন
</button>

</div>

</div>

`;

document.body.appendChild(
overlay
);

document.body.classList.add(
"gb-modal-open"
);

const input =
overlay.querySelector(
".gb-pin-modal-input"
);

input.focus();

function closeModal(value){

overlay.remove();

document.body.classList.remove(
"gb-modal-open"
);

resolve(value);

}

overlay
.querySelector(
".gb-pin-btn-cancel"
)
.addEventListener(
"click",
()=>closeModal(null)
);

overlay
.querySelector(
".gb-pin-btn-confirm"
)
.addEventListener(
"click",
()=>closeModal(
input.value.trim()
)
);

overlay.addEventListener(
"click",
function(e){

if(
e.target === overlay
){

closeModal(null);

}

}
);

input.addEventListener(
"keydown",
function(e){

if(
e.key === "Enter"
){

closeModal(
input.value.trim()
);

}

if(
e.key === "Escape"
){

closeModal(null);

}

}
);

});

}

function showMessageModal(title,message){

return new Promise(resolve=>{

const overlay =
document.createElement("div");

overlay.className =
"gb-pin-modal-overlay";

overlay.innerHTML = `

<div class="gb-pin-modal">

<div class="gb-pin-modal-title">
${title}
</div>

<div
style="
padding:10px 0 20px;
text-align:center;
line-height:1.7;
font-size:15px;
">
${message}
</div>

<div class="gb-pin-modal-actions">

<button
class="gb-pin-btn gb-pin-btn-confirm"
style="width:100%;">
ঠিক আছে
</button>

</div>

</div>

`;

document.body.appendChild(
overlay
);

document.body.classList.add(
"gb-modal-open"
);

function closeModal(){

overlay.remove();

document.body.classList.remove(
"gb-modal-open"
);

resolve();

}

overlay
.querySelector(
".gb-pin-btn-confirm"
)
.addEventListener(
"click",
closeModal
);

overlay.addEventListener(
"click",
function(e){

if(
e.target === overlay
){

closeModal();

}

}
);

document.addEventListener(
"keydown",
function escHandler(e){

if(
e.key === "Escape"
){

document.removeEventListener(
"keydown",
escHandler
);

closeModal();

}

}
);

});

}

(function(){

const target =
document.getElementById("story-comments");

if(!target) return;

target.innerHTML = `

<section class="gb-comments">

<h2 class="gb-comments-title">
আপনার মন্তব্য জানান
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
maxlength="1300"
class="gb-comment-textarea"
placeholder="আপনার মন্তব্য লিখুন"></textarea>

<button
id="gbCommentSubmit"
type="submit"
class="gb-comment-submit">
মন্তব্য পোস্ট করুন
</button>

</form>

<div id="gbCommentToast"></div>

<div
id="gbCommentsSection"
style="display:none;">

<h3 class="gb-comments-heading">
পাঠকদের মন্তব্য দেখুন
</h3>

<div
id="gbCommentsList"
class="gb-comments-list">
</div>

<button
id="gbLoadMoreComments"
class="gb-comments-more"
style="display:none;">
আরও মতামত দেখুন
</button>

</div>

</section>

`;

})();

let allComments = [];
let visibleComments = 5;

async function loadApprovedComments(){

try{

const currentUrl =
window.location.href
.replace(/\/$/,"");

const res =
await fetch(
COMMENTS_API +
"?live=1&pageUrl=" +
encodeURIComponent(
currentUrl
)
);

const data =
await res.json();

allComments = data;

allComments.sort((a,b)=>{

if(
a.pinned &&
!b.pinned
) return -1;

if(
!a.pinned &&
b.pinned
) return 1;

return 0;

});

renderComments();

}catch(err){

console.error(err);

}

}

function renderComments(){

const section =
document.getElementById(
"gbCommentsSection"
);

const list =
document.getElementById(
"gbCommentsList"
);

const loadMore =
document.getElementById(
"gbLoadMoreComments"
);

if(
!section ||
!list
) return;

if(
allComments.length === 0
){

section.style.display =
"none";

return;

}

section.style.display =
"block";

list.innerHTML = "";

allComments
.slice(0,visibleComments)
.forEach(comment=>{

const card =
document.createElement("div");

card.className =
"gb-comment";

card.innerHTML = `
<div
class="gb-comment-author"
style="
display:flex;
justify-content:space-between;
align-items:flex-start;
">

<div>

<div class="gb-comment-author-name">
${comment.name}
</div>

<div class="gb-comment-date">
${new Date(comment.date).toLocaleDateString(
"bn-BD",
{
day:"numeric",
month:"long",
year:"numeric"
}
)}
</div>

</div>

<span
class="gb-pin-icon"
data-id="${comment.id}"
data-pinned="${comment.pinned}">
${comment.pinned ? "❤️" : "✅"}
</span>

</div>

<div class="gb-comment-text">
${comment.comment}
</div>
`;

list.appendChild(card);

const pinIcon =
card.querySelector(
".gb-pin-icon"
);

let clickCount = 0;
let clickTimer;

pinIcon.addEventListener(
"click",
function(){

clickCount++;

clearTimeout(
clickTimer
);

clickTimer =
setTimeout(function(){

clickCount = 0;

},1500);

if(
clickCount < 5
){
return;
}

clickCount = 0;

showSecretPinModal()

.then(code=>{

if(
!code
){
return;
}

const isPinned =
pinIcon.dataset.pinned ===
"true";

const action =
isPinned
? "unpin"
: "pin";

fetch(
COMMENTS_API,
{
method:"POST",
body:new URLSearchParams({

action:action,
id:comment.id,
code:code

})

}
)

.then(res => res.json())

.then(data=>{

console.log(data);

if(
data.success
){

if(isPinned){

pinIcon.textContent =
"✅";

pinIcon.dataset.pinned =
"false";

}else{

pinIcon.textContent =
"❤️";

pinIcon.dataset.pinned =
"true";

}

}else{

showMessageModal(

"⚠ পিন করা যায়নি",

data.message ||
"দুঃখিত কাজটি সম্পন্ন হয়নি"

);

}

// if(isPinned){

// pinIcon.textContent =
// "✅";

// pinIcon.dataset.pinned =
// "false";

// }else{

// pinIcon.textContent =
// "❤️";

// pinIcon.dataset.pinned =
// "true";

// }

})

.catch(err=>{

console.error(err);

showMessageModal(

"⚠ ত্রুটি",

err.toString()

);

});

});
}
);

});

if(
allComments.length >
visibleComments
){

loadMore.style.display =
"block";

}else{

loadMore.style.display =
"none";

}

}

document.addEventListener(
"DOMContentLoaded",
function(){

loadApprovedComments();

const btn =
document.getElementById(
"gbLoadMoreComments"
);

if(btn){

btn.addEventListener(
"click",
function(){

visibleComments += 5;

renderComments();

}
);

}

}
);


// === Max 10 Line Break ===

document.addEventListener(
"keydown",
function(e){

if(
e.target.id !==
"gbCommentText"
){
return;
}

if(
e.key !== "Enter"
){
return;
}

const text =
e.target.value;

const lineBreaks =
(text.match(/\n/g) || []).length;

if(lineBreaks >= 10){

e.preventDefault();

}

}
);

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

/* ===== Validation ===== */

if(comment.length > 1300){

await showMessageModal(
"⚠ মন্তব্য খুব বড়",
"সর্বোচ্চ ১৩০০ অক্ষরের মন্তব্য করা যাবে।"
);

return;

}

const lineBreaks =
(comment.match(/\n/g) || []).length;

if(lineBreaks > 10){

await showMessageModal(
"⚠ অতিরিক্ত লাইন",
"সর্বোচ্চ ১০টি লাইন ব্রেক ব্যবহার করা যাবে।"
);

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
comment,

readerId:
getReaderId()

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

document
.getElementById(
"gbCommentName"
)
.value = "";

document
.getElementById(
"gbCommentText"
)
.value = "";

await showMessageModal(

"✓ মন্তব্য গ্রহণ করা হয়েছে",

"আপনার মতামতটি খুব শীঘ্রই এখানে প্রকাশিত হবে, ইনশাআল্লাহ।"

);

}else{

await showMessageModal(

"⚠ মন্তব্য জমা হয়নি",

result.message ||
"দুঃখিত, মন্তব্য পাঠানো যায়নি।"

);

}

}catch(error){

console.error(error);

await showMessageModal(

"⚠ ত্রুটি",

error?.message ||
error?.toString() ||
"Unknown Error"

);

}

submitBtn.disabled = false;

submitBtn.textContent =
"মন্তব্য পোস্ট করুন";

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