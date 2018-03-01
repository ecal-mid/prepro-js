const tpl = require('./sift_tpl.ejs');

class SiftView {
  constructor(container) {
    this.container = container;

    this.el = document.createElement('div');
    this.el.classList.add('prepro-block', 'prepro-sift');
    this.el.innerHTML = tpl({config: prepro.config});
    container.appendChild(this.el);

    this.canvas = this.el.querySelector('canvas');
    this.ctx = this.canvas.getContext('2d');
  }

  show(data) {
    if (!data) {
      return;
    }

    const ctx = this.ctx;

    ctx.canvas.width =
        ctx.canvas.height * prepro.config.width / prepro.config.height;

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    ctx.fillStyle = 'blue';
    for (let kp of data.keypointsA) {
      ctx.beginPath();
      ctx.arc(kp.x, kp.y, 2, 0, 2 * Math.PI);
      ctx.fill();
    }
    ctx.strokeStyle = 'red';
    ctx.fillStyle = 'white';
    ctx.lineWidth = 1;
    for (let m of data.matches) {
      const kp1 = data.keypointsA[m.keypointA];
      const kp2 = data.keypointsB[m.keypointB];

      if (!kp1 || !kp2) {
        continue;
      }

      const dx = (kp2.x - kp1.x);
      const dy = (kp2.y - kp1.y);
      if (dx > 3 || dy > 3) {
        continue;
      }

      ctx.beginPath();
      ctx.arc(kp1.x, kp1.y, 2, 0, 2 * Math.PI);
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(kp1.x, kp1.y);
      ctx.lineTo(kp1.x + dx * 20, kp1.y + dy * 20);
      ctx.stroke();
    }
  }

  resize() {
    const w = this.ctx.canvas.clientHeight * prepro.config.width /
        prepro.config.height;
    this.ctx.canvas.style.width = w + 'px';
  }
}

module.exports = SiftView;
