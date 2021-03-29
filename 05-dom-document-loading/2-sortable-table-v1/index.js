export default class SortableTable {
  fieldElement = document.getElementById('field');
  orderElement = document.getElementById('order');

  constructor(header = [], options = {}) {
    this.header = header;
    this.data = options.data;
    this.setSortOption(this.fieldElement ? this.fieldElement.value : '', this.orderElement ? this.orderElement.value : '');
    this.setElement();
  }

  setSortOption(fieldValue, orderValue) {
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
          ${item.id === this.fieldValue ? this.arrowTemplate : ''}
        </div>
      `;
    }).join('');
  }

  get bodyItems() {
    return this.data.map(item => {
      return `
        <a href="/products/${item.id}" class="sortable-table__row">
          ${getFirstImage(item.images)}
          ${getTableCell(item.title)}
          ${getTableCell(item.quantity)}
          ${getTableCell(item.price)}
          ${getTableCell(item.sales)}
        </a>
      `;
    }).join('');

    function getFirstImage(images = {}) {
      for (let i = 0; i < images.length; i++) {
        if (i === 0) {
          return `<div class="sortable-table__cell">
                  <img class="sortable-table-image" alt="Image" src="${images[i].url}">
                </div>`;
        }
      }
    }

    function getTableCell(value) {
      if (value) {
        return `<div class="sortable-table__cell">${value}</div>`;
      }
    }
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

    this.subElements.header.innerHTML = this.headerItems;
    this.subElements.body.innerHTML = this.bodyItems;
  }

  destroy() {
    this.element.remove();
    this.subElements = {};
  }
}

