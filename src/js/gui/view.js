import ColorsView from './services/colors';
import FlowView from './services/flow';
import OpenposeView from './services/openpose';
import SpectrogramView from './services/spectrogram';
import TimelineView from './timeline';

const viewClasses = {
  'colors': ColorsView,
  'openpose': OpenposeView,
  'spectrogram': SpectrogramView,
  'flow': FlowView,
};

class View {
  constructor(container) {
    this.video = document.createElement('video');
    this.video.loop = true;
    this.video.classList.add('prepro-video');
    this.video.addEventListener(
        'click', this.onVideoClicked_.bind(this), false);
    container.append(this.video);

    this.el = document.createElement('div');
    this.el.classList.add('prepro-view', 'prepro-reactive');
    this.el.innerHTML = `
      <div class="prepro-timeline-cursor"></div>
      <div class="prepro-timeline-cursor-bg"></div>
      <div class="prepro-services"></div>
    `;
    container.append(this.el);

    this.timeline = new TimelineView(this.el);

    this.servicesViews_ = {};

    this.pct_ = 0;
    this.interval_ = false;
    this.framerate_ = 0;

    this.setupAutoHide_(2000);
    window.addEventListener('resize', this.onVideoResize_.bind(this));
  }

  setup(src, config) {
    this.src = src;
    this.framerate_ = config.framerate_;
    this.showFrameDetails(prepro.getCurrentFrame());
  }

  play() {
    this.video.play();
    this.interval_ =
        setInterval(this.update.bind(this), 1000 / this.framerate_);
  }

  pause() {
    this.video.pause();
    clearInterval(this.interval_);
  }

  update() {
    this.pct_ = this.video.currentTime / this.video.duration;
    if (!isNaN(this.pct_)) {
      this.timeline.update(this.pct_);
      this.showFrameDetails(prepro.getCurrentFrame());
    }
  }

  showFrameDetails(frame) {
    for (let serviceName in frame) {
      if (!this.servicesViews_[serviceName]) {
        const ServiceViewClass = viewClasses[serviceName];
        if (!ServiceViewClass) {
          continue;
        }
        const serviceEl = this.el.querySelector('.prepro-services');
        this.servicesViews_[serviceName] = new ServiceViewClass(serviceEl);
      }
      this.servicesViews_[serviceName].show(frame[serviceName]);
    }
  }

  set pct(val) {
    this.pct_ = val;
    this.video.pause();
    this.video.currentTime = this.pct_ * this.video.duration;
    this.update();
  }

  get pct() {
    return this.pct_;
  }

  set src(source) {
    this.video.src = source;
  }

  getServiceView(serviceName) {
    return this.servicesViews_[serviceName];
  }

  onVideoClicked_(evt) {
    if (this.video.paused) {
      this.play();
    } else {
      this.pause();
    }
  }

  onVideoResize_(evt) {
    for (let serviceView in this.servicesViews_) {
      const v = this.servicesViews_[serviceView];
      if (v.resize) {
        v.resize();
      }
    }
  }

  setupAutoHide_(delay) {
    let hideTimeout = null;
    this.el.classList.add('prepro-autohide');
    const autohide = () => {
      this.el.classList.remove('prepro-hidden');
      clearTimeout(hideTimeout);
      hideTimeout =
          setTimeout(() => this.el.classList.add('prepro-hidden'), delay);
    };

    this.el.addEventListener('mouseover', (evt) => {
      window.removeEventListener('mousemove', autohide, false);
      clearTimeout(hideTimeout);
    });

    this.el.addEventListener('mouseleave', (evt) => {
      window.addEventListener('mousemove', autohide, false);
    });
    window.addEventListener('mousemove', autohide, false);
    autohide();
  }
}

module.exports = View;
