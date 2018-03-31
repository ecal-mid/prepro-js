const margin = 15;
const grid = [];
const lines = [];

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  prepro.load('../_data/test-video', 'flow').then(start);
}

function start() {
  prepro.showVideo('#prepro');
  prepro.addEventListener('update', update);
  prepro.addEventListener('processed', (service) => {
    if (service == 'flow') {
      prepro.play();
    }
  });
}

function update() {
  // Make sure a frame is available
  if (!prepro.currentFrame) {
    return;
  }

  // Retrieve the SIFT object for the current frame
  const flow = prepro.currentFrame.flow;
  if (!flow) {
    return;
  }

  updateGrid(flow);
}

function draw() {
  if (!grid.length) {
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

  // Create Lines
  if (lines.length == 0) {
    createLines();
  }
  // Draw the lines
  drawLines();

  // Restore the context transform
  pop();
}

function windowResized() {
  resizeCanvas(window.innerWidth, window.innerHeight);
}

function createLines() {
  for (let row = 0; row < grid.length; row++) {
    for (let column = 0; column < grid[row].length; column++) {
      lines[column * grid.length + row] = 0;
    }
  }
}

function drawLines() {
  for (let row = 0; row < grid.length; row++) {
    for (let column = 0; column < grid[row].length; column++) {
      const x = (column + 0.5) / grid[row].length * prepro.config.width;
      const y = (row + 0.5) / grid.length * prepro.config.height;
      const f = grid[row][column];
      const l = column * grid.length + row;
      lines[l] += (f.a - lines[l]) * 0.05;

      push();
      translate(x, y);
      rotate(lines[l]);

      const c = Math.abs(lines[l]) / Math.PI * 255;
      stroke(255 - c, c, 255 - c * 0.5);
      line(0, 0, 15, 0);

      noStroke();
      ellipse(1, 1, 3, 3);
      pop();
    }
  }
}

/** GRID **/

function createGrid(flow) {
  for (let y = 0; y < flow.canvas.height; y += margin) {
    const row = y / margin;
    grid[row] = [];
    for (let x = 0; x < flow.canvas.width; x += margin) {
      const column = x / margin;
      grid[row][column] = {x: 0, y: 0, a: 0};
    }
  }
}

function updateGrid(flow) {
  const pixels =
      flow.getImageData(0, 0, flow.canvas.width, flow.canvas.height).data;

  if (!grid.length) {
    createGrid(flow);
  }
  for (let y = 0; y < flow.canvas.height; y += margin) {
    const row = y / margin;
    for (let x = 0; x < flow.canvas.width; x += margin) {
      const p = y * flow.canvas.width + x;
      const fx = pixels[p * 4] / 255;
      const fy = pixels[p * 4 + 1] / 255;
      const column = x / margin;
      grid[row][column].x = fx;
      grid[row][column].y = fy;
      if (fx * fx + fy * fy < 0.005) {
        grid[row][column].a = -Math.PI / 2;
      } else {
        grid[row][column].a = Math.atan2(-fy, fx);
      }
    }
  }
}
