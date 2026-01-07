/* ================================
   GitHub Pages Safe Footer Loader
   ================================ */

const isGitHub = location.hostname.includes("github.io");
const REPO_NAME = "golper-bahar";
const basePath = isGitHub ? `/${REPO_NAME}` : "";

/* ---------- Component Loader ---------- */
function loadComponent(id, file) {
  fetch(`${basePath}${file}`)
    .then(res => res.text())
    .then(html => {
      const el = document.getElementById(id);
      if (!el) return;

      el.innerHTML = html;

      // Footer load হলে GitHub link fix চালাও
      if (id === "footer") {
        fixFooterLinksForGitHub();
      }
    })
    .catch(err => console.error("Component load error:", err));
}

/* ---------- GitHub Pages Footer Link Fix ---------- */
function fixFooterLinksForGitHub() {
  if (!isGitHub) return;

  const footer = document.querySelector(".site-footer");
  if (!footer) return;

  const links = footer.querySelectorAll("a[href]");

  links.forEach(link => {
    const href = link.getAttribute("href");

    // Skip external / mail / tel / hash
    if (
      href.startsWith("http") ||
      href.startsWith("mailto:") ||
      href.startsWith("tel:") ||
      href.startsWith("#")
    ) {
      return;
    }

    // Fix root-absolute links like "/privacy.html"
    if (href.startsWith("/")) {
      link.setAttribute("href", `/${REPO_NAME}${href}`);
    }
  });
}

/* ---------- Load Footer ---------- */
loadComponent("footer", "/components/footer/footer.html");
