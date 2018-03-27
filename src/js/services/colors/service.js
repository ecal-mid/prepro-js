/**
 * Class for each color frame.
 * It's an array of colors represented as an hexadecimal string.
 * @extends Array
 *
 * @example
 * console.log(myColorFrame)
 * // Prints: ['#ff0000', '#00ff00', '#0000ff', '#ffffff', '#000000']
 */
class ColorsFrame extends Array {
  constructor(colors) {
    super();
    for (let c of colors) {
      this.push('#' + c);
    }
  }
}

/**
 * Colors Class
 */
class Colors {
  constructor(data) {
    this.frames = [];
    this.data = data;
  }

  getFrame(i) {
    return this.frames[i];
  }

  set data(d) {
    this.data_ = d;
    this.frames = [];
    for (let frameColors of d) {
      this.frames.push(new ColorsFrame(frameColors));
    }
  }

  get data() {
    return this.data_;
  }
}

module.exports = Colors;
