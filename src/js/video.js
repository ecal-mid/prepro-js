import {EventDispatcher} from './utils';

class Video extends EventDispatcher {
  constructor(src, config) {
    super();

    this.config_ = config;
    this.framerate_ = this.config_.framerate_;

    this.el_ = document.createElement('video');
    this.el_.loop = true;
    this.el_.src = src;
    this.el_.classList.add('prepro-video');
    this.el_.addEventListener('click', this.onVideoClicked_.bind(this), false);

    this.pct_ = 0;
    this.interval_ = false;
  }

  play() {
    this.el_.play();
    this.interval_ =
        setInterval(this.update.bind(this), 1000 / this.framerate_);
  }

  pause() {
    this.el_.pause();
    clearInterval(this.interval_);
  }

  update() {
    this.pct_ = this.el_.currentTime / this.el_.duration;
    this.dispatch('update');
  }

  set percent(val) {
    this.pct_ = val;
    this.el_.pause();
    this.el_.currentTime = this.pct_ * this.el_.duration;
    this.update();
  }

  get percent() {
    return this.pct_;
  }

  get currentFrame() {
    return Math.floor(this.pct_ * this.config_.totalframes);
  }

  set src(source) {
    this.video.src = source;
  }

  getServiceView(serviceName) {
    return this.servicesViews_[serviceName];
  }

  onVideoClicked_(evt) {
    if (this.el_.paused) {
      this.play();
    } else {
      this.pause();
    }
  }
}

module.exports = Video;
