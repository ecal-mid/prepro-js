import View from './gui/view';
import loadAll from './loader';

import {Colors} from './services/colors';
import Openpose from './services/openpose';
import Spectrogram from './services/spectrogram';

const DEFAULT_CONFIG_FILENAME = 'prepro.json';
const DEFAULT_VIDEO_FILENAME = 'source.mov';

class Prepro {
  constructor(el) {
    this.services = {};
    this.frames = [];
    this.config = {};
    if (el) {
      this.el = el;
      this.view = new View(this.el);
    }
  }

  /**
   * Loads a prepro data folder generated by the CLI.
   * @param  {String} folder The prepro data folder that contains prepro.json
   * @return {Promise}       A Promise that completes when everything is loaded.
   */
  load(folder) {
    return new Promise((resolve, reject) => {
      fetch(folder + '/' + DEFAULT_CONFIG_FILENAME)
          .then((data) => data.json())
          .then((config) => {
            this.config = config;
            loadAll(folder, config)
                .then((data) => {
                  this.setupServices_(data);
                  if (this.view) {
                    this.view.setup(
                        folder + '/' + DEFAULT_VIDEO_FILENAME, config);
                  }
                  resolve();
                })
                .catch(reject);
          });
    });
  }

  /**
   * Starts playback.
   */
  play() {
    this.view.play();
  }

  /**
   * Pause playback.
   */
  pause() {
    this.view.pause();
  }

  /**
   * Returns a snapshot of all the availalbe services for the current frame.
   * @return {Dictionary} The snapshot
   */
  getCurrentFrame() {
    const frameNum = Math.floor(this.view.pct * this.config.totalframes);
    const frame = {frame: frameNum};
    const servicesNames = this.config.services.map((s) => s.name);
    for (let service of servicesNames) {
      frame[service] = this.services[service].getFrame(frameNum);
    }
    return frame;
  }

  /**
   * Setup the services from loaded data.
   * @param {Object} data - The data object generated by the Loader.
   * @private
   */
  setupServices_(data) {
    this.services.colors = new Colors(data.colors);
    this.services.openpose = new Openpose(data.openpose);
    this.services.spectrogram = new Spectrogram(data.spectrogram);
  }
}

// TODO: TO BE MOVED
const el = document.getElementById('prepro');
el.classList.add('prepro-container');
window.prepro = new Prepro(el);
//
// console.log(prepro);
//
module.exports = Prepro;
