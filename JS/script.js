// Typing effect on hero
document.addEventListener('DOMContentLoaded', () => {
  const text = "Crafting Interactive User Interfaces";
  const typingElement = document.querySelector('.typing-text');
  let index = 0;

  if (typingElement) {
    function type() {
      if (index < text.length) {
        typingElement.textContent += text.charAt(index);
        index++;
        setTimeout(type, 80);
      }
    }
    type();
  }

  // Fade-in animation on scroll
  const cards = document.querySelectorAll('.fade-in');
  function revealOnScroll() {
    const triggerBottom = window.innerHeight * 0.85;
    cards.forEach(card => {
      const cardTop = card.getBoundingClientRect().top;
      if (cardTop < triggerBottom) {
        card.classList.add('show');
      }
    });
  }
  window.addEventListener('scroll', revealOnScroll);
  revealOnScroll();

  // Highlight active nav link while scrolling
  const sections = document.querySelectorAll("section");
  const navLinks = document.querySelectorAll(".navbar a");

  window.addEventListener("scroll", () => {
    let current = "";
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 80;
      if (scrollY >= sectionTop) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach(link => {
      link.classList.remove("active");
      if (link.getAttribute("href") === "#" + current) {
        link.classList.add("active");
      }
    });
  });
});
