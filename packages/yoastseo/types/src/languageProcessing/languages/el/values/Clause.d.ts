export default GreekClause;
declare const GreekClause_base: any;
/**
 * Creates a Clause object for the Greek language.
 */
declare class GreekClause extends GreekClause_base {
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
     * Sets the passiveness of a clause based on whether the matched participle is a valid one.
     * We only process clauses that have an auxiliary in this check.
     *
     * @returns {void}
     */
    checkParticiples(): void;
}
