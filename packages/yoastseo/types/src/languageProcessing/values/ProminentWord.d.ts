export default ProminentWord;
/**
 * Represents a prominent word in the context of relevant words.
*/
declare class ProminentWord {
    /**
     * Parses the object to a ProminentWord.
     *
     * @param {Object} serialized The serialized object.
     *
     * @returns {ProminentWord} The parsed ProminentWord.
     */
    static parse(serialized: Object): ProminentWord;
    /**
     * Constructs Prominent word object.
     *
     * @constructor
     *
     * @param {string} word             The word.
     * @param {string} [stem]           The stem / base form of the word, defaults to the word.
     * @param {number} [occurrences]    The number of occurrences, defaults to 0.
     */
    constructor(word: string, stem?: string | undefined, occurrences?: number | undefined);
    _word: string;
    _stem: string;
    _occurrences: number;
    /**
     * Sets the word.
     *
     * @param {string} word The word to set.
     *
     * @returns {void}.
     */
    setWord(word: string): void;
    /**
     * Returns the word.
     *
     * @returns {string} The word.
     */
    getWord(): string;
    /**
     * Returns the stem of the word.
     *
     * @returns {string} The stem.
     */
    getStem(): string;
    /**
     * Sets the number of occurrences to the word.
     *
     * @param {int} numberOfOccurrences The number of occurrences to set.
     *
     * @returns {void}.
     */
    setOccurrences(numberOfOccurrences: int): void;
    /**
     * Returns the amount of occurrences of this word.
     *
     * @returns {number} The number of occurrences.
     */
    getOccurrences(): number;
    /**
     * Serializes the ProminentWord instance to an object.
     *
     * @returns {Object} The serialized ProminentWord.
     */
    serialize(): Object;
}
