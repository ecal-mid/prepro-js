class EventDispatcher {
  constructor() {
    this.handlers_ = {};
  }

  /**
   * Adds an event listener.
   * @param  {string} event   Name of the event.
   * @param  {function} handler Function called when the event is triggered.
   */
  addEventListener(event, handler) {
    this.handlers_[event] = this.handlers_[event] || [];
    this.handlers_[event].push(handler);
  }

  /**
   * Dispatch an event.
   * @param  {string} event   Name of the event.
   * @param  {*}      data    Data payload.
   */
  dispatch(event, data) {
    const handlers = this.handlers_[event];
    if (handlers) {
      for (let handler of handlers) {
        handler(event, data);
      }
    }
  }
}

module.exports = {EventDispatcher};
