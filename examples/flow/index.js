const canvas = document.getElementById('overlay');
const ctx = canvas.getContext('2d');

function setup() {
  prepro.showVideo('#prepro');
  // prepro.addDebugView();
  prepro.addEventListener('update', update);
  prepro.play();

  window.addEventListener('resize', resize);
  resize();
}

function update() {
  const flow = prepro.currentFrame.flow;
  if (!flow || !flow.canvas.width) {
    return;
  }

  const pixels =
      flow.getImageData(0, 0, flow.canvas.width, flow.canvas.height).data;


  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.save();

  const h = prepro.video.el_.videoHeight / prepro.video.el_.videoWidth *
      window.innerWidth;
  ctx.translate(0, (window.innerHeight - h) * 0.5);

  const scale = canvas.width / flow.canvas.width;
  ctx.scale(scale, scale);

  const margin = 5;

  ctx.beginPath();
  ctx.lineWidth = 2;
  ctx.strokeStyle = 'white';
  for (let y = 0; y < flow.canvas.height; y += margin) {
    for (let x = 0; x < flow.canvas.width; x += margin) {
      const p = y * flow.canvas.width + x;
      const fx = pixels[p * 4] / 255;
      const fy = pixels[p * 4 + 1] / 255;

      ctx.moveTo(x, y);
      ctx.lineTo(x + fx * fx * 50, y + fy * fy * 50);
    }
  }
  ctx.stroke();

  ctx.restore();
}

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

prepro.load('../_data/test-video').then(setup);
