/**
 * Retrieves an element from the DOM based on the provided element and include selectors.
 *
 * @param {string} selector - The CSS selector of the element to retrieve.
 * @param {string} includeSelector - The CSS selector of the sl-include element.
 * @returns {Promise<Element|null>} A promise that resolves to the found element or null if not found.
 */
function getIncludedElement(selector, includeSelector) {
  return new Promise((resolve) => {
    const includeElement = document.querySelector(includeSelector);
    if (!includeElement) {
      return resolve(null);
    }

    const element = includeElement.querySelector(selector);
    if (element) {
      return resolve(element);
    }

    includeElement.addEventListener("sl-load", () => {
      const element = document.querySelector(selector);
      resolve(element);
    });
  });
}


/**
 * @template T
 * @typedef {new (...args: any[]) => T} Class<T>
*/
/**
 * Retrieves an element from the DOM based on the provided selector and expected type.
 * 
 * @template E
 * @param {string} selector 
 * @param {Class<E>} type
 * @param {ParentNode | null | undefined} parent
 * @return {E | null}
 */
function typedQuerySelector(selector, type, parent = document) {
  const element = parent?.querySelector(selector);
  if(element instanceof type) {
    return element
  }

  return null
}