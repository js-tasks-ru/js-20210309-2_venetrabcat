class Tooltip {
  element;

  pointerOverEvent = (event) => {
    if (event.target.dataset.tooltip !== undefined) {
      const data = {
        title: event.target.dataset.tooltip,
        style: {
          top: `${event.clientY + 10}px`,
          left: `${event.clientX + 10}px`,
          position: 'absolute'
        }
      };
      this.removeEventListener();
      this.render(data);
    }
  }

  pointerOutEvent = () => this.destroy();

  pointerMoveEvent = (event) => {
    const style = {
      top: `${event.clientY + 10}px`,
      left: `${event.clientX + 10}px`,
      position: 'absolute'
    };
    this.update(style);
  }

  addEventListener() {
    document.addEventListener('pointerover', this.pointerOverEvent);
    document.addEventListener('pointermove', this.pointerMoveEvent);
    document.addEventListener('pointerout', this.pointerOutEvent);
  }

  removeEventListener() {
    document.removeEventListener('pointerover', this.pointerOverEvent);
    document.removeEventListener('pointermove', this.pointerMoveEvent);
    document.removeEventListener('pointerout', this.pointerOutEvent);
  }

  initialize() {
    this.addEventListener();
  }

  render({title = '', style = {}}) {
    this.element = document.createElement('div');

    this.element.classList.add('tooltip');
    this.update(style);

    this.element.innerHTML = title;
    document.body.append(this.element);

    this.addEventListener();
  }

  update(style = {}) {
    if (this.element) {
      this.element.setAttribute('style', this.setStyle(style));
    }
  }

  setStyle(properties) {
    let propertiesStr = '';
    for (let [key, value] of Object.entries(properties)) {
      propertiesStr += `${key}:${value};`;
    }

    return propertiesStr;
  }

  destroy() {
    if (this.element) {
      this.element.remove();
    }
  }
}

const tooltip = new Tooltip();

export default tooltip;
