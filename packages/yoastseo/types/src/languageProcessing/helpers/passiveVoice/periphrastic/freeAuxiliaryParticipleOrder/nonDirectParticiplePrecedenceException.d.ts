/**
 * Checks whether there are any exception words in between the auxiliary and participle. If there are, it doesn't return a passive.
 *
 * @param {string} clause 											The clause that contains the participle.
 * @param {string} participle 										The participle in the clause.
 * @param {string[]} auxiliaries 									One or more auxiliaries in the clause.
 * @param {string[]} cannotBeBetweenPassiveAuxiliaryAndParticiple 	The list of words that cannot be between the auxiliary and participle.
 *
 * @returns {boolean} Returns true if a word from the 'cannot be between passive auxiliary and participle' exception list
 * appears anywhere in between the last (closest to participle) auxiliary and the participle.
 */
export default function _default(clause: string, participle: string, auxiliaries: string[], cannotBeBetweenPassiveAuxiliaryAndParticiple: string[]): boolean;
