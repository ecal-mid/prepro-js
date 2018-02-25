function loadJSON(path) {
  return fetch(path).then((data) => data.json());
}

function loadImage(path) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.addEventListener('load', (evt) => {
      resolve(img);
    });
    img.src = path;
  });
}

function loadVideo(path) {
  return new Promise((resolve, reject) => {
    fetch(path)
        .then((response) => response.blob())
        .then((blob) => {
          const videoData = URL.createObjectURL(blob);
          const video = document.createElement('video');
          const itv = setInterval(() => {
            if (video.readyState === 4) {
              clearInterval(itv);
              resolve(video);
            }
          });
          video.src = videoData;
        })
        .catch(reject);
  });
}

function loadAll(folder, config) {
  return new Promise((resolve, reject) => {
    const data = {};
    const loaders = config.services.map((s) => {
      const name = s.name.split('2').pop();
      if ([
            'openpose',
            'colors',
            'spectrogram',
            'flow',
          ].indexOf(name) == -1) {
        return;
      }
      switch (s.type) {
        case 'json':
          return loadJSON(folder + '/' + s.path)
              .then((json) => data[name] = json);
        case 'png':
        case 'jpg':
          return loadImage(folder + '/' + s.path)
              .then((image) => data[name] = image);
        case 'mov':
          return loadVideo(folder + '/' + s.path)
              .then((video) => data[name] = video);
      }
    });
    Promise.all(loaders).then(() => resolve(data)).catch((err) => {
      console.error('Error loading files:');
      console.error(err);
    });
  });
}

module.exports = loadAll;
