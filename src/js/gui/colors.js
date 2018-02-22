const tpl = require('./colors_tpl.ejs');

class ColorsView {
  constructor(container) {
    this.el = document.createElement('div');
    this.el.classList.add('prepro-block', 'prepro-colors');
    container.appendChild(this.el);
  }

  set colors(colors) {
    this.el.innerHTML = tpl({colors: colors});
  }
}

module.exports = ColorsView;
