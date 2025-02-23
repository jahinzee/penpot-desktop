/**
 * @template T
 *
 * @param {T} value
 *
 * @returns {value is Exclude<T, null | undefined>}
 */

export function isNonNull(value) {
	return value !== undefined && value !== null;
}
