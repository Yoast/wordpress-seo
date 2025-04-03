/**
 * Removes list-related html tags in a text to be used for the keyphrase distribution assessment.
 * That way, lists with single words don't result in a skewed keyphrase distribution result.
 *
 * @param {string}  text    The text in which to remove the list structures.
 *
 * @returns {string} The text with all list structures removed.
 */
export function mergeListItems(text: string): string;
