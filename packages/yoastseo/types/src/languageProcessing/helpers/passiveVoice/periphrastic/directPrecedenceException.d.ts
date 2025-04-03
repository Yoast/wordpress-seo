/**
 * Checks whether the participle is directly preceded by a word from the direct precedence exception list.
 * If this is the case, the clause is not passive.
 *
 * @param {string} clause 		The clause that contains the participle.
 * @param {string} participle   The participle.
 * @param {Array} cannotDirectlyPrecedePassiveParticipleList List of words which cannot directly precede a passive participle.
 *
 * @returns {boolean} Returns true if a word from the direct precedence exception list is directly preceding
 *                    the participle, otherwise returns false.
 */
export default function _default(clause: string, participle: string, cannotDirectlyPrecedePassiveParticipleList?: any[]): boolean;
