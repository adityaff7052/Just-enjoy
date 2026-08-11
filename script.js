// Setup Canvas & Frame Sequence Variables
const canvas = document.getElementById("hero-canvas");
const context = canvas.getContext("2d");

const TOTAL_FRAMES = 240;
const currentFrame = (index) => `./frames/frame (${index}).webp`;

const images = [];
const frameState = { frame: 1 };

// Preload Sequence Images
for (let i = 1; i <= TOTAL_FRAMES; i++) {
  const img = new Image();
  img.src = currentFrame(i);
  images.push(img);
}

// Canvas Resize & Dynamic Mobile Offset Handler
function setCanvasSize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  renderFrame();
}

window.addEventListener("resize", setCanvasSize);

// Render Current Frame with Device-Aware Positioning
function renderFrame() {
  const img = images[frameState.frame - 1];
  if (!img || !img.complete) return;

  context.clearRect(0, 0, canvas.width, canvas.height);

  const hRatio = canvas.width / img.width;
  const vRatio = canvas.height / img.height;
  
  // Choose scale factor
  const isMobile = window.innerWidth <= 768;
  const ratio = Math.max(hRatio, vRatio) * (isMobile ? 0.85 : 1.0);

  const centerShift_x = (canvas.width - img.width * ratio) / 2;
  
  // On mobile, push the model up to the top 65% so the bottom card never overlaps
  const centerShift_y = isMobile
    ? (canvas.height * 0.40) - (img.height * ratio / 2)
    : (canvas.height - img.height * ratio) / 2;

  context.drawImage(
    img,
    0,
    0,
    img.width,
    img.height,
    centerShift_x,
    centerShift_y,
    img.width * ratio,
    img.height * ratio
  );
}

// Initial Render on First Image Load
images[0].onload = () => {
  setCanvasSize();
};

// Scroll Controller for Canvas Frame Scrubbing and Cards
const scrollTrack = document.getElementById("scroller");

window.addEventListener("scroll", () => {
  const trackRect = scrollTrack.getBoundingClientRect();
  const trackHeight = scrollTrack.offsetHeight - window.innerHeight;
  
  // Calculate progress inside scroller section (0.0 to 1.0)
  let progress = -trackRect.top / trackHeight;
  progress = Math.max(0, Math.min(1, progress));

  // Update Frame Index
  const frameIndex = Math.min(
    TOTAL_FRAMES,
    Math.max(1, Math.floor(progress * TOTAL_FRAMES))
  );

  frameState.frame = frameIndex;
  requestAnimationFrame(renderFrame);

  // Toggle Overlay Cards Based on Scroll Depth
  toggleCard("overlay-top", progress > 0.05 && progress < 0.20);
  toggleCard("overlay-antenna", progress >= 0.20 && progress < 0.35);
  toggleCard("overlay-front", progress >= 0.35 && progress < 0.50);
  toggleCard("overlay-back", progress >= 0.50 && progress < 0.65);
  toggleCard("overlay-pcb", progress >= 0.65 && progress < 0.80);
  toggleCard("overlay-mic", progress >= 0.80 && progress < 0.95);
});

function toggleCard(id, isActive) {
  const card = document.getElementById(id);
  if (card) {
    if (isActive) {
      card.classList.add("active");
    } else {
      card.classList.remove("active");
    }
  }
}

// Specs Button Smooth Scroll Navigation
function scrollToScroller(e) {
  e.preventDefault();
  const target = document.getElementById("scroller");
  if (target) {
    target.scrollIntoView({ behavior: "smooth" });
  }
}

document.getElementById("nav-specs-btn")?.addEventListener("click", scrollToScroller);
document.getElementById("hero-specs-btn")?.addEventListener("click", scrollToScroller);
             
