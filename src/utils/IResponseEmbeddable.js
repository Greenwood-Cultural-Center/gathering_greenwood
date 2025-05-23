/**
 * @interface
 * @typedef {Object} IResponseEmbeddable
 * @property {function(): any} TotalCount
 * @property {function(string): any} filterByYear
 */

/**
 * @interface
 * @typedef {Object} IResponseEmbeddableConstructor
 * @property {function(...any): IResponseEmbeddable} new
 * @property {function(function(any): void, any): void} fromJson
 * @property {function(): IResponseEmbeddable} createEmpty
 */

// These exports are just for consistency; they don't actually enforce the interface
export default {};
export const IResponseEmbeddable = {};
export const IResponseEmbeddableConstructor = {};