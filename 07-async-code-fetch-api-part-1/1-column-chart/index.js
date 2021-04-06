import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class ColumnChart {
  /** @type {HTMLElement} */
  element;
  subElements = {};
  chartHeight = 50;
  data = [];

  /** Column Chart
   * @param url {string}
   * @param label {string}
   * @param range {Object}
   * @param link {string}
   * @param value {number}
   * @param formatHeading {function}
   */
  constructor({
    url = '',
    label = '',
    range = {},
    link = '',
    value = 0,
    formatHeading = data => data
  } = {}) {
    this.url = new URL(`/${url}`, BACKEND_URL);

    this.label = label;
    this.link = link;
    this.value = value;
    this.formatHeading = formatHeading;

    this.render();
    this.update(range.from, range.to);
  }

  setSearchParams(from = new Date(), to = new Date()) {
    this.url.searchParams.set('from', from.toISOString());
    this.url.searchParams.set('to', to.toISOString());
  }

  update(from, to) {
    this.setSearchParams(from, to);
    return fetchJson(`${this.url}`).then((resp) => {
      this.data = Object.values(resp);

      if (this.data.length) {
        this.value = this.data.reduce((accum, value) => accum + value);
      }

      this.element.classList.toggle('column-chart_loading', !this.data.length);

      this.subElements.header.innerHTML = this.formatHeading(this.value);
      this.subElements.body.innerHTML = this.getColumnBody(this.data);
    });
  }

  getColumnBody(data) {
    const maxValue = Math.max(...data);

    return data
      .map(item => {
        const scale = this.chartHeight / maxValue;
        const percent = (item / maxValue * 100).toFixed(0);

        return `<div style="--value: ${Math.floor(item * scale)}" data-tooltip="${percent}%"></div>`;
      })
      .join('');
  }

  getLink() {
    return this.link ? `<a class="column-chart__link" href="${this.link}">View all</a>` : '';
  }

  get template() {
    return `
      <div class="column-chart column-chart_loading" style="--chart-height: ${this.chartHeight}">
        <div class="column-chart__title">
          Total ${this.label}
          ${this.getLink()}
        </div>
        <div class="column-chart__container">
          <div data-element="header" class="column-chart__header">
            ${this.formatHeading(this.value)}
          </div>
          <div data-element="body" class="column-chart__chart">
            ${this.getColumnBody(this.data)}
          </div>
        </div>
      </div>
    `;
  }

  render() {
    const element = document.createElement('div');

    element.innerHTML = this.template;

    this.element = element.firstElementChild;

    this.subElements = this.getSubElements(this.element);
  }

  getSubElements(element) {
    const elements = element.querySelectorAll('[data-element]');

    return [...elements].reduce((accum, subElement) => {
      accum[subElement.dataset.element] = subElement;

      return accum;
    }, {});
  }

  remove () {
    this.element.remove();
  }

  destroy() {
    this.remove();
    this.subElements = {};
  }
}
