const tpl = require('./openpose_tpl.ejs');

class OpenposeView {
  constructor(container) {
    this.container = container;

    this.el = document.createElement('div');
    this.el.classList.add('prepro-block', 'prepro-openpose');
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
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.rect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fill();

    ctx.fillStyle = 'white';
    const joints = [
      [0, 1],           // neck
      [1, 2, 3, 4],     // left shoulder & arm
      [1, 5, 6, 7],     // right shoulder & arm
      [1, 8, 9, 10],    // left body & leg
      [1, 11, 12, 13],  // right body & leg
    ];
    for (let pose of data) {
      const pts = pose['pose_keypoints'];
      for (let i = 0; i < pts.length / 3; i++) {
        const x = pts[i * 3];
        const y = pts[i * 3 + 1];
        const c = pts[i * 3 + 2];
        ctx.fillStyle = `rgba(255, 255, 255, ${c})`;
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, 2 * Math.PI);
        ctx.fill();
      }

      ctx.lineWidth = 5;
      for (let j of joints) {
        ctx.beginPath();
        const c = pts[j[0] * 3 + 2];
        if (c > 0.2) {
          ctx.moveTo(pts[j[0] * 3], pts[j[0] * 3 + 1]);
        }
        for (let pi of j) {
          const c = pts[pi * 3 + 2];
          if (c > 0.1) {
            ctx.strokeStyle = `rgba(127, 127, 127, ${c})`;
            ctx.lineTo(pts[pi * 3], pts[pi * 3 + 1]);
          }
        }
        ctx.stroke();
      }
    }
  }
}

module.exports = OpenposeView;
