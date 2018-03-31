import {EventDispatcher} from './utils';

/**
 * Map service names to corresponding class.
 * @type Object
 * @private
 */
const services = [
  'colors',
  'openpose',
  'spectrogram',
  'flow',
  'segmentation',
  'sift',
];

/**
 * The Services dictionnary.
 */
class Services extends EventDispatcher {
  /**
   */
  constructor() {
    /**
     * Services dictionnary.
     * @type {Object}
     * @private
     */
    super();
    this.services_ = {};
  }

  /**
   * Setup the services from loaded data.
   * @param {Object} data - The data object generated by the Loader.
   * @private
   */
  setup(data) {
    for (let s in data) {
      if (services.indexOf(s) != -1) {
        const ServiceClass = require(`./services/${s}/service`);
        this.services_[s] = new ServiceClass(data[s]);
        if (this.services_[s].addEventListener) {
          this.services_[s].addEventListener(
              'ready', (e) => this.dispatch('ready', e));
        }
      }
    }
  }

  /**
   * Return the service.
   * @param  {String} serviceName The name of the service.
   * @return {Service}            A Service object.
   */
  get(serviceName) {
    return this.services_[serviceName];
  }

  /**
   * Returns services frame
   * @param  {Integer} frameId The frame number
   * @return {Object}           The service object for each frame.
   */
  getFrame(frameId) {
    const frame = {id: frameId};
    for (let service in this.services_) {
      frame[service] = this.services_[service].getFrame(frameId);
    }
    return frame;
  }
}

module.exports = Services;
