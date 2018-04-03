/**
 * Loads a JSON file.
 * @ignore
 * @param  {string} path The path of the image to load.
 * @return {Promise}     A Promise resolving when the file has been loaded.
 */
function loadJSON(path) {
  return fetch(path).then((data) => data.json());
}

/**
 * Loads an image.
 * @ignore
 * @param  {string} path The path of the image to load.
 * @return {Promise}     A Promise resolving when the file has been loaded.
 */
function loadImage(path) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.addEventListener('load', (evt) => {
      resolve(img);
    });
    img.src = path;
  });
}

/**
 * Loads a video file
 * @ignore
 * @param  {string} path The path of the video to load.
 * @return {Promise}     A Promise resolving when the file has been loaded.
 */
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

/**
 * Load all available data currently implemented.
 * @ignore
 * @param  {string} folder Path to the prepro data folder
 * @param  {object} config The prepro.json config object
 * @return {Promise}       A promise resolving when everyting has been loaded.
 */
function loadAll(folder, config) {
  return new Promise((resolve, reject) => {
    const data = {};
    const loaders = config.services.map((s) => {
      const name = s.name.split('2').pop();
      const services = config.services_filter || [
        'openpose',
        'colors',
        'spectrogram',
        'flow',
        'segmentation',
        'sift',
      ];
      if (services.indexOf(name) == -1) {
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

/**
 * Used to request web services.
 * @ignore
 */
module.exports = loadAll;
