/**
 * Creates a focus trap between a range of elements.
 *
 * @param {Array<HTMLElement>} items - Range of elements to trap the focus between.
 *
 * @returns {Function} Destroy the focus trap.
 */
export function trapFocus(items) {
	const firstElement = items[0];
	const lastElement = items[items.length - 1];

	firstElement.addEventListener("keydown", handleKeyDown);
	lastElement.addEventListener("keydown", handleKeyDown);

	/**
	 * @param {KeyboardEvent} event
	 */
	function handleKeyDown(event) {
		const { key, shiftKey } = event;
		const isTabKey = key === "Tab";
		const isLoopForward =
			isTabKey && document.activeElement === lastElement && !shiftKey;
		const isLoopBackward =
			isTabKey && document.activeElement === firstElement && shiftKey;
		const isLoop = isLoopBackward || isLoopForward;

		if (!isLoop) {
			return;
		}

		event.preventDefault();

		if (isLoopForward) {
			firstElement.focus();
			return;
		}

		if (isLoopBackward) {
			lastElement.focus();
		}
	}

	return () => {
		firstElement.removeEventListener("keydown", handleKeyDown);
		lastElement.removeEventListener("keydown", handleKeyDown);
	};
}
