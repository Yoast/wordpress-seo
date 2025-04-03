export default EnglishClause;
declare const EnglishClause_base: any;
/**
 * Creates a Clause object for the English language.
 */
declare class EnglishClause extends EnglishClause_base {
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
     * @returns {boolean} Returns true if no exception is found.
     */
    checkParticiples(): boolean;
    /**
     * Checks whether the participle is 'rid' in combination with 'get', 'gets', 'getting', 'got' or 'gotten'.
     * If this is true, the participle is not passive.
     *
     * @param {string} participle   The participle
     *
     * @returns {boolean} Returns true if 'rid' is found in combination with a form of 'get'
     * otherwise returns false.
     */
    hasRidException(participle: string): boolean;
}
