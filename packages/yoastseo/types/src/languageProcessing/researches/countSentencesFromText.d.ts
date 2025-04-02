/**
 * @typedef {import("../../languageProcessing/AbstractResearcher").default } Researcher
 * @typedef {import("../../values/").Paper } Paper
 */
/**
 * Gets the sentences from the text and calculates the length of each sentence.
 *
 * @param {Paper} paper The Paper object to get text from.
 * @param {Researcher} 	researcher 	The researcher to use for analysis.
 *
 * @returns {SentenceLength[]} The sentences from the text.
 */
export default function _default(paper: Paper, researcher: Researcher): SentenceLength[];
export type Researcher = import("../../languageProcessing/AbstractResearcher").default;
export type Paper = import("../../values/").Paper;
