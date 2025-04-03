export default createRulesFromArrays;
/**
 * Creates an object with a regex and a replacement pair to be processed.
 *
 * @param {Array}   rule        A pair or triplet of strings of which the first one is the regex to match
 *                              and the second (and the third) is the replacement.
 * @param {string}  [flags=i]   The regex flags to use.
 *
 * @returns {{ reg: RegExp, repl: string }|{ reg: RegExp, repl1: string, repl2: string }|null} Object to be used in the regex-based rules.
 */
export function createSingleRuleFromArray(rule: any[], flags?: string | undefined): {
    reg: RegExp;
    repl: string;
} | {
    reg: RegExp;
    repl1: string;
    repl2: string;
} | null;
/**
 * Creates an array of objects with a regex and a replacement pair to be processed.
 *
 * @param {Array}   rules       An array with pairs or triplets of strings of which the first one is the regex to match
 *                              and the second (and the third) is the replacement.
 * @param {string} [flags=i]    The regex flags to use.
 *
 * @returns {Array} Array of objects to be used in the regex-based rules.
 */
export function createRulesFromArrays(rules: any[], flags?: string | undefined): any[];
