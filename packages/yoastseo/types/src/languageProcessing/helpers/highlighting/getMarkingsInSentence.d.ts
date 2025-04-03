export default getMarkingsInSentence;
/**
 * Gets the Mark objects of all keyphrase matches in the sentence.
 * Currently, this function creates Mark objects compatible for both search-based and position-based highlighting.
 * In a pure position-based highlighting, we don't need to provide 'marked' and 'original' when creating the Mark object.
 *
 * @param {Sentence}	sentence			The sentence to check.
 * @param {Token[]}		matchesInSentence	An array containing the keyphrase matches in the sentence.
 *
 * @returns {Mark[]} The array of Mark objects of the keyphrase matches in the sentence.
 */
declare function getMarkingsInSentence(sentence: Sentence, matchesInSentence: Token[]): Mark[];
import Mark from "../../../values/Mark";
