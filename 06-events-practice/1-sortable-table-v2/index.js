export default class SortableTable {
  element;
  subElements = {};

  sortEvent = (event) => {
    const target = event.currentTarget;

    if (target.dataset.sortable === 'true') {
      this.sort(target.dataset.id, this.orderValue === 'desc' ? 'asc' : 'desc');
    }
  }

  addEvent() {
    for (let elem of this.subElements.header.children) {
      elem.addEventListener('pointerdown', this.sortEvent);
    }
  }

  constructor(header = [], options = {}) {
    this.header = header;
    this.data = options.data;
    this.setSortOption();
    this.setElement();
    this.addEvent();
  }

  setSortOption(fieldValue = 'title', orderValue = 'asc') {
    this.fieldValue = fieldValue;
    this.orderValue = orderValue;
  }

  setElement() {
    const element = document.createElement('div');

    element.innerHTML = `
      <div data-element="productsContainer" class="products-list__container">
        <div class="sortable-table">
          <div data-element="header" class="sortable-table__header sortable-table__row"></div>
          <div data-element="body" class="sortable-table__body"></div>
       </div>
      </div>
    `;

    this.element = element.firstElementChild;
    this.subElements = this.getSubElements(this.element);
    this.subElements.header.innerHTML = this.headerItems;
    this.sort(this.fieldValue, this.orderValue);
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
        <div class="sortable-table__cell" data-id="${item.id}" data-sortable="${item.sortable}" data-order="${this.orderValue}">
          <span>${item.title}</span>
          ${item.sortable ? this.arrowTemplate : ''}
        </div>
      `;
    }).join('');
  }

  get tableRows() {
    return this.data.map(item => {
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

  sort(fieldValue, orderValue) {
    this.setSortOption(fieldValue, orderValue);
    const locales = ['ru', 'en'];
    const options = {
      caseFirst: 'upper',
    };

    this.data.sort((a, b) => {
      if (fieldValue === 'title') {
        return orderValue === 'desc' ? b[fieldValue].localeCompare(a[fieldValue], locales, options) : a[fieldValue].localeCompare(b[fieldValue], locales, options);
      } else {
        return orderValue === 'desc' ? b[fieldValue] > a[fieldValue] : a[fieldValue] > b[fieldValue];
      }
    });

    this.subElements.header.querySelectorAll('.sortable-table__cell[data-id]').forEach(elem => {
      if (fieldValue === elem.dataset.id) {
        elem.dataset.order = orderValue;
      } else {
        elem.dataset.order = '';
      }
    });

    this.subElements.body.innerHTML = this.tableRows;
  }

  destroy() {
    this.element.remove();
    this.subElements = {};
  }
}

