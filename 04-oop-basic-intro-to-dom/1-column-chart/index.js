export default class ColumnChart {
  constructor(options) {
    this.setOptions(options);
    this.render();
  }

  setOptions(options) {
    this.chartHeight = 50;

    if (options === undefined) {
      return;
    }

    this.data = options.data;
    this.vabel = options.label;
    this.link = options.link;
    this.totalValue = options.value;
  }

  render() {
    const element = document.createElement('div');

    element.innerHTML = `
      <div class="column-chart ${this.data ? '' : 'column-chart_loading'}" style="--chart-height: 50">
        <div class="column-chart__title">
          Total ${this.vabel}
          <a href="${this.link ? this.link : '/'}" class="column-chart__link">View all</a>
        </div>
        <div class="column-chart__container">
          <div data-element="header" class="column-chart__header">${this.totalValue}</div>
          <div data-element="body" class="column-chart__chart">${this.data ? this.setCharts(this.data) : ''}</div>
        </div>
      </div>
    `;

    this.element = element.firstElementChild;
  }

  setCharts(data) {
    const maxValue = Math.max.apply(null, this.data);
    let items = '';

    data.forEach((value) => {
      const size = Math.trunc(value * (this.chartHeight / maxValue));
      const percent = Math.round(value / maxValue * 100);

      items += `<div style="--value: ${size}" data-tooltip="${percent}%"></div>`;
    });

    return data.length ? items : '<img src="charts-skeleton.svg" alt="charts-skeleton" />';
  }

  update(data) {
    this.element.querySelector('.column-chart__chart').append(this.setCharts(data));
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }
}
