/**
 * Forms the base form from an input word.
 *
 * @param {string}   word                                  The word to build the base form for.
 * @param {Object}   regexAdjective                        The lists of regexes to apply to stem adjectives.
 * @param {Array}    regexAdjective.comparativeToBaseRegex The Array of regex-based rules to bring comparatives to base.
 * @param {Array}    regexAdjective.superlativeToBaseRegex The Array of regex-based rules to bring superlatives to base.
 * @param {Array}    regexAdjective.adverbToBaseRegex      The Array of regex-based rules to bring adverbs to base.
 * @param {Object}   stopAdjectives                        The lists of words that are not adverbs.
 * @param {string[]} stopAdjectives.erExceptions           The list of words that end with -er and are not comparatives.
 * @param {string[]} stopAdjectives.estExceptions          The list of words that end with -est and are not superlatives.
 * @param {string[]} stopAdjectives.lyExceptions           The list of words that end with -ly and are not adverbs.
 * @param {string[]} multiSyllableAdjWithSuffixes          The list of adjectives containing more than 2 syllables that can have suffixes.
 *
 * @returns {Object} The base form of the input word.
 */
export default function _default(word: string, regexAdjective: {
    comparativeToBaseRegex: any[];
    superlativeToBaseRegex: any[];
    adverbToBaseRegex: any[];
}, stopAdjectives: {
    erExceptions: string[];
    estExceptions: string[];
    lyExceptions: string[];
}, multiSyllableAdjWithSuffixes: string[]): Object;
