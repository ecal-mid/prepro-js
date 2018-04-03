import {EventDispatcher} from '../utils';

/**
 * Base Service
 */
class BaseService extends EventDispatcher {
  /**
   * @param {Object} data The raw data loaded by the loader.
   */
  constructor(data) {
    super(data);
    this.currLoaded_ = 0;
    this.frames = [];
    this.data_ = null;
    this.data = data;
  }

  /**
   * Returns the processed data for the frame at i.
   * @param  {Integer} i Id of the frame.
   * @return {Object} The processed frame data
   */
  getFrame(i) {
    return this.frames[i];
  }

  /**
   * Returns the loading/processing status.
   * @return {Object} { loaded:Id of the current frame loaded,
   *                    total: Total number of frames}
   */
  getStatus() {
    return {
      loaded: this.currLoaded_,
      total: this.frames.length,
    };
  }

  /**
   * Sets the raw data.
   * Classes that extend BaseService should override this setter and process
   * the raw data into an optimized format for runtime use.
   * @param  {Object} d The raw data loaded by the loader.
   */
  set data(d) {
    this.data_ = d;
  }

  /**
   * Returns the raw data.
   * @return {Object} The raw data.
   */
  get data() {
    return this.data_;
  }
}

module.exports = BaseService;
