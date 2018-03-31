const canvas = document.getElementById('overlay');
const ctx = canvas.getContext('2d');
const lines = [];

function setup() {
  // Display the video in the #prepro div
  prepro.showVideo('#prepro');

  // Listen to window resize events, and handle them with the resize function
  window.addEventListener('resize', resize);
  resize();

  // Start playing
  prepro.play();

  // Start draw loop.
  draw();
}

// The draw function will recursivelly be called using requestAnimationFrame
function draw() {
  // Ask for recursive call on next frame
  requestAnimationFrame(draw);

  // Ensure prepro data are available for the current video frame
  const spectrogram = prepro.currentFrame.spectrogram;
  const colors = prepro.currentFrame.colors;
  if (!spectrogram || !colors) {
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

  // lerp our current lines values
  for (let i = 0; i < spectrogram.length; i++) {
    if (!lines[i] || lines[i] < spectrogram[i]) {
      lines[i] = spectrogram[i];
    } else {
      lines[i] += (spectrogram[i] - lines[i]) * 0.05;
    }
  }

  // Retrieve the dimension of the video
  const width = prepro.config.width;
  const height = prepro.config.height;
  // Draw each line
  ctx.lineWidth = 4;
  for (let i = 0; i < lines.length; i++) {
    // Use a color from this frame's palette
    ctx.strokeStyle = colors[i % 5];
    ctx.beginPath();
    const x = Math.floor(i / lines.length * width);
    const y = Math.floor((1 - lines[i]) * height);
    ctx.moveTo(x, height);
    ctx.lineTo(x, y);
    ctx.stroke();
  }

  // Restore the context transform
  ctx.restore();
}

// Resize handler
function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

// Start by loading the data and call our setup function when complete
prepro.load('../_data/test-video', ['spectrogram', 'colors']).then(setup);
