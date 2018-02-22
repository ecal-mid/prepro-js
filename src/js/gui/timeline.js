class TimelineView {
  constructor(container) {
    this.container = container;
    this.cursor = container.querySelector('.prepro-timeline-cursor');
    container.addEventListener(
        'mouseover', this.onMouseOver_.bind(this), false);
    container.addEventListener(
        'mousemove', this.onMouseMove_.bind(this), false);
  }

  update(pct) {
    this.cursor.style.width = pct * 100 + '%';
  }

  /* PRIVATE */

  onMouseMove_(event) {
    const pct = event.clientX / this.container.clientWidth;
    prepro.view.pct = pct;
  }

  onMouseOver_(event) {
    prepro.view.pause();
  }
}

module.exports = TimelineView;
