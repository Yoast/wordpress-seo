/**
 * This calculates the Flesch reading score for a given text.
 *
 * @param {Paper}       paper           The paper containing the text.
 * @param {Researcher}  researcher      The researcher.
 *
 * @returns {{ score: number, difficulty: DIFFICULTY }} The Flesch reading score.
 */
export default function _default(paper: Paper, researcher: Researcher): {
    score: number;
    difficulty: DIFFICULTY;
};
/**
 * The Flesch reading ease difficulty.
 */
export type DIFFICULTY = number;
export namespace DIFFICULTY {
    let NO_DATA: number;
    let VERY_EASY: number;
    let EASY: number;
    let FAIRLY_EASY: number;
    let OKAY: number;
    let FAIRLY_DIFFICULT: number;
    let DIFFICULT: number;
    let VERY_DIFFICULT: number;
}
