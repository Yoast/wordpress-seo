export default GermanClause;
declare const GermanClause_base: any;
/**
 * Creates a Clause object for the German language.
 */
declare class GermanClause extends GermanClause_base {
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
     * If no exceptions are found, the clause is passive.
     *
     * @returns {void}
     */
    checkParticiples(): void;
    /**
     * Checks whether a found participle ends in a noun suffix.
     * If a word ends in a noun suffix from the exceptionsRegex, it isn't a participle.
     *
     * @param {string} participle   The participle to check.
     *
     * @returns {boolean} Returns true if it ends in a noun suffix, otherwise returns false.
     */
    hasNounSuffix(participle: string): boolean;
    /**
     * Checks whether a participle is followed by 'haben' or 'sein'.
     * If a participle is followed by one of these, the clause is not passive.
     *
     * @param {string} participle   The participle to check.
     *
     * @returns {boolean} Returns true if it is an exception, otherwise returns false.
     */
    hasHabenSeinException(participle: string): boolean;
}
