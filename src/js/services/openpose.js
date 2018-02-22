class Openpose {
  constructor(data) {
    this.data = data;
  }

  getFrame(i) {
    return this.data[i];
  }

  set data(d) {
    this.data_ = d;
  }

  get data() {
    return this.data_;
  }
}

module.exports = Openpose;
