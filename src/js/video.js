import {EventDispatcher} from './utils';

/**
 * The Video class extends the video module to simplify video playback.
 * @extends EventDispatcher
 */
class Video extends EventDispatcher {
  /**
   * Creates a new Video object
   * @param {string} src    Path of the bideo to load.
   * @param {object} config (optional) An optional config object.
   */
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

  /**
   * Starts playback of the video.
   */
  play() {
    this.el_.play();
    this.interval_ =
        setInterval(this.update.bind(this), 1000 / this.framerate_);
  }

  /**
   * Pauses playback of the video.
   */
  pause() {
    this.el_.pause();
    clearInterval(this.interval_);
  }

  /**
   * Update handler, called on interval, everytime the video updates.
   */
  update() {
    this.pct_ = this.el_.currentTime / this.el_.duration;
    this.dispatch('update');
  }

  /**
   * Setter for the playback position in percent.
   * @param  {number} val The desired playhead position in percent / 100.
   */
  set percent(val) {
    this.pct_ = val;
    this.el_.pause();
    this.el_.currentTime = this.pct_ * this.el_.duration;
    this.update();
  }

  /**
   * Getter for the playback position in percent.
   * @return {number} The playback position in percent.
   */
  get percent() {
    return this.pct_;
  }

  /**
   * Getter for the current frame.
   * @return {object} An object containing all the services data for the current
   *                  frame.
   */
  get currentFrame() {
    return Math.floor(this.pct_ * this.config_.totalframes);
  }

  /**
   * Setter for the url of the video.
   * @param  {String} source Url of the video to Display.
   */
  set src(source) {
    this.video.src = source;
  }

  /**
   * Getter for the current coordinates of the video as displayed.
   */
  get offset() {
    const h = this.el_.videoHeight / this.el_.videoWidth * window.innerWidth;
    return {x: 0, y: (window.innerHeight - h) * 0.5};
  }

  /**
   * Handler for click event on the video.
   * @param  {MouseEvent} evt The mouse event object.
   * @private
   */
  onVideoClicked_(evt) {
    if (this.el_.paused) {
      this.play();
    } else {
      this.pause();
    }
  }
}

module.exports = Video;
