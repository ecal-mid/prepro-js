import BaseService from '../BaseService';

/**
 * Processed Openpose Frames computed by the Openpose service.
 */
class Openpose extends BaseService {
  set data(d) {
    this.data_ = d;
    this.frames = [];
    const total = Object.keys(d).length;
    this.frames[0] = d[1]['people'];
    for (let i = 1; i < total + 1; i++) {
      if (!d[i]) {
        console.warn(`OpenPose data not available for frame ${i}.`);
        continue;
      }
      this.frames[i] = d[i]['people'];
    }
  }
}

module.exports = Openpose;
