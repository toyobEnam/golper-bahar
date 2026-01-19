const canvas = document.getElementById("editor");
const ctx = canvas.getContext("2d");
let img = new Image();
let originalImg = new Image();
let scale = 1;
let posX = 0;
let posY = 0;
let rotation = 0; // in degrees
let flipH = 1; // 1 or -1
let flipV = 1; // 1 or -1
let brightness = 100;
let contrast = 100;
let saturation = 100;
let grayscale = false;
let blurBg = false;
let blurLevel = 10;
let detector = null;
let isDragging = false;
let startX, startY;
let lastDist = 0; // For pinch zoom

function resizeCanvas() {
  const size = Math.min(window.innerWidth * 0.9, window.innerHeight * 0.6);
  canvas.width = size;
  canvas.height = size;
  draw();
}

function draw() {
  if (!img.src) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Blurred background
  const bgScale = Math.max(canvas.width / img.width, canvas.height / img.height);
  const bgW = img.width * bgScale;
  const bgH = img.height * bgScale;
  const bgX = (canvas.width - bgW) / 2;
  const bgY = (canvas.height - bgH) / 2;
  ctx.filter = "blur(35px)";
  ctx.drawImage(img, bgX, bgY, bgW, bgH);
  ctx.filter = "none";
  ctx.fillStyle = "rgba(0,0,0,0.25)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Main image with transformations
  ctx.save();
  const filters = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) ${grayscale ? 'grayscale(100%)' : ''}`;
  ctx.filter = filters;

  // Translate to center, rotate, flip, then draw
  const w = img.width * scale;
  const h = img.height * scale;
  ctx.translate(canvas.width / 2 + posX, canvas.height / 2 + posY);
  ctx.rotate(rotation * Math.PI / 180);
  ctx.scale(flipH, flipV);
  ctx.drawImage(img, -w / 2, -h / 2, w, h);

  ctx.restore();
}

// Upload handler
document.getElementById("fileInput").addEventListener("change", e => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    const dataUrl = reader.result;
    img.src = dataUrl;
    originalImg.src = dataUrl;
    img.onload = () => {
      resetEdits();
    };
  };
  reader.readAsDataURL(file);
});

// Mouse drag
canvas.addEventListener("mousedown", e => {
  isDragging = true;
  startX = e.offsetX - posX;
  startY = e.offsetY - posY;
});
canvas.addEventListener("mousemove", e => {
  if (!isDragging) return;
  posX = e.offsetX - startX;
  posY = e.offsetY - startY;
  draw();
});
canvas.addEventListener("mouseup", () => isDragging = false);
canvas.addEventListener("mouseleave", () => isDragging = false);

// Touch drag & pinch zoom
canvas.addEventListener("touchstart", e => {
  if (e.touches.length === 1) {
    const t = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    isDragging = true;
    startX = t.clientX - rect.left - posX;
    startY = t.clientY - rect.top - posY;
  } else if (e.touches.length === 2) {
    isDragging = false;
    lastDist = Math.hypot(
      e.touches[0].pageX - e.touches[1].pageX,
      e.touches[0].pageY - e.touches[1].pageY
    );
  }
});
canvas.addEventListener("touchmove", e => {
  e.preventDefault();
  if (e.touches.length === 1 && isDragging) {
    const t = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    posX = t.clientX - rect.left - startX;
    posY = t.clientY - rect.top - startY;
    draw();
  } else if (e.touches.length === 2) {
    const dist = Math.hypot(
      e.touches[0].pageX - e.touches[1].pageX,
      e.touches[0].pageY - e.touches[1].pageY
    );
    if (lastDist > 0) {
      const zoom = dist / lastDist;
      scale *= zoom;
      draw();
    }
    lastDist = dist;
  }
});
canvas.addEventListener("touchend", () => {
  isDragging = false;
  lastDist = 0;
});

// Mouse wheel zoom
canvas.addEventListener("wheel", e => {
  e.preventDefault();
  const zoom = e.deltaY < 0 ? 1.05 : 0.95;
  scale *= zoom;
  draw();
});

// Editing functions
function rotateLeft() {
  rotation = (rotation - 90) % 360;
  draw();
}
function rotateRight() {
  rotation = (rotation + 90) % 360;
  draw();
}
function flipHorizontal() {
  flipH = -flipH;
  draw();
}
function flipVertical() {
  flipV = -flipV;
  draw();
}
function centerHorizontal() {
  posX = 0;
  draw();
}
function centerVertical() {
  posY = 0;
  draw();
}
function applyFilters() {
  brightness = document.getElementById("brightness").value;
  contrast = document.getElementById("contrast").value;
  saturation = document.getElementById("saturation").value;
  draw();
}
function toggleGrayscale() {
  grayscale = !grayscale;
  document.querySelector('button[onclick="toggleGrayscale()"]').textContent = `Grayscale: ${grayscale ? 'On' : 'Off'}`;
  draw();
}
function toggleBlurBackground() {
  blurBg = !blurBg;
  document.querySelector('button[onclick="toggleBlurBackground()"]').textContent = `Blur Bg: ${blurBg ? 'On' : 'Off'}`;
  processImage();
}
function applyBlur() {
  blurLevel = document.getElementById("blurAmount").value;
  if (blurBg) processImage();
}
function processImage() {
  if (!blurBg) {
    img = originalImg;
    draw();
    return;
  }
  if (!detector) {
    detector = ml5.objectDetector('cocossd', () => {
      processImage(); // Recall after load
    });
    return;
  }
  detector.detect(originalImg, (err, results) => {
    if (err) {
      console.error(err);
      return;
    }
    let persons = results.filter(r => r.label === 'person');
    if (persons.length === 0) {
      alert('No person detected. Turning off blur.');
      toggleBlurBackground();
      return;
    }
    let tempCanvas = document.createElement('canvas');
    tempCanvas.width = originalImg.width;
    tempCanvas.height = originalImg.height;
    let tctx = tempCanvas.getContext('2d');
    // Draw blurred full image
    tctx.filter = `blur(${blurLevel}px)`;
    tctx.drawImage(originalImg, 0, 0);
    tctx.filter = 'none';
    // Draw sharp persons
    for (let p of persons) {
      let {x, y, width, height} = p;
      tctx.drawImage(originalImg, x, y, width, height, x, y, width, height);
    }
    let processed = new Image();
    processed.src = tempCanvas.toDataURL('image/jpeg', 0.9);
    processed.onload = () => {
      img = processed;
      draw();
    };
  });
}
function resetEdits() {
  scale = Math.min(canvas.width / img.width, canvas.height / img.height);
  posX = 0;
  posY = 0;
  rotation = 0;
  flipH = 1;
  flipV = 1;
  brightness = 100;
  contrast = 100;
  saturation = 100;
  grayscale = false;
  blurBg = false;
  blurLevel = 10;
  document.getElementById("brightness").value = 100;
  document.getElementById("contrast").value = 100;
  document.getElementById("saturation").value = 100;
  document.getElementById("blurAmount").value = 10;
  document.querySelector('button[onclick="toggleGrayscale()"]').textContent = 'Grayscale: Off';
  document.querySelector('button[onclick="toggleBlurBackground()"]').textContent = 'Blur Bg: Off';
  img = originalImg;
  draw();
}

// Save
function saveImage() {
  const link = document.createElement("a");
  link.download = "square_photo.jpg";
  link.href = canvas.toDataURL("image/jpeg", 0.95);
  link.click();
}

// Init
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

