declare namespace _default {
    export { stripWordBoundariesStart };
    export { stripWordBoundariesEnd };
    export { stripWordBoundariesEverywhere };
}
export default _default;
/**
 * Strip word boundary markers from text in the beginning
 *
 * @param {String} text The text to strip word boundary markers from.
 *
 * @returns {String} The text without double word boundary markers.
 */
export function stripWordBoundariesStart(text: string): string;
/**
 * Strip word boundary markers from text in the end
 *
 * @param {String} text The text to strip word boundary markers from.
 *
 * @returns {String} The text without double word boundary markers.
 */
export function stripWordBoundariesEnd(text: string): string;
/**
 * Strip word boundary markers from text in the beginning and in the end
 *
 * @param {String} text The text to strip word boundary markers from.
 *
 * @returns {String} The text without word boundary markers.
 */
export function stripWordBoundariesEverywhere(text: string): string;
