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


// Upper Nav Bar

// (function(){

//   const menus = [
//     { name: "হোমপেইজ", link: "home.html" },
//     { name: "আমাদের কথা", link: "about.html" },
//     { name: "সকল গল্প", link: "stories.html" },
//     { name: "নোটিফিকেশন", link: "notifications.html" },
//     { name: "লেখকবৃন্দ", link: "writers.html" },
//     { name: "প্রাইভেসি পলিসি", link: "privacy.html" },
//     { name: "অন্যান্য ফিচার", link: "features.html" },
//     { name: "গল্প খুজুন", link: "search.html" }
//   ];

//   const current = location.pathname.split("/").pop();

//   let html = '<div class="upnav-wrap"><nav class="upnav">';

//   menus.forEach(item=>{
//     const active = current === item.link ? "active" : "";
//     html += `<a href="${item.link}" class="${active}">${item.name}</a>`;
//   });

//   html += '</nav></div>';

//   const target = document.getElementById("upNav");
//   if(target){
//     target.innerHTML = html;
//   }

// })();


// Upper Nav Bar

(function(){

  const menus = [
    { name: "গল্পের বাহার", link: "https://golperbahar.com/" },
    { name: "আমাদের কথা", link: "#" },
    { name: "সকল গল্প", link: "https://golperbahar.com/category-hub/all-categories/" },
    { name: "নোটিফিকেশন", link: "#" },
    { name: "লেখকবৃন্দ", link: "https://golperbahar.com/writers/writers-front-page/" },
    { name: "প্রাইভেসি পলিসি", link: "#" },
    { name: "অন্যান্য ফিচার", link: "#" },
    { name: "গল্প খুজুন", link: "#" }
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
const threshold = 300;   // কত scroll হলে hide start করবে

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