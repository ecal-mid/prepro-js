import DebugView from './gui/debug_view';
import loadAll from './loader';
import Services from './services';
import {EventDispatcher} from './utils';
import Video from './video';

const DEFAULT_CONFIG_FILENAME = 'prepro.json';
const DEFAULT_VIDEO_FILENAME = 'source.mov';

/**
 * Main Prepro class.
 *
 * This class is instanciated automatically in a global 'prepro' object.
 *
 * @example
 * const prepro = new Prepro();
 * prepro.load('prepro-video-export').then(() => {
 *    prepro.play();
 * });
 */
class Prepro extends EventDispatcher {
  /**
   * Instanciate the Prepro class.
   */
  constructor() {
    super();
    this.services = new Services();
    this.frames = [];
    this.config = {};
    this.data = [];
    this.video = null;
    this.debugView = null;

    /**
     * The internal cache for currentFrame object
     * @type {Number}
     * @private
     */
    this.currentFrame_ = 0;
    this.events_ = {};
  }

  /**
   * Loads a prepro data folder generated by the CLI.
   * @param  {String} folder The prepro data folder that contains prepro.json
   * @param  {String} services [optional] specify which services to load.
   * @return {Promise}       A Promise that completes when everything is loaded.
   */
  load(folder, services) {
    return new Promise((resolve, reject) => {
      fetch(folder + '/' + DEFAULT_CONFIG_FILENAME)
          .then((data) => data.json())
          .then((config) => {
            this.config = config;
            this.config['folder'] = folder;
            this.config['services_filter'] = services;
            const videoFile = folder + '/' + DEFAULT_VIDEO_FILENAME;
            this.video = new Video(videoFile, config);
            this.video.addEventListener(
                'update', (e) => this.dispatch('update', e));
            loadAll(folder, config)
                .then((data) => {
                  this.data = data;
                  this.services.setup(data);
                  resolve();
                })
                .catch(reject);
          });
    });
  }

  /**
   * Add video element to container.
   * @param {Element|String} el View container element or query selector.
   */
  showVideo(el) {
    if (typeof el == 'string') {
      el = document.querySelector(el);
    }
    el.appendChild(this.video.el_);
  }

  /**
   * Add debug view helper.
   * @param {Element|String} el View container element or query selector.
   */
  addDebugView(el) {
    if (typeof el == 'string') {
      el = document.querySelector(el);
    }
    this.debugView = new DebugView(this.video, el || document.body);
  }

  /**
   * Returns a snapshot of all the availalbe services for the current frame.
   * @return {Dictionary} The snapshot
   */
  get currentFrame() {
    if (!this.video) {
      return null;
    }
    const frameId = this.video.currentFrame;
    if (frameId != this.currentFrame_.id) {
      this.currentFrame_ = this.services.getFrame(frameId);
    }
    return this.currentFrame_;
  }

  /**
   * Plays the video.
   */
  play() {
    this.video.play();
  }

  /**
   * Pauses the video.
   */
  pause() {
    this.video.pause();
  }
}

if (window) {
  window.prepro = new Prepro();
}

module.exports = Prepro;
