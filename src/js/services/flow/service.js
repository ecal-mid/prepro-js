import {EventDispatcher} from '../../utils';

class Flow extends EventDispatcher {
  constructor(data) {
    super();
    this.frames = [];
    this.video_ = null;
    this.data = data;
    this.currLoaded_ = 0;
  }

  getFrame(i) {
    return this.frames[i];
  }

  getStatus() {
    return {
      loaded: this.currLoaded_,
      total: this.frames.length,
    };
  }

  set data(video) {
    this.video_ = video;
    this.frames = [];

    this.video_.pause();

    const numFrames = video.duration * prepro.config.framerate;

    // create frames;
    for (let i = 0; i < numFrames; i++) {
      const cnv = document.createElement('canvas');
      cnv.width = this.video_.videoWidth;
      cnv.height = this.video_.videoHeight;
      const ctx = cnv.getContext('2d');
      this.frames.push(ctx);
    }

    // draw frame function
    const drawNextFrame = () => {
      const ctx = this.frames[this.currLoaded_];
      ctx.drawImage(this.video_, 0, 0, ctx.canvas.width, ctx.canvas.height);
      this.currLoaded_++;
      if (this.currLoaded_ >= numFrames) {
        this.video_.removeEventListener('seeked', drawNextFrame);
        this.dispatch('processed', 'flow');
      } else {
        this.video_.currentTime = this.currLoaded_ / prepro.config.framerate;
      }
    };

    // launch draw frame pipeline
    this.currLoaded_ = 0;
    this.video_.addEventListener('seeked', drawNextFrame);
    this.video_.currentTime = this.currLoaded_ / prepro.config.framerate;
  }

  get data() {
    return this.video_;
  }
}

module.exports = Flow;
