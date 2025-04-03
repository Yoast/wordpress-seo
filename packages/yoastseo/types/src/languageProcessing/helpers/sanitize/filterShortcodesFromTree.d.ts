export function createShortcodeTagsRegex(shortcodeTags: string[]): RegExp;
export function filterShortcodesFromHTML(html: string, shortcodeTags: string[]): string;
export default filterShortcodesFromTree;
/**
 * Filters shortcodes from the tree.
 * @param {Node} tree The tree to filter.
 * @param {string[]} shortcodeTags The tags of the shortcodes to filter.
 * @returns {void}
 */
declare function filterShortcodesFromTree(tree: Node, shortcodeTags: string[]): void;
