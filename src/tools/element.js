/**
 * Checks if a node is a parent node.
 *
 * @param {Node} node
 *
 * @returns {node is ParentNode}
 */
export function isParentNode(node) {
	return node.hasChildNodes();
}
