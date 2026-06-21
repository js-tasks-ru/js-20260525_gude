import { createElement } from "../../shared/utils/create-element";

interface Options {
  data?: number[];
  label?: string;
  value?: number;
  link?: string;
  formatHeading?: (data: number) => string;
}

export default class ColumnChart {
  private _data: number[];
  private _label: string;
  private _value: number;
  private _link?: string;
  private _formatHeading: (data: number) => string;

  public element: HTMLElement | null = null;
  public chartHeight = 50;

  private _headerElement: HTMLElement | null = null;
  private _bodyElement: HTMLElement | null = null;

  constructor({ data = [], label = '', value = 0, link = '', formatHeading = (data) => String(data) }: Options = {}) {
    this._data = data;
    this._label = label;
    this._value = value;
    this._link = link;
    this._formatHeading = formatHeading;
    this.element = this._createElement();
    this._render();
  }

  private _createElement(): HTMLElement {
    const element = createElement('<div></div>');
    element.className = 'column-chart';
    if (this._data.length === 0) {
      element.classList.add('column-chart_loading');
    }
    element.style.setProperty('--chart-height', String(this.chartHeight));
    return element;
  }

  private _render(): void {
    if (!this.element) return;

    this.element.innerHTML = '';

    const title = createElement(`<div class="column-chart__title"></div>`);
    title.textContent = this._label;
    if (this._link) {
      const link = createElement(`<a class="column-chart__link" href="${this._link}">View all</a>`);
      title.appendChild(link);
    }

    const header = createElement(`<div class="column-chart__header" data-element="header">${this._formatHeading(this._value)}</div>`);
    this._headerElement = header;

    const body = createElement(`<div class="column-chart__chart" data-element="body"></div>`);
    this._bodyElement = body;

    const container = createElement(`<div class="column-chart__container"></div>`);
    container.append(header, body);

    this.element.append(title, container);
    if (this._data.length > 0) {
      this._renderColumns(this._data);
    }
  }
  private _renderColumns(data: number[]): void {
    if (!this._bodyElement) return;
    this._bodyElement.innerHTML = '';
    if (data.length === 0) return;

    const maxValue = Math.max(...data);
    const scale = this.chartHeight / maxValue;

    data.forEach(item => {
      const value = Math.floor(item * scale);
      const percent = ((item / maxValue) * 100).toFixed(0) + '%';
      const column = createElement(`<div style="--value: ${value}" data-tooltip="${percent}"></div>`)
      this._bodyElement!.appendChild(column);
    });
  }
  public update(data: number[]): void {
    this._data = data;
    if (this.element) {
      if (data.length === 0) {
        this.element.classList.add('column-chart_loading');
      } else {
        this.element.classList.remove('column-chart_loading');
      }
    }
    this._renderColumns(data);
  }
  public remove(): void {
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
  }

  public destroy(): void {
    this.remove();
    this.element = null;
    this._headerElement = null;
    this._bodyElement = null;
  }
}
