declare function _default(paper: Paper, researcher: Researcher): SentenceBeginning[];
export default _default;
export type Researcher = import("../../languageProcessing/AbstractResearcher").default;
export type Node = import("../../parse/structure/").Node;
export type Sentence = import("../../parse/structure/Sentence").default;
export type Paper = import("../../values/").Paper;
export type SentenceBeginning = {
    /**
     * The first word of the sentence.
     */
    word: string;
    /**
     * The number of sentences that start with this word.
     */
    count: number;
    /**
     * The sentences that start with this word.
     */
    sentences: Sentence[];
};
