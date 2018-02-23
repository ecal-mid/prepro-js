class Palette extends Array {
  constructor(colors) {
    super();
    for (let c of colors) {
      this.push('#' + c);
    }
  }
}

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
      this.frames.push(new Palette(frameColors));
    }
  }

  get data() {
    return this.data_;
  }
}

module.exports = {
  Palette,
  Colors,
};
