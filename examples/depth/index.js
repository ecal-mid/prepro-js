const canvas = document.getElementById('overlay');
const ctx = canvas.getContext('2d');
const mouse = {
  x: 0,
  y: 0,
};

function setup() {
  const container = document.getElementById('prepro');
  container.addEventListener('mousemove', (evt) => {
    mouse.x = evt.clientX / container.clientWidth - 0.5;
    mouse.y = evt.clientY / container.clientHeight - 0.5;
  });
  container.addEventListener('click', () => prepro.play());
  prepro.addDebugView();
  prepro.addEventListener('update', update);
  prepro.addEventListener('ready', (service) => {
    if (service == 'depth') {
      prepro.play();
    }
  });
}

function update() {
  const depth = prepro.currentFrame.depth;
  if (!depth || !depth.canvas.width) {
    return;
  }

  const pixels =
      depth.getImageData(0, 0, depth.canvas.width, depth.canvas.height).data;

  if (prepro.video.el_.videoWidth != canvas.width) {
    canvas.width = prepro.video.el_.videoWidth;
    canvas.height = prepro.video.el_.videoHeight;
    canvas.style.width = '100%';
    canvas.style.height = '100%';
  }
  ctx.drawImage(prepro.video.el_, 0, 0);

  const imData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const imData2 = ctx.getImageData(0, 0, canvas.width, canvas.height);

  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      const p = y * canvas.width + x;

      const x2 = Math.floor(x / canvas.width * depth.canvas.width);
      const y2 = Math.floor(y / canvas.height * depth.canvas.height);
      const p2 = y2 * depth.canvas.width + x2;

      const d = 255 - pixels[p2 * 4] * 4;
      const pos = (y + Math.floor(mouse.y * d)) * canvas.width +
          (x + Math.floor(mouse.x * d));
      imData2.data[p * 4] = imData.data[pos * 4];
      imData2.data[p * 4 + 1] = imData.data[pos * 4 + 1];
      imData2.data[p * 4 + 2] = imData.data[pos * 4 + 2];
    }
  }

  ctx.putImageData(imData2, 0, 0);
}

prepro.load('../_data/test-video', ['depth']).then(setup);
