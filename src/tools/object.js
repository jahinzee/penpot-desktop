/**
 * Deep freeze an object.
 *
 * @template {object} T
 *
 * @param {T} obj
 *
 * @returns {Readonly<T>}
 */
export function deepFreeze(obj) {
	const isObject = typeof obj === "object";
	const isNull = obj === null;
	const isFrozen = Object.isFrozen(obj);

	if (isObject && !isNull && !isFrozen) {
		for (const key of Object.getOwnPropertyNames(obj)) {
			deepFreeze(obj[/** @type {keyof T}*/ (key)]);
		}
		Object.freeze(obj);
	}

	return obj;
}
