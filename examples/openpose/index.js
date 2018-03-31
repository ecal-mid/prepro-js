const canvas = document.getElementById('overlay');
const ctx = canvas.getContext('2d');

// Ids of the keypoints to use to draw each joints
const joints = [
  // neck
  [0, 1],
  // left shoulder & arm
  [1, 2, 3, 4],
  // right shoulder & arm
  [1, 5, 6, 7],
  // left body & leg
  [1, 8, 9, 10],
  // right body & leg
  [1, 11, 12, 13],
  // pelvis
  [8, 11],
];
// Colors to draw the joints
const colors = ['yellow', 'red', 'blue', 'magenta', '#00ff00', 'cyan'];

/**
 * The setup function
 */
function setup() {
  // Display the video in the #prepro div
  prepro.showVideo('#prepro');

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
  // Retrieve the OpenPose object for the current frame
  const openpose = prepro.currentFrame.openpose;
  if (!openpose) {
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
  for (const pose of openpose) {
    const pts = pose['pose_keypoints'];
    drawPose(pts);
  }

  // Restore the context transform.
  ctx.restore();
}

/**
 * Function that draw a pose from OpenPose keypoints.
 * @param  {Array} pts
 *         An array of OpenPose keypoints. Each value of this array is expected
 *         to be an array of [x, y, confidence].
 * @param  {Number} confidenceMin
 *         Only draw joints and keypoints with a level of confidence above
 *         this level.
 */
function drawPose(pts, confidenceMin = 0.05) {
  // Draw joints
  ctx.lineWidth = 4;
  for (let j = 0; j < joints.length; j++) {
    const joint = joints[j];
    ctx.strokeStyle = colors[j];
    ctx.beginPath();
    for (const pi of joint) {
      const confidence = pts[pi * 3 + 2];
      if (confidence > confidenceMin) {
        const x = pts[pi * 3];
        const y = pts[pi * 3 + 1];
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();
  }

  // Draw a circle for each keypoint.
  ctx.fillStyle = 'white';
  for (let i = 0; i < pts.length / 3; i++) {
    const x = pts[i * 3];
    const y = pts[i * 3 + 1];
    const confidence = pts[i * 3 + 2];
    if (confidence > confidenceMin) {
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, 2 * Math.PI);
      ctx.fill();
    }
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
prepro.load('../_data/test-video', ['openpose']).then(setup);
