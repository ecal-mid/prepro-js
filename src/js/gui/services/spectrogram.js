const tpl = require('./spectrogram_tpl.ejs');

class SpectrogramView {
  constructor(container) {
    this.container = container;

    this.el = document.createElement('div');
    this.el.classList.add('prepro-block', 'prepro-spectrogram');
    this.el.innerHTML = tpl();
    container.appendChild(this.el);

    this.canvas = this.el.querySelector('canvas');
    this.ctx = this.canvas.getContext('2d');
  }

  show(data) {
    if (!data) {
      return;
    }

    const ctx = this.ctx;
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    ctx.beginPath();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 3;

    const coords = (i) => {
      return {
        x: i / data.length * ctx.canvas.width,
            y: (1 - data[i]) * ctx.canvas.height
      }
    };

    const start = coords(0);
    ctx.moveTo(start.x, start.y);
    for (let i = 0; i < data.length; i += 8) {
      const pt = coords(i);
      ctx.lineTo(pt.x, pt.y);
    }
    ctx.lineTo(3, ctx.canvas.height - 3);
    ctx.lineTo(start.x + 3, start.y - 3);
    ctx.fill();
    ctx.stroke();
  }
}

module.exports = SpectrogramView;
