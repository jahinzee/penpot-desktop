/**
 * @template T
 * @typedef {new (...args: any[]) => T} Class<T>
 */

/**
 * Retrieves an element from the DOM based on the provided element and include selectors, and type.
 *
 * @overload
 * @param {string} selector
 * @param {string} includeSelector
 * @returns {Promise<Element | null>}
 */
/**
 * @template E
 * @overload
 * @param {string} selector
 * @param {string} includeSelector
 * @param {Class<E> =} type
 * @returns {Promise<ReturnType<typeof typedQuerySelector<E>> | null>}
 *
 */
/**
 * @param {string} selector - The CSS selector of the element to retrieve.
 * @param {string} includeSelector - The CSS selector of the sl-include element.
 * @param {Class<E> =} type - The expected type of the element.
 */
export function getIncludedElement(selector, includeSelector, type) {
  return new Promise((resolve) => {
    const includeElement = document.querySelector(includeSelector);
    if (!includeElement) {
      return resolve(null);
    }

    const getElement = () =>
      type
        ? typedQuerySelector(selector, type, includeElement)
        : includeElement.querySelector(selector);
    const element = getElement();

    if (element) {
      return resolve(element);
    }

    includeElement.addEventListener("sl-load", () => {
      const element = getElement();

      resolve(element);
    });
  });
}

/**
 * Retrieves an element from the DOM based on the provided selector and expected type.
 *
 * @template E
 * @param {string} selector
 * @param {Class<E>} type
 * @param {ParentNode | null | undefined} parent
 * @return {E | null}
 */
export function typedQuerySelector(selector, type, parent = document) {
  const element = parent?.querySelector(selector);
  if (element instanceof type) {
    return element;
  }

  return null;
}
