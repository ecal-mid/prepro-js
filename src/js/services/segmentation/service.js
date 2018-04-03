import BaseService from '../BaseService';

/**
 * Processed Segmentation Frames computed by the MaskRCNN service.
 */
class Segmentation extends BaseService {
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
        this.dispatch('ready', 'segmentation');
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

module.exports = Segmentation;
