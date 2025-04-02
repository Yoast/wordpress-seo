declare namespace _default {
    export { stripFullTags };
    export { stripIncompleteTags };
    export { stripBlockTagsAtStartEnd };
}
export default _default;
/**
 * Strip HTML-tags from text
 *
 * @param {String} text The text to strip the HTML-tags from.
 * @returns {String} The text without HTML-tags.
 */
export function stripFullTags(text: string): string;
/**
 * Strip incomplete tags within a text. Strips an end tag at the beginning of a string and the start tag at the end of a
 * start of a string.
 *
 * @param {String} text The text to strip the HTML-tags from at the begin and end.
 * @returns {String} The text without HTML-tags at the begin and end.
 */
export function stripIncompleteTags(text: string): string;
/**
 * Removes the block element tags at the beginning and end of a string and returns this string.
 *
 * @param {string} text The unformatted string.
 * @returns {string} The text with removed HTML begin and end block elements
 */
export function stripBlockTagsAtStartEnd(text: string): string;
