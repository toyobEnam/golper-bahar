// ================================
// Navigation + Theme Controller
// ================================

const menuToggle = document.getElementById("menuToggle");
const navList = document.getElementById("navList");
const menuIcon = document.getElementById("menuIcon");

const themeBtnDesktop = document.getElementById("themeToggleBtn");
const themeBtnMobile = document.getElementById("themeToggleBtnMobile");

// ---------------- Menu Toggle ----------------
menuToggle.addEventListener("click", function (e) {
    e.stopPropagation();
    const isOpen = navList.classList.toggle("active");
    menuIcon.textContent = isOpen ? "✖" : "☰";
});

document.addEventListener("click", function (e) {
    if (
        navList.classList.contains("active") &&
        !navList.contains(e.target) &&
        !menuToggle.contains(e.target)
    ) {
        navList.classList.remove("active");
        menuIcon.textContent = "☰";
    }
});

window.addEventListener("resize", function () {
    if (window.innerWidth > 768) {
        navList.classList.remove("active");
        menuIcon.textContent = "☰";
    }
});

// ---------------- Theme Toggle ----------------
function applyTheme(isDark) {
    document.body.classList.toggle("dark", isDark);

    const icon = isDark ? "☀️ লাইট" : "🌙 ডার্ক";
    const iconMobile = isDark ? "☀️" : "🌙";

    if (themeBtnDesktop) themeBtnDesktop.textContent = icon;
    if (themeBtnMobile) themeBtnMobile.textContent = iconMobile;

    localStorage.setItem("theme", isDark ? "dark" : "light");
}

function toggleTheme() {
    const isDark = !document.body.classList.contains("dark");
    applyTheme(isDark);
}

themeBtnDesktop?.addEventListener("click", toggleTheme);
themeBtnMobile?.addEventListener("click", toggleTheme);

// ---------------- Load Saved Theme ----------------
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
    applyTheme(true);
}
