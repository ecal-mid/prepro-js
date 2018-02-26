const tpl = require('./segmentation_tpl.ejs');

class FlowView {
  constructor(container) {
    this.container = container;

    this.el = document.createElement('div');
    this.el.classList.add('prepro-block', 'prepro-segmentation');
    this.el.innerHTML = tpl({config: prepro.config});
    container.appendChild(this.el);

    this.canvas = this.el.querySelector('canvas');
    this.ctx = this.canvas.getContext('2d');

    // Routine to show the updated status.
    const statusEl = this.el.querySelector('.prepro-segmentation-status');
    const itvl = setInterval(() => {
      const service = prepro.services.get('segmentation');
      const status = service.getStatus();
      statusEl.innerHTML = `processing ${status.loaded} / ${status.total}`;
      if (status.loaded >= status.total) {
        statusEl.remove();
        clearInterval(itvl);
      }
    }, 100);
  }

  show(data) {
    if (!data) {
      return;
    }
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    const frame = data.canvas;
    this.ctx.drawImage(frame, 0, 0, this.canvas.width, this.canvas.height);
  }
}

module.exports = FlowView;
