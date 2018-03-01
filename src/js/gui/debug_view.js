import ColorsView from './services/colors';
import FlowView from './services/flow';
import OpenposeView from './services/openpose';
import SegmentationView from './services/segmentation';
import SiftView from './services/sift';
import SpectrogramView from './services/spectrogram';
import TimelineView from './timeline';

const viewClasses = {
  'colors': ColorsView,
  'openpose': OpenposeView,
  'spectrogram': SpectrogramView,
  'flow': FlowView,
  'segmentation': SegmentationView,
  'sift': SiftView,
};

class DebugView {
  constructor(video, container) {
    this.video = video;
    this.video.addEventListener('update', this.update.bind(this));

    this.el = document.createElement('div');
    // el.classList.add('prepro-container');
    this.el.classList.add('prepro-view', 'prepro-reactive');
    this.el.innerHTML = `
      <div class="prepro-timeline-cursor"></div>
      <div class="prepro-timeline-cursor-bg"></div>
      <div class="prepro-services"></div>
    `;
    container.append(this.el);

    this.timeline = new TimelineView(this.el);

    this.servicesViews_ = {};

    this.setupAutoHide_(2000);
    window.addEventListener('resize', this.onWindowResize_.bind(this));

    this.showFrameDetails(prepro.currentFrame);
  }

  update() {
    this.timeline.update(this.video.percent);
    this.showFrameDetails(prepro.currentFrame);
  }

  showFrameDetails(frame) {
    for (let serviceName in frame) {
      if (!frame[serviceName]) {
        continue;
      }
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

  getServiceView(serviceName) {
    return this.servicesViews_[serviceName];
  }

  onWindowResize_(evt) {
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

module.exports = DebugView;
