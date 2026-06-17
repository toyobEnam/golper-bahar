// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    toggleBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        
        // Animate hamburger
        const hamburger = toggleBtn.querySelector('.hamburger');
        if (hamburger) {
            hamburger.classList.toggle('active');
        }
    });
    
    // Close mobile menu when clicking links
    const mobileLinks = document.querySelectorAll('.mobile-menu a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
        });
    });
    
    // Keyboard escape support
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
            mobileMenu.classList.remove('active');
        }
    });
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            if (this.getAttribute('href') === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Card hover enhancement for accessibility
    const allCards = document.querySelectorAll('.blog-card, .post-card, .category-card');
    allCards.forEach(card => {
        card.setAttribute('role', 'article');
        card.setAttribute('tabindex', '0');
        
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const link = card.querySelector('a');
                if (link) link.click();
            }
        });
    });
    
    console.log('%cগল্পের বাহার - Index Page Loaded Successfully', 'color: #2c7a7b; font-size: 14px; font-weight: bold');
});