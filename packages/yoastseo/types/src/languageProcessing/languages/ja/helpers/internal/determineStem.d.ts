/**
 * Determines the canonical stem from the word forms.
 *
 * @param {string} word             The word input.
 * @param {object} morphologyData   The morphology data file.
 *
 * @returns {string}    The shortest form from the array as the canonical stem.
 */
export default function determineStem(word: string, morphologyData: object): string;
