export default FrenchClause;
declare const FrenchClause_base: any;
/**
 * Creates a Clause object for the French language.
 */
declare class FrenchClause extends FrenchClause_base {
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
     * Checks whether the participle is on an exception list of words that look like participles but are adjectives or verbs.
     *
     * @param {string}	participle	The participle to check.
     *
     * @returns {boolean}	Whether or not the participle is on the adjective and verb exception list.
     */
    isOnAdjectiveVerbExceptionList(participle: string): boolean;
    /**
     * Checks whether the participle is on an exception list of words that look like participles but are nouns.
     *
     * @param {string}	participle	The participle to check.
     *
     * @returns {boolean}	Whether or not the participle is on the noun exception list.
     */
    isOnNounExceptionList(participle: string): boolean;
}
