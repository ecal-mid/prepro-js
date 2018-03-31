function setup() {
  // Add the video element to the div with the id "prepro".
  prepro.showVideo('#prepro');
  // Add the debug view to see the services details.
  prepro.addDebugView('#prepro');
  // Start playing.
  prepro.play();
}

// Load the video folder and call the setup function when done.
prepro.load('../_data/test-video').then(setup);
