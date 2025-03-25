// Js för att cta knappen ska scrolla till futures sectionen direkt
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        console.log("Section found, scrolling to it.");
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
        console.error("Section with ID '" + sectionId + "' not found.");
    }
}



