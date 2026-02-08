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



