const menuToggle = document.getElementById("menu-toggle");
const menu = document.getElementById("menu");

menuToggle.addEventListener("click", () => {menu.classList.toggle("active");});

document.getElementById('contact-form').addEventListener('submit', function(event) {
    event.preventDefault();
    alert('Tack för ditt meddelande! Vi återkommer så snart som möjligt.');
    this.reset();
});