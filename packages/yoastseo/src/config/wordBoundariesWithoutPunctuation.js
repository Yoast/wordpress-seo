/*
 * A regex string that can be used to split a string on whitespaces, en-dashes, and hyphens.
 */
export const WORD_BOUNDARY_WITH_HYPHEN = "[\\s\\u2013\\u002d]";

/*
 * A regex string that can be used to split a string on whitespaces and en-dashes.
 */
export const WORD_BOUNDARY_WITHOUT_HYPHEN = "[\\s\\u2013]";
