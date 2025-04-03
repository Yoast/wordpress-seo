/**
 * Gets the shortest of the alphabetically ordered strings from an array.
 *
 * @param {string[]} array  The array of strings.
 *
 * @returns {string|undefined}  The shortest of the alphabetically ordered strings from the input array;
 *                              undefined if the input array is empty.
 */
export function findShortestAndAlphabeticallyFirst(array: string[]): string | undefined;
/**
 * Checks if the input word occurs in the list of exceptions and if so returns the first form of the paradigm, which is
 * always the base.
 *
 * @param {string}		word		The word for which to determine its base.
 * @param {string[]}	irregulars	An array of irregular nouns and adjectives.
 *
 * @returns {string|null} The base form of the irregular word; null if no irregular stem was found.
 */
export function determineIrregularStem(word: string, irregulars: string[]): string | null;
/**
 * Checks if the input word occurs in the list of exception verbs and if so returns the first form
 * of the paradigm, which is always the base. Contrary to nouns and adjectives, irregular verbs can have different prefixes
 * which are not included in the list of exceptions and have to be processed separately.
 *
 * @param {string}	word            The word for which to determine its base.
 * @param {Object}	verbMorphology  Regexes and irregulars for verb morphology, False if verb rules should not be applied.
 *
 * @returns {string|null} The base form of the irregular word; null if no irregular stem was found.
 */
export function determineIrregularVerbStem(word: string, verbMorphology: Object): string | null;
/**
 * Gets possible stems as a regular noun, adjective and verb.
 *
 * @param {string} word              The word for which to determine its base.
 * @param {Object} morphologyData    The morphology data for the language.
 *
 * @returns {string} The shortest and the alphabetically-first of possible noun-like, verb-like and adjective-like bases.
 */
export function determineRegularStem(word: string, morphologyData: Object): string;
/**
 * Returns the stem of the input word using the morphologyData (language-specific).
 *
 * @param   {string} word           The word to get the stem for.
 * @param   {Object} morphologyData The available morphology data per language (false if unavailable).
 *
 * @returns {string} Stemmed (or base) form of the word.
 */
export function determineStem(word: string, morphologyData: Object): string;
export default determineStem;
