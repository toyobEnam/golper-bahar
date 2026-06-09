/* =========================================================
   Short Stories Breadcrumb
========================================================= */

const shortStoryCategoryMap = {

"romantic":"রোমান্টিক",
"social":"সামাজিক",
"family":"ফ্যামিলি",
"suspense":"রহস্য",
"love-thriller":"লাভ থ্রিলার",
"tragedy":"ট্র্যাজেডি"

};

function toBanglaNumber(num){

return String(num).replace(/\d/g, d =>
"০১২৩৪৫৬৭৮৯"[d]
);

}

(function(){

const target =
document.getElementById("upNav");

if(!target) return;

const path =
location.pathname
.replace(/^\/|\/$/g,"")
.split("/");

if(path[0] !== "short-stories") return;

const wrap =
document.createElement("div");

wrap.className =
"gb-breadcrumb-wrap";

let html = `
<a href="https://golperbahar.com/">হোমপেজ</a>
<span>›</span>

<a href="https://golperbahar.com/short-stories/">
ছোটোগল্প
</a>
`;

/* ===== Category ===== */

if(path[1]){

const categoryName =
shortStoryCategoryMap[path[1]]
|| decodeURIComponent(path[1]).replace(/-/g," ");

if(path.length === 2){

html += `
<span>›</span>
<span class="current">${categoryName}</span>
`;

}else{

html += `
<span>›</span>
<a href="https://golperbahar.com/short-stories/${path[1]}/">
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

if(path[3]){

html += `
<span>›</span>
<a href="https://golperbahar.com/short-stories/${path[1]}/${path[2]}/">
${storyName}
</a>
`;

}else{

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

html += `
<span>›</span>
<span class="current">
পর্ব ${toBanglaNumber(episodeNumber)}
</span>
`;

}

wrap.innerHTML =
`<div class="gb-breadcrumb">${html}</div>`;

target.insertAdjacentElement(
"afterend",
wrap
);

})();

/* =========================================================
   Short Stories Breadcrumb Schema
========================================================= */

(function(){

const path =
location.pathname
.replace(/^\/|\/$/g,"")
.split("/");

if(path[0] !== "short-stories") return;

const breadcrumbItems = [

{
"@type":"ListItem",
"position":1,
"name":"হোমপেজ",
"item":"https://golperbahar.com/"
},

{
"@type":"ListItem",
"position":2,
"name":"ছোটোগল্প",
"item":"https://golperbahar.com/short-stories/"
}

];

if(path[1]){

breadcrumbItems.push({

"@type":"ListItem",
"position":breadcrumbItems.length + 1,
"name":
shortStoryCategoryMap[path[1]]
|| path[1],

"item":
`https://golperbahar.com/short-stories/${path[1]}/`

});

}

if(path[2]){

const storyName =
document.querySelector(".story-title")
?.textContent.trim()
|| path[2];

breadcrumbItems.push({

"@type":"ListItem",
"position":breadcrumbItems.length + 1,
"name":storyName,

"item":
`https://golperbahar.com/short-stories/${path[1]}/${path[2]}/`

});

}

if(path[3]){

breadcrumbItems.push({

"@type":"ListItem",
"position":breadcrumbItems.length + 1,
"name":
`পর্ব ${toBanglaNumber(path[3].replace(/[^\d]/g,""))}`,

"item":
window.location.href

});

}

const schema = {

"@context":"https://schema.org",
"@type":"BreadcrumbList",
"itemListElement":breadcrumbItems

};

const script =
document.createElement("script");

script.type =
"application/ld+json";

script.textContent =
JSON.stringify(schema);

document.head.appendChild(script);

})();