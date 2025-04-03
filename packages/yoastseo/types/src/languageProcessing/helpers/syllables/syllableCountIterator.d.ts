/**
 * A SyllableCountIterator contains individual SyllableCountSteps.
 */
export default class SyllableCountIterator {
    /**
     * Creates a syllable count iterator.
     *
     * @param {object} config The config object containing an array with syllable exclusions.
     * @constructor
     */
    constructor(config: object);
    countSteps: any[];
    /**
     * Creates a syllable count step object for each exclusion.
     *
     * @param {object} syllableCounts The object containing all exclusion syllables including the multipliers.
     * @returns {void}
     */
    createSyllableCountSteps(syllableCounts: object): void;
    /**
     * Returns all available count steps.
     *
     * @returns {Array} All available count steps.
     */
    getAvailableSyllableCountSteps(): any[];
    /**
     * Counts the syllables for all the steps and returns the total syllable count.
     *
     * @param {String} word The word to count syllables in.
     * @returns {number} The number of syllables found based on exclusions.
     */
    countSyllables(word: string): number;
}
