/**
 * Forms the infinitive from an input word.
 *
 * @param {string} word                               The word to build the infinitive for.
 * @param {Object} regexVerb                          The list of regex rules used to bring verb forms to infinitive.
 * @param {Array}  regexVerb.sFormToInfinitiveRegex   The array of regex-based rules used to bring -s forms to infinitive.
 * @param {Array}  regexVerb.ingFormToInfinitiveRegex The array of regex-based rules used to bring -ing forms to infinitive.
 * @param {Array}  regexVerb.edFormToInfinitiveRegex  The array of regex-based rules used to bring -ed forms to infinitive.
 *
 * @returns {Object} The infinitive of the input word.
 */
export function getInfinitive(word: string, regexVerb: {
    sFormToInfinitiveRegex: any[];
    ingFormToInfinitiveRegex: any[];
    edFormToInfinitiveRegex: any[];
}): Object;
/**
 * Checks if the input word occurs in the list of exception verbs and if so returns all its irregular forms.
 * If not checks if it is an irregular verb with one of the standard verb prefixes, if so returns all irregular prefixed forms.
 *
 * @param {string} word             The word for which to determine its irregular forms.
 * @param {Array} irregularVerbs    The array of irregular verbs available for this language.
 * @param {Object} verbPrefixes     The collection of verb prefixes to be used for normalization of irregular verbs.
 *
 * @returns {Array} Array of word forms from the exception list.
 */
export function checkIrregulars(word: string, irregularVerbs: any[], verbPrefixes: Object): any[];
/**
 * Checks if the input word ends with "ing".
 *
 * @param {string} word The word to check.
 *
 * @returns {boolean} True if the word ends with "ing".
 */
export function endsWithIng(word: string): boolean;
/**
 * Checks if the input word has one of the standard verb prefixes and if so returns a prefix and a de-prefixed verb to be
 * further used to compare with the list of irregular verbs.
 *
 * @param {string} word             The word for which to determine if it has one of the standard verb prefixes.
 * @param {Object} verbPrefixes     The collection of verb prefixes to be used for normalization
 *
 * @returns {Array} Array of word forms from the exception list.
 */
export function normalizePrefixed(word: string, verbPrefixes: Object): any[];
