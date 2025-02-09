import {
	SlMenu,
	SlMenuItem,
} from "../../../node_modules/@shoelace-style/shoelace/cdn/shoelace.js";
import { typedQuerySelector } from "./dom.js";

/**
 * @typedef {Object} MenuItem
 * @property {string} label
 * @property {Function} onClick
 */

/** @type {ResizeObserver | null} */
let resizeObserver;

/**
 * Opens a context menu with given items, positioned "relatively" to a host element.
 *
 * @param {Element} host
 * @param {MenuItem[]} items
 */
export function showContextMenu(host, items) {
	const { contextMenu, menu } = getContextMenuElement();
	if (!contextMenu || !menu) {
		return;
	}

	const menuItems = items.map(createContextMenuItem);
	menu.replaceChildren(...menuItems);

	// By default the menu has display set to `none`.
	// Position calculation has to be delayed until the menu is part of the DOM. Otherwise the menu's size and position are reported as 0.
	resizeObserver = new ResizeObserver(() => {
		const {
			top: hostTop,
			left: hostLeft,
			height: hostHeight,
			width: hostWidth,
		} = host.getBoundingClientRect();
		const { width: menuWidth } = menu.getBoundingClientRect();
		menu.style.top = `${hostTop + hostHeight + 4}`;
		menu.style.left = `${hostLeft + hostWidth - menuWidth}`;
	});
	resizeObserver.observe(menu);

	contextMenu.addEventListener("click", hideContextMenu);
	contextMenu.classList.add("visible");
}

export function hideContextMenu() {
	const { contextMenu, menu } = getContextMenuElement();
	if (!contextMenu || !menu) {
		return;
	}

	contextMenu?.classList.remove("visible");
	contextMenu.removeEventListener("click", hideContextMenu);
	resizeObserver?.unobserve(menu);
}

/**
 * Creates a menu item element.
 *
 * @param {MenuItem} item
 */
function createContextMenuItem({ label, onClick }) {
	const menuItem = new SlMenuItem();
	menuItem.innerText = label;
	menuItem.addEventListener("click", (event) => {
		event.stopPropagation();
		onClick();
	});

	return menuItem;
}

function getContextMenuElement() {
	const contextMenu = typedQuerySelector("#context-menu", HTMLDivElement);
	const menu = typedQuerySelector("sl-menu.menu", SlMenu, contextMenu);

	return { contextMenu, menu };
}
