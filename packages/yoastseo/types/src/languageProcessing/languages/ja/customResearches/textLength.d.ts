/**
 * A result of the character count calculation.
 *
 * @typedef CharacterCountResult
 * @param {number} count The number of characters found in the text.
 * @param {string} unit The unit used in the text length calculations, always "character".
 */
/**
 * Count the characters in the text.
 *
 * @param {Paper} paper The Paper object.
 *
 * @returns {CharacterCountResult} The number of characters found in the text, plus "character" as the unit used in calculating the text length.
 */
export default function _default(paper: Paper): CharacterCountResult;
/**
 * A result of the character count calculation.
 */
export type CharacterCountResult = any;
