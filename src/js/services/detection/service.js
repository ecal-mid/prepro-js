import BaseService from '../BaseService';

/**
 * Processed Openpose Frames computed by the Openpose service.
 */
class Detection extends BaseService {
  set data(d) {
    this.data_ = d;
    this.frames = [];
    const total = Object.keys(d).length;
    // Results are lagging a few frames
    this.frames.push(d[0]);
    for (let i = 0; i < total; i++) {
      if (!d[i]) {
        console.warn(`Detection data not available for frame ${i}.`);
        continue;
      }
      this.frames.push(d[i]);
    }
  }
}

module.exports = Detection;
