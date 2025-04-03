/**
 * A DeviationFragment represents a partial deviation when counting syllables.
 */
export default class DeviationFragment {
    /**
     * Constructs a new DeviationFragment.
     *
     * @param {Object} options Extra options that are used to match this deviation fragment.
     * @param {string} options.location The location in the word where this deviation can occur.
     * @param {string} options.word The actual string that should be counted differently.
     * @param {number} options.syllables The amount of syllables this fragment has.
     * @param {string[]} [options.notFollowedBy] A list of characters that this fragment shouldn't be followed with.
     * @param {string[]} [options.alsoFollowedBy] A list of characters that this fragment could be followed with.
     *
     * @constructor
     */
    constructor(options: {
        location: string;
        word: string;
        syllables: number;
        notFollowedBy?: string[] | undefined;
        alsoFollowedBy?: string[] | undefined;
    });
    _location: string;
    _fragment: string;
    _syllables: number;
    _regex: RegExp | null;
    _options: Pick<{
        location: string;
        word: string;
        syllables: number;
        notFollowedBy?: string[] | undefined;
        alsoFollowedBy?: string[] | undefined;
    }, "notFollowedBy" | "alsoFollowedBy">;
    /**
     * Creates a regex that matches this fragment inside a word.
     *
     * @returns {void}
     */
    createRegex(): void;
    /**
     * Returns the regex that matches this fragment inside a word.
     *
     * @returns {RegExp} The regex that matches this fragment.
     */
    getRegex(): RegExp;
    /**
     * Returns whether this fragment occurs in a word.
     *
     * @param {string} word The word to match the fragment in.
     * @returns {boolean} Whether or not this fragment occurs in a word.
     */
    occursIn(word: string): boolean;
    /**
     * Removes this fragment from the given word.
     *
     * @param {string} word The word to remove this fragment from.
     * @returns {string} The modified word.
     */
    removeFrom(word: string): string;
    /**
     * Returns the amount of syllables for this fragment.
     *
     * @returns {number} The amount of syllables for this fragment.
     */
    getSyllables(): number;
}
