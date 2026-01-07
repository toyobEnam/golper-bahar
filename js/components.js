// ===================== Start Footer Component ===========================

// detect base path automatically
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

(function () {
  // All footer links
  const footerLinks = document.querySelectorAll(
    '.site-footer a[href]'
  );

  // Ignore mailto, tel, external links
  const isSkippable = (href) =>
    href.startsWith('mailto:') ||
    href.startsWith('tel:') ||
    href.startsWith('http');

  // Calculate base path dynamically
  const pathParts = window.location.pathname
    .split('/')
    .filter(Boolean);

  /*
    Examples:
    /index.html                         -> []
    /stories/a/b.html                   -> ["stories","a","b.html"]
    /Practice-Play/stories/a/b.html     -> ["Practice-Play","stories","a","b.html"]
  */

  // Remove filename
  if (pathParts.length && pathParts[pathParts.length - 1].includes('.')) {
    pathParts.pop();
  }

  // If hosted on GitHub Pages with repo name
  let depth = pathParts.length;

  // When custom domain root (no repo folder)
  if (location.hostname !== 'localhost' && !location.hostname.includes('github.io')) {
    depth = pathParts.length;
  }

  const basePath = depth === 0 ? '' : '../'.repeat(depth);

  footerLinks.forEach(link => {
    const href = link.getAttribute('href');

    if (isSkippable(href)) return;

    // Only fix absolute-root links like "/writers/writers.html"
    if (href.startsWith('/')) {
      link.setAttribute('href', basePath + href.replace(/^\/+/, ''));
    }
  });
})();


// ===================== End Footer Component ===========================