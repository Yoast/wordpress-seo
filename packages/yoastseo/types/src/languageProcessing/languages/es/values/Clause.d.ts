export default SpanishClause;
declare const SpanishClause_base: any;
/**
 * Creates a Clause object for the Spanish language.
 */
declare class SpanishClause extends SpanishClause_base {
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
     * @returns { void }
     */
    checkParticiples(): void;
}
