/**
 * Checks whether a word from the precedence exception list occurs anywhere in the clause before the participle.
 * If this is the case, the sentence part is not passive.
 *
 * @param {string} clause 		The clause that contains the participle.
 * @param {string} participle   The participle.
 * @param {Array} cannotBeBetweenPassiveAuxiliaryAndParticipleList  List of words which cannot be between auxiliary and participle.
 *
 * @returns {boolean} Returns true if a word from the precedence exception list occurs anywhere in the
 *                    sentence part before the participle, otherwise returns false.
 */
export default function _default(clause: string, participle: string, cannotBeBetweenPassiveAuxiliaryAndParticipleList?: any[]): boolean;
