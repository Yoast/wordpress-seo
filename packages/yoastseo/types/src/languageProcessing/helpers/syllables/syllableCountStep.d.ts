/**
 * A SyllableCountStep is an individual step in a SyllableCountIterator.
 */
export default class SyllableCountStep {
    /**
     * Constructs a language syllable regex that contains a regex for matching syllable exclusion.
     *
     * @param {object} syllableRegex The object containing the syllable exclusions.
     * @constructor
     */
    constructor(syllableRegex: object);
    _hasRegex: boolean;
    _regex: string;
    _multiplier: string;
    /**
     * Checks whether a valid regex has been set.
     *
     * @returns {boolean} True if a regex has been set, false if not.
     */
    hasRegex(): boolean;
    /**
     * Creates a regex based on the given syllable exclusions, and sets the multiplier to use.
     *
     * @param {object} syllableRegex The object containing the syllable exclusions and multiplier.
     * @returns {void}
     */
    createRegex(syllableRegex: object): void;
    /**
     * Returns the stored regular expression.
     *
     * @returns {RegExp} The stored regular expression.
     */
    getRegex(): RegExp;
    /**
     * Matches syllable exclusions in a given word and returns the number found multiplied by the
     * given multiplier. The result of this multiplication is the syllable count.
     *
     * @param {String} word The word to match for syllable exclusions.
     * @returns {number} The amount of syllables found.
     */
    countSyllables(word: string): number;
}
