export class ContrastControl {

  constructor(options) {
    this.options = options || {};
    this.label = this.options.label || 'Contrast';
    this.group = this.options.group || false;
    this.classList = this.options.classList || ['mapboxgl-ctrl-custom'];
    this.position = this.options.position || 'top-right';
    this.prepend = this.options.prepend || false;
    this._container = this.options.container || null;
    if (this.options.prepend && !this.options.parentId) {
      console.error('Prepend option requires a parentId to be set.');
      return;
    }
    else if (this.options.parentId) {
      this.parentId = this.options.parentId || `mapboxgl-ctrl-${this.options.position}`;
    }
  }
  onAdd(map) {
    if (this.prepend) {
      parentNode = document.getElementById(this.parentId);
      parentNode.prepend(this._container);
    }
    return this._container;
  }
  onRemove() {
    if (this._container?.parentNode) {
      this._container.parentNode.removeChild(this._container);
    }
  }
}

export function createCustomControl(options = {}) {
  const opts = {
    label: options.label || 'Contrast',
    group: options.group || false,
    classList: options.classList || ['mapboxgl-ctrl-custom'],
    position: options.position || 'top-right',
    prepend: options.prepend || false,
    container: options.container || null,
    parentId: options.parentId || (options.prepend ? `mapboxgl-ctrl-${options.position || 'top-right'}` : null),
  };

  if (opts.prepend && !opts.parentId) {
    console.error('Prepend option requires a parentId to be set.');
    return;
  }

  return {
    _container: opts.container || null,
    onAdd(map) {
      if (opts.prepend && opts.parentId) {
        const parentNode = document.getElementById(opts.parentId);
        if (parentNode) parentNode.prepend(this._container);
      }
      return this._container;
    },
    onRemove() {
      if (this._container?.parentNode) {
        this._container.parentNode.removeChild(this._container);
      }
    }
  };
}