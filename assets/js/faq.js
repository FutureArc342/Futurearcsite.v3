function initializeFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    if (!faqItems || faqItems.length === 0) {
        console.warn('FAQ items not found. Make sure the elements with class "faq-item" exist in the HTML.');
        return;
    }

    faqItems.forEach(item => {
        const button = item.querySelector('.faq-toggle');
        
        if (!button) {
            console.warn('FAQ toggle button not found in an FAQ item.');
            return;
        }

        button.addEventListener('click', () => {
            // Stäng alla andra öppna FAQ-items
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggla aktiv klass på klickad item
            item.classList.toggle('active');
        });
    });
}

// Försök initialisera när DOM är redo
document.addEventListener('DOMContentLoaded', () => {
    // Första försöket
    initializeFAQ();
    
    // Om första försöket misslyckas, försök igen efter en kort stund
    setTimeout(initializeFAQ, 500);
});