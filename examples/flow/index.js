function setup() {
  prepro.showVideo('#prepro');
  // prepro.addDebugView();
  prepro.addEventListener('update', update);
  // prepro.video.play();
}

function update() {
  console.log(prepro.currentFrame);
}

prepro.load('../data/test_video_small_new').then(setup);
