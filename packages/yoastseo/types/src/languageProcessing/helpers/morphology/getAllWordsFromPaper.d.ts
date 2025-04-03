/**
 * Gets all words found in the text, title, slug and meta description of a given paper.
 *
 * @param {Paper} 	paper     					The paper for which to get the words.
 * @param {boolean}	areHyphensWordBoundaries	Whether hyphens should be treated as word boundaries.
 *
 * @returns {string[]} All words found.
 */
export default function _default(paper: Paper, areHyphensWordBoundaries: boolean): string[];
