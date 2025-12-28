// ================================
// Mobile Drawer Navigation Script
// ================================

const menuToggle = document.getElementById("menuToggle");
const navList = document.getElementById("navList");
const menuIcon = document.getElementById("menuIcon");

// Toggle menu open / close
menuToggle.addEventListener("click", function (e) {
    e.stopPropagation();

    const isOpen = navList.classList.toggle("active");

    // Icon switch ☰ ↔ ✖
    menuIcon.textContent = isOpen ? "✖" : "☰";
});

// Close menu when clicking outside
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

// Close menu on resize (safety for orientation change)
window.addEventListener("resize", function () {
    if (window.innerWidth > 768) {
        navList.classList.remove("active");
        menuIcon.textContent = "☰";
    }
});
