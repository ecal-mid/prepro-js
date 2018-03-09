/**
 * The setup function
 */
function setup() {
  createCanvas(window.innerWidth, window.innerHeight);

  // Start by loading the data and call our setup function when complete
  prepro.load('../_data/test-video', 'sift').then(start);
}

function start() {
  // Display the video in the #prepro div
  prepro.showVideo('#prepro');

  // Add a debug view of the different signals
  prepro.addDebugView();

  // Start playing
  prepro.play();
}

/**
 * The draw function
 */
function draw() {
  // Make sure a frame is available
  if (!prepro.currentFrame) {
    return;
  }

  // Retrieve the SIFT object for the current frame
  const sift = prepro.currentFrame.sift;
  if (!sift) {
    return;
  }

  // Clear the canvas
  clear();

  // Save the context transform
  push();

  // Translate to the video element position
  translate(0, prepro.video.offset.y);

  // Scale to the video element size
  scale(width / prepro.config.width);

  // Draw a blue circle for each keypoint in the current frame
  for (let keypoint of sift.keypointsA) {
    // Draw point
    stroke(255, 255, 255);
    ellipse(keypoint.x, keypoint.y, 2, 2);
    // Draw connecting lines
    stroke(255, 255, 255, 50);
    for (let kb of sift.keypointsA) {
      const dx = kb.x - keypoint.x;
      const dy = kb.y - keypoint.y;
      if (dx * dx + dy * dy < mouseY * 2) {
        line(keypoint.x, keypoint.y, kb.x, kb.y);
      }
    }
  }

  // Restore the context transform
  pop();
}

/**
 * The resize event handler
 */
function windowResized() {
  resizeCanvas(window.innerWidth, window.innerHeight);
}
