const canvas = document.getElementById('overlay');
const ctx = canvas.getContext('2d');

/**
 * The setup function
 */
function setup() {
  // Display the video in the #prepro div
  prepro.showVideo('#prepro');

  // Add a debug view of the different signals
  // prepro.addDebugView();

  // Listen to prepro update events, and handle them with the resize function
  prepro.addEventListener('update', update);

  // Start playing
  prepro.play();

  // Listen to window resize events, and handle them with the resize function
  window.addEventListener('resize', resize);
  resize();
}

/**
 * The update event handler
 */
function update() {
  // Retrieve the SIFT object for the current frame
  const sift = prepro.currentFrame.sift;
  if (!sift) {
    return;
  }

  // Clear the canvas
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  // Save the context transform
  ctx.save();

  // Translate to the video element position
  ctx.translate(0, prepro.video.offset.y);

  // Scale to the video element size
  const scale = canvas.width / prepro.config.width;
  ctx.scale(scale, scale);

  // Draw a blue circle for each keypoint in the current frame
  ctx.fillStyle = 'blue';
  for (let keypoint of sift.keypointsA) {
    ctx.beginPath();
    ctx.arc(keypoint.x, keypoint.y, 2, 0, 2 * Math.PI);
    ctx.fill();
  }

  // Restore the context transform
  ctx.restore();
}

/**
 * The resize event handler
 */
function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

// Start by loading the data and call our setup function when complete
prepro.load('../_data/test-data').then(setup);
