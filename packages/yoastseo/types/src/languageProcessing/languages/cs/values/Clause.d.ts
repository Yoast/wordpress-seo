export default CzechClause;
declare const CzechClause_base: any;
/**
 * Creates a Clause object for the Czech language.
 */
declare class CzechClause extends CzechClause_base {
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
     * Sets the clause passiveness to true if there is a participle present in the clause, otherwise sets it to false.
     *
     * @returns {void}
     */
    checkParticiples(): void;
}
