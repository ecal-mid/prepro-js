class Sift {
  constructor(data) {
    this.frames = [];
    this.data = data;
  }

  getFrame(i) {
    return this.frames[i];
  }

  set data(d) {
    this.data_ = d;
    this.frames = d;
  }

  get data() {
    return this.data_;
  }
}

module.exports = Sift;