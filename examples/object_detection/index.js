const canvas = document.getElementById('overlay');
const ctx = canvas.getContext('2d');

/**
 * The setup function
 */
function setup() {
  // Display the video in the #prepro div
  prepro.showVideo('#prepro');
  prepro.addDebugView();

  // Listen to prepro update events, and handle them with the updqte function.
  prepro.addEventListener('update', update);

  // Listen to window resize events, and handle them with the resize function.
  window.addEventListener('resize', resize);
  resize();

  // Start playing
  prepro.play();
}

/**
 * The update event handler
 */
function update() {
  // Retrieve the Detection object for the current frame
  const detection = prepro.currentFrame.detection;
  if (!detection) {
    return;
  }

  // Clear the canvas
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  // Draw each bounding box
  const w = ctx.canvas.width;
  const h = ctx.canvas.height;
  for (let box of detection) {
    if (box.category == 'toaster') {
      console.log(box);
    }
    ctx.strokeStyle = 'blue';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.rect(box.x * w, box.y * h, box.width * w, box.height * h);
    ctx.stroke();
    ctx.font = 'bold 12px sans-serif';
    ctx.fillStyle = 'blue';
    ctx.fillText(box.category.toUpperCase(), box.x * w + 5, box.y * h + 15);
    ctx.fillText(box.score.toFixed(2), box.x * w + 5, box.y * h + 30);
  }
}

/**
 * The resize event handler.
 */
function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

// Start by loading the data and call our setup function when complete.
prepro.load('../_data/test-video', ['detection']).then(setup);
