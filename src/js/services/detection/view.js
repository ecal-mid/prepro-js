const tpl = require('./tpl.ejs');

class BoxDetectionView {
  constructor(container) {
    this.container = container;

    this.el = document.createElement('div');
    this.el.classList.add('prepro-block', 'prepro-detection');
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

    ctx.fillStyle = 'white';

    const w = ctx.canvas.width;
    const h = ctx.canvas.height;

    for (let box of data) {
      ctx.strokeStyle = 'red';
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.rect(
          box.x * w, box.y * h, (box.x + box.width) * w,
          (box.y + box.height) * h);
      ctx.stroke();
      ctx.font = '50px sans-serif';
      ctx.fillText(box.category.toUpperCase(), box.x * w, box.y * h + 45);
    }
  }

  resize() {
    const w = this.ctx.canvas.clientHeight * prepro.config.width /
        prepro.config.height;
    this.ctx.canvas.style.width = w + 'px';
  }
}

module.exports = BoxDetectionView;
