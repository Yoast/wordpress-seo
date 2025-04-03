/**
 * Matches forms of words in the keyphrase against a given text.
 *
 * @param {Array}       keywordForms    The array with word forms of all (content) words from the keyphrase in a shape
 *                                      [ [ form1, form2, ... ], [ form1, form2, ... ] ].
 * @param {string}      text            The string to match the word forms against.
 * @param {string}      locale          The locale of the paper.
 * @param {function}    matchWordCustomHelper The helper function to match word in text.
 *
 * @returns {Object} The number and the percentage of the keyphrase words that were matched in the text by at least one form,
 * and the lowest number of positions of the matches.
 */
export function findWordFormsInString(keywordForms: any[], text: string, locale: string, matchWordCustomHelper: Function): Object;
/**
 * Matches forms of words in the keyphrase and in the synonyms against a given text.
 *
 * @param {Object}      topicForms       The object with word forms of all (content) words from the keyphrase and eventually synonyms,
 * comes in a shape {
 *                     keyphraseForms: [[ form1, form2, ... ], [ form1, form2, ... ]],
 *                     synonymsForms: [
 *                          [[ form1, form2, ... ], [ form1, form2, ... ]],
 *                          [[ form1, form2, ... ], [ form1, form2, ... ]],
 *                          [[ form1, form2, ... ], [ form1, form2, ... ]],
 *                     ],
 *                  }
 * @param {string}      text                    The string to match the word forms against.
 * @param {boolean}     useSynonyms             Whether to use synonyms as if it was keyphrase or not (depends on the assessment).
 * @param {string}      locale                  The locale of the paper.
 * @param {function}    matchWordCustomHelper   The language-specific helper function to match word in text.
 *
 * @returns {Object} The number and the percentage for the keyphrase words or synonyms that were matched in the text by at least one form,
 * and whether the keyphrase or a synonym was matched.
 */
export function findTopicFormsInString(topicForms: Object, text: string, useSynonyms: boolean, locale: string, matchWordCustomHelper: Function): Object;
