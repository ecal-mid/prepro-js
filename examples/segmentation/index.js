const canvas = document.getElementById('overlay');
const ctx = canvas.getContext('2d');

function setup() {
  // prepro.showVideo('#prepro');
  prepro.addDebugView();
  prepro.addEventListener('update', update);
  window.addEventListener('click', () => {
    prepro.video.play();
  });
}

function update() {
  const seg = prepro.currentFrame.segmentation;
  if (!seg || !seg.canvas.width) {
    return;
  }

  const pixels =
      seg.getImageData(0, 0, seg.canvas.width, seg.canvas.height).data;

  if (prepro.video.el_.videoWidth != canvas.width) {
    canvas.width = prepro.video.el_.videoWidth;
    canvas.height = prepro.video.el_.videoHeight;
  }
  ctx.drawImage(prepro.video.el_, 0, 0);

  const imData = ctx.getImageData(0, 0, canvas.width, canvas.height);

  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      const p = y * canvas.width + x;

      const x2 = Math.floor(x / canvas.width * seg.canvas.width);
      const y2 = Math.floor(y / canvas.height * seg.canvas.height);
      const p2 = y2 * seg.canvas.width + x2;
      if (pixels[p2 * 4] < 127) {
        imData.data[p * 4] = 0;
        imData.data[p * 4 + 1] = 0;
        imData.data[p * 4 + 2] = 0;
      }
    }
  }

  ctx.putImageData(imData, 0, 0);
}

prepro.load('../_data/test-video', 'segmentation').then(setup);
