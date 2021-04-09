import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class SortableTable {
  element;
  subElements = {};
  loadStep = 30;

  sortEvent = event => {
    const selectColumn = event.target.closest('[data-sortable=true]');

    if (selectColumn) {
      this.sorted.id = selectColumn.dataset.id;
      this.sorted.order = selectColumn.dataset.order === 'desc' ? 'asc' : 'desc'

      if (this.isSortLocally) {
        this.sortOnClient(this.sorted.id, this.sorted.order);
      } else {
        this.sortOnServer(this.sorted.id, this.sorted.order, 0, this.loadStep);
      }
    }
  }

  scrollEvent = async () => {
    if (window.pageYOffset + window.innerHeight >= this.subElements.body.clientHeight && !this.loading) {
      const dataSize = this.data.length + 1;
      const data = await this.getData(this.sorted.id, this.sorted.order, dataSize, dataSize + this.loadStep);
      this.update(data);
    }
  }

  addEvents() {
    this.subElements.header.addEventListener('pointerdown', this.sortEvent);
    document.addEventListener('scroll', this.scrollEvent);
  }

  constructor(headersConfig, {
    url = '',
    sorted = {
      'id': 'title',
      'order': 'asc'
    },
    isSortLocally = false,
  } = {}) {
    this.header = headersConfig;
    this.url = new URL(`/${url}`, BACKEND_URL);
    this.sorted = sorted;
    this.isSortLocally = isSortLocally;

    this.render();
  }

  async getData(fieldValue= 'title', orderValue= 'asc', start = 0, end = 30) {
    this.url.searchParams.set('_sort', fieldValue);
    this.url.searchParams.set('_order', orderValue);
    this.url.searchParams.set('_start', String(start));
    this.url.searchParams.set('_end', String(end));

    this.stateLoading();
    const data = await fetchJson(`${this.url}`);
    this.stateLoading(false);

    return data;
  }

  async render() {
    const element = document.createElement('div');

    element.innerHTML = `
      <div data-element="productsContainer" class="products-list__container">
        <div class="sortable-table">
          <div data-element="header" class="sortable-table__header sortable-table__row"></div>
          <div data-element="body" class="sortable-table__body"></div>

          <div data-element="loading" class="loading-line sortable-table__loading-line" style="display: block;"></div>
       </div>
      </div>
    `;

    this.element = element.firstElementChild;
    this.subElements = this.getSubElements(this.element);
    this.subElements.header.innerHTML = this.headerItems;

    this.data = await this.getData(this.sorted.id, this.sorted.order);
    this.addTableRows();
    this.addEvents();
  }

  stateLoading(state = true) {
    this.loading = state;
    if (state) {
      this.subElements.loading.setAttribute('style', 'display: block;');
    } else {
      this.subElements.loading.removeAttribute('style');
    }
  }

  getSubElements(element) {
    const elements = element.querySelectorAll('[data-element]');

    return [...elements].reduce((accum, subElement) => {
      accum[subElement.dataset.element] = subElement;

      return accum;
    }, {});
  }

  get arrowTemplate() {
    return `<span data-element="arrow" class="sortable-table__sort-arrow">
             <span class="sort-arrow"></span>
           </span>`;
  }

  get headerItems() {
    return this.header.map(item => {
      return `
        <div class="sortable-table__cell" data-id="${item.id}" data-sortable="${item.sortable}" data-order="${this.sorted.id === item.id ? this.sorted.order : ''}">
          <span>${item.title}</span>
          ${item.sortable ? this.arrowTemplate : ''}
        </div>
      `;
    }).join('');
  }

  addTableRows() {
    this.subElements.body.innerHTML = this.gettableRows();
  }

  update(data) {
    const rows = document.createElement('div');

    this.data = [...this.data, ...data];

    rows.innerHTML = this.gettableRows(data);

    this.subElements.body.append(...rows.childNodes);
  }

  gettableRows(data = this.data) {
    return data.map(item => {
      return `
        <a href="/products/${item.id}" class="sortable-table__row">
          ${this.getTableRow(item)}
        </a>`;
    }).join('');
  }

  getTableRow(item) {
    const cells = this.header.map(({id, template}) => {
      return {
        id,
        template
      };
    });

    return cells.map(({id, template}) => {
      return template
        ? template(item[id])
        : `<div class="sortable-table__cell">${item[id]}</div>`;
    }).join('');
  }

  headersChangeSelect(id, order) {
    this.subElements.header.querySelectorAll('.sortable-table__cell[data-id]').forEach(elem => {
      if (id === elem.dataset.id) {
        elem.dataset.order = order;
      } else {
        elem.dataset.order = '';
      }
    });
  }

  sortOnClient(id = 'title', order = 'asc') {
    const locales = ['ru', 'en'];
    const options = {
      caseFirst: 'upper',
    };

    this.data.sort((a, b) => {
      if (id === 'title') {
        return order === 'desc' ? b[id].localeCompare(a[id], locales, options) : a[id].localeCompare(b[id], locales, options);
      } else {
        return order === 'desc' ? b[id] > a[id] : a[id] > b[id];
      }
    });

    this.headersChangeSelect(id, order);

    this.subElements.body.innerHTML = this.gettableRows();
  }

  async sortOnServer(id, order, start, end) {
    this.data = await this.getData(id, order, start, end);
    this.headersChangeSelect(id, order);
    this.addTableRows();
  }

  destroy() {
    this.element.remove();
    this.subElements = {};
    document.removeEventListener('scroll', this.scrollEvent);
  }
}
