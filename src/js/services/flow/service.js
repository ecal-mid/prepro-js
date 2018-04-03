import BaseService from '../BaseService';

/**
 * Processed Flow Frames computed by the Flow service using OpenCV.
 *
 * Each frame is a canvas that contains an estimation of the movement of each
 * pixels in the source video.
 *
 * - The red channel contains the movement on the `x` axis
 * - The green channel contains the movement on the `y` axis
 * - The blue channel contains the movement on the `z` axis
 *
 * The canvas are saved at half the resolution of the source video for
 optimisation.
 */
class Flow extends BaseService {
  /**
   * @override
   */
  set data(video) {
    this.frames = [];

    video.pause();

    const numFrames = video.duration * prepro.config.framerate;

    // create frames;
    for (let i = 0; i < numFrames; i++) {
      const cnv = document.createElement('canvas');
      cnv.width = video.videoWidth;
      cnv.height = video.videoHeight;
      const ctx = cnv.getContext('2d');
      this.frames.push(ctx);
    }

    // draw frame function
    const drawNextFrame = () => {
      const ctx = this.frames[this.currLoaded_];
      ctx.drawImage(video, 0, 0, ctx.canvas.width, ctx.canvas.height);
      this.currLoaded_++;
      if (this.currLoaded_ >= numFrames) {
        video.removeEventListener('seeked', drawNextFrame);
        this.dispatch('ready', 'flow');
      } else {
        video.currentTime = this.currLoaded_ / prepro.config.framerate;
      }
    };

    // launch draw frame pipeline
    this.currLoaded_ = 0;
    video.addEventListener('seeked', drawNextFrame);
    video.currentTime = this.currLoaded_ / prepro.config.framerate;
  }
}

module.exports = Flow;
