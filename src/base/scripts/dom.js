/**
 * Retrieves an element from the DOM based on the provided element and include selectors.
 *
 * @param {string} selector - The CSS selector of the element to retrieve.
 * @param {string} includeSelector - The CSS selector of the sl-include element.
 * @returns {Promise<Element|null>} A promise that resolves to the found element or null if not found.
 */
export function getIncludedElement(selector, includeSelector) {
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
