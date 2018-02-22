class Openpose {
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
    const total = Object.keys(d).length;
    this.frames[0] = d[1]['people'];
    for (let i = 1; i < total + 1; i++) {
      this.frames[i] = d[i]['people'];
    }
  }

  get data() {
    return this.data_;
  }
}

module.exports = Openpose;
