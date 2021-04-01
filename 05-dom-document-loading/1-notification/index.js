export default class NotificationMessage {
  static notifications;

  constructor(message = '', {
    duration = 2000,
    type = 'success',
  } = {}) {
    if (NotificationMessage.notifications) {
      NotificationMessage.notifications.remove();
    }

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

  show(elem = document.body) {
    elem.append(this.element);

    NotificationMessage.notifications = this.element;
    this.remove();
  }

  remove() {
    setTimeout(() => {
      this.destroy();
    }, this.duration);
  }

  destroy() {
    this.element.remove();
  }
}
