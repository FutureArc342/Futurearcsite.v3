function includeHTML() {
    let elements = document.querySelectorAll("[include-html]");
    let promises = [];

    elements.forEach(el => {
        let file = el.getAttribute("include-html");
        if (file) {
            let promise = fetch(file)
                .then(response => response.text())
                .then(data => {
                    el.innerHTML = data;
                    el.removeAttribute("include-html");
                })
                .catch(error => console.error("Error loading", file, error));
            promises.push(promise);
        }
    });

    Promise.all(promises).then(() => {
        // Kör funktionen igen för att inkludera eventuella nya include-html element
        if (document.querySelectorAll("[include-html]").length > 0) {
            includeHTML();
        }
    });
}

document.addEventListener('DOMContentLoaded', includeHTML);

