export default ItalianClause;
declare const ItalianClause_base: any;
/**
 * Creates a Clause object for the Italian language.
 */
declare class ItalianClause extends ItalianClause_base {
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
     * Checks if any exceptions are applicable to this participle that would result in the sentence part not being passive.
     * If no exceptions are found, the sentence part is passive.
     *
     * @returns {boolean} Returns true if no exception is found.
     */
    checkParticiples(): boolean;
}
