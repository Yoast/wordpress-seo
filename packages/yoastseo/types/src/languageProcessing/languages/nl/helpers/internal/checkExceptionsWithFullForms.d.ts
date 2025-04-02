/**
 *
 * Checks whether a word is on the exception list for which we have full forms. If it is, returns the indicated stem of the word.
 *
 * @param {Array} morphologyDataNL The Dutch morphology data file.
 * @param {string} word The word to check.
 *
 * @returns {string/null} The created word forms.
 */
export default function checkExceptionsWithFullForms(morphologyDataNL: any[], word: string): string;
