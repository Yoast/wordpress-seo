declare namespace _default {
    export { inRangeEndInclusive as inRange };
    export { inRangeStartInclusive };
    export { inRangeEndInclusive };
    export { inRangeStartEndInclusive };
}
export default _default;
/**
 * Checks if `n` is between `start` and `end` but not including `start`.
 *
 * @param {number} number The number to check.
 * @param {number} start The start of the range.
 * @param {number} end The end of the range.
 * @returns {boolean} Returns `true` if `number` is in the range, else `false`.
 */
export function inRangeEndInclusive(number: number, start: number, end: number): boolean;
/**
 * Checks if `n` is between `start` and up to, but not including, `end`.
 *
 * @param {number} number The number to check.
 * @param {number} start The start of the range.
 * @param {number} end The end of the range.
 * @returns {boolean} Returns `true` if `number` is in the range, else `false`.
 */
export function inRangeStartInclusive(number: number, start: number, end: number): boolean;
/**
 * Checks if `n` is between `start` and `end`, including both.
 *
 * @param {number} number The number to check.
 * @param {number} start The start of the range.
 * @param {number} end The end of the range.
 * @returns {boolean} Returns `true` if `number` is in the range, else `false`.
 */
export function inRangeStartEndInclusive(number: number, start: number, end: number): boolean;
export { inRangeEndInclusive as inRange };
