export default keyphraseDistributionResearcher;
/**
 * Checks whether all content words from the topic are found within one sentence.
 * Assigns a score to every sentence following the following schema:
 * 9 if all content words from the topic are in the sentence,
 * 3 if not all content words from the topic were found in the sentence.
 *
 * @param {Array}  topic     The word forms of all content words in a keyphrase or a synonym.
 * @param {Array}  sentences An array of all sentences in the text.
 * @param {string} locale    The locale of the paper to analyse.
 * @param {function}    matchWordCustomHelper 	The language-specific helper function to match word in text.
 *
 * @returns {Array} The scores per sentence.
 */
export function computeScoresPerSentenceShortTopic(topic: any[], sentences: any[], locale: string, matchWordCustomHelper: Function): any[];
/**
 * Checks whether at least half of the content words from the topic are found within the sentence.
 * Assigns a score to every sentence following the following schema:
 * 9 if at least half of the content words from the topic are in the sentence,
 * 3 otherwise.
 *
 * @param {Array}  topic     The word forms of all content words in a keyphrase or a synonym.
 * @param {Array}  sentences An array of all sentences in the text.
 * @param {string} locale    The locale of the paper to analyse.
 * @param {function}    matchWordCustomHelper 	The language-specific helper function to match word in text.
 *
 * @returns {Array} The scores per sentence.
 */
export function computeScoresPerSentenceLongTopic(topic: any[], sentences: any[], locale: string, matchWordCustomHelper: Function): any[];
/**
 * Maximizes scores: Give every sentence a maximal score that it got from analysis of all topics
 *
 * @param {Array} sentenceScores The scores for every sentence, as assessed per keyphrase and every synonym.
 *
 * @returns {Array} Maximal scores of topic relevance per sentence.
 */
export function maximizeSentenceScores(sentenceScores: any[]): any[];
/**
 * Determines which portions of the text did not receive a lot of content words from keyphrase and synonyms.
 *
 * @param {Paper}       paper               The paper to check the keyphrase distribution for.
 * @param {Researcher}  researcher          The researcher to use for analysis.
 *
 * @returns {Object} The scores of topic relevance per portion of text and an array of all word forms to highlight.
 */
export function keyphraseDistributionResearcher(paper: Paper, researcher: Researcher): Object;
/**
 * Computes the maximally long piece of text that does not include the topic.
 *
 * @param {Array} sentenceScores The array of scores per sentence.
 *
 * @returns {number} The maximum number of sentences that do not include the topic.
 */
export function getDistraction(sentenceScores: any[]): number;
