export default DutchClause;
declare const DutchClause_base: any;
/**
 * Creates a Clause object for the Dutch language.
 */
declare class DutchClause extends DutchClause_base {
    [x: string]: any;
    /**
     * Constructor.
     *
     * @param {string} clauseText   The text of the clause.
     * @param {Array} auxiliaries   The auxiliaries.
     *
     * @constructor
     */
    constructor(clauseText: string, auxiliaries: any[]);
    _participles: any[];
    /**
     * Checks if any exceptions are applicable to this participle that would result in the clause not being passive.
     * If no exceptions are found and there is an auxiliary present, the clause is passive.
     *
     * @returns {void}
     */
    checkParticiples(): void;
    /**
     * Checks whether a found participle has a non-participle ending and is therefore not really a participle.
     *
     * @param {string} participle   The participle to check.
     *
     * @returns {boolean} Returns true if the participle has a non-participle ending, otherwise returns false.
     */
    hasNonParticipleEnding(participle: string): boolean;
}
