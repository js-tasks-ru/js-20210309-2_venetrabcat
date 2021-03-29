export default class NotificationMessage {
  static notification = [];

  constructor(message = '', {
    duration = 2000,
    type = 'success',
  } = {}) {
    this.message = message;
    this.duration = duration;
    this.type = type;
    this.setElement();
  }

  setElement() {
    const element = document.createElement('div');

    element.innerHTML = this.template;
    this.element = element.firstElementChild;
  }

  get template() {
    return `<div class="notification ${this.type}" style="--value:${this.duration / 1000}s">
              <div class="timer"></div>
              <div class="inner-wrapper">
                <div class="notification-header">${this.type}</div>
                <div class="notification-body">${this.message}</div>
              </div>
            </div>`;
  }

  show(elem) {
    this.remove();

    if (elem !== undefined) {
      elem.append(this.element);
    } else {
      document.body.append(this.element);
    }

    this.timeOut();
  }

  remove() {
    NotificationMessage.notification.forEach(el => el.remove());
    NotificationMessage.notification.push(this.element);
  }

  timeOut() {
    setTimeout(() => {
      this.destroy();
    }, this.duration);
  }

  destroy() {
    this.element.remove();
  }
}
