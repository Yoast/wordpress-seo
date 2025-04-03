export default Clause;
/**
 * Sentence clause which should be checked for passiveness.
 *
 */
declare class Clause {
    /**
     * Parses the object to a Clause.
     *
     * @param {Object} serialized The serialized object.
     *
     * @returns {Clause} The parsed Clause.
     */
    static parse(serialized: Object): Clause;
    /**
     * Constructs a clause object.
     *
     * @param {string} clauseText The text in the clause.
     * @param {Array} auxiliaries The auxiliaries in the clause.
     *
     * @constructor
     */
    constructor(clauseText: string, auxiliaries: any[]);
    _clauseText: string;
    _auxiliaries: any[];
    _isPassive: boolean;
    _participles: any[];
    /**
     * Returns the clause text.
     *
     * @returns {string} The clause text.
     */
    getClauseText(): string;
    /**
     * Returns true if the clause is passive.
     *
     * @returns {boolean} Whether the clause is passive.
     */
    isPassive(): boolean;
    /**
     * Returns the auxiliaries of the clause.
     *
     * @returns {Array} The auxiliaries present in the clause.
     */
    getAuxiliaries(): any[];
    /**
     * Sets the passiveness of the clause.
     *
     * @param {boolean} passive	 Whether the clause is passive.
     *
     * @returns {void}
     */
    setPassive(passive: boolean): void;
    /**
     * Sets the participles.
     *
     * @param {Array} participles	The participles.
     *
     * @returns {void}
     */
    setParticiples(participles: any[]): void;
    /**
     * Returns the found participles.
     *
     * @returns {Array} The participles
     */
    getParticiples(): any[];
    /**
     * Serializes the Clause instance to an object.
     *
     * @returns {Object} The serialized Clause.
     */
    serialize(): Object;
}
