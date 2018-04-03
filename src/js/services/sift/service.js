import BaseService from '../BaseService';

/**
 * Processed SIFT Frames computed by the OpenCV Sift service.
 */
class Sift extends BaseService {
  set data(d) {
    super.data = d;
    for (let i = 0; i < d.length; i++) {
      this.frames[i] = d[i];
    }
  }
}

module.exports = Sift;
