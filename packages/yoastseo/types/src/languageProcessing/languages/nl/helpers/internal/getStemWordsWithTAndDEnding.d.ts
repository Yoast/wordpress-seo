/**
 * Creates the correct stem for words which end in ambiguous endings -t, -te, -ten, -de, or -den.
 *
 * @param {Object} 		morphologyDataNL 					The Dutch morphology data.
 * @param {string} 		word								The word to be checked.
 *
 * @returns {?string} 	The stemmed word or null.
 */
export function generateCorrectStemWithTAndDEnding(morphologyDataNL: Object, word: string): string | null;
