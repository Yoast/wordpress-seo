declare namespace _default {
    export { getSubheadings };
    export { getSubheadingsTopLevel };
    export { getSubheadingContents };
    export { getSubheadingContentsTopLevel };
    export { removeSubheadingsTopLevel };
}
export default _default;
/**
 * Gets all subheadings from the text and returns these in an array.
 *
 * @param {string} text The text to return the headings from.
 *
 * @returns {Array<string[]>} Matches of subheadings in the text, first key is everything including tags,
 *                            second is the heading level, third is the content of the subheading.
 */
export function getSubheadings(text: string): Array<string[]>;
/**
 * Gets all the level 2 and 3 subheadings from the text and returns these in an array.
 *
 * @param {string} text The text to return the headings from.
 *
 * @returns {Array<string[]>} Matches of subheadings in the text, first key is everything including tags,
 *                            second is the heading level, third is the content of the subheading.
 */
export function getSubheadingsTopLevel(text: string): Array<string[]>;
/**
 * Gets the content of subheadings in the text.
 *
 * @param {string} text The text to get the subheading contents from.
 *
 * @returns {string[]} A list of all the subheadings with their content.
 */
export function getSubheadingContents(text: string): string[];
/**
 * Gets the content of subheadings h2 and h3 in the text.
 *
 * @param {string} text The text to get the subheading contents from.
 *
 * @returns {string[]} A list of all the subheadings with their content.
 */
export function getSubheadingContentsTopLevel(text: string): string[];
/**
 * Removes all level 2 and 3 subheadings from the text.
 *
 * @param {string} text The text to remove the headings from.
 *
 * @returns {string} The text with removed subheadings.
 */
export function removeSubheadingsTopLevel(text: string): string;
