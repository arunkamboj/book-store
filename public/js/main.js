const backdrop = document.querySelector(".backdrop");
const sideDrawer = document.querySelector(".mobile-nav");
const menuToggle = document.querySelector("#side-menu-toggle");
const slides = document.querySelectorAll(".hero-slide");
const dots = document.querySelectorAll(".hero-slider__dots button");
let activeSlide = 0;

function backdropClickHandler() {
  backdrop.style.display = "none";
  sideDrawer.classList.remove("open");
}

function menuToggleClickHandler() {
  backdrop.style.display = "block";
  sideDrawer.classList.add("open");
}

if (backdrop && sideDrawer) {
  backdrop.addEventListener("click", backdropClickHandler);
}

if (menuToggle) {
  menuToggle.addEventListener("click", menuToggleClickHandler);
}

function showSlide(index) {
  if (slides.length === 0) {
    return;
  }

  activeSlide = index % slides.length;
  slides.forEach((slide, slideIndex) => {
    slide.classList.toggle("active", slideIndex === activeSlide);
  });
  dots.forEach((dot, dotIndex) => {
    dot.classList.toggle("active", dotIndex === activeSlide);
  });
}

dots.forEach((dot) => {
  dot.addEventListener("click", () => {
    showSlide(Number(dot.dataset.slide));
  });
});

if (slides.length > 0) {
  setInterval(() => {
    showSlide(activeSlide + 1);
  }, 5000);
}
