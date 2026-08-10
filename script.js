const canvas = document.getElementById("hero-canvas");
const context = canvas.getContext("2d");

// Native video render resolution
canvas.width = 1920;
canvas.height = 1080;

const TOTAL_FRAMES = 240;
const images = [];

// Preload 240 frame images named frame (1).webp through frame (240).webp
for (let i = 1; i <= TOTAL_FRAMES; i++) {
  const img = new Image();
  img.src = `./frames/frame (${i}).webp`;
  images.push(img);
}

// Draw initial frame as soon as frame 1 finishes loading
images[0].onload = () => {
  drawFrame(0);
};

let targetFrame = 0;
let currentFrame = 0;

// Scroll & Navigation Interactivity
window.addEventListener("scroll", () => {
  const heroSection = document.querySelector(".hero-section");
  const heroHeight = heroSection ? heroSection.offsetHeight : window.innerHeight;
  const scrollTop = window.scrollY || document.documentElement.scrollTop;

  // Calculate scroll fraction after passing hero banner
  const animationScrollTop = Math.max(0, scrollTop - heroHeight);
  const totalAnimatableHeight = document.querySelector(".scroll-track").offsetHeight;

  let scrollFraction = 0;
  if (totalAnimatableHeight > 0) {
    scrollFraction = Math.min(1, Math.max(0, animationScrollTop / totalAnimatableHeight));
  }

  // Map scroll progress to total frames
  targetFrame = Math.floor(scrollFraction * (TOTAL_FRAMES - 1));

  // Canvas visibility control
  const canvasContainer = document.querySelector(".canvas-container");
  if (canvasContainer) {
    if (scrollTop < heroHeight * 0.4 || scrollFraction >= 0.98) {
      canvasContainer.style.opacity = "0";
    } else {
      canvasContainer.style.opacity = "1";
    }
  }

  // Toggle dynamic overlay callout cards and connector SVG lines
  toggleOverlay("overlay-solar", "line-solar", scrollFraction > 0.08 && scrollFraction < 0.25);
  toggleOverlay("overlay-lora", "line-lora", scrollFraction > 0.22 && scrollFraction < 0.40);
  toggleOverlay("overlay-tinyml", "line-tinyml", scrollFraction > 0.36 && scrollFraction < 0.54);
  toggleOverlay("overlay-mic", "line-mic", scrollFraction > 0.50 && scrollFraction < 0.68);
  toggleOverlay("overlay-speaker", "line-speaker", scrollFraction > 0.64 && scrollFraction < 0.82);
  toggleOverlay("overlay-enclosure", "line-enclosure", scrollFraction > 0.78 && scrollFraction < 0.95);

  // Active state update for navigation menu links
  updateActiveNavLink();
});

// Helper function to toggle overlay card and line visibilities
function toggleOverlay(cardId, lineId, showCondition) {
  const card = document.getElementById(cardId);
  const line = document.getElementById(lineId);

  if (card) {
    card.style.opacity = showCondition ? "1" : "0";
    card.style.transform = showCondition ? "translateY(0)" : "translateY(10px)";
  }

  if (line) {
    line.style.opacity = showCondition ? "1" : "0";
  }
}

// Canvas rendering helper
function drawFrame(index) {
  if (images[index] && images[index].complete) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(images[index], 0, 0, canvas.width, canvas.height);
  }
}

// Lerp loop for smooth high refresh rate scrubbing
function render() {
  currentFrame += (targetFrame - currentFrame) * 0.12;
  const frameToDraw = Math.round(currentFrame);

  drawFrame(frameToDraw);

  requestAnimationFrame(render);
}

requestAnimationFrame(render);

// Navigation menu active state updater on scroll
function updateActiveNavLink() {
  const sections = document.querySelectorAll("section, .canvas-container");
  const navLinks = document.querySelectorAll(".nav-item");

  let currentSection = "";
  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 120;
    if (window.scrollY >= sectionTop) {
      currentSection = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") === `#${currentSection}`) {
      link.classList.add("active");
    }
  });
}

// Responsive Mobile Menu Drawer Toggle
const hamburgerBtn = document.getElementById("hamburger-btn");
const navMenu = document.getElementById("nav-menu");

if (hamburgerBtn && navMenu) {
  hamburgerBtn.addEventListener("click", () => {
    navMenu.classList.toggle("active");
  });

  document.querySelectorAll(".nav-item").forEach((link) => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("active");
    });
  });
}