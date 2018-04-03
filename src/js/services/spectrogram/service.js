const BaseService = require('../BaseService');

/**
 * Processed Audio Spectrogram Frames computed by the Scipy Spectrogram service.
 */
class Spectrogram extends BaseService {
  set data(d) {
    super.data = d;
    const w = d.width;
    const h = d.height;

    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(d, 0, 0, w, h);
    const pixels = ctx.getImageData(0, 0, w, h).data;
    for (let i = 0; i < w; i++) {
      const frame = [];
      for (let j = 0; j < h; j++) {
        const k = j * w + i;
        const v = pixels[k * 4];
        frame.push(v / 255);
      }
      this.frames.push(frame);
    }
  }
}

module.exports = Spectrogram;
