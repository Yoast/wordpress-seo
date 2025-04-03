export default Sentence;
/**
 * Construct the Sentence object and set the sentence text.
 *
 * @param {string} sentence The text of the sentence.
 * @constructor
 */
declare class Sentence {
    /**
     * Parses the object to a Sentence.
     *
     * @param {Object} serialized The serialized object.
     *
     * @returns {Sentence} The parsed Sentence.
     */
    static parse(serialized: Object): Sentence;
    /**
     * Constructor.
     *
     * @param {string} sentence The sentence.
     * @constructor
     */
    constructor(sentence: string);
    _sentenceText: string;
    _isPassive: boolean;
    _clauses: any[];
    /**
     * Returns the sentence text.
     *
     * @returns {string} The sentence.
     */
    getSentenceText(): string;
    /**
     * Returns the passiveness of a sentence.
     *
     * @returns {boolean} True if passive, otherwise returns false.
     */
    isPassive(): boolean;
    /**
     * Sets the passiveness of the sentence.
     *
     * @param {boolean} passive Whether the sentence is passive or not.
     * @returns {void}
     */
    setPassive(passive: boolean): void;
    /**
     * Returns an array of clauses.
     *
     * @returns {Clause[]} The clauses of the sentence.
     */
    getClauses(): Clause[];
    /**
     * Sets the clauses.
     *
     * @param {Clause[]} clauses The clauses of the sentence.
     *
     * @returns {void}
     */
    setClauses(clauses: Clause[]): void;
    /**
     * Sets the passiveness of the sentence. A sentence is passive if it contains at least one passive clause.
     *
     * @returns {void}
     */
    setSentencePassiveness(): void;
    /**
     * Serializes the Sentence instance to an object.
     *
     * @returns {Object} The serialized Sentence.
     */
    serialize(): Object;
}
