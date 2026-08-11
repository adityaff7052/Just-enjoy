const canvas = document.getElementById("hero-canvas");
const context = canvas.getContext("2d");

// Native rendering resolution
canvas.width = 1920;
canvas.height = 1080;

const TOTAL_FRAMES = 240;
const images = [];

// Preload 240 frame sequence images from frames/ folder
for (let i = 1; i <= TOTAL_FRAMES; i++) {
  const img = new Image();
  img.src = `./frames/frame (${i}).webp`;
  images.push(img);
}

// Initial frame render
images[0].onload = () => {
  drawFrame(0);
};

let targetFrame = 0;
let currentFrame = 0;

// Scroll listener for frame scrubbing & overlay stages
window.addEventListener("scroll", () => {
  const heroSection = document.querySelector(".hero-section");
  const heroHeight = heroSection ? heroSection.offsetHeight : window.innerHeight;
  const scrollTop = window.scrollY || document.documentElement.scrollTop;

  const animationScrollTop = Math.max(0, scrollTop - heroHeight);
  const totalAnimatableHeight = document.querySelector(".scroll-track").offsetHeight;

  let scrollFraction = 0;
  if (totalAnimatableHeight > 0) {
    scrollFraction = Math.min(1, Math.max(0, animationScrollTop / totalAnimatableHeight));
  }

  targetFrame = Math.floor(scrollFraction * (TOTAL_FRAMES - 1));

  const canvasContainer = document.querySelector(".canvas-container");
  if (canvasContainer) {
    if (scrollTop < heroHeight * 0.3 || scrollFraction >= 0.98) {
      canvasContainer.style.opacity = "0";
    } else {
      canvasContainer.style.opacity = "1";
    }
  }

  // Display overlay cards based on video timeline views
  toggleOverlay("overlay-top", "line-top", scrollFraction > 0.02 && scrollFraction < 0.16);
  toggleOverlay("overlay-antenna", "line-antenna", scrollFraction > 0.18 && scrollFraction < 0.32);
  toggleOverlay("overlay-front", "line-front", scrollFraction > 0.34 && scrollFraction < 0.48);
  toggleOverlay("overlay-back", "line-back", scrollFraction > 0.50 && scrollFraction < 0.64);
  toggleOverlay("overlay-pcb", "line-pcb", scrollFraction > 0.66 && scrollFraction < 0.82);
  toggleOverlay("overlay-mic", "line-mic", scrollFraction > 0.84 && scrollFraction < 0.96);

  updateActiveNavLink();
});

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

function drawFrame(index) {
  if (images[index] && images[index].complete) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(images[index], 0, 0, canvas.width, canvas.height);
  }
}

function render() {
  currentFrame += (targetFrame - currentFrame) * 0.12;
  const frameToDraw = Math.round(currentFrame);

  drawFrame(frameToDraw);
  requestAnimationFrame(render);
}

requestAnimationFrame(render);

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

// Mobile Menu Toggle
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
