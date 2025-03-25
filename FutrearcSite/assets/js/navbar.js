function initializeNavbar() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (!hamburger || !navLinks) {
        console.warn('Navigation elements not found. Check if hamburger and nav-links classes exist.');
        return;
    }

    // Create overlay element if it doesn't exist
    let overlay = document.querySelector('.nav-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'nav-overlay';
        document.body.appendChild(overlay);
    }

    // Create popup element if it doesn't exist
    let popup = document.querySelector('.news-popup');
    if (!popup) {
        popup = document.createElement('div');
        popup.className = 'news-popup';
        popup.innerHTML = '<p>Nyheter lanseras snart! 🚀</p>';
        document.body.appendChild(popup);
    }

    // Handle news link click
    const newsLink = document.querySelector('nav ul li a[href="#"]');
    if (newsLink) {
        newsLink.addEventListener('click', function(e) {
            e.preventDefault();
            popup.classList.add('show');
            setTimeout(() => {
                popup.classList.remove('show');
            }, 2000);
        });
    }

    // Handle hamburger click
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
        overlay.classList.toggle('active');
        document.body.style.overflow = hamburger.classList.contains('active') ? 'hidden' : '';
    });

    // Handle overlay click
    overlay.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // Initial attempt
    initializeNavbar();
    
    // Retry after a short delay if needed
    setTimeout(initializeNavbar, 500);
});