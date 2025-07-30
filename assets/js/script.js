// Före:
// const form = document.querySelector("form");

// Efter:
const form = document.getElementById("contactForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const message = document.getElementById("message").value;

  const res = await fetch("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, message }),
  });
  const data = await res.json();
  alert(data.message || data.error);
  if (res.ok) form.reset();
});
